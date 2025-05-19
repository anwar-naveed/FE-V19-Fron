import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from "@angular/router";
import { SpinnerService } from 'src/app/shared/services/common/spinner.service';
import { Observable } from 'rxjs';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { GlobalConfig } from "src/core/helper/global.config";
import { AppInjector } from "src/core/services/app.injector.service";
import { ConfigService } from 'src/core/services/config.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    // CommonModule, 
    SpinnerComponent,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // title = 'FE-V19-Fron';
  // loadingSpinner$: Observable<boolean>;
  // navigationSpinner: boolean = false;
  // errorObserv$: Observable<any> = this.spinnerService.errObsv$;
  constructor(
    private router: Router,
    injector: Injector,
    private spinner: SpinnerService,
    private configService: ConfigService
    ){ 
      this.spinner.show();
      AppInjector.setInjector(injector);
      GlobalConfig.injector = AppInjector.getInjector();
      // this.loadingSpinner$ = this.spinnerService.spinnerObsv$;
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.spinner.toggleLoadingSpinner(true);
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.spinner.toggleLoadingSpinner(false);
        }
      });
    }
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  async ngOnInit() {
    // this.navigationSpinner = true;
    document.body.classList.add(this.configService.getSetting("Data").themeColor);
    // this.router.events.subscribe(
    //   (event) => {
      
    //   if (event instanceof NavigationStart) {
    //   this.navigationSpinner = true;
    //   } 
    //   else if (
    //   event instanceof NavigationEnd || event instanceof NavigationError ||
    //   event instanceof NavigationCancel) {
      
    //   this.navigationSpinner = false;
    //   }
    //   },
    //   (err) => {
    //   this.navigationSpinner = false;
    //   }
    //   );
  }

}
