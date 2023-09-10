import {ITreeModel, Node, IModelVisitor} from '../models/tree-container';
import {InternalModelVisitor} from './internal-model-visitor';

export class TreeModel implements ITreeModel {
  private treeMap = new Map<Node, Node>();
  private internalModelVisitor: any;
  constructor(public model: any) {
    if (model) {
      this.makeTreeMap();
    }
  }

  private makeTreeMap(): void {
    this.internalModelVisitor = new InternalModelVisitor();
    this.accept(this.internalModelVisitor);
    this.treeMap = this.internalModelVisitor.modelMap;
  }

  public accept(visitor: IModelVisitor) {
    this.acceptInternal(this.model, visitor);
  }

  private acceptInternal(model: Node, visitor: IModelVisitor): void {
    const nodeVisitor = visitor.visitComponent(model);
    if (Array.isArray(model.containers)) {
      model.containers.forEach((childDescriptor: any) => {
        const childVisitor = nodeVisitor.visitChildComponent(childDescriptor);
        this.acceptInternal(childDescriptor, childVisitor);
      });
    }
    visitor.leaveComponent(model);
  }

  public insert(src: Node, parent: Node) {
    const container: Node[] = parent.containers;
    if (Array.isArray(container)) {
      container.push(src);
      const nodeVisitor = this.internalModelVisitor.visitComponent(parent);
      nodeVisitor.visitChildComponent(src);
    } else {
      throw Error(`Container can not accept an insert operation`);
    }
  }

  private findParentModel(ref: Node): Node | undefined {
    if (this.treeMap.has(ref)) {
      return this.treeMap.get(ref);
    } else {
      throw Error(`The model reference does not found`);
    }
  }

  public remove(ref: Node) {
    const parent = this.findParentModel(ref);
    const containers = parent?.containers;
    if (Array.isArray(containers)) {
      for (let i = 0; i < containers.length; i++) {
        if (containers[i] === ref) {
          containers.splice(i, 1);
          break;
        }
      }
    }
  }
}
