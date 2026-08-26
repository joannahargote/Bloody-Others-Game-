(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};

  var ENDINGS = {
    ending01: {
      id: "ending01",
      title: "THE ESCAPE",
      text: [
        "The road home is still dark, but it is real enough to follow.",
        "You choose the people waiting in the kitchen over the voices calling you back to the border.",
        "For the first time, leaving feels less like surrender and more like mercy."
      ]
    },
    ending02: {
      id: "ending02",
      title: "THE KILLER",
      text: [
        "You survive by becoming sharper than everyone who tried to shape you.",
        "The blood on your hands dries into a map of every name you stepped over.",
        "When you finally look up, there is nobody left to blame."
      ]
    },
    ending03: {
      id: "ending03",
      title: "THE OTHER",
      text: [
        "Fear teaches you the rituals of the people you once watched from afar.",
        "You stop knocking on doors and begin standing behind them.",
        "One day a frightened stranger sees you and knows exactly what you became."
      ]
    },
    ending04: {
      id: "ending04",
      title: "THE GOD",
      text: [
        "Truth tears through the walls of every room that ever held you.",
        "The city, the forest, the border, the house: all of it folds inward like paper.",
        "You understand the machine. You also understand that it has been waiting for you to notice."
      ]
    },
    ending05: {
      id: "ending05",
      title: "THE LOOP",
      text: [
        "The highway returns before the answer does.",
        "The same truck passes. The same smoke rises. The same choice waits in your hands.",
        "You are not sure whether this is punishment, design, or mercy."
      ]
    },
    ending06: {
      id: "ending06",
      title: "THE HUMAN",
      text: [
        "At the last table, you choose compassion with no promise that it matters.",
        "Petra remembers. The child remembers. Even the dead seem lighter for a second.",
        "The world does not heal, but you refuse to help it break any further."
      ]
    },
    ending07: {
      id: "ending07",
      title: "BLOODY OTHERS",
      text: [
        "The room empties itself until only the page, the chair, and your reflection remain.",
        "\"You kept choosing,\" the other you says.",
        "\"And I kept becoming what you chose.\"",
        "BLOODY OTHERS.",
        "OTHERS.",
        "\"There were never seven endings.\""
      ]
    }
  };
  var ENDING_ORDER = [
    ENDINGS.ending01,
    ENDINGS.ending02,
    ENDINGS.ending03,
    ENDINGS.ending04,
    ENDINGS.ending05,
    ENDINGS.ending06,
    ENDINGS.ending07
  ];

  function isTrueEndingUnlocked(state) {
    return !!(
      state.flags.inspectPhoto &&
      state.flags.readBook &&
      state.flags.impossibleWoundSeen &&
      state.flags.metDouble &&
      state.flags.choseMeInterrogation &&
      state.flags.door6Entered &&
      state.flags.loopMarked &&
      state.anomalies >= 5
    );
  }

  function determineEnding(state) {
    if (isTrueEndingUnlocked(state)) {
      return ENDINGS.ending07;
    }

    if (state.humanity >= 11) {
      return ENDINGS.ending06;
    }

    if (state.truth >= 9 && state.reality >= 8) {
      return ENDINGS.ending04;
    }

    if (state.violence >= 9 && state.guilt >= 7) {
      return ENDINGS.ending02;
    }

    if (state.fear >= 9 && state.relationships.petra <= -4) {
      return ENDINGS.ending03;
    }

    if (state.reality >= 7 || state.flags.loopMarked) {
      return ENDINGS.ending05;
    }

    return ENDINGS.ending01;
  }

  BO.endings = {
    all: ENDINGS,
    ordered: ENDING_ORDER,
    determineEnding: determineEnding,
    getById: function (endingId) {
      return ENDINGS[endingId] || null;
    }
  };
}());
