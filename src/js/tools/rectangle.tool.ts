import {DragTool, ToolType} from './interfaces';
import {Coords, Vector, vector} from '../geometry';
import {GuideLayer, RectangleGuide} from '../guides';
import {Root} from '../svg-document';
import {compose} from 'smart-table-operators';

type RectangleToolDependencies = {
    canvasGuide: GuideLayer;
    document: Root
}

export const findMatchingRectangle = (origin: Coords, current: Coords, asSquare = false) => {
    let topLeft = vector(Math.min(current.x, origin.x), Math.min(current.y, origin.y));
    let bottomRight = vector(Math.max(current.x, origin.x), Math.max(current.y, origin.y));
    let diag = bottomRight.substract(topLeft);

    if (asSquare) {
        const sideLength = Math.max(diag.x, diag.y);
        const isAbove = current.y <= origin.y;
        const isLeft = current.x <= origin.x;
        topLeft = vector(isLeft ? origin.x - sideLength : origin.x, isAbove ? origin.y - sideLength : origin.y);
        bottomRight = vector(isLeft ? origin.x : origin.x + sideLength, isAbove ? origin.y : origin.y + sideLength);
        diag = bottomRight.substract(topLeft);
    }

    return {
        x: topLeft.x,
        y: topLeft.y,
        width: diag.x,
        height: diag.y
    };
};


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
        actionDrag(point: Coords, ev) {
            const {shiftKey} = ev;
            const {x, y, width, height} = findMatchingRectangle(origin, point, shiftKey);
            requestAnimationFrame(() => {
                guide.x(x);
                guide.y(y);
                guide.width(width);
                guide.height(height);
            });
        },
        actionDragEnd(point: Coords, ev) {
            const {shiftKey} = ev;
            const {x, y, width, height} = findMatchingRectangle(origin, point, shiftKey);
            guide.release();
            appendRectangle({
                x,
                y,
                width,
                height
            });
            origin = null;
        }
    };
};