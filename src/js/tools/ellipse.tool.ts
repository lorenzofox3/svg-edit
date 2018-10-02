import {DragTool} from './interfaces';
import {Coords, Vector, vector} from '../geometry';
import {EllipseGuide, GuideLayer} from '../guides';
import {Root} from '../svg-document';
import {ToolType} from './interfaces';
import {Canvas} from '../canvas';
import {compose} from 'smart-table-operators';
import {abs} from '../utils';

type EllipseToolDependencies = {
    canvasGuide: GuideLayer;
    canvas: Canvas;
    document: Root;
}

const findRadius = (origin: Coords, current: Coords, asCircle = false) => {
    const radius = vector(current).substract(vector(origin));
    const maxRad = Math.max(abs(radius.x), abs(radius.y));
    return {
        rx: asCircle ? maxRad : abs(radius.x),
        ry: asCircle ? maxRad : abs(radius.y)
    };
};

export const ellipseTool = ({canvasGuide, canvas, document}: EllipseToolDependencies): DragTool => {

    let origin: Vector | null = null;
    let guide: EllipseGuide | null = null;

    const {createEllipseNode, append} = document;
    const appendEllipse = compose(createEllipseNode.bind(document), append.bind(document));

    return {
        toolType: ToolType.ELLIPSE,

        actionDragStart(point: Coords) {
            guide = canvasGuide.getEllipseGuide(point.x, point.y);
            origin = vector(point);
        },
        actionDrag(point: Coords, ev: MouseEvent) {
            const {shiftKey} = ev;
            const {rx, ry} = findRadius(origin, point, shiftKey);
            requestAnimationFrame(() => {
                guide.rx(rx);
                guide.ry(ry);
            });
        },
        actionDragEnd(point: Coords, ev: MouseEvent) {
            const {shiftKey} = ev;
            const {rx, ry} = findRadius(origin, point, shiftKey);
            guide.release();
            appendEllipse({
                cx: origin.x,
                cy: origin.y,
                rx,
                ry
            });
            origin = null;
        }
    };
};