// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Helpers
var find = function find(el) {
  return $("body").find(el);
};

var log = function log(message) {
  console.log(message);
};

var PlayPause = /*#__PURE__*/function () {
  function PlayPause() {
    _classCallCheck(this, PlayPause);

    this.playbackState = "pause";
    this.clickEvents();
    this.keyboardEvents();
  }

  _createClass(PlayPause, [{
    key: "notify",
    value: function notify(prop, value) {
      if (prop === "playbackState") {
        if (value === "play") {
          find(".play-pause").text("Pause");
        } else {
          find(".play-pause").text("Play");
        }

        proxy_Clock.update();
      }
    }
  }, {
    key: "clickEvents",
    value: function clickEvents() {
      var _this = this;

      find(".play-pause").on("click", function (e) {
        _this.toggle();
      });
    }
  }, {
    key: "keyboardEvents",
    value: function keyboardEvents() {
      var _this2 = this;

      $(document).on("keypress", function (e) {
        if (e.keyCode === 32) {
          _this2.toggle();
        }
      });
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (proxy_PlayPause.playbackState === "play") {
        proxy_PlayPause.playbackState = "pause";
      } else {
        proxy_PlayPause.playbackState = "play";
      }
    }
  }]);

  return PlayPause;
}();

var Clock = /*#__PURE__*/function () {
  function Clock() {
    _classCallCheck(this, Clock);

    this.time = moment().format("hh:mm:ss");
    this.direction = "forward";
    this.speedMultiplier = 1;
    this.timeouts = [];
    this.clickEvents();
    find(".direction .forward").addClass("active");
  }

  _createClass(Clock, [{
    key: "clickEvents",
    value: function clickEvents() {
      find(".faster").on("click", function () {
        proxy_Clock.speedMultiplier = proxy_Clock.speedMultiplier * 2;
      });
      find(".slower").on("click", function () {
        proxy_Clock.speedMultiplier = proxy_Clock.speedMultiplier / 2;
      });
      find(".reset").on("click", function () {
        proxy_Clock.speedMultiplier = 1;
      });
      find(".direction .backward").on("click", function () {
        proxy_Clock.direction = "backward";
      });
      find(".direction .forward").on("click", function () {
        proxy_Clock.direction = "forward";
      });
    }
  }, {
    key: "notify",
    value: function notify(prop, value) {
      if (prop === "time") {
        find(".clock").text(proxy_Clock.time);
      }

      if (prop === "speedMultiplier") {
        find(".mult-speed").text("".concat(proxy_Clock.speedMultiplier, "x"));
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
  }, {
    key: "update",
    value: function update() {
      var counter = 0;
      var timer = null;

      function updateTime() {
        if (proxy_Clock.direction === "forward") {
          proxy_Clock.time = moment(proxy_Clock.time, "hh:mm:ss").add(1, "s").format("hh:mm:ss");
        } else {
          proxy_Clock.time = moment(proxy_Clock.time, "hh:mm:ss").subtract(1, "s").format("hh:mm:ss");
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

      var loop = function loop() {
        // Clear all timeouts before creating another one
        proxy_Clock.timeouts.forEach(function (timeout) {
          clearTimeout(timeout);
        });
        timer = setTimeout(function () {
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
  }]);

  return Clock;
}();

var Timepicker = /*#__PURE__*/function () {
  function Timepicker() {
    _classCallCheck(this, Timepicker);

    this.clickEvents();
  }

  _createClass(Timepicker, [{
    key: "clickEvents",
    value: function clickEvents() {
      find(".go").click(function () {
        proxy_Clock.time = moment($("input").val(), "HH:mm A").format("hh:mm:00");
        proxy_PlayPause.playbackState = "play";
      });
    }
  }]);

  return Timepicker;
}(); // Sentry that guards the getting/setting of PlayPause object properties
// Provides a centralized location to validate getting and setting of properties
// ... as well as a centralized location for adding necessary logic
// Initially checking for property in the target catches spelling errors as well


var sentry_PlayPause = {
  get: function get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      throw "Prop ".concat(prop, " is invalid.");
    }
  },
  set: function set(target, prop, value) {
    if (prop in target) {
      if (prop === "playbackState") {
        if (value.toLowerCase() !== "play" && value.toLowerCase() !== "pause") {
          throw "Unable to set playbackState property. Value must be PLAY or PAUSE";
        }
      }
    } else {
      throw "Prop ".concat(prop, " is invalid.");
    } // Set/update target property


    target[prop] = value; // Post update/set executions

    target.notify(prop, value); // Success

    return true;
  }
};
var sentry_Clock = {
  get: function get(target, prop) {
    if (prop in target) {
      if (prop === "time") {
        if (target[prop].toLowerCase() === "invalid date") {
          throw "Time: ".concat(target[prop], " is not a valid time");
        }
      }

      return target[prop];
    } else {
      throw "Prop ".concat(prop, " is invalid.");
    }
  },
  set: function set(target, prop, value) {
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
      throw "Prop ".concat(prop, " is invalid.");
    } // Set/update target property


    target[prop] = value; // Post update/set executions

    target.notify(prop, value); // Success

    return true;
  }
}; // Proxies

var proxy_PlayPause = new Proxy(new PlayPause(), sentry_PlayPause);
var proxy_Clock = new Proxy(new Clock(), sentry_Clock);
var timepicker = new Timepicker();
},{}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50026" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.js.map