import { 
  Component,
  ChangeDetectorRef, 
  OnDestroy,
  AfterViewInit, 
  OnInit
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { PrismController } from "src/prism_core/controller/prism.controller";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MaterialModule } from "src/app/material.module";
import { Logo } from 'src/app/shared/component-items/models/app-model';

@Component({
  selector: 'app-mainlayout',
  imports: [
    NgFor,
    NgIf,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MaterialModule
  ],
  templateUrl: './mainlayout.component.html',
  styleUrl: './mainlayout.component.scss'
})
export class MainlayoutComponent extends PrismController<any> implements OnInit, OnDestroy, AfterViewInit {
  logo: Logo[] = [];
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  )
  {
    super();
    this.mobileQuery = media.matchMedia('(min-width: 1920px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  async ngOnInit() {}
  async ngAfterContentInit() {
    var logos = [];//check how to get logo array
    if (logos && (logos ?? false) && logos.length > 0) {
      var counter = 0;
      // logos = logos.sort((a,b) => a.guid.charCodeAt(0) - b.guid.charCodeAt(0)); // b - a for reverse sort
      logos.sort(this.sorter('guid'));
      logos.forEach(async x => {
        var log: Logo;
        var logo = this.logo;
        const url = `assets/images/logos/${x.guid}.png`;
        const file = await this.getFileFromUrl(url,`${x.guid}.png`)
        // console.log('file size: ', file.size);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          log = {
            count: counter,
            // guid: x.guid
            // guid: 'data:image/png;base64,' + btoa(reader.result.toString())
            guid: reader.result.toString()
          }
          counter++;
          logo.push(log);
          // console.log('base64 ',log.guid);
        };
        reader.onerror = function (error) {
            console.log('Error converting image to base64 string : ', error);
        };

        this.logo = logo;

      });
    }
  }
  async ngAfterViewInit() {}
  async ngAfterViewChecked() {}

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
