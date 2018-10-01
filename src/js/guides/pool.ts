export interface ElementWrapper {
    readonly el: any
}

export interface Releasable {
    release(): void;
}

export interface GuidePool<T extends ElementWrapper> {
    getShape(): Releasable & T
}


interface PoolOption {
    size: number
}

interface GuideFactory<T extends ElementWrapper> {
    (opts?: any): T;
}

export const poolProvider = <T extends ElementWrapper>(factory: GuideFactory<T>) => (el, options: PoolOption = {size: 10}): GuidePool<T> => {
    const available: (Releasable & T)[] = [];
    const inUse: (Releasable & T)[] = [];
    const {size = 10} = options;

    const releasable = (guide: T): Releasable & T => {

        return Object.assign(guide, {
            release() {
                // 1. remove dom node
                guide.el.remove();

                // 2. Remove from in use
                inUse.splice(inUse.indexOf(this), 1);

                // 3. Put back in the pool
                if (available.length + inUse.length <= size) {
                    available.push(this);
                }
            }
        })
    };

    return {
        getShape() {

            if (available.length + inUse.length > size) {
                console.warn('object count is higher than pool size');
            }

            if (available.length === 0) {
                available.push(releasable(factory()));
                return this.getShape();
            }

            const guide = available.pop();

            el.appendChild(guide.el);

            inUse.push(guide);
            return guide;
        }
    }
};