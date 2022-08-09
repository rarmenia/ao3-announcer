import axios from "axios";
import parse from "node-html-parser";

const BASE_URL = "https://archiveofourown.org/works";

export class Work {
  id: string;
  isResolved: boolean = false;
  lastResolved: Date | null = null;

  constructor(id: string) {
    this.id = id;
  }

  async resolve() {
    const workPage = parse(await axios.get(`${BASE_URL}/${this.id}`));

    this.isResolved = true;
    this.lastResolved = new Date();
  }

}
