import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localePK from '@angular/common/locales/en-PK';
import { firstValueFrom } from 'rxjs';

registerLocaleData(localeEn);
registerLocaleData(localeFr);
registerLocaleData(localeDe);
registerLocaleData(localePK);

@Injectable({
  providedIn: 'root'
})
export class LocaleService extends BaseService<any> {
  private _locale: string = 'en-US'; //default
  private _currencyCode: string = 'USD'; //default

  constructor() {
    super("");
    const stored = this.localStorage.Get('localeSettings');
    if (stored) {
      const data = JSON.parse(stored);
      this._currencyCode = data.currencyCode;
      this._locale = data.locale;
    }
  }

  get locale(): string {
    return this._locale;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  async init(): Promise<void> {

    const headerDict = {
      'Access-Control-Allow-Origin': '*'
    }

    const cached = this.localStorage.Get('localeSettings');
    if (cached) return; // Already initialized

    try {
      const response = await this.httpHelper.Get('https://ipinfo.io/json', headerDict);
      if (response?.IsSuccessful) {
        const country = response.Data.country;
        const language = response.Data.languages?.split(',')[0] || 'en';
        this._locale = `${language}-${country}`;
        this._currencyCode = this.getCurrencyByCountry(country);
      }
      else {
        this.setDefaultsFromBrowser();
      }

      this.localStorage.Set('localeSettings', JSON.stringify({
        currencyCode: this.currencyCode,
        locale: this.locale
      }));

    } catch {
      // Fallback
      this.setDefaultsFromBrowser();
      // Still store defaults to prevent retry on next load
      this.localStorage.Set('localeSettings', JSON.stringify({
        currencyCode: this.currencyCode,
        locale: this.locale
      }));
    }
  }

  private setDefaultsFromBrowser(): void {
    const browserLang = navigator.language || 'en-US';
    const [language, country] = browserLang.split('-');
    this._locale = `${language}-${country || 'US'}`;
    this._currencyCode = this.getCurrencyByCountry(country || 'US');
  }

  private getCurrencyByCountry(countryCode: string): string {
    const currencyMap: Record<string, string> = {
      US: 'USD',
      IN: 'INR',
      GB: 'GBP',
      EU: 'EUR',
      CA: 'CAD',
      AU: 'AUD',
      PK: 'PKR'
      // Add more mappings
    };
    return currencyMap[countryCode] || 'USD';
  }
}
