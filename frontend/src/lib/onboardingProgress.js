import { apiPost } from './api';

const SESSION_KEY = 'onboardingSessionId';
const DATA_KEY = 'onboardingData';

function createSessionId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getOnboardingSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = createSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function clearOnboardingSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getStoredOnboardingData() {
  try {
    const data = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch (_) {
    return {};
  }
}

export function persistOnboardingStepLocal(role, step, data) {
  const existing = getStoredOnboardingData();
  const next = {
    ...existing,
    [role]: {
      ...((existing[role] && typeof existing[role] === 'object') ? existing[role] : {}),
      [step]: data,
    },
  };
  localStorage.setItem(DATA_KEY, JSON.stringify(next));
  return next;
}

export async function saveOnboardingStep(role, step, data) {
  const sessionId = getOnboardingSessionId();
  const stored = persistOnboardingStepLocal(role, step, data);
  try {
    const response = await apiPost('/api/onboarding/step', {
      role,
      step,
      data,
      sessionId,
    });
    const userId = response?.data?.user?.id;
    if (userId) localStorage.setItem('onboardingUserId', userId);
    localStorage.removeItem('onboardingPendingSync');
    return { response, stored, savedToDatabase: true };
  } catch (error) {
    localStorage.setItem('onboardingPendingSync', 'true');
    return { response: null, stored, savedToDatabase: false, error };
  }
}

export function buildOnboardingCompletePayload(role) {
  return {
    role,
    sessionId: getOnboardingSessionId(),
    userId: localStorage.getItem('onboardingUserId') || undefined,
    data: getStoredOnboardingData()?.[role],
  };
}
