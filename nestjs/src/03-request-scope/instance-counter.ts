// Gives every constructed instance a sequential id per class, so we can see when Nest builds a new one.
const counters = new Map<string, number>();

export function nextId(className: string): number {
  const id = (counters.get(className) ?? 0) + 1;
  counters.set(className, id);
  return id;
}
