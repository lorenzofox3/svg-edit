import {SVGContainer} from './element';
import {group} from './group';

export interface ViewPort {
    width: number;
    height: number;
}

export interface SVGRoot {
    width(width: number): SVGRoot;

    width(): number;

    height(height: number): SVGRoot;

    height(): number;

    viewPort(canvas: ViewPort): SVGRoot;

    viewPort(): ViewPort;
}

const rootProto = {
    width(width ?: number) {
        if (width !== void 0) {
            this.viewPort.width = width;
            return this;
        }
        return this.viewPort.width;
    },
    height(height ?: number) {
        if (height !== void 0) {
            this.viewPort.height = height;
            return this;
        }

        return this.viewPort.height;
    },
    viewPort(viewPortInput ?: ViewPort) {
        if (viewPortInput) {
            Object.assign(this.viewPort, viewPortInput);
            return this;
        }

        return Object.assign({}, this.viewPort);
    }
};

// todo proxy on current layer
export const root = ({width = 100, height = 100} = {width: 100, height: 100}): SVGContainer & SVGRoot => {

    const rootDocument = Object.create(rootProto, {
        children: {value: []}, viewPort: {
            value: {
                width, height
            }
        }
    });
    const mainLayer = group();

    rootDocument.children.push(mainLayer);
    return Object.assign(rootDocument, {
        appendChild(element: any) {
            mainLayer.appendChild(element);
        }
    });
};