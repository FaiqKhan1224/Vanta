export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API + path, {
      method: opts.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Is the API running?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data as T;
}
