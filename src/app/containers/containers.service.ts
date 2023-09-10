import { inject, Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { Container } from "../models/container";
import { UuidService } from "../services/uuid.service";

@Injectable({providedIn: "root"})
export class ContainersService {
  public uuidService = inject(UuidService);

  public getContainer(): Observable<any> {
    return of(JSON.parse( localStorage.getItem('container') as any)).pipe(delay(1000));
  }

  public addContainer(payload: Container): Observable<any> {
    let containerFromStore: any = localStorage.getItem('container');
    const uuid: string = this.uuidService.uuidv4();
    let newContainer = [{...payload, ...{idContainer: uuid}}];

    if (containerFromStore) {
      localStorage.setItem('container', JSON.stringify([...JSON.parse(containerFromStore), ...newContainer]));
    } else {
      localStorage.setItem('container', JSON.stringify(newContainer));
    }
    return of(uuid).pipe(delay(1000));
  }

  public updateContainer(payload: Container): Observable<any> {
    let containerFromStore = JSON.parse(localStorage.getItem('container') as any);
    const updatedContainer = containerFromStore.map((container: Container) => {
      if (container.idContainer === payload.idContainer) {
        container = payload;
      }
      return container;
    });
    localStorage.setItem('container', JSON.stringify(updatedContainer));
    return of([]).pipe(delay(1000));
  }

  public deleteContainer(idContainer: string): Observable<any> {
    let containerFromStore = JSON.parse(localStorage.getItem('container') as any);
    const updatedContainer = containerFromStore.filter((container: Container) => container.idContainer !== idContainer);
    localStorage.setItem('container', JSON.stringify(updatedContainer));
    return of([]).pipe(delay(1000));
  }
}
