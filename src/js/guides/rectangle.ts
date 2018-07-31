import {ElementWrapper, poolProvider} from './pool';
import {SVG_NS} from '../svg';

export interface Rectangle {
    width(width: number): Rectangle;

    x(x: number): Rectangle;

    y(x: number): Rectangle;

    height(height: number): Rectangle;
}

const prototype = {
    width(width: number) {
        this.el.setAttribute('width', String(width));
        return this;
    },
    height(height: number) {
        this.el.setAttribute('height', String(height));
        return this;
    },
    x(width: number) {
        this.el.setAttribute('x', String(width));
        return this;
    },
    y(width: number) {
        this.el.setAttribute('y', String(width));
        return this;
    }
};

export type DomRectangle = Rectangle & ElementWrapper

const rectangle = (): DomRectangle => {
    const el = document.createElementNS(SVG_NS, 'rect');
    el.setAttribute('vector-effect', 'non-scaling-stroke');
    el.setAttribute('stroke-width', '1px');
    el.setAttribute('stroke', 'blue');

    return Object.create(prototype, {
        el: {value: el}
    });
};

export const rectanglePoolFactory = poolProvider(rectangle);