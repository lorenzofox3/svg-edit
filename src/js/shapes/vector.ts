export interface Coords {
    x: number;
    y: number
}

export interface Vector extends Coords {
    clone(): Vector;

    add(...vectors: Vector[]): Vector;

    substract(vect: Vector): Vector;

    multiply(lambda: number): Vector;

    norm(): number;

    distance(vect: Vector): number;
}

const proto = {
    clone() {
        return vector(this.x, this.y);
    },
    add(...vectors: Coords[]) {
        return vector(vectors.reduce((acc, curr) => {
            acc.x += curr.x;
            acc.y += curr.y;
            return acc;
        }, {
            x: this.x,
            y: this.y
        }));
    },
    substract(vect: Vector) {
        return this.add(vect.multiply(-1));
    },
    multiply(lambda: number) {
        return vector(this.x * lambda, this.y * lambda);
    },
    norm() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    },
    distance(vect: Vector) {
        return vect.add(this.multiply(-1)).norm();
    }
};

type CoordsOrArray = Coords | [number, number] | number;

export function vector(x: CoordsOrArray, y?: number): Vector;

export function vector(x, y) {
    let xCoord = x;
    let yCoord = y;

    if (y === undefined) {
        Array.isArray(x) ? [xCoord, yCoord] = x : {x: xCoord, y: yCoord} = x;
    }

    return Object.create(proto, {x: {value: xCoord}, y: {value: yCoord}});
}