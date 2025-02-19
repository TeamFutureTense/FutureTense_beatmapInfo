// connecting to websocket
import WebSocketManager from './js/socket.js';
import anime from './js/anime.js';
// import axiosMin from './js/axios.min.js';
const socket = new WebSocketManager('127.0.0.1:24050');

// cache values here to prevent constant updating
const cache = {
  name: "Unknown",
  difficulty: 0,
  length: 0,
  diffName: "Unknown diff",
  userid: ""
};

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// receive message update from websocket
socket.api_v2(({ state, beatmap, profile }) => {
  try {
    if (state.name === "play") {
      // get data
      cache.name = beatmap.title;
      cache.difficulty = beatmap.stats.stars.total;
      cache.diffName = beatmap.version;
      cache.length = beatmap.time.mp3Length;
      cache.userid = profile.id;
      // console.log("Updated cache", cache)
      
      // set styles
      document.getElementById("songTitle").innerText = cache.name;
      document.getElementById("starRating").innerText = cache.difficulty;
      document.getElementById("diffName").innerText = cache.diffName;
      document.getElementById("length").innerText = formatTime(cache.length);
      // display overlay
    }
    else {
      // hide overlay
    }
  } catch (error) {
    console.log(error);
  }
});

