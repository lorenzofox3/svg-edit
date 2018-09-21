import {Emitter} from '../events';
import {fluent} from '../utils';

export const enum TagName {
    SVG = 'svg',
    ELLIPSE = 'ellipse',
    GROUP = 'g',
    RECTANGLE = 'rect'
}

export const enum NodeEvent {
    INSERT = 'insert',
    UPDATE = 'update'
}

export interface Node {
    parent: Node | null;
    type: TagName,
    attributes: Object,
    stateFlag: number;

    lock(): Node;

    unlock(): Node;

    toggleLock(): Node;

    hide(): Node;

    show(): Node;

    toggleHide(): Node;
}

export interface ContainerNode extends Iterable<Node>, Node {
    children: Node[];

    appendChild(node: Node): Node | ContainerNode;

    insert(node: Node, nextSibling: Node | null): Node | ContainerNode;
}

export const HIDDEN_MASK = 1;
export const LOCKED_MASK = 1 << 1;

export const provider = (emitter: Emitter) => {
    const NodePrototype = {
        lock: fluent(function () {
            this.stateFlag |= LOCKED_MASK;
        }),
        unlock: fluent(function () {
            this.stateFlag &= ~LOCKED_MASK;
        }),
        toggleLock: fluent(function () {
            const method = this.stateFlag & LOCKED_MASK ? 'unlock' : 'lock';
            this[method]();
        }),
        hide: fluent(function () {
            this.stateFlag |= HIDDEN_MASK;
        }),
        show: fluent(function () {
            this.stateFlag &= ~HIDDEN_MASK;
        }),
        toggleHide: fluent(function () {
            const method = this.stateFlag & HIDDEN_MASK ? 'show' : 'hide';
            this[method]();
        })
    };

    const ContainerNodePrototype = Object.assign({
        [Symbol.iterator]() {
            return this.children[Symbol.iterator]();
        },
        appendChild(node: Node) {
            return this.insert(node, null);
        },
        insert(node: Node, nextSibling: Node | null) {
            const index = nextSibling !== null ?
                this.children.findIndex(ch => ch === nextSibling) :
                this.children.length - 1;
            this.children.splice(index, 0, node);
            node.parent = this;
            emitter.dispatch(NodeEvent.INSERT, node, this, nextSibling);
            return node;
        }
    }, NodePrototype);


    const nodePropertyDescriptor = (type: TagName, parent: ContainerNode | null, attrs = {}) => {
        let stateFlag = 0;

        return {
            type: {value: type, enumerable: true},
            parent: {value: parent, enumerable: true, writable: true},
            attributes: {
                get() {
                    return Object.assign({}, attrs);
                },
                enumerable: true
            },
            stateFlag: {
                get() {
                    return stateFlag;
                },
                set(val) {
                    if (val !== stateFlag) {
                        stateFlag = val;
                        emitter.dispatch(NodeEvent.UPDATE, this);
                    }
                },
                enumerable: true
            }
        };
    };

    const containerNodePropertyDescriptor = (type: TagName, parent: ContainerNode | null, attrs = {}) => Object.assign(nodePropertyDescriptor(type, parent, attrs), {
        children: {
            value: [],
            enumerable: true
        }
    });

    return {
        createNode(type: TagName, parent: ContainerNode | null, attrs = {}): Node {
            return Object.create(NodePrototype, nodePropertyDescriptor(type, parent, attrs));
        },
        createContainerNode(type: TagName, parent: ContainerNode | null, attrs = {}): ContainerNode {
            return Object.create(ContainerNodePrototype, containerNodePropertyDescriptor(type, parent, attrs));
        }
    };
};

export const traverseDF = function* (node: Node) {
    yield node;
    if (node[Symbol.iterator]) {
        for (const ch of <ContainerNode>node) {
            yield* traverseDF(ch);
        }
    }
};

export const traverseUp = function* (node: Node) {
    yield node;
    if (node.parent !== null) {
        yield* traverseUp(node.parent);
    }
};

export const depth = (node: Node, currentDepth = 1) => {
    if (node.parent === null) {
        return currentDepth;
    }

    return depth(node.parent, currentDepth + 1);
};
