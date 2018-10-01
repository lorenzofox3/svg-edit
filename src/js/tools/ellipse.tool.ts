import {DragTool} from './interfaces';
import {Coords, Vector, vector} from '../geometry';
import {EllipseGuide, GuideLayer} from '../guides';
import {Root, NodeType} from '../svg-document';
import {ToolType} from './interfaces';
import {Canvas} from '../canvas';
import {compose} from 'smart-table-operators';

type EllipseToolDependencies = {
    canvasGuide: GuideLayer;
    canvas: Canvas;
    document: Root;
}

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
        actionDrag(point: Coords) {
            const radius = vector(point).substract(origin);
            requestAnimationFrame(() => {
                guide.rx(radius.x);
                guide.ry(radius.y);
            });
        },
        actionDragEnd(point: Coords) {
            const vec = vector(point).substract(origin);
            guide.release();
            appendEllipse({
                cx: origin.x,
                cy: origin.y,
                rx: vec.x,
                ry: vec.y
            });
            origin = null;
        }
    };
};