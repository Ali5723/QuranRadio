import streamManager from "../services/streamManager";

export function useStream() {
  return {
    connected: streamManager.connected,
    playing: streamManager.playing,
    reconnecting: streamManager.reconnecting,
    silent: streamManager.silent,

    start: (url) => streamManager.start(url),
    stop: () => streamManager.stop(),
  };
}
