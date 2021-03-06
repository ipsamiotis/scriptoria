import verovio from 'verovio'

/**
 * Simple class to help us reuse toolkit instances.
 */
export class VerovioHelper {
    static options = {
        pageHeight: 1100,
        pageWidth: 400,
        adjustPageHeight: true
    }
    static vrvToolkit;

    static init() {
        verovio.module.onRuntimeInitialized = () => {
            this.vrvToolkit = new verovio.toolkit();
            this.vrvToolkit.setOptions(this.options)
        }
    }

    static getSvgFromMei(mei) {
        this.vrvToolkit.loadData(mei);
        return this.vrvToolkit.renderToSVG(1, {});
    }

    static getXmlFromElements(xml, elements) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        const layer = xmlDoc.getElementsByTagName("layer");

        for (let element of elements) {
            let element_xml = document.createRange().createContextualFragment(element.toMei());
            layer[0].appendChild(element_xml)
        }
        const serializer = new XMLSerializer();
        return serializer.serializeToString(xmlDoc);
    }
}