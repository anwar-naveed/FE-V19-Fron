import { BaseController } from "src/core/controller/base.controller";
import { Injector, PLATFORM_ID, inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { Title, Meta } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";
// import { GlobalConfig } from "src/core/helper/global.config";
// import { AppInjector } from "src/app/shared/services/common/app.injector.service";
import { HttpHelper } from "src/core/helper/http.helper";
import { LocalStorage } from "src/core/helper/local.storage";
import { config, delay, filter } from "rxjs";
import { GeneralService} from "src/app/shared/services/common/general.service";
import { ErrorComponent, DialogData } from "src/app/shared/components/error/error.component";
import { ImageViewerComponent } from "src/app/shared/components/image-viewer/image-viewer.component";
import { ViewportScroller, isPlatformBrowser } from "@angular/common";
import { NavigationEnd, Scroll } from "@angular/router";
// import { CustomerInfoViewComponent } from "src/app/components/customer-info-view/customer-info-view.component";

export abstract class PrismController<T> extends BaseController<T> {
    // protected dialog: MatDialog;
    // public snackBar: MatSnackBar;
    // public httpHelper: HttpHelper;
    static config: any = null;
    // private titleBr: Title;
    // private meta: Meta;
    // protected _GeneralService: GeneralService;
    protected _GeneralService = inject(GeneralService);
    protected dialog = inject(MatDialog);
    public snackBar = inject(MatSnackBar);
    public httpHelper = inject(HttpHelper);
    public localStorage = inject(LocalStorage);
    private titleBr = inject(Title);
    private meta = inject(Meta);
    private viewportScroller = inject(ViewportScroller);
    public platformId = inject(PLATFORM_ID);
    // constructor(protected dialog: MatDialog,
    //     public snackBar: MatSnackBar) {
    constructor(
        // private title: Title,
        // private meta: Meta,
        // private inject: Injector
    ) {
        super();
        // this.dialog = GlobalConfig.injector.get(MatDialog);
        // this.snackBar = GlobalConfig.injector.get(MatSnackBar);
        // this.httpHelper = GlobalConfig.injector.get(HttpHelper);
        // this.titleBr = GlobalConfig.injector.get(Title);
        // this.meta = GlobalConfig.injector.get(Meta);

        // this.dialog = AppInjector.getInjector().get(MatDialog);
        // this.snackBar = AppInjector.getInjector().get(MatSnackBar);
        // this.httpHelper = AppInjector.getInjector().get(HttpHelper);
        // this.titleBr = AppInjector.getInjector().get(Title);
        // this.meta = AppInjector.getInjector().get(Meta);

        // this.dialog = inject(MatDialog);
        // this.snackBar = inject(MatSnackBar);
        // this.httpHelper = inject(HttpHelper);
        // this.titleBr = inject(Title);
        // this.meta = inject(Meta);


        // this.GetConfigurations();
    }


    get Role(){
        const user = JSON.parse(localStorage.getItem('user')!);
        if (user && user.role) {
            return user.role.roleType
        }
        else {
            return 0;
        }
    }

    get UserLogin(){
        const user = JSON.parse(localStorage.getItem('user')!);
        if (user) {
            return user
        }
        return {}
    }

    get FSKey(){
        return PrismController.config
        ? PrismController.config.FSTokens
        ? PrismController.config.FSTokens
        : {}
        : {};
    }

    public ShowError(messages: string | any[]) {
        let msgs = "";
        if (typeof messages != "string" && !Array.isArray(messages)) {
            msgs = "Validation Error Ocurred.";
        } else {
            msgs = this.MessagesInString(messages);
        }

        this.OpenSnakBar(msgs, "Ok", 4500, ["danger"]);
    }

    protected ShowErrorInDialog(Data: DialogData) : MatDialogRef<ErrorComponent, any> {
        return this.dialog.open(ErrorComponent, {
            data: Data
        });
    }

    protected ShowSuccess(messages: string) {
        this.OpenSnakBar(messages, "Ok", 3500, ["success"]);
    }

    protected ShowSuccessDialog(Data: DialogData) : MatDialogRef<ErrorComponent, any> {
        return this.dialog.open(ErrorComponent, {
            data: Data
        });
    }

    protected ShowInfo(messages: string) {
        this.OpenSnakBar(messages, "Ok", 3500, ["info"]);
    }

    protected ShowInfoDialog() {}

    private OpenSnakBar(
        message: string,
        action?: string,
        duration?: number,
        panelClass?: string[]
    ) {
        return this.snackBar.open(message, action, {
            duration,
            panelClass
        });
    }

    private MessagesInString(messages: string | any[]) {
        if (!messages) {
            return;
        }
        let msg: any;
        if (typeof messages === "string") {
            msg = messages;
        } else {
            msg = "";
            messages.forEach((error) => {
                msg += error;
                msg += ", ";
            })
        }
        return msg;
    }

    public downloadFile(data: any, type: string) {
        let blob = new Blob([data], { type: type});
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    }

    // downloadFS from generalservice

    openImageNewtab(url : any) {
        const img = '<img src="' + url + '">';
        window.open()?.document.write(img);
    }

    protected ImageViewer(Data, pclass?, height?, width?, positionLeft?: boolean, positionRight?: boolean): MatDialogRef<ImageViewerComponent, any> {
        if (positionLeft) {
            return this.dialog.open(ImageViewerComponent, {
                // disableClose: true,
                // direction: left
                panelClass: pclass,
                position: {left:'0px'},
                maxHeight: height,
                maxWidth: width,
                data: Data
            });
        }
        else if (positionRight) {
            return this.dialog.open(ImageViewerComponent, {
                // disableClose: true,
                // direction: left
                panelClass: pclass,
                position: {right:'0px'} ,
                maxHeight: height,
                maxWidth: width,
                data: Data
            });
        } else {
            return this.dialog.open(ImageViewerComponent, {
                // disableClose: true,
                maxHeight: height,
                maxWidth: width,
                data: Data
            });
        }


    }
    // download method

    public async GetConfigurations() {
        if (!PrismController.config) {
            const config: any = await this.httpHelper.Get(
                "./assets/configurations/config.json?t=" + new Date().getTime());
            if (config.IsSuccessful) {
                PrismController.config = config.Data;
            }
        }
    }

    scrollToTop($element: any) {
        $element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        })
    }

    async updateTitleAndMeta(title, tag){
        // SEO metadata
        this.titleBr.setTitle(title);
        this.meta.updateTag(tag);
        //Add loop for twitter
        // Twitter metadata
          // this.meta.addTag({name: 'twitter:card', content: 'summary'});
          // this.meta.addTag({name: 'twitter:site', content: '@AngularUniv'});
          // this.meta.addTag({name: 'twitter:title', content: this.course.description});
          // this.meta.addTag({name: 'twitter:description', content: this.course.description});
          // this.meta.addTag({name: 'twitter:text:description', content: this.course.description});
          // this.meta.addTag({name: 'twitter:image', content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200'});
    }

    async updateMeta(tag){
      // SEO metadata
      this.meta.updateTag(tag);
      //Add loop for twitter
      // Twitter metadata
        // this.meta.addTag({name: 'twitter:card', content: 'summary'});
        // this.meta.addTag({name: 'twitter:site', content: '@AngularUniv'});
        // this.meta.addTag({name: 'twitter:title', content: this.course.description});
        // this.meta.addTag({name: 'twitter:description', content: this.course.description});
        // this.meta.addTag({name: 'twitter:text:description', content: this.course.description});
        // this.meta.addTag({name: 'twitter:image', content: 'https://avatars3.githubusercontent.com/u/16628445?v=3&s=200'});
  }

    copyObject = (obj) => {
      let result = [];
      Object.entries(obj).forEach(([key, value]) => {
        result[key] = value;
      });
      return result;
    };

    async scrollToTopPosition(){
      if (isPlatformBrowser(this.platformId)) {
          // this.router.events.pipe(filter((event): event is Scroll => event instanceof Scroll)
          // )
          // // .pipe(delay(1))
          // .subscribe(e => {
          //   if (e.position) {
          //     // backward navigation
          //     console.log('scrolling to back position');
          //     setTimeout(() => { this.viewportScroller.scrollToPosition(e.position); }, 300);
          //   }
          //   else if (e.anchor) {
          //     // anchor navigation
          //     console.log('scrolling to anchor');
          //     setTimeout(() => { this.viewportScroller.scrollToAnchor(e.anchor); }, 300);
          //   }
          //   else {
          //     // forward navigation
          //     // this.viewportScroller.scrollToPosition([0, 0]);
          //     console.log('scrolling to top at 0 0');
          //     setTimeout(() => { this.viewportScroller.scrollToPosition([0, 0]); }, 300);
          //   }
          // })

          // this.router.events.pipe(
          //   filter((e: RouterEvent | Scroll): e is Scroll => e instanceof Scroll)
          // ).subscribe(e => {
          //   if (e.position) {
          //     setTimeout(() => { this.viewportScroller.scrollToPosition(e.position); }, 0);
          //   }
          //   else if (e.anchor) {
          //     setTimeout(() => { this.viewportScroller.scrollToAnchor(e.anchor); }, 0);
          //   }
          //   else {
          //     setTimeout(() => { this.viewportScroller.scrollToPosition([0, 0]); }, 0);
          //   }
          // });
        // console.log('scrolling to top');
        // this.router.events
        // .pipe(filter((routerEvent) => routerEvent instanceof NavigationEnd))
        // .subscribe(() => window.scrollTo(0, 0));
        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          const contentContainer = document.querySelector('.mat-sidenav-content');
          if (contentContainer) {
            document.querySelector('.mat-sidenav-content').scroll({ top: 0, left: 0, behavior: 'smooth' });
          } else {
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
          }
        });
      }
    }

    async getFileFromUrl(url, name, defaultType = 'image/jpeg'){
      const response = await fetch(url);
      const data = await response.blob();
      return new File([data], name, {
        type: data.type || defaultType,
      });
    }

    sorter = (sortBy) => (a, b) => a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1;

    async getLastUrl(){
        return this.localStorage.Get('lastUrl');
    }
}
