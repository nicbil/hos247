import { Container } from "../../models/container";

export class AddContainer {
  static readonly type = '[Container] Add containers';
  constructor(public payload: Container) {}
}

export class UpdateContainer {
  static readonly type = '[Container] Update containers';
  constructor(public payload: Container) {}
}

export class DeleteContainer {
  static readonly type = '[Container] Delete containers';
  constructor(public idContainer: string) {}
}
