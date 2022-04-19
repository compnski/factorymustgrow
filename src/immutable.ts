import { Map as ImmutableMap } from "immutable";

function Map<K, V>(collection?: Iterable<[K, V]>): ImmutableMap<K, V>;
function Map<V>(obj: { [key: string]: V }): ImmutableMap<string, V>;
function Map<K extends string, V>(obj: { [P in K]?: V }): ImmutableMap<K, V>;

function Map<K, V>(arg): ImmutableMap<K, V> {
  const m = ImmutableMap<K, V>(arg);
  (m as any).toJSON = function () {
    return this;
  };
  return m;
}

export { Map as ImmutableMap };
