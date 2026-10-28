import React, { useState } from 'react';

// ============================================================================
// MODULE: OwnerAccountProfile.jsx
// PURPOSE:
//   1. Displays Owner Profile Card (Photo, Name, Role, Basic Details, Saved Location)
//   2. Allows modifying Bank Account & UPI ID ANYTIME without cooldown
//   3. Enforces a 30-Day (Once-a-Month) lock on Basic Profile Info changes,
//      requiring 4-digit OTP verification before saving
//   4. Provides PIN & Biometric Login toggles and Consumer Interoperability switch
// ============================================================================

export default function OwnerAccountProfile({
  currentUser,
  setCurrentUser,
  activePortal,
  setActivePortal,
  activeAddressObj,
  accountSecurity,
  setAccountSecurity,
  onLockApp,
  onOpenAdminWeb,
  brightTheme,
  setBrightTheme,
  onTriggerToast
}) {
  // Bank & UPI Details (Editable Anytime - Requirement 5 & 6)
  const [bankDetails, setBankDetails] = useState({
    accountHolder: currentUser?.fullName || 'Khoday Anvesh',
    bankName: 'State Bank of India (Adilabad Main)',
    accountNumber: '38492019482',
    ifscCode: 'SBIN0000802',
    upiId: 'khodayanvesh@ybl'
  });
  const [editingBank, setEditingBank] = useState(false);

  // Basic Profile Info (Once-a-Month / 30-Day Rule + Mandatory OTP Verification - Requirement 7, 8, 9)
  const [basicProfile, setBasicProfile] = useState({
    fullName: currentUser?.fullName || 'Khoday Anvesh',
    phone: currentUser?.phone || '9848011223',
    savedLocation: activeAddressObj?.fullAddress || 'Subhash Nagar, Adilabad',
    profilePhoto:
      currentUser?.selfieUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    lastModifiedTimestamp: null // Tracks the 30-day cooldown
  });
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [basicEditOtpSent, setBasicEditOtpSent] = useState('');
  const [basicEditOtpInput, setBasicEditOtpInput] = useState('');
  const [newPinInput, setNewPinInput] = useState(accountSecurity.fastPin || '1990');

  const daysSinceLastBasicEdit = basicProfile.lastModifiedTimestamp
    ? Math.floor((Date.now() - basicProfile.lastModifiedTimestamp) / (1000 * 60 * 60 * 24))
    : 31;
  const canEditBasicThisMonth = daysSinceLastBasicEdit >= 30;

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBasicProfile({ ...basicProfile, profilePhoto: url });
    onTriggerToast('ðŸ“· Owner Profile Photo updated!');
  };

  const handleRequestBasicInfoOtp = () => {
    if (!canEditBasicThisMonth) {
      alert(
        `â³ Once-a-Month Rule Active: You already updated your basic profile this month. Next edit unlocks in ${
          30 - daysSinceLastBasicEdit
        } days.`
      );
      return;
    }
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    setBasicEditOtpSent(otp);
    setBasicEditOtpInput(otp);
    onTriggerToast(`ðŸ” Basic Profile Modification OTP Sent: ${otp} (Auto-filled)`);
  };

  const handleConfirmBasicInfoWithOtp = () => {
    if (!basicEditOtpSent || basicEditOtpInput.trim() !== basicEditOtpSent) {
      alert('Invalid OTP! Basic details can only be altered after OTP verification.');
      return;
    }
    setBasicProfile({
      ...basicProfile,
      lastModifiedTimestamp: Date.now()
    });
    setCurrentUser({
      ...currentUser,
      fullName: basicProfile.fullName,
      phone: basicProfile.phone
    });
    setEditingBasicInfo(false);
    setBasicEditOtpSent('');
    onTriggerToast('âœ… Basic Profile updated via OTP! Locked for the next 30 days.');
  };

  return (
    <div className="space-y-3 text-xs text-white">
      {/* 1. OWNER PROFILE IDENTITY CARD (Requirement 7, 8 & 9) */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950/50 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-3.5 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <label className="relative w-16 h-16 rounded-2xl border-2 border-amber-400 overflow-hidden cursor-pointer shrink-0 shadow-md">
            <img
              src={basicProfile.profilePhoto}
              alt={basicProfile.fullName}
              className="w-full h-16 object-cover"
            />
            <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-amber-300 text-center font-bold py-0.5">
              ðŸ“· Photo
            </span>
            <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
          </label>
          <div className="flex-1 min-w-0">
            <span className="bg-amber-400 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
              VERIFIED ACCOUNT OWNER â€¢ {activePortal.replace('_', ' ')}
            </span>
            <h3 className="text-sm font-black text-white truncate mt-1">
              {basicProfile.fullName}
            </h3>
            <p className="text-[10px] text-emerald-300 font-semibold">
              ðŸ“ž +91 {basicProfile.phone}
            </p>
            <p className="text-[9px] text-slate-300 truncate">
              ðŸ“ {basicProfile.savedLocation}
            </p>
          </div>
        </div>

        {/* Basic Info Editor (Protected by 30-Day Cooldown + OTP Verification) */}
        <div className="pt-2 border-t border-slate-800/80">
          {!editingBasicInfo ? (
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-400">
                {canEditBasicThisMonth
                  ? 'âœ“ Monthly Basic Profile Edit Available (Requires OTP)'
                  : `ðŸ”’ Locked for ${30 - daysSinceLastBasicEdit} more days (Once-a-Month Rule)`}
              </span>
              <button
                onClick={() => {
                  if (!canEditBasicThisMonth) {
                    alert(
                      `Basic details can only be altered once a month! Please wait ${
                        30 - daysSinceLastBasicEdit
                      } days.`
                    );
                    return;
                  }
                  setEditingBasicInfo(true);
                }}
                className={`px-2.5 py-1 rounded-xl text-[9px] font-black cursor-pointer ${
                  canEditBasicThisMonth
                    ? 'bg-slate-800 text-amber-300 border border-amber-400/40'
                    : 'bg-slate-900 text-slate-500'
                }`}
              >
                âœï¸ Edit Basic Info (1x/Month)
              </button>
            </div>
          ) : (
            <div className="space-y-2 bg-slate-950 p-2.5 rounded-2xl border border-amber-400/50">
              <p className="text-[10px] font-bold text-amber-300">
                âœï¸ Alter Basic Details (Once-a-Month OTP Verification):
              </p>
              <input
                type="text"
                value={basicProfile.fullName}
                onChange={(e) => setBasicProfile({ ...basicProfile, fullName: e.target.value })}
                placeholder="Full Legal Name"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-white"
              />
              <input
                type="tel"
                maxLength={10}
                value={basicProfile.phone}
                onChange={(e) => setBasicProfile({ ...basicProfile, phone: e.target.value })}
                placeholder="10-Digit Mobile"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-white"
              />
              <input
                type="text"
                value={basicProfile.savedLocation}
                onChange={(e) =>
                  setBasicProfile({ ...basicProfile, savedLocation: e.target.value })
                }
                placeholder="Primary Saved Location"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-white"
              />
              {!basicEditOtpSent ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleRequestBasicInfoOtp}
                    className="flex-1 bg-amber-400 text-slate-950 font-black py-1.5 rounded-xl cursor-pointer"
                  >
                    Send OTP to Verify
                  </button>
                  <button
                    onClick={() => setEditingBasicInfo(false)}
                    className="px-3 bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={basicEditOtpInput}
                    onChange={(e) => setBasicEditOtpInput(e.target.value)}
                    placeholder="4-Digit OTP"
                    className="w-24 bg-slate-900 border border-emerald-400 rounded-xl p-1.5 text-center font-mono text-white"
                  />
                  <button
                    onClick={handleConfirmBasicInfoWithOtp}
                    className="flex-1 bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl cursor-pointer"
                  >
                    âœ“ Verify OTP & Lock 30d
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. BANK ACCOUNT & UPI ID MANAGER (MODIFIABLE ANYTIME - Requirement 5 & 6) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-black text-emerald-400 text-xs">
              ðŸ¦ Linked Bank Account & UPI ID
            </h4>
            <p className="text-[9px] text-slate-400">
              Can be modified anytime for instant UPI payments, payouts & refunds
            </p>
          </div>
          <button
            onClick={() => setEditingBank(!editingBank)}
            className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 px-2.5 py-1 rounded-xl text-[9px] font-black cursor-pointer"
          >
            {editingBank ? 'Close' : 'âœï¸ Modify Anytime'}
          </button>
        </div>

        {!editingBank ? (
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Primary UPI ID:</span>
              <span className="font-mono font-bold text-amber-300">{bankDetails.upiId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bank Name:</span>
              <span className="font-bold text-white">{bankDetails.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account No / IFSC:</span>
              <span className="font-mono text-emerald-300">
                {bankDetails.accountNumber} ({bankDetails.ifscCode})
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 bg-slate-950 p-2.5 rounded-xl border border-emerald-500/40">
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
                placeholder="Account Number"
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
              onClick={() => {
                setEditingBank(false);
                onTriggerToast('ðŸ¦ Bank Account & UPI ID updated immediately!');
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl cursor-pointer"
            >
              âœ“ Save Bank & UPI Details Now
            </button>
          </div>
        )}
      </div>

      {/* 3. MULTI-ROLE CONSUMER INTEROPERABILITY & BRIGHT UI THEME (Requirement 3 & 13) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-amber-300 text-[11px]">
            â˜€ï¸ Screen Readability Mode:
          </span>
          <button
            onClick={() => setBrightTheme(!brightTheme)}
            className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-xl text-[10px] font-black text-emerald-300 cursor-pointer"
          >
            {brightTheme ? 'ðŸŒ™ Switch to Dark Emerald' : 'â˜€ï¸ Switch to Bright Daylight'}
          </button>
        </div>

        {activePortal !== 'customer' && (
          <button
            onClick={() => {
              setActivePortal('customer');
              onTriggerToast('ðŸ›ï¸ Switched to Personal Consumer Shopping Mode (Role Strictly Isolated)!');
            }}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer shadow"
          >
            ðŸ›ï¸ Shop as Consumer (Buy Groceries / Book Services)
          </button>
        )}
      </div>

      {/* 4. PIN & BIOMETRIC SECURITY CONTROLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <h4 className="font-black text-teal-300 text-xs">ðŸ” App PIN & Biometric Lock</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              setAccountSecurity({
                ...accountSecurity,
                pinEnabled: !accountSecurity.pinEnabled
              })
            }
            className={`py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
              accountSecurity.pinEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'
            }`}
          >
            PIN Login: {accountSecurity.pinEnabled ? 'ON âœ“' : 'OFF'}
          </button>
          <button
            onClick={() =>
              setAccountSecurity({
                ...accountSecurity,
                biometricEnabled: !accountSecurity.biometricEnabled
              })
            }
            className={`py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
              accountSecurity.biometricEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'
            }`}
          >
            Biometric: {accountSecurity.biometricEnabled ? 'ON âœ“' : 'OFF'}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            maxLength={4}
            value={newPinInput}
            onChange={(e) => setNewPinInput(e.target.value)}
            placeholder="4-Digit PIN"
            className="w-24 bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-center font-mono text-white"
          />
          <button
            onClick={() => {
              setAccountSecurity({ ...accountSecurity, fastPin: newPinInput });
              onTriggerToast('ðŸ” 4-Digit Quick PIN saved!');
            }}
            className="flex-1 bg-slate-800 text-amber-300 font-bold rounded-xl text-[10px] cursor-pointer"
          >
            Save New PIN
          </button>
          <button
            onClick={onLockApp}
            className="bg-rose-600 text-white font-black px-3 rounded-xl text-[10px] cursor-pointer"
          >
            ðŸ”’ Lock
          </button>
        </div>
      </div>

      {/* 5. ROLE SWITCHER FOR REAL-WORLD TESTING */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <p className="font-bold text-slate-300 text-[10px]">
          ðŸ§­ Switch Dedicated Module Portal (Each has its own separate footer & rules):
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          {[
            { id: 'customer', label: '1. Customer App' },
            { id: 'merchant', label: '2. Product Merchant' },
            { id: 'service_provider', label: '3. Service Provider' },
            { id: 'decorator', label: '4. Decorator / Hall' },
            { id: 'rider', label: '5. Captain Radar' },
            { id: 'split', label: 'ðŸ“± All 5 Phones View' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePortal(p.id)}
              className={`p-2 rounded-xl font-bold border text-left cursor-pointer ${
                activePortal === p.id
                  ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                  : 'border-slate-800 bg-slate-950 text-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={onOpenAdminWeb}
          className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer"
        >
          ðŸ‘‘ Open Founder Admin Backend Console
        </button>
      </div>
    </div>
  );
}