import {apiServer} from "./uri";

export async function getRandomStyle(uid : any) {
 return fetch(apiServer + "getStyle", {
    method: 'POST',
    //mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: uid,
      random: 1,
    })
  });
}