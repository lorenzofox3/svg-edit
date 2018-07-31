import {DragTool} from './interfaces';
import {Coords, Vector, vector} from '../geometry';
import {RectangleGuide} from '../guides';
import {rectangle} from '../svg';

export const rectangleTool = ({canvasGuide, document, canvas}): DragTool => {

    let origin: Vector | null = null;
    let guide: RectangleGuide | null = null;

    return {
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
            document.appendChild(rectangle({
                x: origin.x,
                y: origin.y,
                width: diag.x,
                height: diag.y
            }));
            canvas.render();
            origin = null;
        }
    };
};