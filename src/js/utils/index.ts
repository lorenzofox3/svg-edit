export const fluent = fn => function (...args) {
    fn.call(this, ...args);
    return this;
};

export const abs = (val: number) => Math.abs(val);