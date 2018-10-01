import {ElementWrapper, poolProvider} from './pool';
import {SVG_NS} from '../mini-f';
import {fluent} from '../utils';
import {Coords} from '../geometry';

export interface Line {
    p1(x: Coords): Line;

    p1(x1: number, y1: number): Line;

    p2(y: Coords): Line;

    p2(x2: number, y2: number);
}

const prototype = {
    p1: fluent(function (x1: number | Coords, y1?: number) {
        let point: Coords = y1 !== undefined ? {x: Number(x1), y: Number(y1)} : <Coords>x1;
        this.el.setAttribute('x1', String(point.x));
        this.el.setAttribute('y1', String(point.y));
    }),
    p2: fluent(function (x2: number | Coords, y2?: number) {
        let point: Coords = y2 !== undefined ? {x: Number(x2), y: Number(y2)} : <Coords>x2;
        this.el.setAttribute('x2', String(point.x));
        this.el.setAttribute('y2', String(point.y));
    }),
};

export type DOMLine = Line & ElementWrapper;

const line = (): DOMLine => {
    const el = document.createElementNS(SVG_NS, 'line');
    el.setAttribute('vector-effect', 'non-scaling-stroke');
    el.setAttribute('stroke-width', '1px');
    el.setAttribute('stroke', 'blue');

    return Object.create(prototype, {
        el: {value: el}
    });
};

export const linePoolFactory = poolProvider(line);