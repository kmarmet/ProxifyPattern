import $ from "jquery";
window.jQuery = $;
window.$ = $;
import moment from "moment";

// Helpers
const find = (el) => {
  return $("body").find(el);
};
const log = (message) => {
  console.log(message);
};

class PlayPause {
  constructor() {
    this.playbackState = "pause";
    this.clickEvents();
    this.keyboardEvents();
  }
  notify(prop, value) {
    if (prop === "playbackState") {
      if (value === "play") {
        find(".play-pause").text("Pause");
      } else {
        find(".play-pause").text("Play");
      }
      proxy_Clock.update();
    }
  }
  clickEvents() {
    find(".play-pause").on("click", (e) => {
      log("here");
      this.toggle();
    });
  }
  keyboardEvents() {
    $(document).on("keypress", (e) => {
      if (e.keyCode === 32) {
        this.toggle();
      }
    });
  }
  toggle() {
    if (proxy_PlayPause.playbackState === "play") {
      proxy_PlayPause.playbackState = "pause";
    } else {
      proxy_PlayPause.playbackState = "play";
    }
  }
}
class Clock {
  constructor() {
    this.time = moment().format("hh:mm:ss");
    this.direction = "forward";
    this.speedMultiplier = 1;
    this.timeouts = [];
    this.clickEvents();
    find(".direction .forward").addClass("active");
  }
  clickEvents() {
    find(".faster").on("click", () => {
      proxy_Clock.speedMultiplier = proxy_Clock.speedMultiplier * 2;
    });
    find(".slower").on("click", () => {
      proxy_Clock.speedMultiplier = proxy_Clock.speedMultiplier / 2;
    });
    find(".reset").on("click", () => {
      proxy_Clock.speedMultiplier = 1;
    });
    find(".direction .backward").on("click", () => {
      proxy_Clock.direction = "backward";
    });
    find(".direction .forward").on("click", () => {
      proxy_Clock.direction = "forward";
    });
  }
  notify(prop, value) {
    if (prop === "time") {
      find(".clock").text(proxy_Clock.time);
    }
    if (prop === "speedMultiplier") {
      find(".mult-speed").text(`${proxy_Clock.speedMultiplier}x`);
    }
    if (prop === "direction") {
      if (value === "forward") {
        find(".direction .backward").removeClass("active");
        find(".direction .forward").addClass("active");
      } else {
        find(".direction .forward").removeClass("active");
        find(".direction .backward").addClass("active");
      }
    }
  }
  update() {
    let counter = 0;
    let timer = null;
    function updateTime() {
      if (proxy_Clock.direction === "forward") {
        proxy_Clock.time = moment(proxy_Clock.time, "hh:mm:ss")
          .add(1, "s")
          .format("hh:mm:ss");
      } else {
        proxy_Clock.time = moment(proxy_Clock.time, "hh:mm:ss")
          .subtract(1, "s")
          .format("hh:mm:ss");
      }
    }
    if (counter === 0) {
      if (proxy_PlayPause.playbackState === "play") {
        updateTime();
      } else {
        proxy_Clock.time = proxy_Clock.time;
      }
      counter++;
    }
    const loop = () => {
      // Clear all timeouts before creating another one
      proxy_Clock.timeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timer = setTimeout(() => {
        if (proxy_PlayPause.playbackState === "play") {
          loop();
          updateTime();
        }
      }, 1000 / proxy_Clock.speedMultiplier);
      proxy_Clock.timeouts.push(timer);
    };
    if (proxy_PlayPause.playbackState === "play") {
      loop();
    }
  }
}
class Timepicker {
  constructor() {
    this.clickEvents();
  }
  clickEvents() {
    find(".go").click(() => {
      proxy_Clock.time = moment($("input").val(), "HH:mm A").format("hh:mm:00");
      proxy_PlayPause.playbackState = "play";
    });
  }
}

// Sentry that guards the getting/setting of PlayPause object properties
// Provides a centralized location to validate getting and setting of properties
// ... as well as a centralized location for adding necessary logic
// Initially checking for property in the target catches spelling errors as well
const sentry_PlayPause = {
  get: function (target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      throw `Prop ${prop} is invalid.`;
    }
  },
  set: function (target, prop, value) {
    if (prop in target) {
      if (prop === "playbackState") {
        if (value.toLowerCase() !== "play" && value.toLowerCase() !== "pause") {
          throw "Unable to set playbackState property. Value must be PLAY or PAUSE";
        }
      }
    } else {
      throw `Prop ${prop} is invalid.`;
    }

    // Set/update target property
    target[prop] = value;
    // Post update/set executions
    target.notify(prop, value);

    // Success
    return true;
  },
};
const sentry_Clock = {
  get: function (target, prop) {
    if (prop in target) {
      if (prop === "time") {
        if (target[prop].toLowerCase() === "invalid date") {
          throw `Time: ${target[prop]} is not a valid time`;
        }
      }
      return target[prop];
    } else {
      throw `Prop ${prop} is invalid.`;
    }
  },
  set: function (target, prop, value) {
    if (prop in target) {
      if (prop === "time") {
        if (value.toLowerCase() === "invalid date") {
          alert("Please choose a valid date");
        }
      }
      if (prop === "speedMultiplier") {
        if (value > 512) {
          value = 512;
        }
        if (value === 0) {
          value = 1;
        }
        if (value < 0.5) {
          value = 0.5;
        }
      }
    } else {
      throw `Prop ${prop} is invalid.`;
    }

    // Set/update target property
    target[prop] = value;
    // Post update/set executions
    target.notify(prop, value);

    // Success
    return true;
  },
};

// Proxies
const proxy_PlayPause = new Proxy(new PlayPause(), sentry_PlayPause);
const proxy_Clock = new Proxy(new Clock(), sentry_Clock);
const timepicker = new Timepicker();
