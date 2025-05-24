import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(@Inject(DOCUMENT) private _doc: Document) {}

  getWindow(): Window | null {
    return this._doc.defaultView!;
  }

  getLocation(): Location {
    return this._doc.location!;
  }

  createElement(tag: string): HTMLElement {
    return this._doc.createElement(tag);
  }

  getDocument(): Document {
    return this._doc;
  }

  addDocumentBodyClass(className: string) {
    this._doc.body.classList.add(className);
  }

  updateDocumentBodyClassByRemovingAll(className: string){
    this._doc.body.classList.value = "";
    this.addDocumentBodyClass(className);
  }
}
