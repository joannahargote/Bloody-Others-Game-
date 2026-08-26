(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};

  function roll(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function chance(percent) {
    return Math.random() * 100 < percent;
  }

  function pickWeighted(outcomes) {
    var total = 0;
    var index;
    for (index = 0; index < outcomes.length; index += 1) {
      total += outcomes[index].weight;
    }

    var cursor = Math.random() * total;
    var running = 0;
    for (index = 0; index < outcomes.length; index += 1) {
      running += outcomes[index].weight;
      if (cursor <= running) {
        return outcomes[index];
      }
    }
    return outcomes[outcomes.length - 1];
  }

  function combatRoll() {
    var value = Math.random() * 100;
    if (value < 10) {
      return "miss";
    }
    if (value < 25) {
      return "critical";
    }
    if (value < 30) {
      return "special";
    }
    return "hit";
  }

  BO.random = {
    roll: roll,
    chance: chance,
    pickWeighted: pickWeighted,
    combatRoll: combatRoll
  };
}());
