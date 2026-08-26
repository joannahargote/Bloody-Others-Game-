(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};
  var DEFAULT_ACTIONS = [
    { id: "attack", label: "Attack" },
    { id: "defend", label: "Defend" },
    { id: "run", label: "Run" },
    { id: "item", label: "Use Item" }
  ];

  function cloneEnemy(enemy) {
    return JSON.parse(JSON.stringify(enemy));
  }

  function cloneActions(actions) {
    return JSON.parse(JSON.stringify(actions || DEFAULT_ACTIONS));
  }

  function createSession(config) {
    return {
      enemy: cloneEnemy(config.enemy),
      config: config,
      actions: cloneActions(config.actions),
      guard: false,
      specialUsed: false,
      turn: 1,
      log: [config.introText || ("A " + config.enemy.name + " steps into your path.")]
    };
  }

  function addLog(session, text) {
    session.log.unshift(text);
    session.log = session.log.slice(0, 6);
  }

  function applyInjury(state, session, preferred) {
    var injuryPool = preferred || session.config.injuryPool || ["Bruised ribs", "Wounded arm", "Wounded leg"];
    if (!state.injury) {
      state.injury = injuryPool[BO.random.roll(0, injuryPool.length - 1)];
      addLog(session, "You suffer " + state.injury.toLowerCase() + ".");
    }
  }

  function startBleeding(state, session) {
    if (!state.bleeding) {
      state.bleeding = true;
      addLog(session, "You start bleeding.");
    }
  }

  function applyBleedingTick(state, session) {
    if (!state.bleeding) {
      return;
    }
    state.health = Math.max(0, state.health - 2);
    addLog(session, "Blood loss costs you 2 HP.");
  }

  function setDeathCause(state, text) {
    state.deathCause = text;
  }

  function accuracyPenalty(state, mode) {
    if (state.injury === "Wounded arm" && (mode === "attack" || mode === "shoot")) {
      return 10;
    }
    if (state.injury === "Wounded leg" && mode === "run") {
      return 15;
    }
    return 0;
  }

  function buildAction(action) {
    if (!action) {
      return null;
    }
    return action;
  }

  function getAction(session, actionId) {
    return buildAction(session.actions.filter(function (entry) {
      return entry.id === actionId;
    })[0]);
  }

  function consumeAmmo(state, session) {
    if (state.ammo <= 0) {
      addLog(session, "The chamber clicks empty.");
      return false;
    }
    state.ammo -= 1;
    return true;
  }

  function enemyAttack(state, session) {
    var result = BO.random.combatRoll();
    var damage = Math.max(1, session.enemy.attack - state.defense + BO.random.roll(0, 4));

    if (session.guard) {
      damage = Math.max(0, damage - 6);
      session.guard = false;
    }

    if (result === "miss") {
      addLog(session, session.enemy.name + " misses.");
      return;
    }

    if (result === "critical") {
      damage += 8;
      if (BO.random.chance(55)) {
        applyInjury(state, session);
      }
      if (BO.random.chance(45)) {
        startBleeding(state, session);
      }
    }

    if (result === "special") {
      if (session.config.enemyWeapon === "firearm") {
        damage = Math.max(0, damage - 6);
        addLog(session, session.enemy.name + "'s weapon jams for a heartbeat.");
      } else {
        damage += 2;
        addLog(session, session.enemy.name + " drives you into the wall.");
      }
    }

    state.health = Math.max(0, state.health - damage);
    addLog(session, session.enemy.name + " hits you for " + damage + ".");
    if (state.health <= 0) {
      setDeathCause(state, session.config.deathCause || (session.enemy.name + " finishes what the fight started."));
    }
  }

  function playerAttack(state, session) {
    var result = BO.random.combatRoll();
    if (BO.random.chance(accuracyPenalty(state, "attack"))) {
      result = "miss";
    }
    var damage = Math.max(1, state.attack - session.enemy.defense + BO.random.roll(0, 5));

    if (result === "miss") {
      addLog(session, "You miss.");
      enemyAttack(state, session);
      return;
    }

    if (result === "critical") {
      damage += 10;
      addLog(session, "Critical hit.");
    }

    if (result === "special") {
      damage += 2;
      addLog(session, "The strike lands, but something about it feels wrong.");
    }

    session.enemy.health = Math.max(0, session.enemy.health - damage);
    addLog(session, "You deal " + damage + " damage.");

    if (session.enemy.health > 0) {
      enemyAttack(state, session);
    }
  }

  function playerShoot(state, session) {
    var result;
    var damage;
    if (!consumeAmmo(state, session)) {
      enemyAttack(state, session);
      return;
    }

    result = BO.random.combatRoll();
    if (BO.random.chance(accuracyPenalty(state, "shoot"))) {
      result = "miss";
    }
    damage = Math.max(4, state.attack + 8 - session.enemy.defense + BO.random.roll(0, 6));

    if (result === "miss") {
      addLog(session, "The shot misses and tears into the dark.");
      enemyAttack(state, session);
      return;
    }

    if (result === "critical") {
      damage += 12;
      addLog(session, "The shot lands hard.");
    }

    if (result === "special") {
      if (BO.random.chance(50)) {
        addLog(session, "The weapon jams after the shot.");
      } else {
        addLog(session, "The recoil nearly tears the weapon from your grip.");
        applyInjury(state, session, ["Wounded arm"]);
      }
    }

    session.enemy.health = Math.max(0, session.enemy.health - damage);
    addLog(session, "You fire and deal " + damage + " damage.");
    if (session.enemy.health > 0) {
      enemyAttack(state, session);
    }
  }

  function defendTurn(state, session) {
    session.guard = true;
    addLog(session, "You brace for the impact.");
    enemyAttack(state, session);
  }

  function runTurn(state, session) {
    var chance = (session.config.runChance || 45) - accuracyPenalty(state, "run");
    if (BO.random.chance(chance)) {
      addLog(session, "You get away.");
      return "escaped";
    }
    addLog(session, "You fail to break away.");
    enemyAttack(state, session);
    return "stuck";
  }

  function useItemTurn(state, session) {
    var kitIndex = state.inventory.indexOf("Medical Kit");
    if (kitIndex === -1) {
      addLog(session, "You have no Medical Kit.");
      enemyAttack(state, session);
      return;
    }

    state.inventory.splice(kitIndex, 1);
    state.health = Math.min(100, state.health + 35);
    state.bleeding = false;
    addLog(session, "You patch yourself up and recover 35 HP.");
    enemyAttack(state, session);
  }

  function specialTurn(state, session) {
    var special = session.config.specialAction;
    var succeeded;
    var damage;

    if (!special) {
      addLog(session, "There is nothing unexpected left to try.");
      enemyAttack(state, session);
      return;
    }

    if (special.once && session.specialUsed) {
      addLog(session, "That opening is gone.");
      enemyAttack(state, session);
      return;
    }

    session.specialUsed = true;
    succeeded = BO.random.chance(special.successRate || 60);
    if (state.injury === "Wounded leg" && special.mobility) {
      succeeded = BO.random.chance(Math.max(15, (special.successRate || 60) - 20));
    }

    if (succeeded) {
      damage = special.damage ? Math.max(0, special.damage + BO.random.roll(0, 4) - session.enemy.defense) : 0;
      if (damage > 0) {
        session.enemy.health = Math.max(0, session.enemy.health - damage);
        addLog(session, special.successText + " (" + damage + " damage)");
      } else {
        addLog(session, special.successText);
      }
      if (special.onSuccess) {
        special.onSuccess(state);
      }
      if (session.enemy.health > 0 && !special.skipEnemyTurn) {
        enemyAttack(state, session);
      }
      return;
    }

    if (special.selfDamage) {
      state.health = Math.max(0, state.health - special.selfDamage);
    }
    if (special.injuryOnFail) {
      applyInjury(state, session, special.injuryOnFail);
    }
    addLog(session, special.failText);
    if (!special.skipEnemyTurnOnFail) {
      enemyAttack(state, session);
    }
    if (state.health <= 0) {
      setDeathCause(state, special.failDeathCause || session.config.deathCause || "You pushed too hard and paid for it.");
    }
  }

  BO.combat = {
    createSession: createSession,
    getAction: getAction,
    perform: function (action, state, session) {
      var configuredAction = getAction(session, action);

      // The UI normally prevents unavailable actions, but combat data can also
      // be reached from saved games or debug tools. Never charge the player a
      // turn for an action they cannot actually use.
      if (!configuredAction) {
        addLog(session, "That combat action is unavailable.");
        return;
      }
      if (configuredAction.requiresItem && state.inventory.indexOf(configuredAction.requiresItem) === -1) {
        addLog(session, "You do not have the item needed for that action.");
        return;
      }
      if (configuredAction.requiresAmmo && state.ammo < configuredAction.requiresAmmo) {
        addLog(session, "You do not have enough ammunition.");
        return;
      }

      applyBleedingTick(state, session);
      if (state.health <= 0) {
        setDeathCause(state, "You bled out before the fight ended.");
        return "death";
      }

      if (action === "attack") {
        playerAttack(state, session);
        return;
      }
      if (action === "shoot") {
        playerShoot(state, session);
        return;
      }
      if (action === "defend") {
        defendTurn(state, session);
        return;
      }
      if (action === "special") {
        specialTurn(state, session);
        return;
      }
      if (action === "run") {
        return runTurn(state, session);
      }
      if (action === "item") {
        useItemTurn(state, session);
      }
    }
  };
}());
