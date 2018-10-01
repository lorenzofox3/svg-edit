import {ClickTool, DragTool, ToolType} from './interfaces';
import {Coords, vector, Vector} from '../geometry';
import {Canvas} from '../canvas';
import {GuideLayer, RectangleGuide} from '../guides';

type MagnifierToolDependencies = {
    canvas: Canvas,
    canvasGuide: GuideLayer
}

export const magnifierTool = ({canvas, canvasGuide}: MagnifierToolDependencies): ClickTool & DragTool => {

    let origin: Vector = null;
    let guide: RectangleGuide = null;

    return {
        toolType: ToolType.MAGNIFIER,
        actionClick(point: Coords, event: MouseEvent) {
            canvas.zoomIn(point);
        },
        alternateActionClick(point: Coords, event: MouseEvent) {
            canvas.zoomOut(point);
        },
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
            const viewBox = {
                xmin: origin.x,
                ymin: origin.y,
                width: point.x - origin.x,
                height: point.y - origin.y
            };
            guide.release();
            canvas.matchViewBox(viewBox);
            origin = null;
        }
    };
};