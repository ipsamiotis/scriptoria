import verovio from 'verovio'
import {NoteElement} from "@/scripts/data/NoteElement";
import {ClefElement} from "@/scripts/data/ClefElement";
import {RestElement} from "@/scripts/data/RestElement";

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
        return new Promise(resolve => {
            verovio.module.onRuntimeInitialized = () => {
                this.vrvToolkit = new verovio.toolkit();
                this.vrvToolkit.setOptions(this.options)
                resolve();
            }
        })
    }

    static getSvgFromMei(mei) {
        this.vrvToolkit.loadData(mei);
        return this.vrvToolkit.renderToSVG(1, {});
    }

    static getXmlFromElements(xml, elements, removeChildren = false) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        const layer = xmlDoc.getElementsByTagName("layer");

        if (removeChildren) {
            layer[0].innerHTML = '';
        }
        for (let element of elements) {
            let element_xml = document.createRange().createContextualFragment(element.toMei());
            layer[0].appendChild(element_xml)
        }
        const serializer = new XMLSerializer();
        return serializer.serializeToString(xmlDoc);
    }

    static getElementsFromSectionXml(xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        const elementsXml = xmlDoc.getElementsByTagName("layer")[0].children;

        const elements = []
        for (const elemXml of elementsXml) {
            console.log(elemXml.tagName);

            if (elemXml.tagName.includes('note')) {
                elements.push(NoteElement.fromAttributes(elemXml.attributes))
            } else if (elemXml.tagName.includes('clef')) {
                elements.push(ClefElement.fromAttributes(elemXml.attributes))
            } else if (elemXml.tagName.includes('rest')) {
                elements.push(RestElement.fromAttributes(elemXml.attributes))
            }
        }
        return elements;
    }
}