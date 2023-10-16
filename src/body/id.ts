import type { Branded } from "src/util";

export type BodyId<B extends string> = Branded<string, B>;

export function createBodyId<T extends string>(id: string, type: T): BodyId<T> {
  return id as BodyId<T>;
}