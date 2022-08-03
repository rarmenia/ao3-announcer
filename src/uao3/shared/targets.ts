import XRay from "x-ray";

export type HandlerFunc = (response: any | undefined) => string | undefined;

export type ScraperConfig = {
  context: string,
  selector?: XRay.Selector,
  handler?: HandlerFunc,
  sub?: string;
}

export type Targets<T> = {
  [Prop in keyof T]: ScraperConfig | undefined
}
