import {h, Component} from '../mini-f';
import {Node, component, NodeEvent, HIDDEN_MASK} from '../svg-document';

const SVGElement = component((node: Node, state = {}) => {
    const classList = [];

    if (node.stateFlag & HIDDEN_MASK) {
        classList.push('hidden');
    }

    return h(node.type, Object.assign({
        class: classList.join(' ')
    }, node.attributes));
});

export const renderingLayer = ({document: root, el}) => {
    const nodeToComp = new WeakMap<Node, Component>();

    root.on(NodeEvent.INSERT, (newNode: Node, parentNode: Node) => {
        const dom = nodeToComp.has(parentNode) ? nodeToComp.get(parentNode).vnode.dom : el;
        const comp = SVGElement(newNode, dom);
        nodeToComp.set(newNode, comp);
        comp.render();
    });

    root.on(NodeEvent.UPDATE, (node: Node) => {
        nodeToComp.get(node).render();
    });
};