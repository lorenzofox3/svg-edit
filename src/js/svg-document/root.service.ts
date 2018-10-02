import {Emitter, emitter} from '../events';
import {ParentNode, Layer, Node, NodeType, provider, containerTypes} from './nodes';
import {Coords} from '../geometry';

type RectangleOptions = {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

type EllipseOptions = {
    cx?: number;
    cy?: number;
    rx?: number;
    ry?: number;
}

type PolygonOptions = {
    points?: Coords[];
}

type LineOptions = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

export interface Root extends Emitter {
    width: number;
    height: number;

    createNode(type: NodeType, attributes?: Object): Node | ParentNode;

    createLayerNode(): Layer;

    createLayerNode(attributes: Object): Layer;

    createRectangleNode(options: RectangleOptions): Node;

    createEllipseNode(options: EllipseOptions): Node;

    createPolygonNode(options: PolygonOptions): Node;

    createLineNode(options: LineOptions): Node;

    append<T extends Node>(type: NodeType, attributes: Object): T;

    append<T extends Node>(node: T): T;

    activateLayer(node: Layer): Layer;

    dir(): void;
}

export const RootService = ({width = 100, height = 100} = {
    width: 100,
    height: 100,
}): Root => {
    let currentLayer: ParentNode | null = null;
    const instance = emitter();
    const {createNode, createContainerNode, createLayerNode} = provider(instance);

    const rootNode = createContainerNode(NodeType.SVG, {
        viewBox: `0 0 ${width} ${height}`,
        id: 'document'
    });

    const toReturn = Object.assign({
        width, // so typescript does not scream
        height,
        createLayerNode(attrs = {}) {
            const newNode = createLayerNode(attrs);
            rootNode.appendChild(newNode);
            return this.activateLayer(newNode);
        },
        append<T extends Node>(type: NodeType | T, attributes = {}) {
            const parent = currentLayer || rootNode;
            let newNode = type;
            //we have already a node
            if (typeof type !== 'object') {
                const factory = containerTypes.includes(type) ? createContainerNode : createNode;
                newNode = <T>factory(type, attributes);
            }
            parent.appendChild(<T>newNode);
            return newNode;
        },
        createNode(type: NodeType, attributes = {}) {
            return type === NodeType.GROUP ? createContainerNode(type, attributes) : createNode(type, attributes);
        },
        createRectangleNode(options: RectangleOptions) {
            return this.createNode(NodeType.RECTANGLE, options);
        },
        createEllipseNode(options: EllipseOptions) {
            return this.createNode(NodeType.ELLIPSE, options);
        },
        createPolygonNode(options: PolygonOptions) {
            const attributes: any = {...options};
            attributes.points = options.points.map(({x, y}) => `${x},${y}`).join(' ');
            return this.createNode(NodeType.POLYGON, attributes);
        },
        createLineNode(options: LineOptions) {
            return this.createNode(NodeType.LINE, options);
        },
        activateLayer(node: Layer) {
            rootNode.children.map(ch => ch === node ? (<Layer>ch).activate() : (<Layer>ch).deactivate());
            currentLayer = node;
            return node;
        },
        dir() {
            console.dir(rootNode);
        }
    }, instance);

    Object.defineProperties(toReturn, {
        width: {value: width},
        height: {value: height}
    });

    return toReturn;
};