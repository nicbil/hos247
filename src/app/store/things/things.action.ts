import { Thing } from "../../models/thing";

export class AddThing {
  static readonly type = '[Thing] Add things';
  constructor(public payload: Thing) {}
}

export class UpdateThing {
  static readonly type = '[Thing] Update things';
  constructor(public payload: Thing) {}
}

export class DeleteThing {
  static readonly type = '[Thing] Delete things';
  constructor(public idThing: string) {}
}
