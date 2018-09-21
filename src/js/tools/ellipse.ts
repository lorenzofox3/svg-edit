import {DragTool} from './interfaces';
import {Coords, Vector, vector} from '../geometry';
import {EllipseGuide, GuideLayer} from '../guides';
import {Root, TagName} from '../svg-document';
import {ToolType} from './interfaces';
import {Canvas} from '../canvas';

type EllipseToolDependencies = {
    canvasGuide: GuideLayer;
    canvas: Canvas;
    document: Root;
}

export const ellipseTool = ({canvasGuide, canvas, document}: EllipseToolDependencies): DragTool => {

    let origin: Vector | null = null;
    let guide: EllipseGuide | null = null;

    return {
        toolType: ToolType.ELLIPSE,

        actionDragStart(point: Coords) {
            guide = canvasGuide.getEllipseGuide(point.x, point.y);
            origin = vector(point);
        },
        actionDrag(point: Coords) {
            const radius = vector(point).substract(origin);
            guide.rx(radius.x);
            guide.ry(radius.y);
        },
        actionDragEnd(point: Coords) {
            const vec = vector(point).substract(origin);
            document.append(TagName.ELLIPSE, {
                cx: origin.x,
                cy: origin.y,
                rx: vec.x,
                ry: vec.y
            });
            guide.release();
            origin = null;
        }
    };
};