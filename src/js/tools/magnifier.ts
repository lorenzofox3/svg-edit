import {ClickTool, ToolType} from './interfaces';
import {Coords} from '../geometry';
import {Canvas} from '../canvas';

type MagnifierToolDependencies = {
    canvas: Canvas
}

export const magnifierTool = ({canvas}: MagnifierToolDependencies): ClickTool => {
    return {
        toolType:ToolType.MAGNIFIER,
        actionClick(point: Coords, event: MouseEvent) {
            canvas.zoomIn(point);
        },
        alternateActionClick(point: Coords, event: MouseEvent) {
            canvas.zoomOut(point);
        }
    };
};