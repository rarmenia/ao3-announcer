import axios from "axios";
import parse from "node-html-parser";
import { Work } from "./work";

const BASE_URL = "https://archiveofourown.org/users";

export class Profile {
  username: string;

  displayName?: string;
  title?: string;
  pseuds?: string[];
  birthday?: string;

  isResolved: boolean = false;
  lastResolved: Date | null = null;

  constructor(username: string) {
    this.username = username;
  }

  public async resolve() {
    const page = await axios.get(
      `${BASE_URL}/${encodeURI(this.username)}/profile`
    );
    const profile = parse(page.data).querySelector(
      "#main.profile-show.dashboard.region"
    );
    if (profile) {
      this.displayName = (profile.querySelector("h2.heading")?.text ?? "")
        .replace(/[\n\t]*/g, "")
        .trim();
      this.title = (profile.querySelector("h3.heading")?.text ?? "")
        .replace(/[\n\t]*/g, "")
        .trim();
      const meta = profile.querySelector(".meta");
      if (meta) {
        this.pseuds =
          meta
            ?.querySelector("dd.pseuds")
            ?.querySelectorAll("a")
            ?.map((element) => element.text) ?? [];

        this.birthday = meta.querySelector("dd.birthday")?.text ?? undefined;
      }
    }

    this.isResolved = true;
    this.lastResolved = new Date();
  }
}

export class User {
  username: string;
  profile: Profile;
  works: Map<string, Work> = new Map<string, Work>();

  isResolved: boolean = false;
  lastResolved: Date | null = null;

  constructor(username: string) {
    this.username = username;
    this.profile = new Profile(username);
  }

  public async resolve() {
    await this.profile.resolve();

    const page1 = parse(
      (
        await axios.get(`${BASE_URL}/${encodeURI(this.username)}/works`, {
          params: { page: 1 },
        })
      ).data
    ).querySelector("#main");
    const max = Math.max(
      ...(page1
        ?.querySelector(".pagination.actions")
        ?.querySelectorAll("li")
        .map((_) => {
          const raw = _.text;
          const num = Number(raw);
          const isNaN = Number.isNaN(num);
          return isNaN ? Number.MIN_SAFE_INTEGER : num;
        }) ?? [0])
    );
    const pages = [page1];
    for (let i = 2; i <= max; i++) {
      const delay = 1200 * (i - 1);
      await setTimeout(
        async () =>
          await axios
            .get(`${BASE_URL}/${encodeURI(this.username)}/works`, {
              params: { page: i },
            })
            .then((resp) =>
              pages.push(parse(resp.data).querySelector("#main"))
            ),
        delay
      );
    }

    pages.forEach((page) => {
      const works = page
        ?.querySelector(".work.index.group")
        ?.querySelectorAll("li.work")
        ?.map((_) => _.id.split("_")[1] ?? undefined);
      works?.forEach((work) => {
        if (!this.works.has(work)) {
        }
      });
    });
    // console.log(pages);
    // pages.forEach(page => {
    //   const works = page?.querySelector('.work.index.group')?.querySelectorAll('li.work')?.map(_ => _.id.split('_')[1] ?? undefined);
    //   works?.forEach(work => {
    //     if(!this.works.has(work)) {

    //     }
    //   })
    // })

    // const resolveWorks = async (currentIndex: number = 1, max?: number) => {
    //   console.log('running resolveWorks');
    //   console.log({currentIndex, max});
    //   const raw =
    //   const worksPage = parse(raw.data).querySelector('#main');
    //   if (!worksPage) {return;}
    //   console.log ('found works page');
    //   let curMax = max;
    //   if (curMax === undefined) {
    //     const paginator = worksPage.querySelector('.pagination.actions')?.querySelectorAll('li').map(_ => _.text).reverse();
    //     if (!paginator) return;
    //     for(let i = 0; i < paginator.length; i++) {
    //       const p = paginator[i];
    //       const n = Number(p) ?? 0;
    //       curMax = n;
    //       if (n > 0) {
    //         break;
    //       }
    //     }
    //   }
    //   console.log({curMax})

    //   const works = worksPage.querySelector('.work.index.group')?.querySelectorAll('li.work')?.map(_ => _.id.split('_')[1] ?? undefined);
    //   works?.forEach(_ => {
    //     if(!this.works.has(_)) {
    //       this.works.set(_, new Work(_));
    //     }
    //   });

    //   if ((currentIndex + 1) <= (curMax ?? 0)) {
    //     resolveWorks(currentIndex + 1, curMax);
    //   } else {
    //     return;
    //   }
    // }

    // await resolveWorks();

    this.isResolved = true;
    this.lastResolved = new Date();
  }
}
