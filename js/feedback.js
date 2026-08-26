(function () {
  var BO = window.BloodyOthers = window.BloodyOthers || {};
  var audioContext = null;
  var soundEnabled = true;
  var hapticsEnabled = true;

  function getAudioContext() {
    var Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) {
      return null;
    }
    if (!audioContext) {
      audioContext = new Context();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    return audioContext;
  }

  function tone(frequency, duration, volume, type, slideTo) {
    var context;
    var oscillator;
    var gain;
    var now;

    if (!soundEnabled) {
      return;
    }
    context = getAudioContext();
    if (!context) {
      return;
    }

    now = context.currentTime;
    oscillator = context.createOscillator();
    gain = context.createGain();
    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    if (slideTo) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  function vibrate(pattern) {
    if (hapticsEnabled && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  function signal(kind) {
    if (kind === "combat") {
      tone(105, 0.09, 0.1, "square", 72);
      vibrate(22);
      return;
    }
    if (kind === "danger") {
      tone(78, 0.28, 0.13, "sawtooth", 42);
      vibrate([45, 45, 70]);
      return;
    }
    if (kind === "success") {
      tone(360, 0.08, 0.07, "sine", 520);
      window.setTimeout(function () { tone(520, 0.12, 0.06, "sine", 660); }, 75);
      vibrate([15, 35, 18]);
      return;
    }
    tone(235, 0.055, 0.055, "triangle", 285);
    vibrate(12);
  }

  BO.feedback = {
    configure: function (settings) {
      soundEnabled = settings.soundEnabled !== false;
      hapticsEnabled = settings.hapticsEnabled !== false;
    },
    signal: signal
  };
}());
