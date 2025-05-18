import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from "./error/error.component";
import { ImageViewerComponent } from "./image-viewer/image-viewer.component";
import { GlobalErrorHandler } from "src/core/helper/error.handler";
import { MaterialModule } from "../material.module";


@NgModule({
  declarations: [
    ErrorComponent,
    ImageViewerComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    // ErrorComponent
    // AccordionAnchorDirective,
    // AccordionLinkDirective,
    // AccordionDirective,
    // SpinnerComponent
   ],
   providers: [ 
    // MenuItems,
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
   ]
})
export class SharedModule { }
