import { User } from "./uao3/types";

async function main(): Promise<void> {
  const k = await User.get_user('pinstripedJackalope');
  console.log(k);

  // const yeaka = await User.get_user('yeaka');
  // console.log(yeaka);
}

main();

