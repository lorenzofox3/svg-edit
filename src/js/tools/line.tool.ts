import {DragTool, ToolType} from './interfaces';
import {Coords, vector} from '../geometry';
import {GuideLayer, LineGuide} from '../guides';
import {Root} from '../svg-document';
import {compose} from 'smart-table-operators';

type LineToolDependencies = {
    canvasGuide: GuideLayer;
    document: Root
};

export const lineTool = ({canvasGuide, document}: LineToolDependencies): DragTool => {
    let origin: Coords | null = null;
    let guide: LineGuide | null = null;

    const {createLineNode, append} = document;
    const appendLine = compose(createLineNode.bind(document), append.bind(document));

    return {
        toolType: ToolType.LINE,
        actionDragStart(point: Coords) {
            guide = canvasGuide.getLineGuide(point.x, point.y);
            origin = point;
        },
        actionDrag(point: Coords, ev: DragEvent) {
            const {shiftKey} = ev;
            requestAnimationFrame(() => {
                guide.p2(point.x, point.y);
            });
        },
        actionDragEnd(point: Coords) {
            guide.release();
            appendLine({
                x1: origin.x,
                y1: origin.y,
                x2: point.x,
                y2: point.y
            });
            origin = null;
        }
    };

};