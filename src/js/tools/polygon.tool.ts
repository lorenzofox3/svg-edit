import {CompositeGuide, GuideLayer, LineGuide, PointGuide} from '../guides';
import {Root} from '../svg-document';
import {ClickTool, MoveTool, StatefulTool, ToolType} from './interfaces';
import {Coords} from '../geometry';
import {compose} from 'smart-table-operators';

type PolygonToolDependencies = {
    canvasGuide: GuideLayer,
    document: Root
}

export const polygonTool = ({canvasGuide, document}: PolygonToolDependencies): ClickTool & MoveTool & StatefulTool => {

    let guide: CompositeGuide = null;
    let vertices: Coords[] = [];
    let moving: [LineGuide, PointGuide] = null;
    const {createPolygonNode, append} = document;
    const appendPolygon = compose(createPolygonNode.bind(document), append.bind(document));

    const release = () => {
        if (guide !== null) {
            guide.release();
        }
        guide = null;
        vertices = [];
        moving = null;
    };

    return {
        toolType: ToolType.POLYGON,
        actionClick(point: Coords, event: MouseEvent) {
            if (guide === null) {
                guide = canvasGuide.getCompositeGuide();
                guide.getPointGuide(point.x, point.y);
            }
            vertices.push(point);
            const lineGuide = guide.getLineGuide(point.x, point.y);
            const nextPoint = guide.getPointGuide(point.x, point.y);

            moving = [lineGuide, nextPoint];
        },
        alternateActionClick(point: Coords, event: MouseEvent) {
            // noop
        },
        cancelAction() {
            release();
        },
        endAction() {
            if (vertices.length >= 3) {
                appendPolygon({points: vertices});
            }
            release();
        },
        actionMove(point: Coords, event: MouseEvent) {
            if (moving) {
                requestAnimationFrame(() => {
                    moving[0].p2(point);
                    moving[1].x(point.x);
                    moving[1].y(point.y);
                });
            }
        }
    };
};