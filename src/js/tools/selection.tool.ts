import {GuideLayer, RectangleGuide} from '../guides';
import {Root} from '../svg-document';
import {ClickTool, DragTool, ToolType} from './interfaces';
import {Coords, vector, Vector} from '../geometry';

type SelectionToolDependencies = {
    canvasGuide: GuideLayer;
    document: Root
}


export const selectionTool = ({canvasGuide, document}: SelectionToolDependencies): ClickTool & DragTool => {
    let origin: Vector = null;
    let guide: RectangleGuide = null;

    return {
        toolType: ToolType.SELECTION,
        actionClick(point: Coords, event: MouseEvent) {
        },
        alternateActionClick(point: Coords, event: MouseEvent) {
        },
        actionDragStart(point: Coords) {
        },
        actionDrag(point: Coords) {
        },
        actionDragEnd(point: Coords) {
        }
    };
};