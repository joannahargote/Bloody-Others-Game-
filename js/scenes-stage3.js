(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};

  BO.stage3Scenes = [
    {
      id: "scene19",
      stage: "Stage 3",
      title: "Alone",
      location: "Forest",
      transition: "At some point the others stop answering you, and the forest becomes the only thing still willing to speak.",
      text: [
        "You hear Petra. Then your father. Then the truck driver. Then your own voice.",
        "You cannot tell which sounds are real, only that all of them seem to know where you are going."
      ],
      choices: [
        { text: "Follow Petra's voice.", effects: { trust: 1, fear: 1 }, next: "scene20" },
        { text: "Follow your own voice instead.", effects: { reality: 1, anomalies: 1 }, next: "scene20" },
        { text: "Ignore every voice and keep moving.", effects: { truth: 1 }, next: "scene20" }
      ]
    },
    {
      id: "scene20",
      stage: "Stage 3",
      title: "The Cabin",
      location: "Forest",
      transition: "The cabin appears without warning, as if the forest forgot it was supposed to be impossible.",
      text: function (state) {
        return [
          "Inside are a bed, a table, a mirror, and a book.",
          state.inventory.indexOf("Book") === -1 ? "The book on the table is the same black book you thought you lost." : "The book on the table is the same one you have already carried, as though both versions are equally valid."
        ];
      },
      choices: [
        { text: "Examine the table and the book.", effects: { truth: 1, anomalies: 1, addItem: "Book", flags: { readBook: true } }, next: "scene21" },
        { text: "Search for supplies before anything changes.", effects: { addItem: "Medical Kit", humanity: 1 }, next: "scene21" },
        { text: "Go directly to the mirror.", effects: { fear: 1, reality: 1 }, next: "scene21" }
      ]
    },
    {
      id: "scene21",
      stage: "Stage 3",
      title: "The Mirror",
      location: "Forest",
      themeClass: "glitch-active",
      transition: "The reflection delays by half a breath, then refuses to sync with you at all.",
      text: [
        "The reflection asks, \"Why did you leave?\"",
        "Whatever answer forms in your head, the reflection smiles first and says, \"You always say that.\""
      ],
      choices: [
        { text: "Answer honestly.", effects: { truth: 1, reality: 1, anomalies: 1, flags: { mirrorAccepted: true } }, next: "scene22" },
        { text: "Lie to your own reflection.", effects: { fear: 1, trust: -1, anomalies: 1, flags: { mirrorAccepted: true } }, next: "scene22" },
        { text: "Strike the mirror and leave.", effects: { violence: 1, health: -5, anomalies: 1 }, next: "scene22" }
      ]
    },
    {
      id: "scene22",
      stage: "Stage 3",
      title: "The Hunter",
      location: "Forest",
      transition: "The Hunter steps out only after you have already convinced yourself you are alone.",
      text: [
        "He is stronger, calmer, and less surprised to see you than he should be.",
        "\"You have crossed a line,\" he says. \"Now prove you meant to.\""
      ],
      choices: [
        {
          text: "Fight the Hunter.",
          combat: {
            enemy: { name: "The Hunter", health: 58, attack: 14, defense: 6 },
            introText: "The Hunter moves like someone rehearsing a scene he has survived before.",
            enemyWeapon: "firearm",
            victoryNext: "scene23",
            runNext: "scene23",
            runChance: 35,
            deathCause: "The Hunter catches up and ends the chase in the trees.",
            actions: [
              { id: "attack", label: "Punch" },
              { id: "shoot", label: "Shoot", requiresItem: "Pistol", requiresAmmo: 1 },
              { id: "defend", label: "Block" },
              { id: "special", label: "Use Environment" },
              { id: "run", label: "Run" },
              { id: "item", label: "Use Medical Kit", requiresItem: "Medical Kit" }
            ],
            specialAction: {
              successRate: 58,
              damage: 12,
              mobility: true,
              successText: "You use the terrain to break his rhythm and slam him into the roots.",
              failText: "You misjudge the ground and the Hunter punishes the mistake immediately.",
              selfDamage: 10,
              injuryOnFail: ["Wounded leg", "Bruised ribs"],
              once: false
            },
            onVictory: { violence: 1, truth: 1, flags: { hunterDefeated: true } },
            onEscape: { fear: 2, health: -8 }
          }
        },
        {
          text: "Use the environment instead of meeting him head-on.",
          effects: { truth: 1, health: -6, flags: { hunterDefeated: true } },
          next: "scene23"
        },
        {
          text: "Run and survive however you can.",
          effects: { fear: 2, health: -10 },
          next: "scene23"
        }
      ]
    },
    {
      id: "scene23",
      stage: "Stage 3",
      title: "Impossible Wound",
      location: "Forest",
      transition: "When the struggle ends, the part that makes no sense becomes impossible to ignore.",
      text: [
        "The Hunter bears an injury identical to one you remember receiving.",
        "You have no matching wound.",
        "\"We're both getting closer,\" he says before he dies or disappears."
      ],
      choices: [
        {
          text: "Study the wound.",
          effects: { truth: 2, reality: 1, anomalies: 1, addClue: "The Hunter carried your wound instead of you.", flags: { impossibleWoundSeen: true } },
          next: "scene24"
        },
        {
          text: "Walk away before it means anything.",
          effects: { fear: 1, anomalies: 1, flags: { impossibleWoundSeen: true } },
          next: "scene24"
        }
      ]
    },
    {
      id: "scene24",
      stage: "Stage 3",
      title: "The Village",
      location: "Village",
      transition: "Beyond the forest you find a village that behaves less like a place and more like an argument about your existence.",
      text: [
        "One villager says you arrived yesterday. Another says you have lived there for years. Another claims you are dangerous.",
        "A child asks why you keep coming back."
      ],
      choices: [
        { text: "Ask how many times they have seen you.", effects: { truth: 1, anomalies: 1 }, next: "scene25" },
        { text: "Ignore the contradictions and keep walking.", effects: { fear: 1 }, next: "scene25" }
      ]
    },
    {
      id: "scene25",
      stage: "Stage 3",
      title: "The Child",
      location: "Village",
      transition: null,
      text: [
        "The child looks up at you and asks, \"Are you going to kill us?\""
      ],
      choices: function (state) {
        return [
          {
            text: "Reassure the child.",
            effects: state.humanity >= 4 ?
              { humanity: 1, addItem: "Key", addClue: "The child trusted you with a key." } :
              { humanity: 1 },
            next: "scene26"
          },
          {
            text: "Threaten the child into answering.",
            effects: { violence: 1, guilt: 1, fear: 1 },
            next: "scene26"
          },
          {
            text: "Ask what they mean by \"again.\"",
            effects: { truth: 2, anomalies: 1, addClue: "The child says you are not the first one." },
            next: "scene26"
          },
          {
            text: "Ignore the child and move on.",
            effects: { fear: 1 },
            next: "scene26"
          }
        ];
      }
    },
    {
      id: "scene26",
      stage: "Stage 3",
      title: "The Bell",
      location: "Village",
      transition: "A bell rings somewhere above the square.",
      text: [
        "Every villager freezes where they stand.",
        "Only you can move. As you walk, each frozen face turns toward you at exactly the same time."
      ],
      choices: [
        { text: "Walk through the square toward them.", effects: { reality: 1, anomalies: 1, flags: { rangBell: true } }, next: "scene27" },
        { text: "Call for Petra anyway.", effects: { fear: 1, trust: 1, flags: { rangBell: true } }, next: "scene27" }
      ]
    },
    {
      id: "scene27",
      stage: "Stage 3",
      title: "The Others",
      location: "Village",
      themeClass: "glitch-active",
      transition: [
        "The villagers begin repeating, \"We are not the Others.\"",
        "Then, together: \"You are.\"",
        "Reality glitches. Cut to black."
      ],
      text: [
        "When you wake, you are on the back of a military transport.",
        "You do not remember being captured. One item remains with you because something wanted it to."
      ],
      choices: function (state) {
        var keptItem = state.flags.savedTruckItem ? [state.flags.savedTruckItem] : [];
        return [
          { text: "Keep still and wait for the city.", effects: { fear: 1, setInventory: keptItem }, next: "scene28" },
          { text: "Check which item they failed to take.", effects: { truth: 1, setInventory: keptItem }, next: "scene28" }
        ];
      }
    }
  ];
}());
