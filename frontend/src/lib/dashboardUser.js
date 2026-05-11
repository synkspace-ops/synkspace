export function getDashboardUserFromOnboarding(role, onboardingData = {}) {
  const roleData = onboardingData?.[role] || {};
  const step1 = roleData.step1 || {};
  const step2 = roleData.step2 || {};
  const step4 = roleData.step4 || {};

  if (role === "creator") {
    return {
      role: "creator",
      name: step1.fullName || step1.username || "Creator",
      email: step1.email || "",
      username: step1.username || "",
      phone: step1.phone || "",
      location: [step1.city, step1.state, step1.country].filter(Boolean).join(", "),
    };
  }

  if (role === "brand") {
    return {
      role: "brand",
      name: step4.fullName || step2.companyName || "Brand",
      companyName: step2.companyName || "",
      email: step4.workEmail || "",
      phone: step4.phone || "",
      location: step2.location || "",
      website: step2.website || "",
      avatarUrl: step2.logo || "",
    };
  }

  if (role === "event") {
    return {
      role: "event",
      name: step1.fullName || "Organizer",
      companyName: step1.company || "",
      email: step1.email || "",
      phone: step1.phone || "",
      location: [step1.city, step1.state, step1.country].filter(Boolean).join(", "),
    };
  }

  return null;
}

function meaningfulValue(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed && trimmed.toLowerCase() !== "pending" ? trimmed : undefined;
}

export function persistDashboardUser(role, onboardingData, apiUser) {
  const localUser = getDashboardUserFromOnboarding(role, onboardingData);
  const nextUser = {
    ...(localUser || {}),
    ...(apiUser || {}),
    role: apiUser?.role || localUser?.role || role,
    name: meaningfulValue(apiUser?.name) || meaningfulValue(localUser?.name),
    email: meaningfulValue(apiUser?.email) || meaningfulValue(localUser?.email),
    companyName: meaningfulValue(apiUser?.companyName) || meaningfulValue(localUser?.companyName),
    avatarUrl: meaningfulValue(apiUser?.avatarUrl) || meaningfulValue(localUser?.avatarUrl),
  };

  if (nextUser?.name || nextUser?.email) {
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
  }

  return nextUser;
}
