// connecting to websocket
import WebSocketManager from './js/socket.js';
import anime from './js/anime.js';
const socket = new WebSocketManager('127.0.0.1:24050');

// cache values here to prevent constant updating
const cache = {
  h100: -1,
  h50: -1,
  h0: -1,
  accuracy: -1,
};

// receive message update from websocket
socket.api_v2(({ play, state, performance, resultsScreen }) => {
  try {
    // contents goes here
  } catch (error) {
    console.log(error);
  }
});

