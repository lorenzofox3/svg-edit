import {SVG_NS} from './utils';

// todo first basic draft: can be much better
export const render = (parentDomNode, vnode) => {
    const {tag, attributes = {}} = vnode;
    const n = document.createElementNS(SVG_NS, tag);
    for (const [prop, value] of Object.entries(attributes)) {
        n.setAttribute(prop, String(value));
    }
    parentDomNode.appendChild(n);
    if (vnode.children && vnode.children.length) {
        for (const child of vnode.children) {
            render(n, child);
        }
    }
};