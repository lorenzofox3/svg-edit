import {GuidePool, Releasable} from './pool';
import {rectanglePoolFactory, DomRectangle} from './rectangle';
import {DomEllipse, ellipsePoolFactory} from './ellipse';
import {events} from '../canvas';

export type RectangleGuide = Releasable & DomRectangle;
export type EllipseGuide = Releasable & DomEllipse;

export interface GuideLayer {
    getRectangleGuide(topLeftX: number, topLeftY: number): RectangleGuide;

    getEllipseGuide(centerX: number, centerY: number): EllipseGuide;
}

export const guideLayer = ({el, canvas, document: root}): GuideLayer => {
    const rectanglePool: GuidePool<RectangleGuide> = rectanglePoolFactory(el);
    const ellipsePool: GuidePool<EllipseGuide> = ellipsePoolFactory(el);

    canvas.on(events.VIEW_BOX_CHANGE, viewBox => {
        requestAnimationFrame(() => {
            el.style.setProperty('width', root.width * canvas.pixelByUnit + 'px');
            el.style.setProperty('height', root.height * canvas.pixelByUnit + 'px');
            el.style.setProperty('transform', `translateX(${-1 * viewBox.xmin * canvas.pixelByUnit}px) translateY(${ -1 * viewBox.ymin * canvas.pixelByUnit}px)`);
        });
    });

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
