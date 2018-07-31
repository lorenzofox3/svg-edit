export interface SVGContainer {
    appendChild(child: SVGContainer): SVGContainer
}

export const element = {
    appendChild(element: any) {
        this.children.push(element);
        return element;
    }
};

