import {SliceElement} from "@/scripts/data/SliceElement";

export class NoteElement extends SliceElement {
    constructor(length, dots) {
        super('note', length, dots);
    }

    toMei() {
        return `<note dur='${this.length}' dots='${this.dots ? 1 : 0}'>`;
    }
}
