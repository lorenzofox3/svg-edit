import {Emitter} from '../events';
import {fluent} from '../utils';

export const enum NodeType {
    SVG = 'svg',
    ELLIPSE = 'ellipse',
    GROUP = 'group',
    RECTANGLE = 'rectangle',
    LAYER = 'layer',
    POLYGON = 'polygon',
    LINE = 'line'
}

export const typeTagMap = {
    [NodeType.SVG]: 'svg',
    [NodeType.ELLIPSE]: 'ellipse',
    [NodeType.GROUP]: 'g',
    [NodeType.RECTANGLE]: 'rect',
    [NodeType.LAYER]: 'g',
    [NodeType.POLYGON]: 'polygon',
    [NodeType.LINE]: 'line'
};

export const enum NodeEvent {
    INSERT = 'insert',
    UPDATE = 'update',
    REMOVE = 'remove'
}

export interface Node {
    parent: Node | null;
    type: NodeType,
    attributes: Object,
    stateFlag: number;

    lock(): Node;

    unlock(): Node;

    toggleLock(): Node;

    hide(): Node;

    show(): Node;

    toggleHide(): Node;

    remove(): Node;

    before(...nodes: Node[]): Node;

    after(...nodes: Node[]): Node;
}

export interface ParentNode extends Iterable<Node>, Node {
    children: Node[];

    appendChild<T extends Node>(node: T): T;

    insertBefore<T extends Node>(node: T, nextSibling: Node | null): T;
}

export interface Layer extends ParentNode {
    activate(): Layer;

    deactivate(): Layer;
}

export const HIDDEN_MASK = 1;
export const LOCKED_MASK = 1 << 1;
export const ACTIVE_MASK = 1 << 2;

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
        }),
        remove: fluent(function () {
            if (this.parent !== null) {
                const parent = <ParentNode>this.parent;
                const index = parent.children.findIndex(ch => ch === this);
                const [oldNode] = parent.children.splice(index, 1);
                emitter.dispatch(NodeEvent.REMOVE, oldNode);
            }
        }),
        before: fluent(function (...nodes: Node[]) {
            console.log(`before - ${nodes.length}`);
            if (this.parent !== null) {
                for (const n of nodes) {
                    this.parent.insertBefore(n, this);
                }
            }
        }),
        after: fluent(function (...nodes: Node[]) {
            console.log('after');
            if (this.parent !== null) {
                const last = nodes.pop();
                const index = this.parent.children.findIndex(ch => ch === this);
                this.parent.insertBefore(last, this.parent.children[index + 1] || null);
                last.before(...nodes);
            }
        })
    };

    const ParentNodePrototype = {
        [Symbol.iterator]() {
            return this.children[Symbol.iterator]();
        },
        appendChild<T extends Node>(node: T) {
            return this.insertBefore(node, null);
        },
        insertBefore<T extends Node>(node: T, nextSibling: Node | null) {
            node.remove();
            const index = nextSibling !== null ?
                this.children.findIndex(ch => ch === nextSibling) :
                this.children.length;
            this.children.splice(index, 0, node);
            node.parent = this;
            emitter.dispatch(NodeEvent.INSERT, node, this, nextSibling);
            return node;
        },
        ...NodePrototype
    };

    const LayerNodePrototype = {
        activate: fluent(function () {
            this.stateFlag |= ACTIVE_MASK;
        }),
        deactivate: fluent(function () {
            this.stateFlag &= ~ACTIVE_MASK;
        }),
        ...ParentNodePrototype
    };


    const nodePropertyDescriptor = (type: NodeType, parent: ParentNode | null, attrs = {}) => {
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

    const containerNodePropertyDescriptor = (type: NodeType, parent: ParentNode | null, attrs = {}) => Object.assign(nodePropertyDescriptor(type, parent, attrs), {
        children: {
            value: [],
            enumerable: true
        }
    });

    return {
        createNode(type: NodeType, attrs = {}): Node {
            return Object.create(NodePrototype, nodePropertyDescriptor(type, null, attrs));
        },
        createContainerNode(type: NodeType, attrs = {}): ParentNode {
            return Object.create(ParentNodePrototype, containerNodePropertyDescriptor(type, null, attrs));
        },
        createLayerNode(attrs = {}): Layer {
            return Object.create(LayerNodePrototype, containerNodePropertyDescriptor(NodeType.LAYER, null, attrs));
        },
    };
};

export const traverseDF = function* (node: Node) {
    yield node;
    if (node[Symbol.iterator]) {
        for (const ch of <ParentNode>node) {
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

export const containerTypes = [NodeType.LAYER, NodeType.GROUP];

export const isParentNode = (node: Node | ParentNode): node is ParentNode => {
    return node[Symbol.iterator] !== undefined;
};

