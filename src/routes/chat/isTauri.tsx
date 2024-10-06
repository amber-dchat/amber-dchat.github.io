declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

export const isTauri = window.__TAURI_INTERNALS__ != undefined;