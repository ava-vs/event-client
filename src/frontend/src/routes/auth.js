import { writable } from 'svelte/store';
import { AuthClient } from '@dfinity/auth-client';
import { browser } from '$app/environment';

export const principalId = writable('');
export const isAuthenticated = writable(false);

async function initializeAuthClient() {
  if (!browser) return; 

  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    isAuthenticated.set(true);
    const identity = authClient.getIdentity();
    principalId.set(identity.getPrincipal().toText());
  }
}

export async function loginII() {
  if (!browser) return; 

  const authClient = await AuthClient.create();
  const iiUrl = 'https://identity.ic0.app'; 

  await authClient.login({
    identityProvider: iiUrl,
    onSuccess: () => {
      isAuthenticated.set(true);
      const identity = authClient.getIdentity();
      principalId.set(identity.getPrincipal().toText());
    },
    onError: () => {
      isAuthenticated.set(false);
    }
  });
}

export function logout() {
  if (!browser) return; // И здесь также

  localStorage.removeItem('ic-delegation');
  localStorage.removeItem('ic-identity');
  isAuthenticated.set(false);
  principalId.set('');
}

if (browser) {
  initializeAuthClient(); // Обернуть вызов этой функции в проверку флага
}
