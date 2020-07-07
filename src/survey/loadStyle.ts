import {apiServer} from "./uri";

export async function getRandomStyle(uid : any) {
 const latent = []
 for (let i = 0; i < 3; ++i) {
   const val = Math.random() * 3 - 1.5
   latent.push(val)
 }
 return fetch(apiServer + "getStyle", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: uid,
      latentVec: latent
    })
  });
}

export async function getStyleWithLatentVec(uid : any, latentVec : Array<number>) {
  return fetch(apiServer + "getStyle", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: uid,
      latentVec: latentVec,
    })
  });
}