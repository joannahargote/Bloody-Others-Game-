(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};

  BO.stage2Scenes = [
    {
      id: "scene09",
      stage: "Stage 2",
      title: "The Stranger",
      location: "Border Town",
      transition: "Eventually the dark becomes streetlamps. You enter a town where nobody asks where you came from.",
      text: [
        "A stranger approaches, looks at you once, and says, \"You're late.\"",
        "When you ask what he means, he walks away. Across the street, soldiers watch without intervening."
      ],
      choices: [
        { text: "Follow the stranger.", effects: { truth: 1 }, next: "scene10" },
        { text: "Hide and watch the soldiers instead.", effects: { fear: 1 }, next: "scene10" }
      ]
    },
    {
      id: "scene10",
      stage: "Stage 2",
      title: "Petra",
      location: "Border Town",
      transition: "Before the soldiers can close in, Petra intercepts you and forces you down a side street.",
      text: [
        "Petra says government agents are already searching for you.",
        "You tell her you do not know why. She says nobody crosses the border accidentally.",
        "\"Then you picked the worst place to run to,\" she says."
      ],
      choices: [
        { text: "Tell Petra the truth as best you can.", effects: { trust: 1, relationships: { petra: 2 } }, next: "scene11" },
        { text: "Lie about why you crossed.", effects: { fear: 1, trust: -1, relationships: { petra: -2 } }, next: "scene11" },
        { text: "Demand to know why she cares.", effects: { violence: 1, relationships: { petra: -1 } }, next: "scene11" }
      ]
    },
    {
      id: "scene11",
      stage: "Stage 2",
      title: "Safe House",
      location: "Rebel Safe House",
      transition: "Petra takes you through locked doors and shuttered rooms to a safe house where other people have been waiting too long to trust anyone.",
      text: [
        "Inside you meet Egon, nervous and eager, and Eckhard, older and calm enough to be frightening.",
        "Petra explains that the government controls movement, restricts information, and disappears people for questioning.",
        "When you ask why they do not simply leave, Eckhard replies, \"Leave where?\""
      ],
      choices: [
        { text: "Listen carefully.", effects: { truth: 1, relationships: { petra: 1 } }, next: "scene12" },
        { text: "Question everything they say.", effects: { fear: 1, trust: -1 }, next: "scene12" },
        { text: "Focus on Egon's reaction instead.", effects: { humanity: 1, relationships: { egon: 1 } }, next: "scene12" }
      ]
    },
    {
      id: "scene12",
      stage: "Stage 2",
      title: "The Book",
      location: "Rebel Safe House",
      transition: "Later, Eckhard lets you examine the black book more closely.",
      text: [
        "Several passages describe situations that resemble your journey too closely to dismiss.",
        "You assume someone wrote about you. Eckhard only says, \"Perhaps you are simply beginning to notice.\""
      ],
      choices: [
        {
          text: "Read the passages about yourself.",
          effects: { addItem: "Book", truth: 2, reality: 1, anomalies: 1, addClue: "The black book describes your journey.", flags: { readBook: true } },
          next: "scene13"
        },
        {
          text: "Close the book and study Eckhard instead.",
          effects: { addItem: "Book", truth: 1, relationships: { philosopher: 1 } },
          next: "scene13"
        }
      ]
    },
    {
      id: "scene13",
      stage: "Stage 2",
      title: "The Dead Man",
      location: "Rebel Safe House",
      transition: "That night you wake alone, with the taste of metal in your mouth and no idea how long you have been standing.",
      text: [
        "A dead stranger lies inside the safe house.",
        "There is blood on the floor. There is blood on your hands. You cannot remember what happened.",
        "Near the body are signs that could mean almost anything: a knife, a badge, a photograph, a key, a blank sheet of paper."
      ],
      choices: [
        { text: "Tell Petra immediately.", effects: { humanity: 1, trust: 1 }, next: "scene14" },
        { text: "Inspect the corpse first.", effects: { truth: 1, addClue: "The dead stranger carried official identification.", addItem: "Police Badge" }, next: "scene14" },
        { text: "Hide the body as best you can.", effects: { fear: 1, guilt: 2 }, next: "scene14" },
        { text: "Try to leave before anyone wakes.", effects: { fear: 2, relationships: { petra: -1 } }, next: "scene14" }
      ]
    },
    {
      id: "scene14",
      stage: "Stage 2",
      title: "You Did This",
      location: "Rebel Safe House",
      transition: "Petra finds the body before dawn and confronts you in the narrow hall beside the kitchen.",
      text: [
        "\"You were the only person awake,\" Petra says.",
        "You insist you did not kill him.",
        "\"Then someone wanted you to think you did,\" she replies."
      ],
      choices: [
        { text: "Insist on your innocence.", effects: { truth: 1, fear: 1 }, next: "scene15" },
        { text: "Help Petra prepare for whoever comes next.", effects: { humanity: 1, trust: 1, relationships: { petra: 1 } }, next: "scene15" },
        { text: "Accuse the rebels of using you.", effects: { violence: 1, relationships: { petra: -2 } }, next: "scene15" }
      ]
    },
    {
      id: "scene15",
      stage: "Stage 2",
      title: "First Fight",
      location: "Rebel Safe House",
      transition: "Government forces hit the safe house before the argument has time to end.",
      text: [
        "Glass bursts inward. Egon panics. Petra drags you behind a doorway while Eckhard reaches for the book.",
        "The fight is short, loud, and confused in exactly the ways real violence always is."
      ],
      choices: [
        {
          text: "Defend Petra and fight back.",
          combat: {
            enemy: { name: "Safe House Attacker", health: 46, attack: 12, defense: 4 },
            introText: "Boots hammer the stairs. The first attacker crashes through the kitchen door.",
            enemyWeapon: "firearm",
            victoryNext: "scene16",
            runNext: "scene16",
            deathCause: "The safe house attack turns you into another body on the floorboards.",
            actions: [
              { id: "attack", label: "Punch Attacker" },
              { id: "shoot", label: "Shoot", requiresItem: "Pistol", requiresAmmo: 1 },
              { id: "defend", label: "Defend Petra" },
              { id: "special", label: "Rescue Egon" },
              { id: "run", label: "Flee Through Back Hall" },
              { id: "item", label: "Use Medical Kit", requiresItem: "Medical Kit" }
            ],
            specialAction: {
              successRate: 62,
              damage: 8,
              mobility: true,
              successText: "You drag Egon clear as the attacker overcommits.",
              failText: "You reach for Egon too late and catch the worst of the return fire.",
              selfDamage: 8,
              injuryOnFail: ["Bruised ribs", "Wounded leg"],
              once: false
            },
            onVictory: { violence: 1, trust: 1, relationships: { petra: 1 }, flags: { wonFirstFight: true } },
            onEscape: { fear: 2, relationships: { petra: 1 } }
          }
        },
        {
          text: "Rescue Egon and flee through the back.",
          effects: { humanity: 1, relationships: { egon: 2 }, health: -8, flags: { egonSaved: true } },
          next: "scene16"
        },
        {
          text: "Grab a weapon and run for the alley.",
          effects: { addItem: "Pistol", ammo: 4, fear: 1, violence: 1, health: -6 },
          next: "scene16"
        }
      ]
    },
    {
      id: "scene16",
      stage: "Stage 2",
      title: "Roadblock",
      location: "Edge of Town",
      transition: [
        "The survivors escape through back alleys toward an abandoned vehicle while the safe house burns behind them.",
        "Eckhard is wounded and tells you to take the book. The group separates in the confusion, and you hit a military roadblock at the edge of the forest."
      ],
      text: [
        "Rifles cover the road. A spotlight sweeps across broken concrete and the hood of the abandoned car.",
        "You can sneak, fight, or gamble that surrender means anything here."
      ],
      choices: [
        {
          text: "Sneak through the roadblock.",
          random: {
            outcomes: [
              { weight: 70, next: "scene17", effects: { truth: 1 }, resultText: "You slip through the concrete shadows and reach the far ditch." },
              { weight: 30, next: "scene17", effects: { health: -12, fear: 1 }, resultText: "A rifle cracks. You still escape, but not untouched." }
            ]
          }
        },
        {
          text: "Fight through with the pistol.",
          requires: { item: "Pistol", minAmmo: 1 },
          effects: { violence: 2, guilt: 1, health: -14 },
          next: "scene17"
        },
        {
          text: "Surrender until an opening appears, then run.",
          effects: { fear: 2, health: -10 },
          next: "scene17"
        }
      ]
    },
    {
      id: "scene17",
      stage: "Stage 2",
      title: "The Prisoner",
      location: "Forest Edge",
      transition: "On the far side of the roadblock, one wounded soldier ends up in your hands instead of theirs.",
      text: [
        "Petra wants answers before the patrol regroups.",
        "Under threat, the soldier finally says, \"You're not supposed to be here.\"",
        "When pressed, he adds, \"Because you already were.\""
      ],
      choices: [
        { text: "Threaten him for more information.", effects: { violence: 1, guilt: 1, truth: 1 }, next: "scene18" },
        { text: "Refuse to harm him and listen instead.", effects: { humanity: 2, truth: 1 }, next: "scene18" },
        { text: "Strike him when he refuses to explain.", effects: { violence: 2, guilt: 2, relationships: { petra: -1 } }, next: "scene18" }
      ]
    },
    {
      id: "scene18",
      stage: "Stage 2",
      title: "The Line",
      location: "Forest Edge",
      transition: "By the time dawn reaches the trees, the prisoner is gone from your story and the survivors are no longer moving as one group.",
      text: [
        "This is the point where your choices stop feeling theoretical.",
        "Petra wants information. You want a reason. The forest waits for both of you to become something harder."
      ],
      choices: [
        { text: "Participate in Petra's intimidation.", effects: { violence: 1, guilt: 1, relationships: { petra: 1 } }, next: "scene19" },
        { text: "Refuse and walk into the trees instead.", effects: { humanity: 1, trust: -1 }, next: "scene19" },
        { text: "Keep asking what the soldier meant.", effects: { truth: 2, anomalies: 1, addClue: "The soldier claimed you had already been here." }, next: "scene19" }
      ]
    }
  ];
}());
