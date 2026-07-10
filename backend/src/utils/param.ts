// Helper to extract route param as string (Express params can be string | string[])
export function paramId(id: string | string[] | undefined): string {
  if (!id) return "";
  return Array.isArray(id) ? id[0] : id;
}
