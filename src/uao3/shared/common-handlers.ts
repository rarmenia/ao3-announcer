import { HandlerFunc } from "./targets";

export const cleanString: HandlerFunc = (response: any) => {
  if (!response || typeof response !== 'string') return undefined;
  return response.replace(/[\n\t]*/g, '').trim();
}
