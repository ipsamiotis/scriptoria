import {SliceElement} from "@/scripts/data/SliceElement";

export class NoteElement extends SliceElement {
    oct;
    pname;
    accidental;

    pnames = ["c", "d", "e", "f", "g", "a", "b"]

    constructor(length, dots, oct, pname, accidental) {
        super('note', length, dots);
        this.oct = oct;
        this.pname = pname;
        this.accidental = accidental
    }

    octString() {
        return this.oct ? `oct='${this.oct}'` : '';
    }

    accidString() {
        return this.accidental ? `accid='${this.accidental}'` : '';
    }

    pnameString() {
        return this.pname ? `pname='${this.pname}'` : '';
    }

    pitchUp() {
        if (this.pname === "b") {
            this.oct++;
            this.pname = "c"
        } else {
            this.pname = this.pnames[this.pnames.indexOf(this.pname) + 1]
        }
    }

    pitchDown() {
        if (this.pname === "c") {
            this.oct--;
            this.pname = "b"
        } else {
            this.pname = this.pnames[this.pnames.indexOf(this.pname) - 1]
        }
    }

    octUp() {
        this.oct++;
    }

    octDown() {
        this.oct--;
    }

    toMei() {
        return `<note ${this.octString()} ${this.pnameString()} ${this.accidString()} dur='${this.length}' dots='${this.dots}'/>`;
    }

    static fromAttributes(attr) {
        return new NoteElement(attr.dur?.value, attr.dots?.value, attr.oct?.value ?? 4, attr.pname?.value ?? 'a', attr.accid?.value);
    }
}
