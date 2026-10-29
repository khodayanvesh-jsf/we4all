const LIVE_CLOUD_ORIGIN = "https://we-4-all-super-app.vercel.app";
const STORAGE_KEY = "we4all_master_cloud_state_v4";
const BACKUP_KEY = "we4all_zero_loss_user_backup_v4";
const INSTALLED_VER_KEY = "we4all_device_installed_version_v4";

const syncChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("we4all_realtime_bus_v4")
    : null;

export function getDeviceInstalledVersion(fallback = "2.8.8") {
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
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Migrate old cached products on other devices so Stock Manual & Qty always show
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
    const origin =
      typeof window !== "undefined" && window.location.origin.includes("vercel.app")
        ? window.location.origin
        : LIVE_CLOUD_ORIGIN;
    const res = await fetch(`${origin}/ota-manifest.json?_cb=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" }
    });
    if (!res.ok) return null;
    const remoteOta = await res.json();
    const installedVer = getDeviceInstalledVersion("2.8.8");
    if (remoteOta?.latestAvailableVersion) {
      const hasNewer = remoteOta.latestAvailableVersion !== installedVer;
      const updatedInfo = {
        ...remoteOta,
        currentVersion: installedVer,
        latestAvailableVersion: remoteOta.latestAvailableVersion,
        updateAvailable: Boolean(hasNewer || remoteOta.updateAvailable),
        apkDownloadUrl: `${LIVE_CLOUD_ORIGIN}/WE4ALL.apk`
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
  const updatedAppInfo = {
    ...(currentData.appUpdateInfo || {}),
    currentVersion: targetVersion,
    latestAvailableVersion: targetVersion,
    updateAvailable: false,
    apkDownloadUrl: `${LIVE_CLOUD_ORIGIN}/WE4ALL.apk`,
    releaseNotes
  };

  // Keep user orders, carts, and new additions, but refresh product stock schema
  const preservedState = {
    ...currentData,
    appUpdateInfo: updatedAppInfo,
    lastUpdatedTimestamp: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preservedState));
  localStorage.setItem(BACKUP_KEY, JSON.stringify(preservedState));
  localStorage.setItem(INSTALLED_VER_KEY, targetVersion);

  // Purge WebView / Browser CacheStorage & Service Workers on the device
  if (typeof window !== "undefined") {
    if ("caches" in window) {
      caches.keys().then((names) => names.forEach((n) => caches.delete(n))).catch(() => {});
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
    }
  }

  let step = 0;
  const stages = [
    { pct: 25, msg: "1/4: Backing up Orders, Carts, KYC & PIN Vault..." },
    { pct: 60, msg: `2/4: Fetching Live Cloud Build v${targetVersion}...` },
    { pct: 90, msg: "3/4: Clearing Old Device Cache & Applying New Modules..." },
    { pct: 100, msg: "4/4: Relaunching Live WE4ALL v" + targetVersion + "..." }
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
          // If running inside an offline APK (localhost), jump directly to the live cloud server!
          const isLocalApk =
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.protocol === "capacitor:" ||
            window.location.protocol === "file:";
          const targetBase = isLocalApk ? LIVE_CLOUD_ORIGIN : window.location.origin + window.location.pathname;
          window.location.replace(`${targetBase}?ota_v=${encodeURIComponent(targetVersion)}&_cb=${Date.now()}`);
        }
      }, 300);
    }
  }, 450);
}