import XRay from "x-ray";
import { CommonHandlers, ScraperConfig, Targets } from "../shared";
import runner from "../shared/xray";
import { Work } from "./work";

const DATA_TARGETS: Targets<IUserData> = {
  name: {
    context: '.primary.header h2.heading',
    handler: CommonHandlers.cleanString,
  },
  icon: {
    context: '.primary.header p.icon img@src',
    handler: CommonHandlers.cleanString
  },
  title: {
    context: '.user.home.profile h3.heading',
    handler: CommonHandlers.cleanString,
    sub: '/profile'
  },
  birthday: {
    context: '.user.home.profile dd.birthday',
    handler: CommonHandlers.cleanString,
    sub: '/profile'
  },
  bio: {
    context: 'div.bio.module blockquote',
    sub: '/profile',
  }
}

export interface IUserData{
  name?: string;
  icon?: string;
  title?: string;
  userid?: string;
  birthday?: string;
  bio?: string;
}

export class User {

  username: string;
  isResolved: boolean = false;
  lastResolved: Date | null = null;
  userData: IUserData = {};
  works: Map<string, Work>  = new Map<string, Work>();
  error?: any;

  constructor(username: string) {
    this.username = username;
  }

  async resolve() {
    const base = `users/${this.username}`;
    const wrapper = (context: string, selector?: XRay.Selector, sub: string = '') => runner(`${base}${sub}`, context, selector);

    const promiseCollection: Promise<void>[] = [];

    Object.entries(DATA_TARGETS).forEach(([key, config]) => {
      if (config) {
        promiseCollection.push(wrapper(config.context, config.selector, config.sub).then(result => {
          const handled = config.handler ? config.handler(result) : result;
          this.userData[key as keyof IUserData] = handled;
        }).catch(err => {}));
      }
    })

    const pages = await wrapper('ol.pagination.actions', ['li'], '/works');
    if (pages && Array.isArray(pages)) {
      const lastPage = Number(pages[pages.length - 2]);
      if (lastPage && lastPage !== NaN) {
        promiseCollection.push(wrapper('ol.work.index.group', [{li: {}}], '/works').then((result => {
          console.log({works: result});
        })))
      }
    }


    
    return Promise.all(promiseCollection).then(() => {
      this.isResolved = true;
      this.lastResolved = new Date();
    })
  }

  static async get_user(userId: string): Promise<User> {
    const user = new User(userId);
    await user.resolve();
    return user;
  }

}
