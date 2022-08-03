export interface IWorkData {

}

export class Work {
  workRef: string;
  isResolved: boolean = false;
  lastResolved: Date | null = null;

  constructor(workRef: string) {
    this.workRef = workRef;
  }

}
