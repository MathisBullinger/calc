const caches = new Map<(...args: any) => unknown, { [args: string]: any }>()

export default <T extends (...args: any[]) => any>(func: T) => (
  ...args: Parameters<T>
): ReturnType<T> => {
  const cache = caches.get(func) ?? caches.set(func, {}).get(func)
  const argsJson = JSON.stringify(args)
  return argsJson in cache ? cache[argsJson] : (cache[argsJson] = func(...args))
}
