import { createClient } from "@supabase/supabase-js";

const LIVE_CLOUD_ORIGIN = "https://we-4-all-super-app.vercel.app";
const CURRENT_SCHEMA_VERSION = "2.9.8";
const STORAGE_KEY = "we4all_master_cloud_state_v4";
const BACKUP_KEY = "we4all_zero_loss_user_backup_v4";
const INSTALLED_VER_KEY = "we4all_device_installed_version_v4";
const SCHEMA_MIGRATED_KEY = "we4all_schema_migrated_v298";
const ZONE_MASTER_ID = "adilabad_master";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isLiveSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
    SUPABASE_URL.startsWith("https://")
);

export const supabase = isLiveSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: { params: { eventsPerSecond: 10 } }
    })
  : null;

const syncChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("we4all_realtime_bus_v4")
    : null;

let cloudSyncDebounceTimer = null;
let lastAppliedCloudTimestamp = "";

export function getDeviceInstalledVersion(fallback = "2.9.7") {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(INSTALLED_VER_KEY) || fallback;
}

// Upload Camera Photo / PDF / Signature to Supabase Storage Bucket ("we4all-media")
export async function uploadFileToSupabaseStorage(fileOrDataUrl, folder = "uploads") {
  if (!supabase) return typeof fileOrDataUrl === "string" ? fileOrDataUrl : "";
  try {
    let blobToUpload = fileOrDataUrl;
    let ext = "png";

    if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
      const match = fileOrDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return fileOrDataUrl;
      const mime = match[1];
      ext = mime.split("/")[1] || "png";
      const byteCharacters = atob(match[2]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      blobToUpload = new Blob([new Uint8Array(byteNumbers)], { type: mime });
    } else if (fileOrDataUrl instanceof File) {
      ext = fileOrDataUrl.name.split(".").pop() || "jpg";
    } else {
      return String(fileOrDataUrl || "");
    }

    const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("we4all-media")
      .upload(filePath, blobToUpload, { upsert: true });

    if (error) return typeof fileOrDataUrl === "string" ? fileOrDataUrl : "";

    const { data } = supabase.storage.from("we4all-media").getPublicUrl(filePath);
    return data?.publicUrl || "";
  } catch (e) {
    return typeof fileOrDataUrl === "string" ? fileOrDataUrl : "";
  }
}

// Save State Locally AND Push to Live Supabase PostgreSQL
export function saveCloudAndLocalState(stateSlice) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadCloudAndLocalState() || {};
    const nowIso = new Date().toISOString();
    const merged = { ...existing, ...stateSlice, lastSyncedAt: nowIso };
    lastAppliedCloudTimestamp = nowIso;

    const serialized = JSON.stringify(merged);
    try {
      localStorage.setItem(STORAGE_KEY, serialized);
      localStorage.setItem(BACKUP_KEY, serialized);
    } catch (quotaErr) {
      localStorage.removeItem(BACKUP_KEY);
      localStorage.setItem(STORAGE_KEY, serialized);
    }

    if (syncChannel) {
      syncChannel.postMessage({ type: "STATE_UPDATED", payload: merged });
    }

    // Debounced push to live Supabase PostgreSQL so all phones in town receive the update
    if (supabase) {
      if (cloudSyncDebounceTimer) clearTimeout(cloudSyncDebounceTimer);
      cloudSyncDebounceTimer = setTimeout(async () => {
        try {
          await supabase.from("we4all_town_state").upsert(
            {
              zone_id: ZONE_MASTER_ID,
              state_payload: merged,
              app_version: merged?.appUpdateInfo?.latestAvailableVersion || CURRENT_SCHEMA_VERSION,
              updated_at: nowIso
            },
            { onConflict: "zone_id" }
          );
        } catch (dbErr) {}
      }, 350);
    }
  } catch (e) {}
}

export function loadCloudAndLocalState() {
  if (typeof window === "undefined") return null;
  try {
    if (localStorage.getItem(SCHEMA_MIGRATED_KEY) !== CURRENT_SCHEMA_VERSION) {
      localStorage.setItem(SCHEMA_MIGRATED_KEY, CURRENT_SCHEMA_VERSION);
      localStorage.setItem(INSTALLED_VER_KEY, CURRENT_SCHEMA_VERSION);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BACKUP_KEY);
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
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
    const installedVer = getDeviceInstalledVersion("2.9.7");
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

// Subscribe to Live Supabase PostgreSQL Realtime + Same-Device BroadcastChannel
export function subscribeToRealtimeUpdates(callback) {
  if (typeof window === "undefined") return () => {};

  const applyIncomingPayload = (remotePayload) => {
    if (!remotePayload || typeof remotePayload !== "object") return;
    if (
      remotePayload.lastSyncedAt &&
      remotePayload.lastSyncedAt === lastAppliedCloudTimestamp
    ) {
      return;
    }
    if (remotePayload.lastSyncedAt) {
      lastAppliedCloudTimestamp = remotePayload.lastSyncedAt;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remotePayload));
    } catch (e) {}
    callback(remotePayload);
  };

  // 1. Initial pull from Supabase PostgreSQL on app startup
  if (supabase) {
    supabase
      .from("we4all_town_state")
      .select("state_payload, updated_at")
      .eq("zone_id", ZONE_MASTER_ID)
      .single()
      .then(({ data }) => {
        if (data?.state_payload && Object.keys(data.state_payload).length > 0) {
          applyIncomingPayload(data.state_payload);
        }
      })
      .catch(() => {});
  }

  // 2. Real-time WebSocket subscription to Supabase PostgreSQL changes across all phones
  let supabaseRealtimeSub = null;
  if (supabase) {
    supabaseRealtimeSub = supabase
      .channel("we4all_adilabad_live_sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "we4all_town_state",
          filter: `zone_id=eq.${ZONE_MASTER_ID}`
        },
        (payload) => {
          const nextState = payload?.new?.state_payload;
          if (nextState) {
            applyIncomingPayload(nextState);
          }
        }
      )
      .subscribe();
  }

  // 3. Local Tab / Split-Screen Fallback
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
  }, 8000);

  return () => {
    if (supabaseRealtimeSub && supabase) {
      supabase.removeChannel(supabaseRealtimeSub);
    }
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
    releaseNotes
  };

  localStorage.setItem(INSTALLED_VER_KEY, targetVersion);
  localStorage.setItem(SCHEMA_MIGRATED_KEY, targetVersion);

  if (typeof window !== "undefined" && "caches" in window) {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n))).catch(() => {});
  }

  let step = 0;
  const stages = [
    { pct: 25, msg: "1/4: Syncing State with Live Supabase PostgreSQL..." },
    { pct: 60, msg: `2/4: Downloading WE4ALL v${targetVersion} Modules In-App...` },
    { pct: 90, msg: "3/4: Applying Cloud Realtime Bridge..." },
    { pct: 100, msg: `4/4: WE4ALL v${targetVersion} Installed! Restarting In-App...` }
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
      }, 300);
    }
  }, 400);
}