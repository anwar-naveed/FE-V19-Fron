import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LocaleService } from '../services/locale.service';

@Pipe({
  name: 'customCurrency',
  pure: false, // Needed so it updates when currency changes
})
export class CustomCurrencyPipe implements PipeTransform {

  constructor(private localeService: LocaleService, private currencyPipe: CurrencyPipe) {}

  transform(value: number | null | undefined, digits?: string): string | null {
    if (value == null) return null;
    const code = this.localeService.currencyCode;
    return this.currencyPipe.transform(value, code, 'symbol', digits ?? '1.2-2');
  }
}
