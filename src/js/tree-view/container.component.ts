import {DragAndDropHelperFactory, DropArea} from './drag-and-drop';
import {ACTIVE_MASK, Layer, NodeType, Root, Node} from '../svg-document';
import {button, component, div, li, SLOT, span, ul} from '../mini-f';
import {controlBar} from './control-bar.component';


const itemRowTemplate = (ControlBarComponent) => state => {
    const {depth, dropArea = DropArea.NONE, ondragover, ondragstart, ondrop, toggle, nodeType} = state;
    const classList = ['item-content'];

    if (dropArea !== DropArea.NONE) {
        classList.push(`drop-${dropArea}`);
    }

    return div({class: classList.join(' '), draggable: true, ondragstart, ondrop, ondragover},
        ControlBarComponent(state),
        div({
                style: `--depth: ${depth};`,
                'data-depth': depth,
                class: 'item-label'
            },
            button({
                onclick: toggle,
                'aria-expanded': String(!!state.isExpanded)
            }, state.isExpanded ? 'c' : 'e'),
            span({class: 'name'}, nodeType)
        )
    );
};

type ContainerComponentDependencies = {
    node: Node;
    dragAndDropHelper: DragAndDropHelperFactory<Node>;
    root: Root;
}

export const ContainerComponent = ({node, dragAndDropHelper, root}: ContainerComponentDependencies) => {
    const ddHandlers = dragAndDropHelper(node);
    const ControlBarComponent = controlBar(node);
    const row = itemRowTemplate(ControlBarComponent);

    return component((state, update) => {
        const {isExpanded = true} = state;
        const toggle = () => update({isExpanded: !isExpanded});
        const className = isExpanded === false ? ['hidden'] : [''];
        const isActive = node.stateFlag & ACTIVE_MASK;
        const activate = ev => {
            if (node.type === NodeType.LAYER && ev.target.tagName !== 'BUTTON') {
                root.activateLayer(<Layer>node);
            }
        };
        return li({
                onclick: activate,
                class: isActive ? 'layer-active' : ''
            },
            row({...state, ...ddHandlers, isExpanded, nodeType: node.type, toggle}),
            ul({
                class: className
            }, SLOT));
    });
};