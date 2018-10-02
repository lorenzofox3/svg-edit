export interface Coords {
    x: number;
    y: number
}

export const trunc = (number: number) => Math.trunc(number * 10) / 10;

export interface Vector extends Coords {
    clone(): Vector;

    add(...vectors: Vector[]): Vector;

    substract(vect: Vector): Vector;

    multiply(lambda: number): Vector;

    norm(): number;

    dot(vector: Vector): number;

    distance(vect: Vector): number;

    determinant(vect: Vector): number;
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

    dot(vector: Vector) {
        return this.x * vector.x + this.y * vector.y;
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
    },
    determinant(vect: Vector) {
        return this.x * vect.y - this.y * vect.x;
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

    return Object.create(proto, {x: {value: trunc(xCoord)}, y: {value: trunc(yCoord)}});
}