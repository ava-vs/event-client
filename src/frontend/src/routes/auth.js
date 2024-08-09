import { writable } from 'svelte/store';
import { AuthClient } from '@dfinity/auth-client';
import { browser } from '$app/environment';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as dao } from '../dao-backend.did';
import { idlFactory as _client } from './client.did';
import { idlFactory as _broadcaster } from './broadcaster.did';

if (typeof global === 'undefined') {
  window.global = window;
}

export const principalId = writable('');
export const isAuthenticated = writable(false);
export let client_canister_actor = null;
export let broadcaster_canister_actor = null;
export let dao_canister_actor = null;


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
  if (!browser) return;

  localStorage.removeItem('ic-delegation');
  localStorage.removeItem('ic-identity');
  isAuthenticated.set(false);
  principalId.set('');
}

if (browser) {
  initializeAuthClient();
}

export async function dao_backend() {
  try {
    const dao_canister = "k5yym-uqaaa-aaaal-ajoyq-cai";
    const agent = HttpAgent.createSync({ host: 'https://ic0.app' });
    if (process.env.DFX_NETWORK !== "ic") {
      await agent.fetchRootKey();
    } // for local 
    return Actor.createActor(dao, { agent, canisterId: dao_canister });
  } catch (error) {
    console.error('Error when creating dao canister:', error);
    throw error;
  }
}

export async function broadcaster() {
  try {
    const broadcaster_canister = "rvrj4-pyaaa-aaaal-ajluq-cai";//"mmt3g-qiaaa-aaaal-qi6ra-cai";
    const agent = HttpAgent.createSync({ host: 'https://ic0.app' });
    await agent.fetchRootKey(); // for local
    return Actor.createActor(_broadcaster, { agent, canisterId: broadcaster_canister });
  } catch (error) {
    console.error('Error when creating broadcaster canister:', error);
    throw error;
  }
}

export async function client_canister() {
  const client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";
  const agent = HttpAgent.createSync({ host: 'https://ic0.app' });
  await agent.fetchRootKey(); // for local
  return Actor.createActor(_client, { agent, canisterId: client_canister });
}
