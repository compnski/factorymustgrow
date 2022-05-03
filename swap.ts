function swap<T>(a: T[], lowerIdx: number, upperIdx: number): T[] {
  const lowerSlot = a[lowerIdx];
  const upperSlot = a[upperIdx];
  return [
    ...a.splice(0, lowerIdx),
    lowerSlot,
    ...a.splice(lowerIdx + 1, upperIdx),
    upperSlot,
    ...a.splice(upperIdx + 1),
  ];
}

const a = [1, 2, 3];
console.log(swap(a, 1, 2));
