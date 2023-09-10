import {Container} from "./container";

export interface Node extends Container {
  containers: Node[];
}

export interface IModelVisitor {
  visitComponent(component: Node): IModelVisitor;
  visitChildComponent(component: Node): IModelVisitor;
  leaveComponent(component: Node): void;
}

export interface ITreeModel {
  accept(visitor: IModelVisitor): void;
}
