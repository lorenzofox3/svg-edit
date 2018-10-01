import {Node, Root} from '../svg-document';
import {DragAndDropHelperFactory, DropArea} from './drag-and-drop';
import {button, component, div, li, NA, span} from '../mini-f';
import {controlBar} from './control-bar.component';

type ItemComponentDependencies = {
    node: Node;
    dragAndDropHelper: DragAndDropHelperFactory<Node>;
}

export const ItemComponent = ({node, dragAndDropHelper}: ItemComponentDependencies) => {
    const ddHandlers = dragAndDropHelper(node);
    const ControlBarComponent = controlBar(node);
    return component((state, update) => {
        const {depth, dropArea = DropArea.NONE} = state;
        const {ondragover, ondragstart, ondrop} = ddHandlers;
        const classList = ['item-content'];

        if (dropArea !== DropArea.NONE) {
            classList.push(`drop-${dropArea}`);
        }

        return li(NA, div({class: classList.join(' '), draggable: true, ondragstart, ondrop, ondragover},
            ControlBarComponent(state),
            div({
                    style: `--depth: ${depth};`,
                    'data-depth': depth,
                    class: 'item-label'
                },
                span({class: 'name'}, node.type)
            )
        ));
    });
};