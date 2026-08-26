(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};
  var allScenes = []
    .concat(BO.stage1Scenes || [])
    .concat(BO.stage2Scenes || [])
    .concat(BO.stage3Scenes || [])
    .concat(BO.stage4Scenes || [])
    .concat(BO.stage5Scenes || [])
    .map(function (scene) {
      return Object.assign({
        stage: "",
        transition: null,
        effects: null,
        requirements: null,
        randomEvents: null,
        combat: null,
        deathConditions: null,
        flags: null,
        next: null
      }, scene);
    });

  var byId = {};
  allScenes.forEach(function (scene) {
    byId[scene.id] = scene;
  });

  BO.scenes = {
    all: allScenes,
    byId: byId
  };
}());
