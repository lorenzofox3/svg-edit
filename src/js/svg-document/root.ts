import {Emitter, emitter} from '../events';
import {ContainerNode, Node, provider, TagName} from './nodes';

export interface Root extends Emitter {
    width: number;
    height: number;

    addLayer(attributes: Object): ContainerNode;

    append(type: TagName, attributes: Object): Node | ContainerNode;

    createNode(type: TagName, attributes: Object): Node | ContainerNode;
}

export const root = ({width = 100, height = 100} = {
    width: 100,
    height: 100,
}): Root => {
    let currentLayer: ContainerNode | null = null;
    const instance = emitter();
    const {createNode, createContainerNode} = provider(instance);

    const rootNode = createContainerNode(TagName.SVG, null, {
        viewBox: `0 0 ${width} ${height}`,
        id: 'document'
    });


    Object.assign(instance, {
        addLayer(attrs = {}) {
            const newNode = createContainerNode(TagName.GROUP, rootNode, attrs);
            rootNode.appendChild(newNode);
            return currentLayer = newNode;
        },
        append(type: TagName, attributes = {}) {
            const factory = type === TagName.GROUP ? createContainerNode : createNode;
            const newNode = factory(type, currentLayer, attributes);
            const parent = currentLayer || rootNode;
            parent.appendChild(newNode);
            return newNode;
        },
        createNode(type: TagName, attributes = {}) {
            return type === TagName.GROUP ? createContainerNode(type, null, attributes) : createNode(type, null, attributes);
        }
    });

    Object.defineProperties(instance, {
        width: {value: width},
        height: {value: height}
    });

    return <Root>instance;
};