export interface ViewPort {
    width: number;
    height: number;
}

export interface Svg {
    width(width: number): Svg;

    width(): number;

    height(height: number): Svg;

    height(): number;

    viewPort(canvas: ViewPort): Svg;

    viewPort(): ViewPort;
}

export const svg = ({width = 100, height = 100} = {width: 100, height: 100}): Svg => {
    const viewPort: ViewPort = {width, height};
    return {
        width(width ?: number) {
            if (width !== void 0) {
                viewPort.width = width;
                return this;
            }
            return viewPort.width;
        },
        height(height ?: number) {
            if (height !== void 0) {
                viewPort.height = height;
                return this;
            }

            return viewPort.height;
        },
        viewPort(viewPortInput ?: ViewPort) {
            if (viewPortInput) {
                Object.assign(viewPort, viewPortInput);
                return this;
            }

            return Object.assign({}, viewPort);
        }
    };
};