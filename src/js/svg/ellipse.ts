export interface EllipseDefinition {
    rx: number;
    ry: number;
    cx: number;
    cy: number
}

export const ellipse = (input: EllipseDefinition) => {
    const instance = {};
    Object.defineProperties(instance, {attributes: {value: input}, tag: {value: 'ellipse'}});
    return instance;
};
