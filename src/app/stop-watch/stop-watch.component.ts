import { Component, OnInit } from '@angular/core';
import { IStopWatch } from './stop-watch';
import { NEVER, fromEvent, interval, map, mapTo, merge, scan, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss']
})
export class StopWatchComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    const getElem = (id: string): HTMLElement | null => document.getElementById(id);
    const getVal = (id: string): number => parseInt(getElem(id)['value']);
    const fromClick = (id: string) => fromEvent(getElem(id), 'click');
    const fromClickAndMapTo = (id: string, obj: {}) =>
      fromClick(id).pipe(mapTo(obj));
    const fromClickAndMap = (id: string, fn: _ => {}) =>
      fromClick(id).pipe(map(fn));
    const setValue = (val: number) =>
      (getElem('counter').innerText = val.toString());
    
    const events$ = merge(
      fromClickAndMapTo('start', { count: true }),
      fromClickAndMapTo('pause', { count: false }),
      fromClickAndMapTo('reset', { value: 0 }),
      fromClickAndMapTo('countup', { countup: true }),
      fromClickAndMapTo('countdown', { countup: false }),
      fromClickAndMap('setto', _ => ({ value: getVal('value') })),
      fromClickAndMap('setspeed', _ => ({ speed: getVal('speed') })),
      fromClickAndMap('setincrease', _ => ({ increase: getVal('increase') }))
    );
    
    const stopWatch$ = events$.pipe(
      startWith({
        count: false,
        speed: 1000,
        value: 0,
        countup: true,
        increase: 1
      }),
      scan((state: IStopWatch, curr): IStopWatch => ({ ...state, ...curr }), {}),
      tap((state: IStopWatch) => setValue(state.value)),
      switchMap((state: IStopWatch) =>
        state.count
          ? interval(state.speed).pipe(
              tap(
                _ =>
                  (state.value += state.countup ? state.increase : -state.increase)
              ),
              tap(_ => setValue(state.value))
            )
          : NEVER
      )
    );
    
    stopWatch$.subscribe();
  }
}
