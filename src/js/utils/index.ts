export const fluent = fn => function (...args) {
    fn.call(this, ...args);
    return this;
};