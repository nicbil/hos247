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
import { AddContainer, DeleteContainer, UpdateContainer } from "../store/containers/containers.action";
import { MatSelectModule } from "@angular/material/select";
import { Container } from "../models/container";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { map, Observable } from "rxjs";
import { ContainersState } from "../store/containers/containers.state";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-containers',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    RouterModule,
    MatButtonModule
  ],
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainersComponent implements OnInit {
  @Select(ContainersState.getContainers)
  public containers$!: Observable<Container[]>;

  public containersForm = new FormGroup(<{ [key in keyof any]: FormControl }>{
    nameContainer: new FormControl('', Validators.required),
    volumeContainer: new FormControl('', Validators.required)
  });

  public containersUpdateForm = this.fb.group({
    containers: this.fb.array([])
  });

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private updates$: Actions,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.containers$.subscribe((data) => {
      this.containersArray.clear();
      if (data.length) {
        data.map((container: Container) => {
          this.addContainer(container);
        });
      }
      this.cdRef.detectChanges();
    });
  }

  public get containersArray(): FormArray {
    return this.containersUpdateForm.get('containers') as FormArray;
  }

  public async createContainer() {
    if (this.containersForm.valid) {
      let { nameContainer, volumeContainer } = this.containersForm.value;
      this.store.dispatch(new AddContainer( { nameContainer, volumeContainer })).pipe(map((containers) =>  {
        return containers.containers.containers[containers.containers.containers.length-1];
      })).subscribe(() => {
        this.containersForm.reset();
      });
    }
  }

  private addContainer(container: Container): void {
    if (container) {
      const containersForm: any = this.fb.group({
        idContainer: new FormControl(container.idContainer),
        nameContainer: new FormControl(container.nameContainer, Validators.required),
        volumeContainer: new FormControl(container.volumeContainer, Validators.required)
      });
      this.containersArray.push(containersForm);
    }
  }

  public deleteContainer(idContainer: string) {
    this.store.dispatch(new DeleteContainer(idContainer)).subscribe(() => {
      console.log('Container was deleted');
    });
  }

  public updateContainer(container: Container) {
    this.store.dispatch(new UpdateContainer(container)).subscribe(() => {
      console.log('Container was updated');
    });
  }
}
