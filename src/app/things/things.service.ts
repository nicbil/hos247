import { inject, Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { UuidService } from "../services/uuid.service";
import { Thing } from "../models/thing";

@Injectable({providedIn: "root"})
export class ThingsService {
  public uuidService = inject(UuidService);

  public getThing(): Observable<any> {
    return of(JSON.parse( localStorage.getItem('things') as any)).pipe(delay(1000));
  }

  public addThing(payload: Thing): Observable<any> {
    let thingFromStore: any = localStorage.getItem('things');
    const uuid: string = this.uuidService.uuidv4();
    let newThing = [{...payload, ...{idThing: uuid}}];

    if (thingFromStore) {
      localStorage.setItem('things', JSON.stringify([...JSON.parse(thingFromStore), ...newThing]));
    } else {
      localStorage.setItem('things', JSON.stringify(newThing));
    }
    return of(uuid).pipe(delay(1000));
  }

  public updateThing(payload: Thing): Observable<any> {
    let thingFromStore = JSON.parse(localStorage.getItem('things') as any);
    const updatedThing = thingFromStore.map((thing: Thing) => {
      if (thing.idThing === payload?.idThing) {
        thing.nameThing = payload.nameThing;
      }
      return thing;
    });
    localStorage.setItem('things', JSON.stringify(updatedThing));
    return of().pipe(delay(1000));
  }

  public deleteThing(idThing: string): Observable<any> {
    let thingFromStore = JSON.parse(localStorage.getItem('things') as any);
    const updatedThing = thingFromStore.filter((thing: Thing) => thing.idThing !== idThing);
    localStorage.setItem('things', JSON.stringify(updatedThing));
    return of([]).pipe(delay(1000));
  }
}
