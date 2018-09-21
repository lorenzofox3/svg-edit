import {HIDDEN_MASK, Node, NodeEvent, depth, component, TagName, LOCKED_MASK} from '../svg-document';
import {div, li, NA, SLOT, span, ul, button, component as fcomp, Component, VNode, h2} from '../mini-f';

const hiddable = (node: Node) => () => node.toggleHide();
const lockable = (node: Node) => () => node.toggleLock();

//todo: could be improved
function* traverse(node: VNode) {
    for (const ch of node.children) {
        yield {node: ch, parent: node};
    }

    for (const ch of node.children) {
        yield* traverse(ch);
    }
}

export const findSlot = (node: VNode) => {
    for (const {node: child, parent} of traverse(node)) {
        if (child === SLOT) {
            return parent;
        }
    }
    return null;
};
//////////

const controlsBar = (node: Node, state = {}) => {
    const isHidden = !!(node.stateFlag & HIDDEN_MASK);
    const isLocked = !!(node.stateFlag & LOCKED_MASK);

    return div(NA,
        button({onclick: hiddable(node), role: 'checkbox', 'aria-checked': String(isHidden)}, isHidden ? 's' : 'h'),
        button({onclick: lockable(node), role: 'checkbox', 'aria-checked': String(isLocked)}, isLocked ? 'u' : 'l')
    );
};

const TreeView = root => fcomp(() => {
    const addLayer = () => {
        root.addLayer();
    };

    return div(NA,
        h2(NA, 'Tree view'),
        button({
            onclick: addLayer
        }, 'Add layer'),
        ul({id: 'layers-container'})
    );
});

const itemRowTemplate = (toggle?: Function) => (node, state) => {
    const {depth} = state;
    return li(NA,
        div({class: 'item-content'},
            controlsBar(node, state),
            div({style: `--depth: ${depth};`, 'data-depth': depth},
                toggle !== undefined ? button({onclick: toggle}, state.isExpanded ? 'c' : 'e') : '',
                span({class: 'name'}, node.type)
            )
        ));
};

const ContainerItem = component((node: Node, state, update) => {
    const {isExpanded = true} = state;
    const toggle = () => update({isExpanded: !isExpanded});
    const className = isExpanded === false ? 'hidden' : '';
    const row = itemRowTemplate(toggle);
    return li(NA,
        row(node, state),
        ul({
            class: className
        }, SLOT));
});

const Item = component((node: Node, state = {depth: 0}) => {
    const row = itemRowTemplate();
    return li(NA,
        row(node, state));
});

export const TreeViewComponent = ({document: root, el}) => {
    const nodeToComponent = new WeakMap<Node, Component>();
    const comp = TreeView(root)(el);

    let layerContainer = null;

    root.on(NodeEvent.INSERT, (newNode: Node, parentNode: Node) => {
        let parent = layerContainer = layerContainer || el.querySelector('ul');
        const comp = newNode.type === TagName.GROUP ? ContainerItem : Item;
        const d = Math.max(depth(newNode) - 2, 0);

        if (nodeToComponent.has(parentNode)) {
            const parentVNode = nodeToComponent.get(parentNode).vnode;
            parent = findSlot(parentVNode).dom;
        }

        const instance = comp(newNode, parent, {depth: d});
        nodeToComponent.set(newNode, instance);
        instance.render();
    });

    root.on(NodeEvent.UPDATE, (node: Node) => {
        const component = nodeToComponent.get(node);
        component.render();
    });
    return comp;
};