import {canvas as canvasFactory, renderingLayer} from '../canvas';
import {toolBarComponent, toolBox as toolBoxFactory} from '../tools';
import {ContainerNode, root as svg, TagName} from '../svg-document';
import {guideLayer as guideLayerFactory} from '../guides/service';
import {SVG_NS} from '../mini-f';
import {TreeViewComponent} from '../tree-view';

const width = 640;
const height = 640;

const body = document.querySelector('body');
const canvasContainer = document.getElementById('canvas-container');
const physicalCanvas = document.getElementById('canvas');
physicalCanvas.style.height = canvasContainer.clientHeight + 'px';
const rootNode = document.createElementNS(SVG_NS, 'svg');
const guideNode = document.createElementNS(SVG_NS, 'svg');
rootNode.setAttribute('id', 'document');
guideNode.setAttribute('id', 'guide');
rootNode.setAttribute('viewBox', `0 0 ${width} ${height}`);
guideNode.setAttribute('viewBox', `0 0 ${width} ${height}`);
physicalCanvas.appendChild(rootNode);
physicalCanvas.appendChild(guideNode);

// services
const root = svg({width, height});
const canvas = canvasFactory({document: root, el: canvasContainer});
const canvasGuide = guideLayerFactory({el: guideNode, canvas, document: root});
const toolBoxService = toolBoxFactory({canvas, document: root, canvasGuide});

// components
const toolbar = toolBarComponent({el: document.getElementById('toolbar'), toolBox: toolBoxService})
    .render();
const svgLayer = renderingLayer({el: rootNode, document: root});
const treeView = TreeViewComponent({el: document.querySelector('#document-tree-view'), document: root})
    .render();


// trackerComponent({el: document.querySelector('#document-tree-view > ul'), canvas});

root.addLayer({id: 'render-layer'});

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

window.addEventListener('load', ev => {
    const body = document.getElementsByTagName('body')[0];
    body.style.setProperty('--vh', `${window.innerHeight / 100}px`);
    body.style.setProperty('--vw', `${window.innerWidth / 100}px`);

    const group = <ContainerNode>root.append(TagName.GROUP, {});
    group.appendChild(root.createNode(TagName.RECTANGLE, {x: 0, y: 0, width: 100, height: 100}));

    requestAnimationFrame(() => canvas.zoom(0.7));
});
