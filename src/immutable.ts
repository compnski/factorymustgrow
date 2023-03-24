import { Map } from "immutable"

// function Map<K, V>(collection?: Iterable<[K, V]>): ImmutableMap<K, V>;
// function Map<V>(obj: { [key: string]: V }): ImmutableMap<string, V>;
// function Map<K extends string, V>(obj: { [P in K]?: V }): ImmutableMap<K, V>;

// function Map<K, V>(arg?: Iterable<[K, V]>): ImmutableMap<K, V> {
//   const m = ImmutableMap<K, V>(arg);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   (m as any).toJSON = function () {
//     return this;
//   };
//   return m;
// }

export { Map as ImmutableMap } //, ImmutableMap as ImmutableMapType };
