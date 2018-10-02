import {ClickTool, DragTool, ToolType} from './interfaces';
import {Coords, vector, Vector} from '../geometry';
import {Canvas} from '../canvas';
import {GuideLayer, RectangleGuide} from '../guides';
import {findMatchingRectangle} from './rectangle.tool';

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
            const {x, y, width, height} = findMatchingRectangle(origin, point);
            requestAnimationFrame(() => {
                guide.x(x);
                guide.y(y);
                guide.width(width);
                guide.height(height);
            });
        },
        actionDragEnd(point: Coords) {
            const {x: xmin, y: ymin, width, height} = findMatchingRectangle(origin, point);
            const viewBox = {
                xmin,
                ymin,
                width,
                height
            };
            guide.release();
            canvas.matchViewBox(viewBox);
            origin = null;
        }
    };
};