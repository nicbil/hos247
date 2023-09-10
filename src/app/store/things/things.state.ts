import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddThing, DeleteThing, UpdateThing } from './things.action';
import { inject } from "@angular/core";
import { tap } from "rxjs/operators";
import { Thing } from "../../models/thing";
import { ThingsService } from "../../things/things.service";

export interface ThingsStateModel {
  things: Thing[],
}

@State<ThingsStateModel>({
  name: 'things',
  defaults: {
    things: []
  }
})
export class ThingsState {
  private thingService = inject(ThingsService);

  public ngxsOnInit({ setState }: StateContext<ThingsStateModel>) {
    this.thingService.getThing().subscribe((data) => {
      setState({things: data});
    });
  }

  @Selector()
  static getThings(state: ThingsStateModel) {
    return state.things;
  }

  @Action(AddThing)
  addContainer({dispatch, getState, patchState, setState }: StateContext<ThingsStateModel>, { payload }: any) {
    return this.thingService.addThing(payload).pipe(
      tap((idThing: string) => {
        let newThing = {...payload, idThing};
        let currentThings = getState().things || [];
        patchState({
          things: [...currentThings, newThing]
        });
      })
    );
  }

  @Action(UpdateThing)
  updateThing({getState, patchState }: StateContext<ThingsStateModel>, { payload }: UpdateThing) {
    return this.thingService.updateThing(payload).pipe(
      tap(() => {
        let things = getState().things.map((thing: Thing) => {
          if (thing.idThing === payload.idThing) {
            thing = payload;
          }
          return thing;
        })
        patchState({things});
      })
    );
  }

  @Action(DeleteThing)
  deleteThing({getState, patchState }: StateContext<ThingsStateModel>, { idThing }: DeleteThing) {
    return this.thingService.deleteThing(idThing).pipe(
      tap(() => {
        let things = getState().things.filter((thing: Thing) => thing.idThing !== idThing)
        patchState({things});
      })
    );
  }
}
