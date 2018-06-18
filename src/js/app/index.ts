// import {store as workspaceStoreFactory} from '../workspace';
import {canvas as canvasFactory, events} from '../canvas';
import {toolBox as toolBoxFactory} from '../tools';
// import {canvasToolPanel} from '../workspace/panel-component';
// import {canvasToolComponent, previewComponent, canvasComponent} from '../canvas';
import {svg} from '../svg';
import {vector} from "../shapes/vector";

const canvasToolElement = document.getElementById('canvas-tool-panel');
const body = document.querySelector('body');

//services
const root = svg({width: 640, height: 640});
const canvasContainer = document.getElementById('canvas-container');

// const workspace = workspaceStoreFactory();
const canvas = canvasFactory({root, el: canvasContainer});
const toolBox = toolBoxFactory({canvas});

body.addEventListener('keypress', ev => {
    const {metaKey, key} = ev;
    if (metaKey === true && ['=', '-', '0'].includes(key)) {
        if (key === '=') {
            canvas.zoomIn();
        } else if (key === '-') {
            canvas.zoomOut();
        } else if (key === '0') {
            canvas.fitContent();
        }
        ev.preventDefault();
    }
});

// canvas.on(events.MOUSE_MOVE, point => console.log(`x: ${point.x}, y: ${point.y}`));

setTimeout(() => canvas.zoom(0.7), 1000);

// setTimeout(() => canvas.pane(vector(-320, -320)), 2000);

//tools & components
// const canvasTool = canvasToolPanel({
//     el: canvasToolElement,
//     open: true,
//     workspace
// });
// const canvasTool_c = canvasToolComponent({
//     el: document.getElementById('canvas-tools-content'),
//     canvas
// });
// const canvas_c = canvasComponent({el: document.getElementById('canvas'), canvasStore: canvas});
// const preview_c = previewComponent({el: document.getElementById('preview-frame'), canvasStore: canvas});
//
// //link
// workspace.addPanel(canvasTool);
// workspace.openPanel(canvasTool);
//
//
// canvas.on('MOUSE_MOVE', ev => {
//     console.log(ev);
// });
//
// //boot
// setTimeout(() => canvas.setViewPort({width: 640, height: 640}), 1000);
//
// body.addEventListener('keypress', ev => {
//     const {metaKey, key} = ev;
//     if (metaKey === true && key === '1') {
//         canvasTool.toggle();
//         ev.preventDefault();
//     }
// });