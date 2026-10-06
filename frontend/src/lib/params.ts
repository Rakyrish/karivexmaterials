type SearchParams = Record<string, string | string[] | undefined>;

export function first(params: SearchParams, key: string, max = 100): string | undefined {
  const value = params[key];
  const text = Array.isArray(value) ? value[0] : value;
  const trimmed = text?.trim().slice(0, max);
  return trimmed ? trimmed : undefined;
}

export function pageNumber(params: SearchParams): number {
  const page = Number(first(params, "page"));
  return Number.isInteger(page) && page > 1 && page < 1000 ? page : 1;
}
