console.log("vonageExample.js");
import config from "./config.js";

var appId = config.appId;
var sessionId = config.sessionId;
var token = config.token;
var API_KEY = config.azureSpeechKey;
let messages = [];

import { SofyaTranscriber, MediaElementAudioCapture } from "sofya.transcription";
import { isDoctorClient, updateChat } from "./utils";

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
  const session = OT.initSession(appId, sessionId);

  // Capture audio from the user
  function captureAudioFromUser() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        startContinuousRecognition(stream, "doctor");
      })
      .catch(handleError);
  }

  // Subscribe to a newly created stream
  session.on("streamCreated", (event) => {
    const subscriberOptions = {
      insertMode: "append",
      width: "100%",
      height: "100%",
    };
    const subscriber = session.subscribe(
      event.stream,
      "subscriber",
      subscriberOptions,
      (error) => {
        console.log({
          subscriber,
          element: subscriber.element,
          src: subscriber.element.src,
        });
        if (error) {
          console.error("Error subscribing:", error);
        } else {
          if (isDoctorClient()) captureAudio(subscriber);
        }
      }
    );
  });

  session.on("sessionDisconnected", (event) => {
    console.log("You were disconnected from the session.", event.reason);
  });

  function captureAudio(subscriber) {
    const peerElement = subscriber.element;
    const peerVideoElement = peerElement.querySelector('video');
    const audioCapture = new MediaElementAudioCapture();
    const peerStream = audioCapture.captureAudio(peerVideoElement);
    startContinuousRecognition(peerStream, "paciente");
  }

  function startContinuousRecognition(stream, speaker) {
    const transcriber = new SofyaTranscriber(API_KEY);
    transcriber.startTranscription(stream);
    transcriber.on("recognizing", (text) => {
      console.log(`RECOGNIZING SOFYA: Text=${text}`);
    })
    
    transcriber.on("recognized", (text) => {
      console.log(`RECOGNIZED SOFYA: Text=${text}`);
      messages.push({ speaker, phrase: text });
      updateChat(messages);
        console.log({ messages });
    })

    setTimeout(() => {
      console.log("Transcription for " + speaker + " has stopped");
      transcriber.stopTranscription();
    }, 30000)
  }

  // initialize the publisher
  const publisherOptions = {
    insertMode: "append",
    width: "100%",
    height: "100%",
  };
  const publisher = OT.initPublisher(
    "publisher",
    publisherOptions,
    handleError
  );

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, handleError);
      if(isDoctorClient()) captureAudioFromUser();
    }
  });
}

initializeSession();
