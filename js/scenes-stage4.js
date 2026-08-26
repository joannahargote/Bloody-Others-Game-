(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};

  BO.stage4Scenes = [
    {
      id: "scene28",
      stage: "Stage 4",
      title: "The City",
      location: "Capital",
      transition: "The transport enters an authoritarian capital of screens, checkpoints, demonstrations, arrests, and buildings that look recently abandoned by history itself.",
      text: [
        "You realize your face is already on wanted posters.",
        "Every screen seems able to identify you without ever learning your name."
      ],
      choices: [
        { text: "Keep your head down and watch the streets.", effects: { fear: 1, truth: 1 }, next: "scene29" },
        { text: "Study the posters more closely.", effects: { reality: 1, addClue: "The capital had your face prepared before you arrived." }, next: "scene29" }
      ]
    },
    {
      id: "scene29",
      stage: "Stage 4",
      title: "Wanted",
      location: "Capital",
      transition: null,
      text: [
        "A television report calls the unidentified suspect known only as YOU still at large.",
        "You have never given anyone your name."
      ],
      choices: [
        { text: "Keep moving before anyone notices your reaction.", effects: { fear: 1 }, next: "scene30" },
        { text: "Listen to the whole report.", effects: { truth: 1, anomalies: 1 }, next: "scene30" }
      ]
    },
    {
      id: "scene30",
      stage: "Stage 4",
      title: "The Cafe",
      location: "Capital",
      transition: "You enter a cafe to get out of sight, only to find that privacy has already been replaced by design.",
      text: [
        "A stranger sits across from you and calmly recites your journey: Petra, the truck, the forest, the choices you thought were yours.",
        "\"You keep thinking you are making decisions,\" he says."
      ],
      choices: [
        { text: "Demand to know who he is.", effects: { fear: 1, truth: 1 }, next: "scene31" },
        { text: "Stay silent and let him keep talking.", effects: { truth: 1, humanity: 1 }, next: "scene31" }
      ]
    },
    {
      id: "scene31",
      stage: "Stage 4",
      title: "The Doppelganger",
      location: "Capital",
      themeClass: "glitch-active",
      transition: "The stranger is you, or something patient enough to wear your shape.",
      text: function (state) {
        var repeatCount = state.flags.doubleLoopCount || 0;
        if (repeatCount > 0) {
          return [
            "Each movement you make is mirrored back at you.",
            "The Doppelganger is waiting for you to understand that fighting him only reproduces him."
          ];
        }
        return [
          "When you attack, he attacks. When you defend, he defends. When you run, he follows.",
          "The pattern is immediate and humiliating."
        ];
      },
      choices: function (state) {
        return [
          {
            text: "Attack him.",
            effects: { fear: 1, health: -6, flags: { doubleLoopCount: 1 } },
            next: "scene31"
          },
          {
            text: "Defend and wait him out.",
            effects: { fear: 1, flags: { doubleLoopCount: 1 } },
            next: "scene31"
          },
          {
            text: "Run for the street.",
            effects: { health: -4, fear: 1, flags: { doubleLoopCount: 1 } },
            next: "scene31"
          },
          {
            text: "Lower your hands and stop fighting.",
            effects: { truth: 2, reality: 2, anomalies: 1, flags: { metDouble: true } },
            next: "scene32"
          }
        ];
      }
    },
    {
      id: "scene32",
      stage: "Stage 4",
      title: "Police Station",
      location: "Police Custody",
      transition: "Whether by capture, surrender, or exhaustion, you end up in police custody anyway.",
      text: function (state) {
        var tone = "They treat you as a missing witness, but only until they realize how little you can explain.";
        if (state.violence >= 6) {
          tone = "They treat you as a dangerous criminal before you say a word.";
        } else if (state.truth >= 6) {
          tone = "The officials seem less hostile than confused, as if your existence has paperwork problems.";
        }
        return [
          tone,
          "The station corridors smell of wet uniforms, old electricity, and rehearsed fear."
        ];
      },
      choices: [
        { text: "Wait for the interrogation.", effects: { fear: 1 }, next: "scene33" },
        { text: "Try to escape and get dragged back.", effects: { health: -6, violence: 1 }, next: "scene33" },
        { text: "Fight the officers until they pin you down.", effects: { violence: 2, guilt: 1, health: -10 }, next: "scene33" }
      ]
    },
    {
      id: "scene33",
      stage: "Stage 4",
      title: "Interrogation",
      location: "Police Custody",
      transition: null,
      text: [
        "The interrogator asks, \"Who are the Others?\"",
        "He explains that every society defines itself by naming an outside group, then asks what happens when there is nobody left outside."
      ],
      choices: [
        { text: "The government.", effects: { truth: 1 }, next: "scene34" },
        { text: "The rebels.", effects: { guilt: 1, trust: -1 }, next: "scene34" },
        { text: "Everyone.", effects: { fear: 1, truth: 1 }, next: "scene34" },
        { text: "Me.", effects: { reality: 2, anomalies: 1, flags: { choseMeInterrogation: true } }, next: "scene34" }
      ]
    },
    {
      id: "scene34",
      stage: "Stage 4",
      title: "Television Room",
      location: "Capital",
      themeClass: "flicker-active",
      transition: "Someone leads you into a room full of screens, and the word \"surveillance\" suddenly feels too small.",
      text: [
        "The footage shows your entire journey: home, truck, checkpoint, Petra, safe house, forest, village, city.",
        "Some screens show choices before you made them."
      ],
      choices: [
        { text: "Watch until you understand less than before.", effects: { truth: 2, reality: 1, anomalies: 1, addClue: "The televisions predicted your choices." }, next: "scene35" },
        { text: "Look away and search for a way out.", effects: { fear: 1 }, next: "scene35" }
      ]
    },
    {
      id: "scene35",
      stage: "Stage 4",
      title: "Impossible Choice",
      location: "Capital",
      transition: "Two buttons appear with all the honesty the system has left.",
      text: [
        "KILL THE INTERROGATOR.",
        "DO NOT KILL THE INTERROGATOR.",
        "Both options feel like instructions pretending to be choices."
      ],
      choices: [
        { text: "KILL THE INTERROGATOR", effects: { violence: 2, guilt: 1, flags: { interrogatorDead: true } }, next: "scene36" },
        { text: "DO NOT KILL THE INTERROGATOR", effects: { fear: 1, guilt: 1, flags: { interrogatorDead: true } }, next: "scene36" }
      ]
    },
    {
      id: "scene36",
      stage: "Stage 4",
      title: "The Hallway",
      location: "Capital",
      transition: "When you escape, the hallway beyond contains every earlier location as a door and none of them lead back out.",
      text: function (state) {
        var opened = [
          state.flags.hallwayHomeOpened ? "Home" : "",
          state.flags.hallwayTruckOpened ? "Truck" : "",
          state.flags.hallwaySafeHouseOpened ? "Safe House" : "",
          state.flags.hallwayForestOpened ? "Forest" : "",
          state.flags.hallwayVillageOpened ? "Village" : "",
          state.flags.hallwayBedroomOpened ? "Bedroom" : ""
        ].filter(Boolean);
        var lines = [
          "The doors are labeled Home, Truck, Safe House, Forest, Village, Bedroom.",
          "At the end of the hall is one final door labeled 6."
        ];

        if (opened.length) {
          lines.push("You have opened: " + opened.join(", ") + ". None of them led out.");
        }
        return lines;
      },
      choices: [
        {
          text: "Open the door labeled Home.",
          condition: function (state) { return !state.flags.hallwayHomeOpened; },
          effects: { fear: 1, truth: 1, flags: { hallwayHomeOpened: true } },
          next: "scene36"
        },
        {
          text: "Open the door labeled Truck.",
          condition: function (state) { return !state.flags.hallwayTruckOpened; },
          effects: { guilt: 1, flags: { hallwayTruckOpened: true } },
          next: "scene36"
        },
        {
          text: "Open the door labeled Safe House.",
          condition: function (state) { return !state.flags.hallwaySafeHouseOpened; },
          effects: { fear: 1, relationships: { petra: 1 }, flags: { hallwaySafeHouseOpened: true } },
          next: "scene36"
        },
        {
          text: "Open the door labeled Forest.",
          condition: function (state) { return !state.flags.hallwayForestOpened; },
          effects: { truth: 1, anomalies: 1, flags: { hallwayForestOpened: true } },
          next: "scene36"
        },
        {
          text: "Open the door labeled Village.",
          condition: function (state) { return !state.flags.hallwayVillageOpened; },
          effects: { humanity: 1, flags: { hallwayVillageOpened: true } },
          next: "scene36"
        },
        {
          text: "Open the door labeled Bedroom.",
          condition: function (state) { return !state.flags.hallwayBedroomOpened; },
          effects: { reality: 1, anomalies: 1, flags: { hallwayBedroomOpened: true } },
          next: "scene36"
        },
        { text: "Ignore them all and open Door 6.", effects: { truth: 2, reality: 1, anomalies: 1, flags: { door6Entered: true } }, next: "scene37" }
      ]
    }
  ];
}());
