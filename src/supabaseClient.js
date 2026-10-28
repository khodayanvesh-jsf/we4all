const LIVE_CLOUD_ORIGIN = "https://we-4-all-super-app.vercel.app";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const STORAGE_KEY = "we4all_master_cloud_state_v4";
const BACKUP_KEY = "we4all_zero_loss_user_backup_v4";
const INSTALLED_VER_KEY = "we4all_device_installed_version_v4";
const syncChannel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("we4all_realtime_bus_v4") : null;

export function getDeviceInstalledVersion(fallback = "2.8.5") {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(INSTALLED_VER_KEY) || fallback;
}
export function saveCloudAndLocalState(stateSlice) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadCloudAndLocalState() || {};
    const merged = { ...existing, ...stateSlice, lastSyncedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(BACKUP_KEY, JSON.stringify(merged));
    if (syncChannel) syncChannel.postMessage({ type: "STATE_UPDATED", payload: merged });
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      fetch(`${SUPABASE_URL}/rest/v1/we4all_state_sync?id=eq.master_state`, { method: "PATCH", headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }, body: JSON.stringify({ app_version: merged.appUpdateInfo?.latestAvailableVersion || "2.8.5", release_notes: merged.appUpdateInfo?.releaseNotes || "", payload: merged, updated_at: new Date().toISOString() }) }).catch(() => {});
    }
  } catch (e) {}
}
export function loadCloudAndLocalState() {
  if (typeof window === "undefined") return null;
  try { const primary = localStorage.getItem(STORAGE_KEY); if (primary) return JSON.parse(primary); const backup = localStorage.getItem(BACKUP_KEY); if (backup) return JSON.parse(backup); } catch (e) { return null; } return null;
}
export async function checkLiveCloudOtaManifest(callback) {
  try {
    const res = await fetch(`${LIVE_CLOUD_ORIGIN}/ota-manifest.json?t=${Date.now()}`, { method: "GET", cache: "no-store" });
    if (!res.ok) return null;
    const remoteOta = await res.json();
    const installedVer = getDeviceInstalledVersion("2.8.5");
    if (remoteOta?.latestAvailableVersion) {
      const hasNewer = remoteOta.latestAvailableVersion !== installedVer;
      const updatedInfo = { ...remoteOta, currentVersion: installedVer, latestAvailableVersion: remoteOta.latestAvailableVersion, updateAvailable: Boolean(remoteOta.updateAvailable || hasNewer), apkDownloadUrl: `${LIVE_CLOUD_ORIGIN}/WE4ALL.apk` };
      if (callback) callback({ appUpdateInfo: updatedInfo });
      return updatedInfo;
    }
  } catch (e) { return null; } return null;
}
export function subscribeToRealtimeUpdates(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = (event) => { if (event.data && event.data.type === "STATE_UPDATED") { callback(event.data.payload); } };
  const storageHandler = (e) => { if (e.key === STORAGE_KEY && e.newValue) { try { callback(JSON.parse(e.newValue)); } catch (err) {} } };
  if (syncChannel) syncChannel.addEventListener("message", handler);
  window.addEventListener("storage", storageHandler);
  checkLiveCloudOtaManifest(callback);
  const pollTimer = setInterval(() => { checkLiveCloudOtaManifest(callback); }, 8000);
  return () => { if (syncChannel) syncChannel.removeEventListener("message", handler); window.removeEventListener("storage", storageHandler); clearInterval(pollTimer); };
}
export function performZeroLossOtaUpdate(targetVersion, releaseNotes, onProgress, onComplete) {
  const currentData = loadCloudAndLocalState() || {};
  const updatedAppInfo = { ...(currentData.appUpdateInfo || {}), currentVersion: targetVersion, latestAvailableVersion: targetVersion, updateAvailable: false, apkDownloadUrl: `${LIVE_CLOUD_ORIGIN}/WE4ALL.apk`, releaseNotes };
  const preservedState = { ...currentData, appUpdateInfo: updatedAppInfo, lastUpdatedTimestamp: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preservedState));
  localStorage.setItem(BACKUP_KEY, JSON.stringify(preservedState));
  localStorage.setItem(INSTALLED_VER_KEY, targetVersion);
  let step = 0;
  const stages = [ { pct: 25, msg: "1/4: Backing up Orders, Carts & Vault..." }, { pct: 60, msg: `2/4: Downloading v${targetVersion} Live Update...` }, { pct: 90, msg: "3/4: Installing Modules..." }, { pct: 100, msg: "4/4: Restarting WE4ALL..." } ];
  const interval = setInterval(() => {
    if (step < stages.length) { onProgress(stages[step]); step++; } else { clearInterval(interval); if (onComplete) onComplete(updatedAppInfo); setTimeout(() => { if (typeof window !== "undefined") { const url = new URL(window.location.href); url.searchParams.set("ota_v", targetVersion); window.location.replace(url.toString()); } }, 350); }
  }, 500);
}