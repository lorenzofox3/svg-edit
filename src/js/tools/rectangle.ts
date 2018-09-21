import {DragTool, ToolType} from './interfaces';
import {Coords, Vector, vector} from '../geometry';
import {GuideLayer, RectangleGuide} from '../guides';
import {Root, TagName} from '../svg-document';

type RectangleToolDependencies = {
    canvasGuide: GuideLayer;
    document: Root
}

export const rectangleTool = ({canvasGuide, document}: RectangleToolDependencies): DragTool => {

    let origin: Vector | null = null;
    let guide: RectangleGuide | null = null;

    return {
        toolType: ToolType.RECTANGLE,
        actionDragStart(point: Coords, event) {
            guide = canvasGuide.getRectangleGuide(point.x, point.y);
            origin = vector(point);
        },
        actionDrag(point: Coords, event) {
            const translation = vector(point).substract(origin);
            guide.width(translation.x);
            guide.height(translation.y);
        },
        actionDragEnd(point: Coords, event) {
            const diag = vector(point).substract(origin);
            guide.release();
            document.append(TagName.RECTANGLE, {
                x: origin.x,
                y: origin.y,
                width: diag.x,
                height: diag.y
            });
            origin = null;
        }
    };
};