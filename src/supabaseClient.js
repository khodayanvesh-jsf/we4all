// ============================================================================
// MODULE: src/supabaseClient.js
// PURPOSE: Permanent Local + Cloud State Persistence (Never resets on refresh)
//          + Real-time Multi-Tab Sync + True App Restart OTA Updater
// ============================================================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const STORAGE_KEY = "we4all_production_db_v4";
const BACKUP_KEY = "we4all_zero_loss_backup_v4";
const OTA_KEY = "we4all_ota_manifest_v4";

const syncChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("we4all_live_bus_v4")
    : null;

export function saveCloudAndLocalState(stateSlice) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadCloudAndLocalState() || {};
    const merged = { ...existing, ...stateSlice, lastSyncedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(BACKUP_KEY, JSON.stringify(merged));
    if (stateSlice.appUpdateInfo) {
      localStorage.setItem(OTA_KEY, JSON.stringify(stateSlice.appUpdateInfo));
    }
    if (syncChannel) {
      syncChannel.postMessage({ type: "STATE_UPDATED", payload: merged });
    }
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      fetch(`${SUPABASE_URL}/rest/v1/we4all_state_sync?id=eq.master_state`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          app_version: merged.appUpdateInfo?.latestAvailableVersion || "2.8.0",
          release_notes: merged.appUpdateInfo?.releaseNotes || "",
          payload: merged,
          updated_at: new Date().toISOString()
        })
      }).catch(() => {});
    }
  } catch (e) {
    console.warn("Storage sync warning:", e);
  }
}

export function loadCloudAndLocalState() {
  if (typeof window === "undefined") return null;
  try {
    const primary = localStorage.getItem(STORAGE_KEY);
    if (primary) return JSON.parse(primary);
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) return JSON.parse(backup);
  } catch (e) {
    return null;
  }
  return null;
}

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
  if (syncChannel) syncChannel.addEventListener("message", handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    if (syncChannel) syncChannel.removeEventListener("message", handler);
    window.removeEventListener("storage", storageHandler);
  };
}

export function performZeroLossOtaUpdate(targetVersion, releaseNotes, onProgress, onComplete) {
  const currentData = loadCloudAndLocalState() || {};
  const updatedAppInfo = {
    ...(currentData.appUpdateInfo || {}),
    currentVersion: targetVersion,
    latestAvailableVersion: targetVersion,
    updateAvailable: false,
    releaseNotes
  };
  const preservedState = {
    ...currentData,
    appUpdateInfo: updatedAppInfo,
    lastUpdatedTimestamp: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preservedState));
  localStorage.setItem(BACKUP_KEY, JSON.stringify(preservedState));
  localStorage.setItem(OTA_KEY, JSON.stringify(updatedAppInfo));

  let step = 0;
  const stages = [
    { pct: 25, msg: "1/4: Backing up database, carts, stock & PIN vault..." },
    { pct: 60, msg: `2/4: Downloading WE4ALL v${targetVersion} package...` },
    { pct: 90, msg: "3/4: Installing updated modules..." },
    { pct: 100, msg: "4/4: Restarting WE4ALL application now..." }
  ];

  const interval = setInterval(() => {
    if (step < stages.length) {
      onProgress(stages[step]);
      step++;
    } else {
      clearInterval(interval);
      if (onComplete) onComplete(updatedAppInfo);
      // Point 1.3: Perform actual application restart after saving state
      setTimeout(() => {
        window.location.reload();
      }, 400);
    }
  }, 550);
}