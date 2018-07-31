import {canvas as canvasFactory} from '../canvas';
import {toolBox as toolBoxFactory} from '../tools';
import {root as svg, SVG_NS} from '../svg';
import {guideLayer as guideLayerFactory} from '../guides';

const root = svg({width: 640, height: 640});

const body = document.querySelector('body');
const canvasContainer = document.getElementById('canvas-container');
const physicalCanvas = document.getElementById('canvas');
const svgDocument = document.createElementNS(SVG_NS, 'svg');
svgDocument.setAttribute('viewBox', `0 0 ${root.width()} ${root.height()}`);
const guideLayer = document.createElementNS(SVG_NS, 'g');
svgDocument.id = 'document';
guideLayer.id = 'guide-layer';
const renderLayer = document.createElementNS(SVG_NS, 'g');
renderLayer.id = 'render-layer';
svgDocument.appendChild(renderLayer);
svgDocument.appendChild(guideLayer);
physicalCanvas.appendChild(svgDocument);

//services
const canvas = canvasFactory({root, el: canvasContainer});
const canvasGuide = guideLayerFactory({el: canvasContainer});
const toolBox = toolBoxFactory({canvas, document: root, canvasGuide});

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

setTimeout(() => {
    canvas.zoom(0.7)
}, 1000);
