import {Node, IModelVisitor} from "../models/tree-container";

export class InternalModelVisitor implements IModelVisitor {
  public modelMap = new Map<Node, Node>();
  private parents: Node[] = [];

  public visitComponent(component: Node): IModelVisitor {
    this.parents.push(component);
    return this;
  }

  public visitChildComponent(component: Node): IModelVisitor {
    this.modelMap.set(component, this.parents[this.parents.length - 1]);
    return this;
  }

  public leaveComponent() {
    this.parents.pop();
  }
}
