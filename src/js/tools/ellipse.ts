import {DragTool} from './interfaces';
import {Coords, Vector, vector} from '../geometry';
import {EllipseGuide} from '../guides';
import {ellipse} from '../svg';

export const ellipseTool = ({canvasGuide, canvas, document}): DragTool => {

    let origin: Vector | null = null;
    let guide: EllipseGuide | null = null;

    return {
        actionDragStart(point: Coords, event) {
            guide = canvasGuide.getEllipseGuide(point.x, point.y);
            origin = vector(point);
        },
        actionDrag(point: Coords, event) {
            const radius = vector(point).substract(origin);
            guide.rx(radius.x);
            guide.ry(radius.y);
        },
        actionDragEnd(point: Coords, event) {
            const vec = vector(point).substract(origin);
            guide.release();
            document.appendChild(ellipse({
                cx: origin.x,
                cy: origin.y,
                rx: vec.x,
                ry: vec.y
            }));
            canvas.render();
            origin = null;
        }
    };
};