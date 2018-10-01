import {DragTool, ToolType} from './interfaces';
import {Coords, Vector, vector} from '../geometry';
import {GuideLayer, RectangleGuide} from '../guides';
import {Root} from '../svg-document';
import {compose} from 'smart-table-operators';

type RectangleToolDependencies = {
    canvasGuide: GuideLayer;
    document: Root
}

export const rectangleTool = ({canvasGuide, document}: RectangleToolDependencies): DragTool => {

    let origin: Vector | null = null;
    let guide: RectangleGuide | null = null;

    const {createRectangleNode, append} = document;
    const appendRectangle = compose(createRectangleNode.bind(document), append.bind(document));

    return {
        toolType: ToolType.RECTANGLE,
        actionDragStart(point: Coords) {
            guide = canvasGuide.getRectangleGuide(point.x, point.y);
            origin = vector(point);
        },
        actionDrag(point: Coords) {
            const translation = vector(point).substract(origin);
            requestAnimationFrame(() => {
                guide.width(translation.x);
                guide.height(translation.y);
            });
        },
        actionDragEnd(point: Coords) {
            const diag = vector(point).substract(origin);
            guide.release();
            appendRectangle({
                x: origin.x,
                y: origin.y,
                width: diag.x,
                height: diag.y
            });
            origin = null;
        }
    };
};