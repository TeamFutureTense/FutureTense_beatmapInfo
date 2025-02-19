// connecting to websocket
import WebSocketManager from './js/socket.js';
import anime from './js/anime.js';
const socket = new WebSocketManager('127.0.0.1:24050');

// cache values here to prevent constant updating
const cache = {
  name: "Unknown",
  difficulty: 0,
  length: 0,
  diffName: "Unknown diff"
};

// receive message update from websocket
socket.api_v2(({ play, state, performance, resultsScreen, beatmap }) => {
  try {
    if (state.name === "") {
      // get data
      cache.name = beatmap.title;
      cache.difficulty = beatmap.stats.stars.total;
      cache.length = beatmap.time.live;
      
      // set styles

      // display overlay
    }
    else {
      // hide overlay
    }
  } catch (error) {
    console.log(error);
  }
});

