import {GuidePool, Releasable} from './pool';
import {rectanglePoolFactory, DomRectangle} from './rectangle';
import {DomEllipse, ellipsePoolFactory} from './ellipse';

export type RectangleGuide = Releasable & DomRectangle;
export type EllipseGuide = Releasable & DomEllipse;

export interface GuideLayer {
    getRectangleGuide(topLeftX: number, topLeftY: number): RectangleGuide;

    getEllipseGuide(centerX: number, centerY: number): EllipseGuide;
}

export const guideLayer = ({el}): GuideLayer => {
    const layer = el.querySelector('#guide-layer');
    const rectanglePool: GuidePool<RectangleGuide> = rectanglePoolFactory(layer);
    const ellipsePool: GuidePool<EllipseGuide> = ellipsePoolFactory(layer);

    return {
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
        }
    };
};
