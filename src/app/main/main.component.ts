import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {Container} from "../models/container";
import {ThingsState} from "../store/things/things.state";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {ContainersState} from "../store/containers/containers.state";
import {Thing} from "../models/thing";
import {TreeModel} from "../tree/tree-model";
import {Node} from "../models/tree-container";

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
})
export class MainComponent {
  @Select(ContainersState.getContainers)
  public containers$!: Observable<Container[]>;

  @Select(ThingsState.getThings)
  public things$!: Observable<Thing[]>;

  public treeModel = new TreeModel({
    nameContainer: 'root',
    idContainer: '',
    volumeContainer: Infinity,
    containers: []
  });

  private selectedContainer!: Node;

  public handleDragEndContainer(node: Container): void {
    const src: Node = {
      containers: [],
      ...node
    };

    if (this.remainingSpaceInContainer >= node.volumeContainer) {
      this.treeModel.insert(src, this.selectedContainer);
      console.log('container was added');
    } else {
      console.log('container wasn\'t added');
    }
  }

  public handleDragOverContainer(node: Node): void {
    this.selectedContainer = node;
  }

  public removeContainer(container: Node) {
    this.treeModel.remove(container);
  }

  private get remainingSpaceInContainer(): number {
    const currentVolumeContainer: number = this.selectedContainer.volumeContainer || 0;
    const volumeContainers: number = this.selectedContainer.containers.reduce(
        (accumulator: number, currentValue: Container) => accumulator + +currentValue.volumeContainer, 0) || 0;

    return currentVolumeContainer - volumeContainers;
  }
}
