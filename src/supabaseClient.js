const LIVE_CLOUD_ORIGIN = "https://we-4-all-super-app.vercel.app";
const CURRENT_SCHEMA_VERSION = "2.9.2";
const STORAGE_KEY = "we4all_master_cloud_state_v4";
const BACKUP_KEY = "we4all_zero_loss_user_backup_v4";
const INSTALLED_VER_KEY = "we4all_device_installed_version_v4";
const SCHEMA_MIGRATED_KEY = "we4all_schema_migrated_v292";

const syncChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("we4all_realtime_bus_v4")
    : null;

export function getDeviceInstalledVersion(fallback = "2.9.1") {
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
    if (syncChannel) {
      syncChannel.postMessage({ type: "STATE_UPDATED", payload: merged });
    }
  } catch (e) {}
}

export function loadCloudAndLocalState() {
  if (typeof window === "undefined") return null;
  try {
    // One-time migration for v2.9.1 so devices don't stay stuck on old cached state
    if (localStorage.getItem(SCHEMA_MIGRATED_KEY) !== CURRENT_SCHEMA_VERSION) {
      localStorage.setItem(SCHEMA_MIGRATED_KEY, CURRENT_SCHEMA_VERSION);
      localStorage.setItem(INSTALLED_VER_KEY, CURRENT_SCHEMA_VERSION);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BACKUP_KEY);
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.products)) {
      parsed.products = parsed.products.map((p, idx) => ({
        ...p,
        stockQty: p.stockQty ?? (25 + idx * 10),
        inStock: p.inStock ?? true,
        hsnGst: p.hsnGst ?? 5,
        isPublished: p.isPublished ?? true
      }));
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

export async function checkLiveCloudOtaManifest(callback) {
  try {
    const res = await fetch(`${LIVE_CLOUD_ORIGIN}/ota-manifest.json?_cb=${Date.now()}`, {
      method: "GET",
      cache: "no-store"
    });
    if (!res.ok) return null;
    const remoteOta = await res.json();
    const installedVer = getDeviceInstalledVersion("2.9.1");
    if (remoteOta?.latestAvailableVersion) {
      const hasNewer = remoteOta.latestAvailableVersion !== installedVer;
      const updatedInfo = {
        ...remoteOta,
        currentVersion: installedVer,
        latestAvailableVersion: remoteOta.latestAvailableVersion,
        updateAvailable: Boolean(hasNewer || remoteOta.updateAvailable),
        apkDownloadUrl: `${LIVE_CLOUD_ORIGIN}/WE4ALL.apk?v=${remoteOta.latestAvailableVersion}`
      };
      if (callback) callback({ appUpdateInfo: updatedInfo });
      return updatedInfo;
    }
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

  checkLiveCloudOtaManifest(callback);
  const pollTimer = setInterval(() => {
    checkLiveCloudOtaManifest(callback);
  }, 6000);

  return () => {
    if (syncChannel) syncChannel.removeEventListener("message", handler);
    window.removeEventListener("storage", storageHandler);
    clearInterval(pollTimer);
  };
}

export function performZeroLossOtaUpdate(targetVersion, releaseNotes, onProgress, onComplete) {
  const currentData = loadCloudAndLocalState() || {};
  const freshApkUrl = `${LIVE_CLOUD_ORIGIN}/WE4ALL.apk?v=${targetVersion}&t=${Date.now()}`;
  const updatedAppInfo = {
    ...(currentData.appUpdateInfo || {}),
    currentVersion: targetVersion,
    latestAvailableVersion: targetVersion,
    updateAvailable: false,
    apkDownloadUrl: freshApkUrl,
    releaseNotes
  };

  localStorage.setItem(INSTALLED_VER_KEY, targetVersion);
  localStorage.setItem(SCHEMA_MIGRATED_KEY, targetVersion);
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BACKUP_KEY);

  if (typeof window !== "undefined" && "caches" in window) {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n))).catch(() => {});
  }

  let step = 0;
  const stages = [
    { pct: 25, msg: "1/4: Backing up Orders, Carts, KYC & PIN Vault..." },
    { pct: 60, msg: `2/4: Downloading Fresh WE4ALL v${targetVersion} APK & Modules...` },
    { pct: 90, msg: "3/4: Applying New Merchant Portal & Stock Manual..." },
    { pct: 100, msg: `4/4: Launching WE4ALL v${targetVersion} Installer & Reloading...` }
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
          const isLocalApk =
            window.location.hostname === "localhost" ||
            window.location.protocol === "capacitor:" ||
            window.location.protocol === "file:";
          if (isLocalApk) {
            // Trigger fresh APK download on native device AND open live cloud bundle
            const a = document.createElement("a");
            a.href = freshApkUrl;
            a.download = `WE4ALL-v${targetVersion}.apk`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
          window.location.replace(`${LIVE_CLOUD_ORIGIN}/?ota_v=${encodeURIComponent(targetVersion)}&_cb=${Date.now()}`);
        }
      }, 300);
    }
  }, 450);
}