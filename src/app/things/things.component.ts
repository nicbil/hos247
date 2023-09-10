import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { Actions, Select, Store } from "@ngxs/store";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, RouterModule} from "@angular/router";
import { map, Observable } from "rxjs";
import { AddThing, DeleteThing, UpdateThing } from "../store/things/things.action";
import { ThingsState } from "../store/things/things.state";
import { MatButtonModule } from "@angular/material/button";
import { Thing } from "../models/thing";

@Component({
  selector: 'app-things',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './things.component.html',
  styleUrls: ['./things.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThingsComponent implements OnInit {
  @Select(ThingsState.getThings)
  public things$!: Observable<Thing[]>;

  public thingsForm = new FormGroup(<{ [key in keyof any]: FormControl }>{
    nameThing: new FormControl('', Validators.required),
    volumeThing: new FormControl('', Validators.required)
  });

  public thingsUpdateForm = this.fb.group({
    things: this.fb.array([])
  });

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private updates$: Actions,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.things$.subscribe((data) => {
      this.thingsArray.clear();
      if (data) {
        data.map((thing: Thing) => {
          this.addThing(thing);
        });
      }
      this.cdRef.detectChanges();
    });
  }

  public get thingsArray(): FormArray {
    return this.thingsUpdateForm.get('things') as FormArray;
  }

  public async createThing() {
    if (this.thingsForm.valid) {
      let { nameThing, volumeThing } = this.thingsForm.value;
      this.store.dispatch(new AddThing( { nameThing, volumeThing })).pipe(map((things) =>  {
        return things.things.things[things.things.things.length-1];
      })).subscribe(() => {
        this.thingsForm.reset();
      });
    }
  }

  private addThing(thing: Thing): void {
    if (thing) {
      const thingsForm: any = this.fb.group({
        idThing: new FormControl(thing.idThing),
        nameThing: new FormControl(thing.nameThing, Validators.required),
        volumeThing: new FormControl(thing.volumeThing, Validators.required)
      });
      this.thingsArray.push(thingsForm);
    }
  }

  public deleteThing(idThing: string) {
    this.store.dispatch(new DeleteThing(idThing)).subscribe(() => {
      console.log('Thing was deleted');
    });
  }

  public updateThing(thing: Thing) {
    this.store.dispatch(new UpdateThing(thing)).subscribe(() => {
      console.log('Thing was updated');
    });
  }
}

