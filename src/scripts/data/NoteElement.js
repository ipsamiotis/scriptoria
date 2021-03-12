import {SliceElement} from "@/scripts/data/SliceElement";

export class NoteElement extends SliceElement {
    oct;
    pname;
    accidental;

    pnames = ["a", "b", "c", "d", "e", "f", "g"]

    constructor(length, dots, oct, pname, accidental) {
        super('note', length, dots);
        this.oct = oct;
        this.pname = pname;
        this.accidental = accidental
    }

    octString() {
        return this.oct ? 'oct=' + this.oct : '';
    }

    accidString() {
        return this.accidental ? 'accid=' + this.accidental : '';
    }

    pnameString() {
        return this.pname ? 'pname=' + this.pname : '';
    }

    pitchUp() {
        if (this.pname === "g") {
            this.oct++;
            this.pname = "a"
        } else {
            this.pname = this.pnames[this.pnames.indexOf(this.pname) + 1]
        }
    }

    pitchDown() {
        if (this.pname === "a") {
            this.oct--;
            this.pname = "g"
        } else {
            this.pname = this.pnames[this.pnames.indexOf(this.pname) - 1]
        }
    }

    toMei() {
        return `<note ${this.octString()} ${this.pnameString()} ${this.accidString()} dur='${this.length}' dots='${this.dots ? 1 : 0}'>`;
    }

    static fromAttributes(attr) {
        return new NoteElement(attr.dur?.value, attr.dot?.value ? 1 : 0, attr.oct?.value, attr.pname?.value, attr.accid?.value);
    }
}
