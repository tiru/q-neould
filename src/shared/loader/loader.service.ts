import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoaderService {
  checkoutInProgress = false;
  private readonly loaderStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly loaderMsg$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  get displayLoader(): Observable<boolean> {
    return this.loaderStatus$.asObservable();
  }

  get loaderMsg(): Observable<string> {
    return this.loaderMsg$.asObservable();
  }

  show(msg = ''): void {
    this.loaderStatus$.next(true);
    this.loaderMsg$.next(msg);
  }

  hide(): void {
    this.loaderStatus$.next(false);
    this.loaderMsg$.next('');
  }
}
