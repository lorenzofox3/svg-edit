import {
    containerTypes,
    depth,
    isParentNode,
    Node,
    NodeEvent, Root,
} from '../svg-document';
import {button, component, Component, div, h2, NA, SLOT, ul, VNode} from '../mini-f';
import {nodeDragAndDropHelper} from './drag-and-drop';
import {ContainerComponent} from './container.component';
import {ItemComponent} from './element.component';

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

type TreeViewComponentDependencies = {
    root: Root
}

const TreeView = ({root}: TreeViewComponentDependencies) => component(() => {
    const addLayer = () => {
        root.createLayerNode();
    };

    return div(NA,
        h2(NA, 'Tree view'),
        button({
            onclick: addLayer
        }, 'Add layer'),
        button({onclick: () => root.dir()}, 'debug'),
        ul({id: 'layers-container'})
    );
});

export const TreeViewComponent = ({document: root, el}) => {
    const registry = new WeakMap<Node, Component>();
    const dragHelperInstance = nodeDragAndDropHelper(registry);
    const comp = TreeView({root})(el);

    let layerContainer = null;

    const insertHandler = (newNode: Node, parentNode: Node, nextSibling: Node | null) => {
        const dependencies = {node: newNode, dragAndDropHelper: dragHelperInstance, root};
        const factory = containerTypes.includes(newNode.type) ? ContainerComponent : ItemComponent;
        const comp = factory(dependencies);
        const d = Math.max(depth(newNode) - 2, 0);
        const fragment = document.createDocumentFragment();
        const instance = comp(fragment, {depth: d});
        instance.render();
        registry.set(newNode, instance);

        // we insert the whole sub tree
        if (isParentNode(newNode)) {
            for (const ch of newNode) {
                insertHandler(ch, newNode, null);
            }
        }

        if (registry.has(nextSibling)) {
            const sibling = registry.get(nextSibling).vnode.dom;
            sibling.parentNode.insertBefore(fragment, sibling);
        } else {
            let domContainer = layerContainer = layerContainer || el.querySelector('ul');
            domContainer = registry.has(parentNode) ? findSlot(registry.get(parentNode).vnode).dom : domContainer;
            domContainer.appendChild(fragment);
        }
    };

    root.on(NodeEvent.REMOVE, (oldNode: Node) => {
        if (registry.has(oldNode)) {
            const oldComp = registry.get(oldNode);
            oldComp.vnode.dom.parentNode.removeChild(oldComp.vnode.dom);
            registry.delete(oldNode);
        }
    });

    root.on(NodeEvent.INSERT, insertHandler);

    root.on(NodeEvent.UPDATE, (node: Node) => {
        const component = registry.get(node);
        component.render();
    });
    return comp;
};