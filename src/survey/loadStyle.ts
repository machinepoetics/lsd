import {apiServer} from "./uri";

export async function getRandomStyle(uid : any) {
 return fetch(apiServer + "getStyle", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: uid,
      random: 1,
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