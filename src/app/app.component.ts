import { Component, Injector } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from "@angular/router";
import { SpinnerService } from 'src/app/shared/services/common/spinner.service';
import { Observable } from 'rxjs';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { GlobalConfig } from "src/core/helper/global.config";
import { AppInjector } from "src/core/services/app.injector.service";
import { ConfigService } from 'src/core/services/config.service';
import { PrismController } from 'src/prism_core/controller/prism.controller';
import { ThemeService } from './shared/services/common/theme.service';
import { MaterialModule } from './material.module';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    SpinnerComponent,
    MaterialModule
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent extends PrismController<any> {
  constructor(
    injector: Injector,
    private spinner: SpinnerService,
    private configService: ConfigService,
    private themeService: ThemeService
    ){ 
      super()
      this.spinner.show();
      AppInjector.setInjector(injector);
      GlobalConfig.injector = AppInjector.getInjector();
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
    this.themeService.addThemeViaDocumentService(await this.themeService.getdefaultTheme());
    this.updateTitle(this.configService.getSetting("Data").organizationName);
  }

}
