export const API_BASE = import.meta.env.VITE_API_URL || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildApiError(json) {
  const error = new Error(json?.message || json?.error?.message || json?.error?.code || "Request failed");
  error.code = json?.error?.code;
  error.details = json;
  return error;
}

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
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

  const json = await parseJson(res);
  if (!res.ok) throw buildApiError(json);
  return json;
}

export async function apiGet(path) {
  const res = await fetch(API_BASE + path, { headers: authHeaders() });
  const json = await parseJson(res);
  if (!res.ok) throw buildApiError(json);
  return json;
}

export async function apiPatch(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const json = await parseJson(res);
  if (!res.ok) throw buildApiError(json);
  return json;
}

export async function apiPut(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const json = await parseJson(res);
  if (!res.ok) throw buildApiError(json);
  return json;
}

export async function apiDelete(path) {
  const res = await fetch(API_BASE + path, { method: "DELETE", headers: authHeaders() });
  const json = await parseJson(res);
  if (!res.ok) throw buildApiError(json);
  return json;
}
