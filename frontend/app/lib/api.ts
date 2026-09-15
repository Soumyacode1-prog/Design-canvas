const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
let refreshInFlight: Promise<Response> | null = null;

export function authRequest(path: string, init: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, { ...init, credentials: "include", cache: "no-store" });
}

async function refreshSession() {
  const refresh = async () => {
    const current = await authRequest("/auth/me");
    return current.ok ? current : authRequest("/auth/refresh", { method: "POST" });
  };
  if (typeof navigator !== "undefined" && navigator.locks) {
    return navigator.locks.request("minicanvas-refresh", refresh);
  }
  return refresh();
}

export async function apiRequest(path: string, init: RequestInit = {}) {
  let response = await authRequest(path, init);
  if (response.status !== 401) return response;
  if (!refreshInFlight) {
    refreshInFlight = refreshSession().finally(() => { refreshInFlight = null; });
  }
  const refreshed = await refreshInFlight;
  if (refreshed.ok) response = await authRequest(path, init);
  if (response.status === 401) window.dispatchEvent(new Event("auth-expired"));
  return response;
}
