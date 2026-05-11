export const API_BASE = import.meta.env.VITE_API_URL || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiPost(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Request failed");
  }

  return json;
}

export async function apiGet(path) {
  const res = await fetch(API_BASE + path, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || "Request failed");
  }
  return json;
}

export async function apiPatch(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || "Request failed");
  }
  return json;
}

export async function apiDelete(path) {
  const res = await fetch(API_BASE + path, { method: "DELETE", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || "Request failed");
  }
  return json;
}
