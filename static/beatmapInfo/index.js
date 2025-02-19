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

const animDuration = 125;

let isTransitionAnimationPlaying = false;

function fadeOut(target, callback) {
  if (!isTransitionAnimationPlaying) {
    isTransitionAnimationPlaying = true;
    anime({
      targets:"#" + target,
      opacity: 0,
      duration: animDuration,
      easing: 'easeOutQuad',
      complete: function() {
        console.log("Target: ", target)
        isTransitionAnimationPlaying = false;
        document.getElementById(target).classList.add("hide");
        if (callback) callback();
      }
    });
  }
}

function fadeIn(target, callback) {
  if (!isTransitionAnimationPlaying) {
    isTransitionAnimationPlaying = true;
    document.getElementById(target).classList.remove("hide");
    anime({
      targets: "#" + target,
      opacity: 1,
      duration: animDuration,
      easing: 'easeOutQuad',
      complete: function() {
        console.log("Target: ", target)
        isTransitionAnimationPlaying = false;
        if (callback) callback();
      }
    });
  }
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

let startToSwitch = false;
let isFinishedSwitching = false;
let isTransitionLocked = false; // 锁变量

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
      
      // display ingame and songInfo for 3 seconds, then switch to beatmapInfo
      if (!isTransitionLocked) {
        isTransitionLocked = true; // lock animation
        fadeIn('ingame', () => {
          fadeIn('songInfo', () => {
            setTimeout(() => {
              fadeOut('songInfo', () => {
                document.getElementById("songInfo").classList.add("hide");
                fadeIn('beatmapInfo', () => {
                  isTransitionLocked = true; // lock animation
                });
              });
            }, 3000);
          });
        });
      }
    } else {
      // hide overlay
      fadeOut('ingame', () => {
        document.getElementById("beatmapInfo").classList.add("hide");
        document.getElementById("songInfo").classList.remove("hide");
        startToSwitch = false;
        isFinishedSwitching = false;
        isTransitionLocked = false; // reset lock
        console.log("Info display style reset!");
      });
    }
  } catch (error) {
    console.log(error);
  }
});

