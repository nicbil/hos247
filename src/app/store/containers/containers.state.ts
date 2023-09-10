import {State, Action, StateContext, Selector, NgxsOnInit} from '@ngxs/store';
import { AddContainer, DeleteContainer, UpdateContainer } from './containers.action';
import { Container } from "../../models/container";
import { inject } from "@angular/core";
import { ContainersService } from "../../containers/containers.service";
import { tap } from "rxjs/operators";

export interface ContainersStateModel {
  containers: Container[],
}

@State<ContainersStateModel>({
  name: 'containers',
  defaults: {
    containers: []
  }
})
export class ContainersState implements NgxsOnInit {
  private containerService = inject(ContainersService);

  public ngxsOnInit({ setState }: StateContext<ContainersStateModel>) {
    this.containerService.getContainer().subscribe((data) => {
      setState({containers: data});
    });
  }

  @Selector()
  static getContainers(state: ContainersStateModel) {
    return state.containers;
  }

  @Action(AddContainer)
  addContainer({dispatch, getState, patchState, setState }: StateContext<ContainersStateModel>, { payload }: any) {
    return this.containerService.addContainer(payload).pipe(
      tap((idContainer: string) => {
        let newContainer = {...payload, idContainer};
        let currentContainers = getState().containers || [];
        console.log(getState().containers);
        patchState({
          containers: [...currentContainers, newContainer]
        });
      })
    );
  }

  @Action(UpdateContainer)
  updateContainer({getState, patchState }: StateContext<ContainersStateModel>, { payload }: UpdateContainer) {
    return this.containerService.updateContainer(payload).pipe(
      tap(() => {
        let containers = getState().containers.map((container: Container) => {
          if (container.idContainer === payload.idContainer) {
            container = payload;
          }
          return container;
        })
        patchState({containers});
      })
    );
  }

  @Action(DeleteContainer)
  deleteContainer({getState, patchState }: StateContext<ContainersStateModel>, { idContainer }: DeleteContainer) {
    return this.containerService.deleteContainer(idContainer).pipe(
      tap(() => {
        let containers = getState().containers.filter((container: Container) => container.idContainer !== idContainer)
        console.log(containers);
        patchState({containers});
      })
    );
  }
}
