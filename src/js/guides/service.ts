import {GuidePool, Releasable} from './pool';
import {rectanglePoolFactory, DomRectangle} from './rectangle';
import {DomEllipse, ellipsePoolFactory} from './ellipse';
import {events} from '../canvas';
import {DOMPoint, pointPoolFactory} from './point';
import {DOMLine, linePoolFactory} from './line';

export type RectangleGuide = Releasable & DomRectangle;
export type EllipseGuide = Releasable & DomEllipse;
export type PointGuide = Releasable & DOMPoint;
export type LineGuide = Releasable & DOMLine;

export interface GuideProvider {
    getRectangleGuide(topLeftX: number, topLeftY: number): RectangleGuide;

    getEllipseGuide(centerX: number, centerY: number): EllipseGuide;

    getPointGuide(centerX: number, centerY: number): PointGuide;

    getLineGuide(x1: number, y1: number): LineGuide;
}

export type CompositeGuide = GuideProvider & Releasable;

export interface GuideLayer extends GuideProvider {
    getCompositeGuide(): CompositeGuide
}

export const guideLayer = ({el, canvas, document: root}): GuideLayer => {
    const rectanglePool: GuidePool<RectangleGuide> = rectanglePoolFactory(el);
    const ellipsePool: GuidePool<EllipseGuide> = ellipsePoolFactory(el);
    const pointPool: GuidePool<PointGuide> = pointPoolFactory(el);
    const linePool: GuidePool<LineGuide> = linePoolFactory(el);

    canvas.on(events.VIEW_BOX_CHANGE, viewBox => {
        requestAnimationFrame(() => {
            el.style.setProperty('width', root.width * canvas.pixelByUnit + 'px');
            el.style.setProperty('height', root.height * canvas.pixelByUnit + 'px');
            el.style.setProperty('transform', `translateX(${-1 * viewBox.xmin * canvas.pixelByUnit}px) translateY(${ -1 * viewBox.ymin * canvas.pixelByUnit}px)`);
        });
    });

    const guideProvider = {
        getRectangleGuide(topLeftX: number, topLeftY: number) {
            const guide = rectanglePool.getShape();
            guide.x(topLeftX);
            guide.y(topLeftY);
            guide.width(1);
            guide.height(1);
            return guide;
        },

        getEllipseGuide(x: number, y: number) {
            const guide = ellipsePool.getShape();
            guide.center({x, y});
            guide.rx(0);
            guide.ry(0);
            return guide;
        },

        getPointGuide(centerX: number, centerY: number) {
            const guide = pointPool.getShape();
            guide.x(centerX);
            guide.y(centerY);
            return guide;
        },

        getLineGuide(x1: number, y1: number) {
            const guide = linePool.getShape();
            guide.p1(x1, y1);
            guide.p2(x1, y1);
            return guide;
        }
    };

    const getCompositeGuide = (): CompositeGuide => {
        const guides = [];
        const instance: CompositeGuide = {
            ...guideProvider, release() {
                for (const g of guides) {
                    g.release();
                }
            }
        };

        for (const [methodName, fn] of Object.entries(instance)) {
            instance[methodName] = (...args) => {
                const guide = fn(...args);
                guides.push(guide);
                return guide;
            };
        }

        return instance;
    };

    return {getCompositeGuide, ...guideProvider};
};
