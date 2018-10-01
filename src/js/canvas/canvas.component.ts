import {h, component, Component, SVG_NS} from '../mini-f';
import {Node, NodeEvent, HIDDEN_MASK, typeTagMap, Root, isParentNode} from '../svg-document';

const SVGElement = (node: Node) => component((state = {}) => {
    const classList = [];

    if (node.stateFlag & HIDDEN_MASK) {
        classList.push('hidden');
    }

    return h(typeTagMap[node.type], Object.assign({
        class: classList.join(' ')
    }, node.attributes));
});

export type CanvasComponentDependencies = {
    document: Root,
    el: Element
}

export const CanvasComponent = ({document: root, el}: CanvasComponentDependencies) => {
    const nodeToComp = new WeakMap<Node, Component>();

    const insertHandler = (newNode: Node, parentNode: Node, nextSibling: Node) => {
        const fragment = document.createElementNS(SVG_NS, 'svg');
        const comp = SVGElement(newNode)(fragment);
        nodeToComp.set(newNode, comp);
        comp.render();

        // we insert the whole sub tree
        if (isParentNode(newNode)) {
            for (const ch of newNode) {
                insertHandler(ch, newNode, null);
            }
        }

        const parentDom = nodeToComp.has(parentNode) ? nodeToComp.get(parentNode).vnode.dom : el;
        const siblingDom = nodeToComp.has(nextSibling) ? nodeToComp.get(nextSibling).vnode.dom : null;

        parentDom.insertBefore(fragment.removeChild(fragment.firstElementChild), siblingDom);
    };

    root.on(NodeEvent.REMOVE, (oldNode: Node) => {
        if (nodeToComp.has(oldNode)) {
            const oldComp = nodeToComp.get(oldNode);
            oldComp.vnode.dom.parentNode.removeChild(oldComp.vnode.dom);
            nodeToComp.delete(oldNode);
        }
    });

    root.on(NodeEvent.INSERT, insertHandler);

    root.on(NodeEvent.UPDATE, (node: Node) => {
        nodeToComp.get(node).render();
    });
};