(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};
  var STORAGE_KEY = "bloody-others-save";
  var SETTINGS_KEY = "bloody-others-settings";
  var SECRET_BIRTHDAY_KEY = "bloodyOthersSecretBirthday";
  var ENDINGS_STORAGE_KEY = "bloody-others-endings";

  function createInitialState() {
    return {
      humanity: 0,
      fear: 0,
      violence: 0,
      truth: 0,
      guilt: 0,
      trust: 0,
      reality: 0,
      anomalies: 0,
      health: 100,
      attack: 12,
      defense: 4,
      ammo: 0,
      inventory: [],
      clues: [],
      injury: "",
      bleeding: false,
      relationships: {
        petra: 0,
        egon: 0,
        philosopher: 0
      },
      flags: {},
      currentScene: "scene01",
      lastSafeScene: "scene01",
      visitedScenes: [],
      choicesMade: [],
      endingsSeen: [],
      deathCause: "The road ended here.",
      deaths: 0
    };
  }

  function createDefaultSettings() {
    return {
      textSpeed: "normal",
      reducedMotion: false,
      skipAnimations: false
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeState(savedState) {
    var base = createInitialState();
    var merged = clone(base);
    var key;

    if (!savedState) {
      return merged;
    }

    for (key in savedState) {
      if (Object.prototype.hasOwnProperty.call(savedState, key) && key !== "relationships" && key !== "flags") {
        merged[key] = savedState[key];
      }
    }

    merged.relationships = Object.assign({}, base.relationships, savedState.relationships || {});
    merged.flags = Object.assign({}, base.flags, savedState.flags || {});
    merged.inventory = Array.isArray(savedState.inventory) ? savedState.inventory : base.inventory;
    merged.clues = Array.isArray(savedState.clues) ? savedState.clues : base.clues;
    merged.visitedScenes = Array.isArray(savedState.visitedScenes) ? savedState.visitedScenes : base.visitedScenes;
    merged.choicesMade = Array.isArray(savedState.choicesMade) ? savedState.choicesMade : base.choicesMade;
    merged.endingsSeen = Array.isArray(savedState.endingsSeen) ? savedState.endingsSeen : base.endingsSeen;
    return merged;
  }

  function mergeSettings(savedSettings) {
    return Object.assign(createDefaultSettings(), savedSettings || {});
  }

  function loadJson(key) {
    var raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadEndingIds() {
    var loaded = loadJson(ENDINGS_STORAGE_KEY);
    return Array.isArray(loaded) ? loaded : [];
  }

  function saveEndingIds(ids) {
    saveJson(ENDINGS_STORAGE_KEY, ids);
  }

  function ensureEndingId(list, endingId) {
    if (list.indexOf(endingId) === -1) {
      list.push(endingId);
    }
  }

  BO.state = {
    STORAGE_KEY: STORAGE_KEY,
    SETTINGS_KEY: SETTINGS_KEY,
    SECRET_BIRTHDAY_KEY: SECRET_BIRTHDAY_KEY,
    ENDINGS_STORAGE_KEY: ENDINGS_STORAGE_KEY,
    createInitialState: createInitialState,
    createDefaultSettings: createDefaultSettings,
    clone: clone,
    hasSave: function () {
      return !!localStorage.getItem(STORAGE_KEY);
    },
    saveGame: function (state) {
      saveJson(STORAGE_KEY, state);
    },
    loadGame: function () {
      var loaded = loadJson(STORAGE_KEY);
      return mergeState(loaded);
    },
    resetGame: function () {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ENDINGS_STORAGE_KEY);
    },
    hasSecretBirthdayUnlocked: function () {
      return localStorage.getItem(SECRET_BIRTHDAY_KEY) === "true";
    },
    unlockSecretBirthday: function () {
      localStorage.setItem(SECRET_BIRTHDAY_KEY, "true");
    },
    loadUnlockedEndings: function () {
      return loadEndingIds();
    },
    unlockEnding: function (endingId) {
      var unlocked = loadEndingIds();
      ensureEndingId(unlocked, endingId);
      saveEndingIds(unlocked);
      return unlocked;
    },
    saveSettings: function (settings) {
      saveJson(SETTINGS_KEY, settings);
    },
    loadSettings: function () {
      var loaded = loadJson(SETTINGS_KEY);
      return mergeSettings(loaded);
    }
  };
}());
