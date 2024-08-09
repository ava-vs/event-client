import { dev } from '$app/environment';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as dao } from '../../dao-backend.did';

const dao_canister = "k5yym-uqaaa-aaaal-ajoyq-cai";

const agent = HttpAgent.createSync({ host: 'https://ic0.app' });

const dao_canister_actor = Actor.createActor(dao, { agent, canisterId: dao_canister });

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const _dao_canister_actor = dao_canister_actor;
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;
