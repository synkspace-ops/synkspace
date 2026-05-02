export const API_BASE = "http://localhost:4000";

export async function apiPost(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || "Request failed");
  }

  return json;
}