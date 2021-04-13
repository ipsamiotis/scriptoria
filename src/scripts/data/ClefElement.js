import {SliceElement} from "@/scripts/data/SliceElement";

export class ClefElement extends SliceElement {
    line;
    shape


    constructor(line, shape) {
        super('clef', undefined, undefined);
        this.line = line;
        this.shape = shape;
    }

    toMei() {
        return `<clef shape='${this.shape}' line='${this.line}'/>`;
    }

    static fromAttributes(attr) {
        return new ClefElement(attr.line?.value ?? 2, attr.shape?.value ?? 'G');
    }
}
