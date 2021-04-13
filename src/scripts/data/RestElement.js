import {SliceElement} from "@/scripts/data/SliceElement";

export class RestElement extends SliceElement {
    constructor(length, dots) {
        super('rest', length, dots);
    }

    toMei() {
        return `<rest dur='${this.length}' dots='${this.dots}'/>`;
    }

    static fromAttributes(attr) {
        return new RestElement(attr.dur?.value, attr.dots?.value);
    }
}