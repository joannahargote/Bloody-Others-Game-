(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};
  var state = BO.state.loadGame();
  var settings = BO.state.loadSettings();
  var unlockedEndings = BO.state.loadUnlockedEndings();
  var combatSession = null;
  var deathSceneCheckpoint = state.currentScene || "scene01";
  var sceneCheckpointState = BO.state.clone(state);
  var sceneTimers = [];
  var pendingSceneBridge = "";

  var refs = {
    menuScreen: document.getElementById("menuScreen"),
    gameScreen: document.getElementById("gameScreen"),
    menuButton: document.getElementById("menuButton"),
    continueButton: document.getElementById("continueButton"),
    newGameButton: document.getElementById("newGameButton"),
    loadButton: document.getElementById("loadButton"),
    endingsButton: document.getElementById("endingsButton"),
    settingsButton: document.getElementById("settingsButton"),
    menuHint: document.getElementById("menuHint"),
    menuFooterLeft: document.getElementById("menuFooterLeft"),
    menuFooterRight: document.getElementById("menuFooterRight"),
    sceneTitle: document.getElementById("sceneTitle"),
    sceneLocation: document.getElementById("sceneLocation"),
    sceneArt: document.getElementById("sceneArt"),
    sceneText: document.getElementById("sceneText"),
    eventText: document.getElementById("eventText"),
    choiceList: document.getElementById("choiceList"),
    inventoryList: document.getElementById("inventoryList"),
    clueList: document.getElementById("clueList"),
    healthValue: document.getElementById("healthValue"),
    petraLabel: document.getElementById("petraLabel"),
    petraStatus: document.getElementById("petraStatus"),
    deathCount: document.getElementById("deathCount"),
    ammoValue: document.getElementById("ammoValue"),
    injuryValue: document.getElementById("injuryValue"),
    saveButton: document.getElementById("saveButton"),
    restartButton: document.getElementById("restartButton"),
    openSettingsButton: document.getElementById("openSettingsButton"),
    settingsDialog: document.getElementById("settingsDialog"),
    textSpeedSelect: document.getElementById("textSpeedSelect"),
    reducedMotionToggle: document.getElementById("reducedMotionToggle"),
    skipAnimationsToggle: document.getElementById("skipAnimationsToggle"),
    soundEnabledToggle: document.getElementById("soundEnabledToggle"),
    hapticsEnabledToggle: document.getElementById("hapticsEnabledToggle"),
    applySettingsButton: document.getElementById("applySettingsButton"),
    resetSaveButton: document.getElementById("resetSaveButton"),
    deathDialog: document.getElementById("deathDialog"),
    deathCauseText: document.getElementById("deathCauseText"),
    restartSceneButton: document.getElementById("restartSceneButton"),
    restartStoryButton: document.getElementById("restartStoryButton"),
    endingsDialog: document.getElementById("endingsDialog"),
    closeEndingsButton: document.getElementById("closeEndingsButton"),
    endingsProgressText: document.getElementById("endingsProgressText"),
    endingsList: document.getElementById("endingsList"),
    endingPreviewStatus: document.getElementById("endingPreviewStatus"),
    endingPreviewTitle: document.getElementById("endingPreviewTitle"),
    endingPreviewText: document.getElementById("endingPreviewText"),
    debugPanel: document.getElementById("debugPanel"),
    debugItemsButton: document.getElementById("debugItemsButton"),
    debugScenesButton: document.getElementById("debugScenesButton"),
    debugCombatButton: document.getElementById("debugCombatButton"),
    debugEndingButton: document.getElementById("debugEndingButton"),
    debugResetButton: document.getElementById("debugResetButton")
  };

  function clearSceneTimers() {
    while (sceneTimers.length) {
      clearTimeout(sceneTimers.pop());
    }
  }

  function cloneEffects(effects) {
    return effects ? BO.state.clone(effects) : {};
  }

  function mergeOutcome(baseChoice, outcome) {
    var merged = {};
    var key;

    for (key in baseChoice) {
      if (Object.prototype.hasOwnProperty.call(baseChoice, key) && key !== "random") {
        merged[key] = baseChoice[key];
      }
    }

    for (key in outcome) {
      if (Object.prototype.hasOwnProperty.call(outcome, key)) {
        if (key === "effects") {
          merged.effects = combineEffects(baseChoice.effects, outcome.effects);
        } else {
          merged[key] = outcome[key];
        }
      }
    }

    return merged;
  }

  function combineEffects(base, extra) {
    var result = cloneEffects(base);
    var key;

    if (!extra) {
      return result;
    }

    Object.keys(extra).forEach(function (name) {
      if (name === "relationships" || name === "flags") {
        result[name] = result[name] || {};
        Object.keys(extra[name]).forEach(function (nestedKey) {
          if (name === "relationships") {
            result[name][nestedKey] = (result[name][nestedKey] || 0) + extra[name][nestedKey];
          } else {
            result[name][nestedKey] = extra[name][nestedKey];
          }
        });
        return;
      }

      if (name === "addItem" || name === "removeItem" || name === "addClue") {
        result[name] = extra[name];
        return;
      }

      result[name] = (result[name] || 0) + extra[name];
    });

    return result;
  }

  function showScreen(name) {
    document.body.classList.toggle("menu-screen-active", name === "menu");
    document.body.classList.toggle("game-screen-active", name === "game");
    refs.menuScreen.classList.toggle("active", name === "menu");
    refs.gameScreen.classList.toggle("active", name === "game");
    refs.menuButton.classList.toggle("hidden", name !== "game");
  }

  function clearPresentationModes() {
    document.body.classList.remove(
      "glitch-active",
      "flicker-active",
      "late-game-active",
      "final-room-active",
      "secret-transition-active",
      "secret-glitch-phase",
      "birthday-active"
    );
  }

  function saveState() {
    BO.state.saveGame(state);
    updateMenuState("Game saved on this device.");
  }

  function updateMenuState(message) {
    var hasSave = BO.state.hasSave();
    var unlockedCount = unlockedEndings.length;
    refs.continueButton.disabled = !hasSave;
    refs.loadButton.disabled = !hasSave;
    refs.endingsButton.textContent = "Endings (" + unlockedCount + "/7)";
    refs.menuFooterLeft.textContent = BO.secretEnding.menuFooterLeft;
    refs.menuFooterRight.textContent = BO.state.hasSecretBirthdayUnlocked() ? BO.secretEnding.menuFooterRightUnlocked : BO.secretEnding.menuFooterRightDefault;
    refs.menuHint.textContent = message || "";
  }

  function applySettings() {
    document.body.classList.toggle("reduced-motion", settings.reducedMotion || settings.skipAnimations);
    refs.textSpeedSelect.value = settings.textSpeed;
    refs.reducedMotionToggle.checked = settings.reducedMotion;
    refs.skipAnimationsToggle.checked = settings.skipAnimations;
    refs.soundEnabledToggle.checked = settings.soundEnabled !== false;
    refs.hapticsEnabledToggle.checked = settings.hapticsEnabled !== false;
    if (BO.feedback) {
      BO.feedback.configure(settings);
    }
    BO.state.saveSettings(settings);
  }

  function healthClamp() {
    state.health = Math.max(0, Math.min(100, state.health));
  }

  function ensureToken(list, value) {
    if (value && list.indexOf(value) === -1) {
      list.push(value);
    }
  }

  function applyEffects(effects) {
    if (!effects) {
      return;
    }

    Object.keys(effects).forEach(function (key) {
      if (key === "relationships") {
        Object.keys(effects.relationships).forEach(function (name) {
          state.relationships[name] = (state.relationships[name] || 0) + effects.relationships[name];
        });
        return;
      }

      if (key === "flags") {
        Object.keys(effects.flags).forEach(function (flagName) {
          if (typeof effects.flags[flagName] === "number") {
            state.flags[flagName] = (state.flags[flagName] || 0) + effects.flags[flagName];
          } else {
            state.flags[flagName] = effects.flags[flagName];
          }
        });
        return;
      }

      if (key === "addItem") {
        ensureToken(state.inventory, effects.addItem);
        return;
      }

      if (key === "setInventory") {
        state.inventory = effects.setInventory.slice();
        if (state.inventory.indexOf("Pistol") === -1) {
          state.ammo = 0;
        }
        return;
      }

      if (key === "removeItem") {
        state.inventory = state.inventory.filter(function (item) {
          return item !== effects.removeItem;
        });
        if (effects.removeItem === "Pistol") {
          state.ammo = 0;
        }
        return;
      }

      if (key === "addClue") {
        ensureToken(state.clues, effects.addClue);
        return;
      }

      if (key === "setClues") {
        state.clues = effects.setClues.slice();
        return;
      }

      if (typeof effects[key] === "number" && typeof state[key] === "number") {
        state[key] += effects[key];
      }
    });

    healthClamp();
  }

  function getPetraLabel() {
    if (state.relationships.petra >= 6) {
      return "Loyal";
    }
    if (state.relationships.petra >= 2) {
      return "Trusting";
    }
    if (state.relationships.petra >= -1) {
      return "Uncertain";
    }
    if (state.relationships.petra >= -5) {
      return "Suspicious";
    }
    return "Hostile";
  }

  function knowsPetra() {
    return state.visitedScenes.indexOf("scene10") !== -1 || state.currentScene === "scene10";
  }

  function renderTokens(target, values, emptyLabel) {
    target.innerHTML = "";
    if (!values.length) {
      var empty = document.createElement("li");
      empty.textContent = emptyLabel;
      target.appendChild(empty);
      return;
    }

    values.forEach(function (value) {
      var token = document.createElement("li");
      token.textContent = value;
      target.appendChild(token);
    });
  }

  function refreshHud() {
    refs.healthValue.textContent = String(state.health);
    refs.petraLabel.textContent = knowsPetra() ? "Petra" : "[REDACTED]";
    refs.petraStatus.textContent = knowsPetra() ? getPetraLabel() : "Unknown";
    refs.deathCount.textContent = String(state.deaths);
    refs.ammoValue.textContent = String(state.ammo);
    refs.injuryValue.textContent = state.bleeding ? ((state.injury || "Injured") + " / Bleeding") : (state.injury || "Steady");
    renderTokens(refs.inventoryList, state.inventory, "Empty");
    renderTokens(refs.clueList, state.clues, "None");
  }

  function narrationDelay() {
    if (settings.skipAnimations || settings.reducedMotion) {
      return 0;
    }
    if (settings.textSpeed === "fast") {
      return 120;
    }
    if (settings.textSpeed === "slow") {
      return 420;
    }
    return 240;
  }

  function setBodyTheme(scene) {
    clearPresentationModes();
    if (scene.themeClass) {
      scene.themeClass.split(" ").forEach(function (themeClass) {
        document.body.classList.add(themeClass);
      });
    }
    if (scene.stage === "Stage 4" || scene.stage === "Stage 5") {
      document.body.classList.add("late-game-active");
    }
    if (scene.stage === "Stage 5") {
      document.body.classList.add("final-room-active");
    }
  }

  function resolveSceneText(scene) {
    return typeof scene.text === "function" ? scene.text(state) : scene.text;
  }

  function resolveSceneTransition(scene) {
    return typeof scene.transition === "function" ? scene.transition(state) : scene.transition;
  }

  function resolveSceneChoices(scene) {
    var choices = typeof scene.choices === "function" ? scene.choices(state) : scene.choices;
    return choices || [];
  }

  function buildSceneBridge(fromSceneId, nextSceneId, choice) {
    var fromScene = BO.scenes.byId[fromSceneId];
    var nextScene = BO.scenes.byId[nextSceneId];
    var effects = choice && choice.effects ? choice.effects : {};
    var destination;

    if (!fromScene || !nextScene || fromSceneId === nextSceneId) {
      return "";
    }

    destination = nextScene.location || nextScene.title;
    if (effects.violence) {
      return "The violence of your decision follows you out of " + fromScene.location + " and into " + destination + ".";
    }
    if (effects.fear) {
      return "Fear keeps you moving as " + fromScene.location + " falls behind and " + destination + " draws near.";
    }
    if (effects.truth || effects.reality || effects.anomalies) {
      return "What you have learned changes the road between " + fromScene.location + " and " + destination + ".";
    }
    if (effects.humanity || effects.trust || effects.relationships) {
      return "You carry that small human choice with you from " + fromScene.location + " toward " + destination + ".";
    }
    return "The choice is made. " + fromScene.location + " recedes, and the road carries you toward " + destination + ".";
  }

  function recordChoice(sceneId, text) {
    state.choicesMade.push(sceneId + ": " + text);
    if (state.choicesMade.length > 100) {
      state.choicesMade = state.choicesMade.slice(-100);
    }
  }

  function checkRequirements(choice) {
    var requires = choice.requires;
    if (!requires) {
      return true;
    }
    if (requires.item && state.inventory.indexOf(requires.item) === -1) {
      return false;
    }
    if (requires.minAmmo && state.ammo < requires.minAmmo) {
      return false;
    }
    if (requires.flag && !state.flags[requires.flag]) {
      return false;
    }
    if (requires.notFlag && state.flags[requires.notFlag]) {
      return false;
    }
    if (requires.minHealth && state.health < requires.minHealth) {
      return false;
    }
    return true;
  }

  function checkCondition(choice) {
    return !choice.condition || choice.condition(state);
  }

  function setEventText(text) {
    refs.eventText.textContent = text || "";
  }

  function getEndingOrdinal(endingId) {
    var index = BO.endings.ordered.findIndex(function (ending) {
      return ending.id === endingId;
    });
    return index === -1 ? null : index + 1;
  }

  function isEndingUnlocked(endingId) {
    return unlockedEndings.indexOf(endingId) !== -1;
  }

  function renderEndingPreview(endingId) {
    var ending = BO.endings.getById(endingId);
    var unlocked = ending ? isEndingUnlocked(endingId) : false;
    var number = getEndingOrdinal(endingId);

    refs.endingPreviewText.innerHTML = "";

    if (!ending || !number) {
      refs.endingPreviewStatus.textContent = "Select an ending.";
      refs.endingPreviewTitle.textContent = "The road splits seven ways.";
      appendSceneParagraph("Unlocked endings appear here so players can revisit their final message.", "", refs.endingPreviewText);
      return;
    }

    if (!unlocked) {
      refs.endingPreviewStatus.textContent = "Ending " + number + " / 7 locked";
      refs.endingPreviewTitle.textContent = "Ending " + number;
      appendSceneParagraph("Keep playing to unlock this ending and reveal its final page.", "", refs.endingPreviewText);
      return;
    }

    refs.endingPreviewStatus.textContent = "Ending " + number + " / 7 unlocked";
    refs.endingPreviewTitle.textContent = ending.title;
    ending.text.forEach(function (line) {
      appendSceneParagraph(line, "", refs.endingPreviewText);
    });
  }

  function renderEndingsGallery(selectedEndingId) {
    var previewId = selectedEndingId || unlockedEndings[0] || (BO.endings.ordered[0] && BO.endings.ordered[0].id);

    refs.endingsProgressText.textContent = unlockedEndings.length + " of 7 unlocked";
    refs.endingsList.innerHTML = "";

    BO.endings.ordered.forEach(function (ending, index) {
      var unlocked = isEndingUnlocked(ending.id);
      var button = document.createElement("button");
      var title = document.createElement("span");
      var meta = document.createElement("span");

      button.type = "button";
      button.className = "ending-entry " + (unlocked ? "unlocked" : "locked");
      button.setAttribute("aria-pressed", previewId === ending.id ? "true" : "false");
      button.addEventListener("click", function () {
        renderEndingsGallery(ending.id);
      });

      title.className = "ending-entry-title";
      title.textContent = "Ending " + (index + 1) + " - " + (unlocked ? ending.title : "Locked");

      meta.className = "ending-entry-meta";
      meta.textContent = unlocked ? "Unlocked" : "Not yet found";

      button.appendChild(title);
      button.appendChild(meta);
      refs.endingsList.appendChild(button);
    });

    renderEndingPreview(previewId);
  }

  function openEndingsDialog() {
    renderEndingsGallery("");
    refs.endingsDialog.showModal();
  }

  function updateSceneArt(sceneId) {
    var art = BO.sceneAtlas ? BO.sceneAtlas.getSceneArt(sceneId) : null;
    var posX;
    var posY;
    var sizeX;
    var sizeY;

    if (!art) {
      refs.sceneArt.classList.add("hidden");
      refs.sceneArt.style.backgroundImage = "";
      return;
    }

    sizeX = (100 / art.width) * 100;
    sizeY = (100 / art.height) * 100;
    posX = art.width >= 100 ? 0 : (art.x / (100 - art.width)) * 100;
    posY = art.height >= 100 ? 0 : (art.y / (100 - art.height)) * 100;

    refs.sceneArt.style.backgroundImage = "linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.35)), url('" + art.image + "')";
    refs.sceneArt.style.backgroundSize = sizeX + "% " + sizeY + "%";
    refs.sceneArt.style.backgroundPosition = posX + "% " + posY + "%";
    refs.sceneArt.classList.remove("hidden");
  }

  function setSecretScreenTitle(title, location) {
    refs.sceneTitle.textContent = title || "";
    refs.sceneLocation.textContent = location || "";
  }

  function clearStoryPanel() {
    clearSceneTimers();
    clearPanelContent();
  }

  function clearPanelContent() {
    refs.sceneText.innerHTML = "";
    refs.choiceList.innerHTML = "";
    refs.eventText.textContent = "";
  }

  function appendSceneParagraph(text, className, container) {
    var paragraph = document.createElement("p");
    paragraph.textContent = text || "";
    if (className) {
      paragraph.className = className;
    }
    (container || refs.sceneText).appendChild(paragraph);
  }

  function sequenceDelay(ms) {
    if (settings.skipAnimations || settings.reducedMotion) {
      return Math.min(ms, 220);
    }
    return ms;
  }

  function scheduleStep(callback, delay, offset) {
    var timer = setTimeout(callback, offset + sequenceDelay(delay));
    sceneTimers.push(timer);
    return offset + sequenceDelay(delay);
  }

  function returnToTitle(message) {
    clearPresentationModes();
    showScreen("menu");
    updateMenuState(message || "Back at the title screen.");
  }

  function renderSecretBirthdayButton() {
    refs.choiceList.innerHTML = "";
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = "RETURN TO TITLE";
    button.addEventListener("click", function () {
      returnToTitle("Secret epilogue unlocked.");
    });
    refs.choiceList.appendChild(button);
  }

  function renderSecretBirthdayDedication() {
    var container = document.createElement("div");
    container.className = "birthday-dedication";
    BO.secretEnding.dedication.forEach(function (line) {
      appendSceneParagraph(line, "", container);
    });
    refs.sceneText.appendChild(container);
  }

  function renderSecretBirthdaySequence() {
    var offset = 0;

    BO.state.unlockSecretBirthday();
    state.flags.secretBirthdayUnlocked = true;
    saveState();

    clearStoryPanel();
    showScreen("game");
    clearPresentationModes();
    document.body.classList.add("secret-transition-active");
    setSecretScreenTitle("", "");

    offset = scheduleStep(function () {
      clearPanelContent();
      appendSceneParagraph(BO.secretEnding.transition.exceptThisOne, "revealed");
    }, 3000, offset);

    offset = scheduleStep(function () {
      clearPanelContent();
    }, 1200, offset);

    offset = scheduleStep(function () {
      document.body.classList.add("secret-glitch-phase");
      setSecretScreenTitle(BO.secretEnding.transition.titleFull, "");
    }, 800, offset);

    offset = scheduleStep(function () {
      setSecretScreenTitle(BO.secretEnding.transition.titleOthers, "");
    }, 1000, offset);

    offset = scheduleStep(function () {
      document.body.classList.remove("secret-glitch-phase");
      setSecretScreenTitle(BO.secretEnding.transition.titleForA, "");
    }, 900, offset);

    offset = scheduleStep(function () {
      clearPanelContent();
      clearPresentationModes();
      document.body.classList.add("birthday-active");
      setSecretScreenTitle("FOR A.", "Secret Epilogue");
    }, 1200, offset);

    BO.secretEnding.sequence.forEach(function (line, index) {
      var wait = 900;
      if (index === 1 || index === 2 || index === 8) {
        wait = 1200;
      }
      if (index === 9) {
        wait = 1700;
      }
      offset = scheduleStep(function () {
        appendSceneParagraph(line, "revealed");
      }, wait, offset);
    });

    if (BO.secretEnding.includeJoke) {
      offset = scheduleStep(function () {
        appendSceneParagraph("", "");
      }, 900, offset);

      BO.secretEnding.joke.forEach(function (line, index) {
        offset = scheduleStep(function () {
          appendSceneParagraph(line, index >= 2 ? "revealed" : "");
        }, 850, offset);
      });
    }

    offset = scheduleStep(function () {
      renderSecretBirthdayDedication();
      renderSecretBirthdayButton();
      updateMenuState("Secret epilogue unlocked.");
    }, 1200, offset);
  }

  function handleDeath() {
    combatSession = null;
    if (BO.feedback) {
      BO.feedback.signal("danger");
    }
    state.deaths += 1;
    saveState();
    refreshHud();
    refs.deathCauseText.textContent = "Cause: " + (state.deathCause || "The road ended here.");
    refs.deathDialog.showModal();
  }

  function renderChoiceButtons(choices) {
    refs.choiceList.innerHTML = "";

    choices.forEach(function (choice) {
      if (!checkCondition(choice)) {
        return;
      }

      if (!checkRequirements(choice)) {
        if (choice.disabledText) {
          var note = document.createElement("p");
          note.className = "choice-note";
          note.textContent = choice.disabledText;
          refs.choiceList.appendChild(note);
        }
        return;
      }

      var button = document.createElement("button");
      button.type = "button";
      button.textContent = choice.text;
      button.addEventListener("click", function () {
        makeChoice(choice);
      });
      refs.choiceList.appendChild(button);
    });
  }

  function renderCombat() {
    var actions = combatSession.actions || [];
    refs.choiceList.innerHTML = "";
    setEventText(combatSession.log.join(" "));

    actions.forEach(function (entry) {
      var button = document.createElement("button");
      var action = BO.combat.getAction(combatSession, entry.id);
      var blocked = false;

      if (!action) {
        return;
      }
      button.type = "button";
      if (action.requiresItem && state.inventory.indexOf(action.requiresItem) === -1) {
        blocked = true;
      }
      if (action.requiresAmmo && state.ammo < action.requiresAmmo) {
        blocked = true;
      }
      if (action.id === "item" && state.inventory.indexOf("Medical Kit") === -1) {
        blocked = true;
      }
      button.textContent = action.label + " — " + combatSession.enemy.name + " HP: " + combatSession.enemy.health;
      button.disabled = blocked;
      button.addEventListener("click", function () {
        resolveCombatAction(action.id);
      });
      refs.choiceList.appendChild(button);
    });
  }

  function resolveCombatAction(action) {
    if (BO.feedback) {
      BO.feedback.signal("combat");
    }
    var result = BO.combat.perform(action, state, combatSession);
    var nextSceneId;
    healthClamp();
    refreshHud();

    if (state.health <= 0) {
      setEventText(combatSession.log.join(" "));
      handleDeath();
      return;
    }

    if (result === "escaped") {
      if (BO.feedback) {
        BO.feedback.signal("success");
      }
      applyEffects(combatSession.config.onEscape);
      nextSceneId = combatSession.config.runNext || state.currentScene;
      pendingSceneBridge = buildSceneBridge(state.currentScene, nextSceneId, { effects: combatSession.config.onEscape || { fear: 1 } });
      state.lastSafeScene = nextSceneId;
      saveState();
      combatSession = null;
      renderScene(nextSceneId);
      return;
    }

    if (combatSession.enemy.health <= 0) {
      if (BO.feedback) {
        BO.feedback.signal("success");
      }
      applyEffects(combatSession.config.onVictory);
      nextSceneId = combatSession.config.victoryNext || state.currentScene;
      pendingSceneBridge = buildSceneBridge(state.currentScene, nextSceneId, { effects: combatSession.config.onVictory || { violence: 1 } });
      state.lastSafeScene = nextSceneId;
      combatSession = null;
      saveState();
      renderScene(nextSceneId);
      return;
    }

    saveState();
    renderCombat();
  }

  function resolveRandom(choice) {
    if (!choice.random) {
      return choice;
    }
    return mergeOutcome(choice, BO.random.pickWeighted(choice.random.outcomes));
  }

  function goToScene(nextSceneId, message) {
    if (nextSceneId === "ENDING") {
      renderEnding();
      return;
    }
    renderScene(nextSceneId || state.currentScene);
  }

  function makeChoice(choice) {
    var resolvedChoice = resolveRandom(choice);
    if (BO.feedback) {
      BO.feedback.signal(resolvedChoice.combat ? "combat" : "choice");
    }
    recordChoice(state.currentScene, resolvedChoice.text);
    applyEffects(resolvedChoice.effects);

    if (state.health <= 0) {
      handleDeath();
      return;
    }

    if (resolvedChoice.combat) {
      combatSession = BO.combat.createSession(resolvedChoice.combat);
      state.currentScene = state.currentScene;
      saveState();
      refreshHud();
      renderCombat();
      return;
    }

    if (resolvedChoice.resultText) {
      setEventText(resolvedChoice.resultText);
    } else {
      setEventText("");
    }

    saveState();
    pendingSceneBridge = buildSceneBridge(state.currentScene, resolvedChoice.next, resolvedChoice);
    goToScene(resolvedChoice.next, resolvedChoice.resultText);
  }

  function renderNarrative(lines, onDone) {
    clearSceneTimers();
    refs.sceneText.innerHTML = "";
    var delay = narrationDelay();

    if (!delay) {
      lines.forEach(function (line) {
        var paragraph = document.createElement("p");
        paragraph.textContent = line;
        refs.sceneText.appendChild(paragraph);
      });
      onDone();
      return;
    }

    lines.forEach(function (line, index) {
      var timer = setTimeout(function () {
        var paragraph = document.createElement("p");
        paragraph.textContent = line;
        paragraph.className = "revealed";
        refs.sceneText.appendChild(paragraph);

        if (index === lines.length - 1) {
          onDone();
        }
      }, delay * index);
      sceneTimers.push(timer);
    });
  }

  function renderEnding() {
    var ending = BO.endings.determineEnding(state);
    ensureToken(state.endingsSeen, ending.id);
    unlockedEndings = BO.state.unlockEnding(ending.id);
    state.currentScene = "scene42";
    document.body.classList.add("late-game-active", "final-room-active");
    if (ending.id === "ending07") {
      document.body.classList.add("glitch-active");
    }
    saveState();
    refs.sceneTitle.textContent = ending.title;
    refs.sceneLocation.textContent = "Ending";
    setEventText("The road closes around your ending.");
    renderNarrative(ending.text, function () {
      if (ending.id === "ending07") {
        renderSecretBirthdaySequence();
        return;
      }
        refs.sceneArt.classList.add("hidden");
        refs.choiceList.innerHTML = "";

      var restartButton = document.createElement("button");
      restartButton.type = "button";
      restartButton.textContent = "Restart Story";
      restartButton.addEventListener("click", function () {
        startNewGame(true);
      });

      var menuButton = document.createElement("button");
      menuButton.type = "button";
      menuButton.textContent = "Return to Menu";
      menuButton.addEventListener("click", function () {
        returnToTitle("Ending unlocked: " + ending.title);
      });

      refs.choiceList.appendChild(restartButton);
      refs.choiceList.appendChild(menuButton);
    });
    refreshHud();
  }

  function renderScene(sceneId) {
    var scene = BO.scenes.byId[sceneId];
    var lines;
    var choices;
    var transition;

    if (!scene) {
      return;
    }

    combatSession = null;
    state.currentScene = sceneId;
    if (state.visitedScenes.indexOf(sceneId) === -1) {
      state.visitedScenes.push(sceneId);
    }
    deathSceneCheckpoint = sceneId;
    state.lastSafeScene = sceneId;
    state.deathCause = "The road ended here.";
    sceneCheckpointState = BO.state.clone(state);
    saveState();
    refreshHud();
    setBodyTheme(scene);

    showScreen("game");
    refs.sceneTitle.textContent = scene.title;
    refs.sceneLocation.textContent = scene.location;
    updateSceneArt(sceneId);
    setEventText("");

    lines = resolveSceneText(scene);
    if (pendingSceneBridge) {
      lines = [pendingSceneBridge].concat(lines);
      pendingSceneBridge = "";
    }
    transition = resolveSceneTransition(scene);
    if (transition) {
      if (Array.isArray(transition)) {
        lines = lines.concat(transition);
      } else {
        lines = lines.concat([transition]);
      }
    }
    choices = resolveSceneChoices(scene);

    renderNarrative(lines, function () {
      renderChoiceButtons(choices);
    });
  }

  function startNewGame(skipConfirm) {
    if (!skipConfirm && !window.confirm("Start a new game? Current progress on this device will be replaced.")) {
      return;
    }
    state = BO.state.createInitialState();
    deathSceneCheckpoint = state.currentScene;
    saveState();
    refreshHud();
    renderScene(state.currentScene);
  }

  function loadGame() {
    state = BO.state.loadGame();
    deathSceneCheckpoint = state.currentScene || "scene01";
    refreshHud();
    renderScene(state.currentScene || "scene01");
  }

  function restartCurrentScene() {
    refs.deathDialog.close();
    state = BO.state.clone(sceneCheckpointState);
    saveState();
    refreshHud();
    renderScene(deathSceneCheckpoint || state.currentScene || "scene01");
  }

  function restartStory() {
    refs.deathDialog.close();
    startNewGame(true);
  }

  function openSettings() {
    applySettings();
    refs.settingsDialog.showModal();
  }

  function closeToMenu() {
    returnToTitle("Game anchored in local storage.");
  }

  function debugAdjustStat(stat) {
    state[stat] += 1;
    saveState();
    refreshHud();
    setEventText(stat + " increased.");
  }

  function setupDebug() {
    document.querySelectorAll("[data-debug-stat]").forEach(function (button) {
      button.addEventListener("click", function () {
        debugAdjustStat(button.getAttribute("data-debug-stat"));
      });
    });

    refs.debugItemsButton.addEventListener("click", function () {
      ["Envelope", "Book", "Photograph", "Key", "Police Badge", "Knife", "Pistol", "Medical Kit"].forEach(function (item) {
        ensureToken(state.inventory, item);
      });
      saveState();
      refreshHud();
      setEventText("All items granted.");
    });

    refs.debugScenesButton.addEventListener("click", function () {
      state.visitedScenes = BO.scenes.all.map(function (scene) {
        return scene.id;
      });
      saveState();
      setEventText("All scenes unlocked.");
    });

    refs.debugCombatButton.addEventListener("click", function () {
      combatSession = BO.combat.createSession({
        enemy: { name: "Debug Hunter", health: 40, attack: 10, defense: 4 },
        introText: "Debug combat started.",
        victoryNext: state.currentScene,
        runNext: state.currentScene
      });
      renderCombat();
    });

    refs.debugEndingButton.addEventListener("click", function () {
      renderEnding();
    });

    refs.debugResetButton.addEventListener("click", function () {
      state = BO.state.createInitialState();
      saveState();
      refreshHud();
      renderScene(state.currentScene);
    });

    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        refs.debugPanel.classList.toggle("hidden");
      }
    });
  }

  function bindEvents() {
    refs.continueButton.addEventListener("click", loadGame);
    refs.loadButton.addEventListener("click", loadGame);
    refs.newGameButton.addEventListener("click", function () {
      startNewGame(false);
    });
    refs.settingsButton.addEventListener("click", openSettings);
    refs.endingsButton.addEventListener("click", openEndingsDialog);
    refs.openSettingsButton.addEventListener("click", openSettings);
    refs.menuButton.addEventListener("click", closeToMenu);
    refs.saveButton.addEventListener("click", function () {
      saveState();
      setEventText("Progress saved.");
    });
    refs.restartButton.addEventListener("click", function () {
      if (window.confirm("Restart the whole story?")) {
        startNewGame(true);
      }
    });
    refs.applySettingsButton.addEventListener("click", function () {
      settings = {
        textSpeed: refs.textSpeedSelect.value,
        reducedMotion: refs.reducedMotionToggle.checked,
        skipAnimations: refs.skipAnimationsToggle.checked,
        soundEnabled: refs.soundEnabledToggle.checked,
        hapticsEnabled: refs.hapticsEnabledToggle.checked
      };
      applySettings();
      setEventText("Settings applied.");
    });
    refs.resetSaveButton.addEventListener("click", function () {
      if (!window.confirm("Delete local save data for Bloody Others?")) {
        return;
      }
      BO.state.resetGame();
      unlockedEndings = [];
      state = BO.state.createInitialState();
      sceneCheckpointState = BO.state.clone(state);
      refreshHud();
      updateMenuState("Save data reset.");
      refs.settingsDialog.close();
      returnToTitle("Save data reset.");
    });
    refs.restartSceneButton.addEventListener("click", restartCurrentScene);
    refs.restartStoryButton.addEventListener("click", restartStory);
    refs.closeEndingsButton.addEventListener("click", function () {
      refs.endingsDialog.close();
    });
  }

  applySettings();
  bindEvents();
  setupDebug();
  refreshHud();
  showScreen("menu");
  updateMenuState("");
}());
