export class MeiBuilder {
    static createNote(length, dots) {
        return `<note dur='${length}' dots='${dots ? 1 : 0}'>`;
    }

    static createRest(length, dots) {
        return `<rest dur='${length}' dots='${dots ? 1 : 0}'>`;
    }
}