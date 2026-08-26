(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};
  var IMAGE_PATH = "assets/images/scene-atlas.png";
  var ROW_HEIGHT = 100 / 6;
  var sceneMap = {};

  function addScene(sceneId, x, y, width, height) {
    sceneMap[sceneId] = {
      image: IMAGE_PATH,
      x: x,
      y: y,
      width: width,
      height: height
    };
  }

  function addEightColumnRows() {
    var index;
    var row;
    var col;
    for (index = 1; index <= 40; index += 1) {
      row = Math.floor((index - 1) / 8);
      col = (index - 1) % 8;
      addScene(
        "scene" + String(index).padStart(2, "0"),
        col * 12.5,
        row * ROW_HEIGHT,
        12.5,
        ROW_HEIGHT
      );
    }
  }

  function addFinalRowScenes() {
    addScene("scene41", 0, ROW_HEIGHT * 5, 10, ROW_HEIGHT);
    addScene("scene42", 10, ROW_HEIGHT * 5, 10, ROW_HEIGHT);
  }

  function getSceneArt(sceneId) {
    return sceneMap[sceneId] || null;
  }

  addEightColumnRows();
  addFinalRowScenes();

  BO.sceneAtlas = {
    imagePath: IMAGE_PATH,
    getSceneArt: getSceneArt
  };
}());
