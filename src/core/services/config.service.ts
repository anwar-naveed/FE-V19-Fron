import { Injectable } from '@angular/core';
import { HttpHelper } from "../helper/http.helper";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;
  constructor(private httpHelper: HttpHelper) { }

  loadConfig(): Promise<void>{
    return this.httpHelper.Get<any>('assets/config/app-settings.json')
    .then(config => {
      this.config = config;
    })
    .catch(err => {
      console.error('Failed to load config', err);
      return Promise.reject(err);
    });
  }

  getConfig() {
    return this.config;
  }

  getSetting(key: string): any {
    return this.config?.[key];
  }
}
