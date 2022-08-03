import XRay from "x-ray";

export const xray = XRay();

export default async function runner(
  sub: string,
  context: string,
  selector?: XRay.Selector
): Promise<any | undefined> {
  return (
    selector
      ? xray(`https://archiveofourown.org/${sub}`, context, selector)
      : xray(`https://archiveofourown.org/${sub}`, context)
  )
    .then((res) => res)
    .catch(() => undefined);
}
