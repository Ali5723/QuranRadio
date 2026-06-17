import { ref } from "vue";

class StreamManager {
  constructor() {
    this.audio = null;
    this.url = null;
    this.reconnectDelay = 3000;
    this.silenceThreshold = 1;

    this.audioContext = null;
    this.analyser = null;
    this.monitorInterval = null;

    this.connected = ref(false);
    this.playing = ref(false);
    this.reconnecting = ref(false);
    this.silent = ref(false);
  }

  async start(url) {
    this.url = url;

    if (this.audio) {
      this.stop();
    }

    this.audio = new Audio(url);
    this.audio.crossOrigin = "anonymous";
    this.audio.preload = "auto";

    this.audio.addEventListener("playing", () => {
      this.connected.value = true;
      this.playing.value = true;
      this.reconnecting.value = false;
    });

    this.audio.addEventListener("pause", () => {
      this.playing.value = false;
    });

    // this.audio.addEventListener("error", () => {
    //   this.reconnect();
    // });

    // this.audio.addEventListener("stalled", () => {
    //   this.reconnect();
    // });

    // this.audio.addEventListener("ended", () => {
    //   this.reconnect();
    // });

    try {
      await this.audio.play();
      this.setupAudioMonitoring();
    } catch (err) {
      console.error("Playback failed:", err);
      this.reconnect();
    }
  }

  setupAudioMonitoring() {
    if (this.audioContext) {
      this.audioContext.close();
    }

    this.audioContext = new AudioContext();

    const source = this.audioContext.createMediaElementSource(this.audio);

    this.analyser = this.audioContext.createAnalyser();

    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    const data = new Uint8Array(this.analyser.frequencyBinCount);

    clearInterval(this.monitorInterval);

    this.monitorInterval = setInterval(() => {
      this.analyser.getByteFrequencyData(data);

      const avg = data.reduce((a, b) => a + b, 0) / data.length;

      const isSilent = avg < this.silenceThreshold;

      this.silent.value = isSilent;

      if (isSilent) {
        console.warn("Silent stream detected");
        this.reconnect();
      }
    }, 5000);
  }

  reconnect() {
    if (this.reconnecting.value) return;

    this.reconnecting.value = true;
    this.connected.value = false;
    this.playing.value = false;

    clearInterval(this.monitorInterval);

    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.load();
    }

    setTimeout(() => {
      this.start(this.url);
    }, this.reconnectDelay);
  }

  stop() {
    clearInterval(this.monitorInterval);

    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.load();
      this.audio = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.connected.value = false;
    this.playing.value = false;
    this.reconnecting.value = false;
    this.silent.value = false;
  }
}

export default new StreamManager();
