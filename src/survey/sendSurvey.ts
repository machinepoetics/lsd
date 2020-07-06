/*
  API usage:
  ---------------------------------
  POST /api/survey
  userId
  surveyId
  answer
  dateTime
  ---------------------------------
  POST /api/uploadSketch
  userId
  sequence
  dateTime

  Besides the mandatory fields, any data can be sent in the posted Json - just add in the body section
  I add a "test" field temporarily for development usage. Data with test label in MongoDB will be deleted later
*/

import {apiServer} from "./uri";

export async function sendQuestion(uid : string, surveyId : string | number, answer : string | number, test : boolean = false) {
 return fetch(apiServer + "survey", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: uid,
      surveyId: surveyId,
      answer: answer,
      dateTime: new Date().toUTCString(),
      test: test
      // to add extra fields, just add here
    })
  });
}

export async function sendSketch(uid : string, sequence : string, test : boolean = false) {
  return fetch(apiServer + "uploadSketch", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: uid,
      sequence: sequence,
      dateTime: new Date().toUTCString(),
      test: test
      // to add extra fields, just add here
    })
  });
}