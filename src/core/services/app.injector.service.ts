import { Injectable, Injector } from '@angular/core';

@Injectable()

export class AppInjector {

  private static injector: Injector;

  static setInjector(injector: Injector) {

    AppInjector.injector = injector;

  }

  static getInjector(): Injector {

    return AppInjector.injector;

  }

}     