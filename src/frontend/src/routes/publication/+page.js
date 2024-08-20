// import { dev } from '$app/environment';
// import { Actor, HttpAgent } from '@dfinity/agent';
// import { idlFactory as client } from '../client.did';

// const client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";
// let client_canister_actor;

// export async function load() {
//     const agent = await HttpAgent.create({ host: 'https://*.icp0.io' });

//     if (dev) {
//         await agent.fetchRootKey();
//     }

//     client_canister_actor = await Actor.createActor(client, { agent, canisterId: client_canister });

//     return {
//         _client_canister_actor: client_canister_actor
//     };
// }

// export const _client_canister_actor = client_canister_actor;

// export const csr = dev;

export const prerender = true;
