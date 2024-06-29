import { dev } from '$app/environment';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as client } from '../client.did.js';

const client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";

const agent = new HttpAgent({ host: 'https://ic0.app' });

const client_canister_actor = Actor.createActor(client, { agent, canisterId: client_canister });

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const _client_canister_actor = client_canister_actor;
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;
