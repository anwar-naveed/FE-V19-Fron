import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<boolean>(false);

  // Observable the spinner component subscribes to
  get spinnerObsv$(): Observable<boolean> {
    return this.spinnerSubject.asObservable();
  }

  show(): void {
    this.spinnerSubject.next(true);
  }

  hide(): void {
    this.spinnerSubject.next(false);
  }

  toggleLoadingSpinner(val: boolean){
    if(val)
      this.show();
    else
      this.hide();
  }
}
