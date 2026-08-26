(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};

  BO.stage5Scenes = [
    {
      id: "scene37",
      stage: "Stage 5",
      title: "The Room",
      location: "The Room",
      transition: "There are no guards here, no weapons, and no visible exit. Only a table, two chairs, and the end of every attempt to explain this place as politics alone.",
      text: [
        "The Philosopher sits opposite you as if he has been waiting for a conversation instead of a chase.",
        "He asks why you came. You answer, \"I wanted to get away.\"",
        "\"From what?\" he asks."
      ],
      choices: [
        { text: "Say you wanted to escape your family.", effects: { guilt: 1, truth: 1 }, next: "scene38" },
        { text: "Say you wanted to escape authority.", effects: { fear: 1, violence: 1 }, next: "scene38" },
        { text: "Say you do not know anymore.", effects: { humanity: 1, reality: 1 }, next: "scene38" }
      ]
    },
    {
      id: "scene38",
      stage: "Stage 5",
      title: "The Question",
      location: "The Room",
      transition: null,
      text: [
        "The Philosopher asks, \"Who are the Others?\"",
        "\"Everyone you are not,\" he says. \"And who are you?\""
      ],
      choices: [
        { text: "The government.", effects: { truth: 1 }, next: "scene39" },
        { text: "The rebels.", effects: { trust: -1, guilt: 1 }, next: "scene39" },
        { text: "Everyone I fear.", effects: { fear: 1, reality: 1 }, next: "scene39" },
        { text: "I am one of them.", effects: { reality: 2, truth: 1 }, next: "scene39" }
      ]
    },
    {
      id: "scene39",
      stage: "Stage 5",
      title: "The Book",
      location: "The Room",
      themeClass: "glitch-active",
      transition: "The black book is already open to the chapter describing this conversation.",
      text: [
        "The final pages contain your entire journey.",
        "The next paragraph describes your reaction before you have it. You stop reading."
      ],
      choices: [
        { text: "Read ahead anyway.", effects: { truth: 2, reality: 2, anomalies: 1, flags: { readFinalBook: true } }, next: "scene40" },
        { text: "Shut the book and keep your hands off it.", effects: { humanity: 1, fear: 1 }, next: "scene40" }
      ]
    },
    {
      id: "scene40",
      stage: "Stage 5",
      title: "Write Your Ending",
      location: "The Room",
      themeClass: "flicker-active",
      transition: "A pen appears. The page waits with the patience of something that has already seen your answer.",
      text: [
        "You may write only one line.",
        "When the ink settles, another sentence appears beneath it: \"You already chose this.\""
      ],
      choices: [
        { text: "I AM FREE", effects: { truth: 1, flags: { wroteFree: true } }, next: "scene41" },
        { text: "I AM SORRY", effects: { humanity: 2, guilt: -1, flags: { wroteSorry: true } }, next: "scene41" },
        { text: "I AM GOD", effects: { truth: 2, reality: 1, flags: { wroteGod: true } }, next: "scene41" },
        { text: "WRITE NOTHING", effects: { fear: 1, anomalies: 1, flags: { loopMarked: true } }, next: "scene41" }
      ]
    },
    {
      id: "scene41",
      stage: "Stage 5",
      title: "The Door",
      location: "The Room",
      transition: "A door appears in the wall, but staying still does not prevent the final scene from reaching you.",
      text: [
        "Whatever you choose now changes the tone of the ending, not the fact that it is coming."
      ],
      choices: [
        { text: "Open the door.", effects: { reality: 1 }, next: "scene42" },
        { text: "Remain in the room.", effects: { fear: 1 }, next: "scene42" },
        { text: "Destroy the book.", effects: { violence: 1, guilt: 1 }, next: "scene42" },
        { text: "Sit down and wait.", effects: { humanity: 1 }, next: "scene42" }
      ]
    },
    {
      id: "scene42",
      stage: "Stage 5",
      title: "The Table",
      location: "The Room",
      transition: "Across from you sits yourself.",
      text: [
        "\"You thought this was a country,\" the Doppelganger says.",
        "\"You thought they were chasing you. You thought you were choosing.\"",
        "After a long pause, he asks the only version of the question that still matters: \"Weren't you?\""
      ],
      choices: [
        { text: "Accept what the road made of you.", effects: { guilt: 1, fear: 1 }, next: "ENDING" },
        { text: "Insist that one choice was still yours.", effects: { humanity: 1, trust: 1 }, next: "ENDING" }
      ]
    }
  ];
}());
