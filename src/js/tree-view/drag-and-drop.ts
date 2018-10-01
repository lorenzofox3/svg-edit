import {Node, ParentNode, containerTypes, isParentNode} from '../svg-document';
import {Component} from '../mini-f';

export interface DragAndDropHelper {
    ondragstart(ev: DragEvent);

    ondragover(ev: DragEvent);

    ondrop(ev: DragEvent);

    ondragend(ev: DragEvent);
}

export interface DragAndDropHelperFactory<T> {
    (item: T): DragAndDropHelper;
}

const Epsilon = 2;

const isAbove = (y: number, element: HTMLElement) => {
    const {top, height} = element.getBoundingClientRect();
    return (y - top) <= (height / 2); // isAbove
};

export const enum DropArea {
    NONE = 'none',
    WHOLE = 'whole',
    TOP = 'top',
    BOTTOM = 'bottom'
}

export const nodeDragAndDropHelper = (registry: WeakMap<Node, Component>): DragAndDropHelperFactory<Node> => {
    let dragging: Node = null;
    let over: Node = null;
    let lastY: number = null;
    let dropArea: DropArea = DropArea.NONE;

    const unhilight = (node: Node) => {
        registry.get(node).render({dropArea: DropArea.NONE});
    };

    const highlight = (node: Node) => {
        registry.get(node).render({dropArea});
    };

    const reset = () => {
        dragging = null;
        unhilight(over);
        over = null;
        dropArea = null;
    };

    return (node: Node): DragAndDropHelper => ({
        ondragstart(ev: DragEvent) {
            ev.dataTransfer.setData('text/plain', 'moving node');
            ev.dataTransfer.effectAllowed = 'move';
            lastY = ev.clientY;
            over = dragging = node;
        },
        ondragover(ev: DragEvent) {
            ev.preventDefault();
            const {currentTarget, clientY} = ev;

            if (node !== over) {
                unhilight(over);
            }

            if (node !== dragging && Math.abs((clientY - lastY)) > Epsilon) {
                dropArea = isAbove(clientY, <HTMLElement>currentTarget) ? DropArea.TOP : DropArea.BOTTOM;
                dropArea = containerTypes.includes(node.type) ? DropArea.WHOLE : dropArea;
                lastY = clientY;
                highlight(node);
            }

            over = node;
        },
        ondrop(ev: DragEvent) {
            ev.preventDefault();
            if (isParentNode(node)) {
                node.appendChild(dragging);
            } else if (dropArea === DropArea.BOTTOM) {
                node.after(dragging);
            } else {
                node.before(dragging);
            }
            reset();
        },
        ondragend(ev: DragEvent) {
            reset();
        }
    });
};