import { writable } from 'svelte/store';
import { AuthClient } from '@dfinity/auth-client';
import { browser } from '$app/environment';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as dao } from './dao.did';
import { idlFactory as _client } from './client.did';
import { idlFactory as _broadcaster } from './broadcaster.did';

if (typeof global === 'undefined') {
  window.global = window;
}

export const principalId = writable('');
export const isAuthenticated = writable(false);
export let client_canister_actor = null;
let actual_canister = process.env.CANISTER_ID_CLIENT;
console.log("CLIENT_CANISTER_ID ", actual_canister);
const default_client_canister_id = "mmt3g-qiaaa-aaaal-qi6ra-cai";
export let CLIENT_CANISTER_ID = actual_canister ? actual_canister : default_client_canister_id;

export const broadcaster_canister = "rvrj4-pyaaa-aaaal-ajluq-cai";
export let broadcaster_canister_actor = null;
export let dao_canister_actor = null;
export const dao_canister = "k5yym-uqaaa-aaaal-ajoyq-cai";

const isLocal = false;


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
  const iiUrl = 'https://identity.icp0.io';

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

  const agent = HttpAgent.createSync({ host: 'https://icp0.io' });

  if (isLocal) {
    agent.fetchRootKey().catch((err) => {
      console.log("Error fetching root key: ", err);
    });
  }
  return Actor.createActor(dao, { agent, canisterId: dao_canister });
}

export async function broadcaster() {
  const agent = HttpAgent.createSync({ host: 'https://icp0.io' });

  if (isLocal) {
    agent.fetchRootKey().catch((err) => {
      console.log("Error fetching root key: ", err);
    });
  }
  return Actor.createActor(_broadcaster, { agent, canisterId: broadcaster_canister });
}

export async function client_canister() {
  const agent = HttpAgent.createSync({ host: 'https://icp0.io' });

  if (isLocal) {
    agent.fetchRootKey().catch((err) => {
      console.log("Error fetching root key: ", err);
    });
    // for local deployment: change CLIENT_CANISTER_ID to default 
    CLIENT_CANISTER_ID = CLIENT_CANISTER_ID.startsWith("b") ? default_client_canister_id : CLIENT_CANISTER_ID;

    // @ts-ignore
  }
  return Actor.createActor(_client, { agent, canisterId: CLIENT_CANISTER_ID });
}
