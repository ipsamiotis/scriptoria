import {SliceElement} from "@/scripts/data/SliceElement";
import { NoteElement } from "./NoteElement";

export class BeamElement extends SliceElement {
    notes;


    constructor(notes) {
        super('beam', undefined, undefined);
        this.notes = notes;
    }

    toMei() {
        var beamString = "<beam>";
        for (const note of this.notes) {
            beamString += note.toMei();
        }
        return beamString + "</beam>";
    }

    static fromChildren(children) {
        var nt = []
        if (children) {
            nt = [...children].map(noteXml => NoteElement.fromAttributes(noteXml.attributes));
        }
        return new BeamElement(nt);
    }
}
