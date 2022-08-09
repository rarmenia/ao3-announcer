import { User } from "./uao3/types/user";

async function main(): Promise<void> {
  const usernames = ["pinstripedJackalope", "yeaka"];
  usernames.forEach(async (username) => {
    console.log(`scraping ${username}`);
    const user = new User(username);
    const start = Date.now();
    await user.resolve().then((_) => {
      const end = Date.now();
      console.log(
        `finished scraping ${username}, total time: ${end - start}ms`
      );
      console.log(user);
    });
  });
}

main();
