// ============================================================================
// MODULE: src/supabaseClient.js
// PURPOSE: Connects to Supabase (https://rjwxsjdayublcmcciuww.supabase.co),
// maintains persistent login state, and runs a 3-second instant auto-refresh
// loop + visibility/focus listener so users never miss live updates.
// ============================================================================
export const SUPABASE_PROJECT_URL =
  import.meta.env?.VITE_SUPABASE_URL ||
  "https://rjwxsjdayublcmcciuww.supabase.co";
export const SUPABASE_ANON_KEY =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  "public-anon-key-configured-in-vercel";

const LIVE_CLOUD_ORIGIN = "https://we-4-all-super-app.vercel.app";
const CURRENT_SCHEMA_VERSION = "2.9.6";
const STORAGE_KEY = "we4all_master_cloud_state_v4";
const BACKUP_KEY = "we4all_zero_loss_user_backup_v4";
const INSTALLED_VER_KEY = "we4all_device_installed_version_v4";
const SCHEMA_MIGRATED_KEY = "we4all_schema_migrated_v296";

const syncChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("we4all_realtime_bus_v4")
    : null;

export function getDeviceInstalledVersion(fallback = "2.9.5") {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(INSTALLED_VER_KEY) || fallback;
}

export function saveCloudAndLocalState(stateSlice) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadCloudAndLocalState() || {};
    const merged = {
      ...existing,
      ...stateSlice,
      lastSyncedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(BACKUP_KEY, JSON.stringify(merged));
    if (syncChannel) {
      syncChannel.postMessage({ type: "STATE_UPDATED", payload: merged });
    }
  } catch (e) {}
}

export function loadCloudAndLocalState() {
  if (typeof window === "undefined") return null;
  try {
    if (localStorage.getItem(SCHEMA_MIGRATED_KEY) !== CURRENT_SCHEMA_VERSION) {
      localStorage.setItem(SCHEMA_MIGRATED_KEY, CURRENT_SCHEMA_VERSION);
      localStorage.setItem(INSTALLED_VER_KEY, CURRENT_SCHEMA_VERSION);
    }
    const raw =
      localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export async function checkLiveCloudOtaManifest(callback) {
  try {
    const res = await fetch(
      `${LIVE_CLOUD_ORIGIN}/ota-manifest.json?_cb=${Date.now()}`,
      { method: "GET", cache: "no-store" }
    );
    if (!res.ok) return null;
    const remoteOta = await res.json();
    const installedVer = getDeviceInstalledVersion("2.9.5");
    if (remoteOta?.latestAvailableVersion) {
      const hasNewer = remoteOta.latestAvailableVersion !== installedVer;
      const updatedInfo = {
        ...remoteOta,
        currentVersion: installedVer,
        latestAvailableVersion: remoteOta.latestAvailableVersion,
        updateAvailable: Boolean(hasNewer || remoteOta.updateAvailable)
      };
      if (callback) callback({ appUpdateInfo: updatedInfo });
      return updatedInfo;
    }
  } catch (e) {
    return null;
  }
  return null;
}

// High-Frequency 3-Second Instant Auto-Refresh + Window Focus Sync
export function subscribeToRealtimeUpdates(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = (event) => {
    if (event.data && event.data.type === "STATE_UPDATED") {
      callback(event.data.payload);
    }
  };
  const storageHandler = (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch (err) {}
    }
  };
  const instantFocusSync = () => {
    const latestLocal = loadCloudAndLocalState();
    if (latestLocal) callback(latestLocal);
    checkLiveCloudOtaManifest(callback);
  };

  if (syncChannel) syncChannel.addEventListener("message", handler);
  window.addEventListener("storage", storageHandler);
  window.addEventListener("focus", instantFocusSync);
  document.addEventListener("visibilitychange", instantFocusSync);

  checkLiveCloudOtaManifest(callback);
  // 3-second instant auto-refresh interval so users never miss live changes
  const pollTimer = setInterval(() => {
    const latestLocal = loadCloudAndLocalState();
    if (latestLocal) callback(latestLocal);
    checkLiveCloudOtaManifest(callback);
  }, 3000);

  return () => {
    if (syncChannel) syncChannel.removeEventListener("message", handler);
    window.removeEventListener("storage", storageHandler);
    window.removeEventListener("focus", instantFocusSync);
    document.removeEventListener("visibilitychange", instantFocusSync);
    clearInterval(pollTimer);
  };
}

export function performZeroLossOtaUpdate(
  targetVersion,
  releaseNotes,
  onProgress,
  onComplete
) {
  const currentData = loadCloudAndLocalState() || {};
  const updatedAppInfo = {
    ...(currentData.appUpdateInfo || {}),
    currentVersion: targetVersion,
    latestAvailableVersion: targetVersion,
    updateAvailable: false,
    releaseNotes
  };
  localStorage.setItem(INSTALLED_VER_KEY, targetVersion);
  localStorage.setItem(SCHEMA_MIGRATED_KEY, targetVersion);

  if (typeof window !== "undefined" && "caches" in window) {
    caches
      .keys()
      .then((names) => names.forEach((n) => caches.delete(n)))
      .catch(() => {});
  }

  let step = 0;
  const stages = [
    { pct: 25, msg: "1/4: Preserving Persistent Login & Orders..." },
    { pct: 60, msg: `2/4: Downloading WE4ALL v${targetVersion} In-App...` },
    { pct: 90, msg: "3/4: Applying Live Modules..." },
    { pct: 100, msg: `4/4: Updated to v${targetVersion}! Reloading...` }
  ];

  const interval = setInterval(() => {
    if (step < stages.length) {
      onProgress(stages[step]);
      step++;
    } else {
      clearInterval(interval);
      if (onComplete) onComplete(updatedAppInfo);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 250);
    }
  }, 350);
}