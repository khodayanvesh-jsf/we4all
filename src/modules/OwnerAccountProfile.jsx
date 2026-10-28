import React, { useState } from "react";

// ============================================================================
// MODULE: src/modules/OwnerAccountProfile.jsx
// PURPOSE:
//   - Column 1: Owner Profile Identity & 30-Day OTP-Verified Basic Info Edit
//   - Column 2: Bank Account & UPI ID Editor (Modify Anytime)
//   - Column 3: PIN Change (Requires Previous PIN + New PIN), Biometric & UI Theme
//               (Role Switcher strictly removed per Points 1.3, 7 & 16!)
//   - Column 4: WE4ALL In-App OTA Update Center (Muted if currentVersion === latestAvailableVersion)
// ============================================================================
export default function OwnerAccountProfile({
  currentUser,
  setCurrentUser,
  activePortal,
  activeAddressObj,
  accountSecurity,
  setAccountSecurity,
  onRequestLogout,
  brightTheme,
  setBrightTheme,
  appUpdateInfo,
  onRunOtaUpdate,
  otaProgress,
  onTriggerToast
}) {
  const [bankDetails, setBankDetails] = useState({
    bankName: currentUser?.bankName || "State Bank of India (Adilabad Main)",
    accountNumber: currentUser?.accountNumber || "30984451209",
    ifscCode: currentUser?.ifscCode || "SBIN0000801",
    upiId: currentUser?.upiId || "khodayanvesh@ybl"
  });
  const [editingBank, setEditingBank] = useState(false);

  const [basicProfile, setBasicProfile] = useState({
    fullName: currentUser?.fullName || "Verified WE4ALL Member",
    phone: currentUser?.phone || "9848011223",
    savedLocation: activeAddressObj?.fullAddress || "Subhash Nagar, Adilabad",
    profilePhoto:
      currentUser?.profilePhoto ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    lastModifiedTimestamp: currentUser?.lastModifiedTimestamp || null
  });
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [basicEditOtpSent, setBasicEditOtpSent] = useState("");
  const [basicEditOtpInput, setBasicEditOtpInput] = useState("");

  // Point 6: Previous PIN + New PIN state for changing 4-Digit Quick PIN
  const [oldPinInput, setOldPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");

  const daysSinceLastEdit = basicProfile.lastModifiedTimestamp
    ? Math.floor((Date.now() - basicProfile.lastModifiedTimestamp) / (1000 * 60 * 60 * 24))
    : 31;
  const canEditBasicThisMonth = daysSinceLastEdit >= 30;

  // Point 1.3: Check if installed version and latest version are identical
  const isUpToDate =
    !appUpdateInfo?.updateAvailable &&
    appUpdateInfo?.currentVersion === appUpdateInfo?.latestAvailableVersion;

  return (
    <div className="space-y-3 text-xs pb-4">
      {/* 1. OWNER PROFILE IDENTITY CARD */}
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-3 space-y-2.5 text-white">
        <div className="flex items-center gap-3">
          <label className="relative w-14 h-14 rounded-2xl border-2 border-amber-400 overflow-hidden cursor-pointer shrink-0">
            <img
              src={basicProfile.profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-amber-300 text-center font-bold">
              Photo
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setBasicProfile({ ...basicProfile, profilePhoto: reader.result });
                    setCurrentUser({ ...currentUser, profilePhoto: reader.result });
                    if (onTriggerToast) onTriggerToast("Profile photo saved!");
                  };
                  reader.readAsDataURL(f);
                }
              }}
              className="hidden"
            />
          </label>
          <div className="flex-1 min-w-0">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-black uppercase">
              Locked Role: {activePortal.replace(/_/g, " ")}
            </span>
            <h3 className="text-sm font-black text-white truncate mt-0.5">
              {basicProfile.fullName}
            </h3>
            <p className="text-[11px] text-amber-300 font-mono">+91 {basicProfile.phone}</p>
            <p className="text-[10px] text-slate-400 truncate">{basicProfile.savedLocation}</p>
          </div>
        </div>

        {/* Basic Info Editor (Once-a-Month 30-Day Cooldown + Mandatory OTP) */}
        <div className="pt-2 border-t border-slate-800">
          {!editingBasicInfo ? (
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400">
                {canEditBasicThisMonth
                  ? "Monthly Basic Info Edit Ready (OTP Required)"
                  : `Locked for ${30 - daysSinceLastEdit} more days (Once-a-Month Rule)`}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!canEditBasicThisMonth) {
                    alert("Basic Profile Info can only be modified once every 30 days.");
                    return;
                  }
                  setEditingBasicInfo(true);
                }}
                className="bg-slate-800 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer"
              >
                Edit Basic Info (OTP)
              </button>
            </div>
          ) : (
            <div className="space-y-2 bg-slate-950 p-2.5 rounded-xl border border-amber-400/50">
              <p className="text-[10px] font-bold text-amber-300">
                Modify Basic Profile (Once-a-Month OTP Verification):
              </p>
              <input
                type="text"
                value={basicProfile.fullName}
                onChange={(e) => setBasicProfile({ ...basicProfile, fullName: e.target.value })}
                placeholder="Full Legal Name"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
              />
              <input
                type="tel"
                maxLength={10}
                value={basicProfile.phone}
                onChange={(e) => setBasicProfile({ ...basicProfile, phone: e.target.value })}
                placeholder="10-Digit Mobile"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
              />
              <input
                type="text"
                value={basicProfile.savedLocation}
                onChange={(e) =>
                  setBasicProfile({ ...basicProfile, savedLocation: e.target.value })
                }
                placeholder="Primary Saved Location"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const otp = String(Math.floor(1000 + Math.random() * 9000));
                    setBasicEditOtpSent(otp);
                    setBasicEditOtpInput(otp);
                    if (onTriggerToast) onTriggerToast(`Profile Modification OTP: ${otp}`);
                  }}
                  className="flex-1 bg-amber-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                >
                  Send OTP
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBasicInfo(false)}
                  className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              {basicEditOtpSent && (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={basicEditOtpInput}
                    onChange={(e) => setBasicEditOtpInput(e.target.value)}
                    className="w-full bg-slate-900 border border-emerald-400 rounded-lg p-1.5 text-center font-mono text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (basicEditOtpInput !== basicEditOtpSent) {
                        alert("Invalid OTP!");
                        return;
                      }
                      const nowTs = Date.now();
                      setBasicProfile({
                        ...basicProfile,
                        lastModifiedTimestamp: nowTs
                      });
                      setCurrentUser({
                        ...currentUser,
                        fullName: basicProfile.fullName,
                        phone: basicProfile.phone,
                        lastModifiedTimestamp: nowTs
                      });
                      setEditingBasicInfo(false);
                      setBasicEditOtpSent("");
                      if (onTriggerToast)
                        onTriggerToast("Basic Profile Updated & Locked for 30 Days!");
                    }}
                    className="w-full bg-emerald-500 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                  >
                    Verify OTP ({basicEditOtpSent}) & Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. BANK ACCOUNT & UPI ID MANAGER (EDITABLE ANYTIME) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-black text-emerald-400 text-xs">
              Bank Account & UPI ID (Modify Anytime)
            </h4>
            <p className="text-[10px] text-slate-400">
              Used for instant UPI payouts, settlements & refunds
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditingBank(!editingBank)}
            className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer"
          >
            {editingBank ? "Close" : "Modify Anytime"}
          </button>
        </div>

        {!editingBank ? (
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[10px]">
            <p>
              UPI ID: <strong className="text-amber-300 font-mono">{bankDetails.upiId}</strong>
            </p>
            <p>
              Bank: <strong>{bankDetails.bankName}</strong> ({bankDetails.accountNumber} /{" "}
              {bankDetails.ifscCode})
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-emerald-500/40">
            <input
              type="text"
              value={bankDetails.upiId}
              onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
              placeholder="UPI ID (e.g. name@ybl)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
            />
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              placeholder="Bank Name"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
            />
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                }
                placeholder="A/C Number"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
              />
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                placeholder="IFSC Code"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentUser({ ...currentUser, ...bankDetails });
                setEditingBank(false);
                if (onTriggerToast) onTriggerToast("Bank & UPI details saved immediately!");
              }}
              className="w-full bg-emerald-500 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
            >
              Save Bank & UPI Details
            </button>
          </div>
        )}
      </div>

      {/* 3. PIN CHANGE (REQUIRES PREVIOUS PIN), BIOMETRIC & UI THEME (NO ROLE SWITCHER!) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2.5 text-white">
        <div className="flex justify-between items-center">
          <h4 className="font-black text-teal-300 text-xs">
            Security PIN, Biometric & UI Theme
          </h4>
          <button
            type="button"
            onClick={() => setBrightTheme(!brightTheme)}
            className="bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-xl font-bold text-[10px] cursor-pointer"
          >
            Theme: {brightTheme ? "Bright Daylight" : "Dark Emerald"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() =>
              setAccountSecurity({
                ...accountSecurity,
                pinEnabled: !accountSecurity.pinEnabled
              })
            }
            className={`py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
              accountSecurity.pinEnabled
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            4-Digit PIN Lock: {accountSecurity.pinEnabled ? "MANDATORY ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={() =>
              setAccountSecurity({
                ...accountSecurity,
                biometricEnabled: !accountSecurity.biometricEnabled
              })
            }
            className={`py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
              accountSecurity.biometricEnabled
                ? "bg-teal-400 text-slate-950"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            Biometric Unlock: {accountSecurity.biometricEnabled ? "ENABLED" : "OFF"}
          </button>
        </div>

        {/* Point 6: Enter Previous PIN to Register New PIN */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
          <p className="text-[10px] text-amber-300 font-bold">
            Change 4-Digit Quick PIN (Requires Previous PIN Verification):
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <input
              type="password"
              maxLength={4}
              value={oldPinInput}
              onChange={(e) => setOldPinInput(e.target.value)}
              placeholder="Previous PIN"
              className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center font-mono text-white"
            />
            <input
              type="password"
              maxLength={4}
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              placeholder="New 4-Digit PIN"
              className="bg-slate-900 border border-emerald-500/50 rounded-lg p-1.5 text-center font-mono text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (oldPinInput !== accountSecurity.fastPin) {
                  alert("Previous PIN does not match your current registered PIN!");
                  return;
                }
                if (!/^\d{4}$/.test(newPinInput)) {
                  alert("New PIN must be exactly 4 digits.");
                  return;
                }
                setAccountSecurity({ ...accountSecurity, fastPin: newPinInput });
                setCurrentUser({ ...currentUser, fastPin: newPinInput });
                setOldPinInput("");
                setNewPinInput("");
                if (onTriggerToast)
                  onTriggerToast("Previous PIN verified! New 4-Digit PIN registered.");
              }}
              className="bg-amber-400 text-slate-950 font-black rounded-lg text-[10px] cursor-pointer"
            >
              Update PIN
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestLogout}
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-2 rounded-xl text-[10px] cursor-pointer"
        >
          Lock / Logout of WE4ALL
        </button>
      </div>

      {/* 4. LAST OPTION IN ACCOUNT: WE4ALL IN-APP OTA UPDATE CENTER (MUTED WHEN UP TO DATE) */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-amber-400 rounded-2xl p-3 space-y-2 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase">
              WE4ALL App Update Center (OTA)
            </span>
            <h4 className="font-black text-emerald-300 text-xs mt-1">
              Installed: v{appUpdateInfo?.currentVersion || "2.8.0"} | Latest: v
              {appUpdateInfo?.latestAvailableVersion || "2.8.0"}
            </h4>
          </div>
          {!isUpToDate ? (
            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">
              UPDATE READY
            </span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
              VERIFIED UP TO DATE
            </span>
          )}
        </div>

        <p className="text-[10px] text-slate-300 leading-relaxed">
          {appUpdateInfo?.releaseNotes}
        </p>

        {otaProgress && (
          <div className="space-y-1 bg-slate-950 p-2 rounded-xl border border-emerald-500/40">
            <div className="flex justify-between text-[10px] font-bold text-amber-300">
              <span>{otaProgress.msg}</span>
              <span>{otaProgress.pct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${otaProgress.pct}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            disabled={isUpToDate}
            onClick={() => {
              if (!isUpToDate && onRunOtaUpdate) onRunOtaUpdate();
            }}
            className={`font-black py-2 rounded-xl text-[10px] shadow ${
              isUpToDate
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60"
                : "bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer"
            }`}
          >
            {isUpToDate
              ? "Up to Date (Muted)"
              : "Download & Install Update (Restart)"}
          </button>
          <a
            href={appUpdateInfo?.apkDownloadUrl || "/WE4ALL.apk"}
            download="WE4ALL.apk"
            onClick={() =>
              onTriggerToast &&
              onTriggerToast("Downloading WE4ALL.apk installer package...")
            }
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-[10px] text-center cursor-pointer shadow block"
          >
            Download WE4ALL.apk
          </a>
        </div>
      </div>
    </div>
  );
}