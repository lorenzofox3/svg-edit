import {ElementWrapper, poolProvider} from './pool';
import {SVG_NS} from '../mini-f';
import {Coords} from '../geometry';
import {fluent} from '../utils';

export interface Ellipse {
    center(point: Coords): Ellipse;

    rx(length: number): Ellipse;

    ry(length: number): Ellipse;
}

const prototype = {
    center: fluent(function (point: Coords) {
        this.el.setAttribute('cx', String(point.x));
        this.el.setAttribute('cy', String(point.y));
    }),
    rx: fluent(function (length: number) {
        this.el.setAttribute('rx', String(length));
    }),
    ry: fluent(function (length: number) {
        this.el.setAttribute('ry', String(length));
    })
};

export type DomEllipse = Ellipse & ElementWrapper;

const ellipse = (): DomEllipse => {
    const el = document.createElementNS(SVG_NS, 'ellipse');
    el.setAttribute('vector-effect', 'non-scaling-stroke');
    el.setAttribute('stroke-width', '1px');
    el.setAttribute('stroke', 'blue');
    el.setAttribute('fill', 'none');

    return Object.create(prototype, {
        el: {value: el}
    });
};

export const ellipsePoolFactory = poolProvider(ellipse);
