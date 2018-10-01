import {CompositeGuide, GuideLayer, LineGuide, PointGuide} from '../guides';
import {Root} from '../svg-document';
import {ClickTool, MoveTool, StatefullTool, ToolType} from './interfaces';
import {Coords, vector, Vector} from '../geometry';
import {compose} from 'smart-table-operators';

type PolygonToolDependencies = {
    canvasGuide: GuideLayer
}

export const polygonTool = ({canvasGuide}: PolygonToolDependencies): ClickTool & MoveTool & StatefullTool => {

    let guide: CompositeGuide = null;
    let vertices = [];
    let lastPoint: PointGuide;
    let moving: [LineGuide, PointGuide];

    return {
        toolType: ToolType.POLYGON,
        actionClick(point: Coords, event: MouseEvent) {
            if (guide === null) {
                guide = canvasGuide.getCompositeGuide();
                vertices.push(guide.getPointGuide(point.x, point.y));
            }

            const lineGuide = guide.getLineGuide(point.x, point.y);
            const nextPoint = guide.getPointGuide(point.x, point.y);

            moving = [lineGuide, nextPoint];
        },
        alternateActionClick(point: Coords, event: MouseEvent) {
            // noop
        },
        cancelAction() {
            vertices = [];
            guide.release();
            guide = null;
        },
        endAction() {

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