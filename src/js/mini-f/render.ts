import {compose, curry} from 'smart-table-operators';
import {
    isShallowEqual,
    pairify,
    noop, nextTick,
} from './util';
import {
    removeAttributes,
    setAttributes,
    setTextNode,
    createDomNode,
    removeEventListeners,
    addEventListeners,
    getEventListeners
} from './dom-util';
import {VNode} from './h';
import {SLOT} from './hdom';

const updateEventListeners = ({props: newNodeProps}: VNode, {props: oldNodeProps}: VNode) => {
    const newNodeEvents = getEventListeners(newNodeProps);
    const oldNodeEvents = getEventListeners(oldNodeProps);

    return newNodeEvents.length || oldNodeEvents.length ?
        compose(
            removeEventListeners(oldNodeEvents),
            addEventListeners(newNodeEvents)
        ) : noop;
};

const updateAttributes = (newVNode: VNode, oldVNode: VNode) => {
    const newVNodeProps = newVNode.props || {};
    const oldVNodeProps = oldVNode.props || {};

    if (isShallowEqual(newVNodeProps, oldVNodeProps)) {
        return noop;
    }

    if (newVNode.type === 'Text') {
        return setTextNode(newVNode.props.value);
    }

    const newNodeKeys = Object.keys(newVNodeProps);
    const oldNodeKeys = Object.keys(oldVNodeProps);
    const attributesToRemove = oldNodeKeys.filter(k => !newNodeKeys.includes(k));

    return compose(
        removeAttributes(attributesToRemove),
        setAttributes(newNodeKeys.map(pairify(newVNodeProps)))
    );
};

const domFactory = createDomNode;

// Apply vnode diffing to actual dom node (only supports upsert)
const domify = (oldVnode: VNode | null, newVnode: VNode, parentDomNode: Node) => {

    // Only update attributes
    if (oldVnode && newVnode) {
        newVnode.dom = oldVnode.dom;
    } else {
        newVnode.dom = parentDomNode.appendChild(domFactory(newVnode, parentDomNode));
    }
    return newVnode;
};

export interface RenderingResult {
    batch: Function[];
    vnode: VNode
}

export const render = (oldVNode: VNode | null, newVNode: VNode, parentDomNode: Node, onNextTick = []): RenderingResult => {
    const vnode = domify(oldVNode, newVNode, parentDomNode);
    const tempOldNode = !oldVNode ? {children: [], props: {}, type: 'none'} : oldVNode;

    updateAttributes(vnode, tempOldNode)(vnode.dom);

    // Fast path
    if (vnode.type === 'Text') {
        return {batch: onNextTick, vnode};
    }

    const childrenCount = Math.max(tempOldNode.children.length, vnode.children.length);

    // Async: will be deferred as it is not "visual"
    const setListeners = updateEventListeners(vnode, tempOldNode);
    if (setListeners !== noop) {
        onNextTick.push(() => setListeners(vnode.dom));
    }

    // 3. recursively traverse children to update dom and collect functions to process on next tick
    if (childrenCount > 0) {
        for (let i = 0; i < childrenCount; i++) {

            if (vnode.children[i] !== SLOT) {
                // We pass onNextTick as reference (improve perf: memory + speed)
                render(tempOldNode.children[i], vnode.children[i], vnode.dom, onNextTick);
            }

        }
    }

    return {batch: onNextTick, vnode};
};

export interface Component {
    vnode: null | VNode;
    render: Function,
    state: Object
}

export const component = (template: Function) => (el: Node, initialState = {}) => ({
    vnode: null,
    state: initialState,
    render(state?: Object) {
        Object.assign(this.state, state || {});
        const vnode = template(this.state, (newState = {}) => this.render(newState));
        const {batch, vnode: newVNode} = render(this.vnode, vnode, el);
        this.vnode = newVNode;
        nextTick(() => {
            for (const op of batch) {
                op();
            }
        });
    }
});