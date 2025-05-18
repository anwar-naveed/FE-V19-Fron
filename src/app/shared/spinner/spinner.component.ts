import {
  Component,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { SpinnerService } from '../services/common/spinner.service';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="preloader" *ngIf="isSpinnerVisible">
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [NgIf],
})
export class SpinnerComponent implements OnDestroy {
  public isSpinnerVisible = true;
  private subscriptions = new Subscription();

  constructor(
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {
    // 👇 Use debounceTime to reduce flickering
    const sub = this.spinnerService.spinnerObsv$
      .pipe(startWith(true),debounceTime(100)) // Delay spinner show/hide
      .subscribe((show) => {
        this.isSpinnerVisible = show;
        this.cdr.markForCheck(); // Trigger change detection if needed
      });

    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
