import { Component, OnInit } from '@angular/core';
import { IStopWatch } from './stop-watch';
import { NEVER, Observable, fromEvent, interval, map, merge, scan, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss']
})

export class StopWatchComponent implements OnInit {

  value: number = 0;

  constructor() {}

  ngOnInit(): void {
    const getElem = (id: string): HTMLElement | null => document.getElementById(id);
    const fromClick = (id: string) => fromEvent(getElem(id)!, 'click');
    const fromClickAndMap = (id: string, obj: object): any => {
      fromClick(id).pipe(map(_ => obj));

    const events$: any = merge(
      fromClickAndMap('start', { count: true }),
      fromClickAndMap('pause', { count: false }),
      fromClickAndMap('reset', { value: 0 }),
    );

      const stopWatch$ = events$.pipe(
        startWith({
          count: false,
          speed: 1000,
          value: 0,
          countup: true,
          increase: 1
        } as IStopWatch),
        scan((state: IStopWatch, curr: IStopWatch) => ({ ...state, ...curr })),
        tap((state: IStopWatch) => this.value = state.value),
        switchMap((state: IStopWatch) =>
          state.count
            ? interval(state.speed).pipe(
              tap(
                _ =>
                  (state.value += state.countup ? state.increase : -state.increase)
              ),
              tap(_ => this.value = state.value)
            )
            : NEVER
        )
      );

      stopWatch$.subscribe();
    }

  }
}
