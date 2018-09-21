export interface VNode {
    type: string;
    props: {
        [prop: string]: any
    };
    children: VNode[];
    dom?: Node;
}


const createTextVNode = value => ({
    type: 'Text',
    children: [],
    props: {value}
});

export const NA = Object.freeze({});

const normalize = (children, currentText = '', normalized = []) => {
    if (children.length === 0) {
        if (currentText) {
            normalized.push(createTextVNode(currentText));
        }
        return normalized;
    }

    const child = children.shift();
    if (typeof child !== 'string') {
        if (currentText) {
            normalized.push(createTextVNode(currentText));
            currentText = '';
        }
        normalized.push(child);
    } else {
        currentText += child;
    }

    return normalize(children, currentText, normalized);
};

export const h = (nodeType: string, props = NA, ...children): VNode => {
    const normalizedChildren = normalize([...children]);
    return {
        type: nodeType,
        props,
        children: normalizedChildren
    };
};