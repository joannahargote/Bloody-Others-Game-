(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};

  BO.stage1Scenes = [
    {
      id: "scene01",
      stage: "Stage 1",
      title: "The Room",
      location: "Home",
      transition: null,
      text: function (state) {
        return [
          "You wake before sunrise in a room that already feels too small for you.",
          "The television is playing quietly. The news describes unrest in a place you have never seen and somehow already resent.",
          state.deaths > 0 ? "The room seems to recognize you before you recognize it." : "You hear your family downstairs and tell yourself that leaving would solve everything."
        ];
      },
      choices: [
        { text: "Go downstairs.", effects: { humanity: 1 }, next: "scene02" },
        { text: "Stay in bed and listen to the television longer.", effects: { fear: 1, truth: 1 }, next: "scene02" },
        { text: "Turn off the television and sit in the dark.", effects: { reality: 1, fear: 1 }, next: "scene02" },
        { text: "Start packing and head for the door.", effects: { truth: 1, guilt: 1 }, next: "scene02" }
      ]
    },
    {
      id: "scene02",
      stage: "Stage 1",
      title: "Breakfast",
      location: "Home",
      transition: [
        "You pack only money, clothes, and one worn paperback from your shelf.",
        "You walk through the neighborhood, look back at the house once, and keep going."
      ],
      text: [
        "At breakfast your father confronts you about your future, your attitude, and the way you have been staring past your own life.",
        "He says you are wasting your opportunities and that running away will accomplish nothing.",
        "You argue, apologize, insult him, or remain silent. The result is the same: by the time the kitchen goes quiet, you are already leaving."
      ],
      choices: [
        { text: "Argue back.", effects: { fear: 1, guilt: 1 }, next: "scene03" },
        { text: "Apologize without meaning it.", effects: { humanity: 1, guilt: 1 }, next: "scene03" },
        { text: "Insult him and walk out.", effects: { violence: 1, guilt: 1 }, next: "scene03" },
        { text: "Say nothing and leave.", effects: { trust: -1, truth: 1 }, next: "scene03" }
      ]
    },
    {
      id: "scene03",
      stage: "Stage 1",
      title: "The Road",
      location: "Highway",
      transition: "Hours later, familiar streets have become fields, concrete, and the long logic of the highway.",
      randomEvents: {
        outcomes: [
          { weight: 25, resultText: "A truck stops almost immediately, as if it had been waiting for you." },
          { weight: 25, resultText: "The truck passes, disappears ahead, then returns in reverse." },
          { weight: 25, resultText: "You wait for several long minutes before headlights break the dark." },
          { weight: 25, resultText: "You nearly turn back before the truck finally appears." }
        ]
      },
      text: [
        "Traffic is sparse. The farther you walk, the less the road feels like an exit and the more it feels like a test.",
        "You consider returning home, but keep going anyway."
      ],
      choices: [
        {
          text: "Flag the truck down.",
          random: {
            outcomes: [
              { weight: 50, next: "scene04", effects: { humanity: 1 }, resultText: "The driver leans over and unlocks the passenger door." },
              { weight: 50, next: "scene04", effects: { fear: 1 }, resultText: "The truck rolls ahead, pauses, then lets you in." }
            ]
          }
        },
        {
          text: "Wait for the driver to decide first.",
          effects: { fear: 1, truth: 1 },
          next: "scene04"
        }
      ]
    },
    {
      id: "scene04",
      stage: "Stage 1",
      title: "The Truck",
      location: "Highway",
      transition: "Inside the truck, the world shrinks to the windshield, the engine, and a stranger deciding what to make of you.",
      text: [
        "The driver is friendly in the way people become when they are unsure whether pity or curiosity is more appropriate.",
        "He asks where you are going. You tell him you do not know. He laughs and says that is usually how journeys begin.",
        "He notices the paperback in your lap and asks, \"Do you know what you're reading?\""
      ],
      choices: [
        { text: "Answer honestly.", effects: { truth: 1 }, next: "scene05" },
        { text: "Lie and say it is just a school book.", effects: { fear: 1, trust: -1 }, next: "scene05" },
        { text: "Ask why he cares.", effects: { reality: 1, fear: 1 }, next: "scene05" }
      ]
    },
    {
      id: "scene05",
      stage: "Stage 1",
      title: "The Envelope",
      location: "Truck",
      transition: "As the border approaches, the driver grows quieter and keeps checking the mirrors.",
      text: [
        "He hands you a sealed envelope and says someone left it with him for \"the boy.\"",
        "If you open it, there is a photograph of you standing somewhere you have never visited and a blank sheet of paper behind it."
      ],
      choices: [
        {
          text: "Open the envelope and inspect the photograph.",
          effects: { setInventory: ["Envelope", "Photograph"], truth: 2, anomalies: 1, addClue: "The photograph shows you in an unknown place.", flags: { inspectPhoto: true, hasEnvelope: true } },
          next: "scene06"
        },
        {
          text: "Hide the envelope in your jacket.",
          effects: { addItem: "Envelope", fear: 1, flags: { hasEnvelope: true } },
          next: "scene06"
        },
        {
          text: "Return it to the driver and ask who sent it.",
          effects: { truth: 1, guilt: 1, addClue: "The driver refuses to explain the envelope." },
          next: "scene06"
        },
        {
          text: "Keep the envelope closed and ask questions.",
          effects: { truth: 1, fear: 1, addItem: "Envelope", flags: { hasEnvelope: true } },
          next: "scene06"
        }
      ]
    },
    {
      id: "scene06",
      stage: "Stage 1",
      title: "The Border",
      location: "Border",
      transition: "Floodlights sweep over barriers, cameras, and propaganda posters as the truck reaches the checkpoint.",
      text: [
        "The driver tells you not to speak.",
        "Armed soldiers approach. One boards the truck while another circles outside with a flashlight."
      ],
      choices: [
        { text: "Stay still and keep your head down.", effects: { fear: 1 }, next: "scene07" },
        { text: "Hide the envelope and book deeper in the cab.", effects: { truth: 1, fear: 1 }, next: "scene07" },
        { text: "Prepare to run if they open your door.", effects: { fear: 1, health: -4 }, next: "scene07" }
      ]
    },
    {
      id: "scene07",
      stage: "Stage 1",
      title: "The Checkpoint",
      location: "Border",
      transition: "The search becomes hostile the moment the soldiers notice the forbidden paper and the sealed envelope.",
      text: [
        "The driver tries to explain. The soldiers accuse him of transporting prohibited material.",
        "A fistfight erupts in the cramped truck doorway. Someone shouts. Someone draws a pistol."
      ],
      choices: [
        {
          text: "Stay hidden until the gunshot.",
          effects: { fear: 2, health: -10, guilt: 1, flags: { driverShot: true } },
          next: "scene08"
        },
        {
          text: "Defend the driver and shove the first soldier.",
          effects: { humanity: 1, violence: 1, health: -12, flags: { driverShot: true } },
          next: "scene08"
        },
        {
          text: "Attack the soldier before he can aim.",
          effects: { violence: 2, guilt: 1, health: -14, flags: { driverShot: true } },
          next: "scene08"
        },
        {
          text: "Run the moment the window shatters.",
          effects: { fear: 1, health: -8, flags: { driverShot: true } },
          next: "scene08"
        }
      ]
    },
    {
      id: "scene08",
      stage: "Stage 1",
      title: "Fire",
      location: "Border",
      themeClass: "flicker-active",
      transition: [
        "The truck catches fire behind you while the checkpoint dissolves into smoke, shouting, and red light.",
        "You walk for hours afterward with dirty clothes, blood on your sleeves, and the certainty that someone should still be chasing you."
      ],
      text: [
        "The shot punches through the driver. Blood spreads across his shirt.",
        "The truck window bursts outward. Flames crawl along the cab.",
        "You have time to recover only one thing before you run toward the nearest lights."
      ],
      choices: [
        {
          text: "Recover the envelope.",
          effects: { setInventory: ["Envelope"], addClue: "You saved the envelope from the fire.", flags: { savedTruckItem: "Envelope" } },
          next: "scene09"
        },
        {
          text: "Recover the black book from the cab.",
          effects: { setInventory: ["Book"], truth: 1, addClue: "You saved the black book from the fire.", flags: { savedTruckItem: "Book" } },
          next: "scene09"
        },
        {
          text: "Recover the driver's photograph.",
          effects: { setInventory: ["Photograph"], truth: 1, anomalies: 1, addClue: "You kept the photograph from the truck.", flags: { savedTruckItem: "Photograph", inspectPhoto: true } },
          next: "scene09"
        },
        {
          text: "Recover the medical supplies.",
          effects: { setInventory: ["Medical Kit"], humanity: 1, flags: { savedTruckItem: "Medical Kit" } },
          next: "scene09"
        }
      ]
    }
  ];
}());
