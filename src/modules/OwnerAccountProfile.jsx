import React, { useState } from 'react';

export default function OwnerAccountProfile({
  currentUser,
  setCurrentUser,
  activePortal,
  setActivePortal,
  activeAddressObj,
  accountSecurity,
  setAccountSecurity,
  onLockApp,
  brightTheme,
  setBrightTheme,
  onTriggerToast
}) {
  // Bank & UPI Details (Modifiable Anytime)
  const [bankDetails, setBankDetails] = useState({
    bankName: currentUser?.bankName || 'State Bank of India (Adilabad)',
    accountNumber: currentUser?.accountNumber || '38492019482',
    ifscCode: currentUser?.ifscCode || 'SBIN0000802',
    upiId: currentUser?.upiId || 'khodayanvesh@ybl'
  });
  const [editingBank, setEditingBank] = useState(false);

  // Basic Profile Info (Once-a-Month 30-Day Cooldown + Mandatory OTP)
  const [basicProfile, setBasicProfile] = useState({
    fullName: currentUser?.fullName || 'Khoday Anvesh',
    phone: currentUser?.phone || '9848011223',
    savedLocation: activeAddressObj?.fullAddress || 'Subhash Nagar, Adilabad',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    lastModifiedTimestamp: null
  });
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [basicEditOtpSent, setBasicEditOtpSent] = useState('');
  const [basicEditOtpInput, setBasicEditOtpInput] = useState('');
  const [newPinInput, setNewPinInput] = useState(accountSecurity.fastPin || '1990');

  const daysSinceLastEdit = basicProfile.lastModifiedTimestamp
    ? Math.floor((Date.now() - basicProfile.lastModifiedTimestamp) / (1000 * 60 * 60 * 24))
    : 31;
  const canEditThisMonth = daysSinceLastEdit >= 30;

  return (
    <div className="space-y-3 text-xs text-white">
      {/* Owner Identity Card */}
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-3.5 space-y-3">
        <div className="flex items-center gap-3">
          <label className="relative w-14 h-14 rounded-2xl border-2 border-amber-400 overflow-hidden cursor-pointer shrink-0">
            <img src={basicProfile.profilePhoto} alt="Owner" className="w-full h-full object-cover" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setBasicProfile({ ...basicProfile, profilePhoto: URL.createObjectURL(f) });
              }}
              className="hidden"
            />
          </label>
          <div className="flex-1 min-w-0">
            <span className="bg-amber-400 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
              ACCOUNT OWNER &bull; {activePortal.replace('_', ' ')}
            </span>
            <h3 className="text-sm font-black text-white truncate mt-0.5">{basicProfile.fullName}</h3>
            <p className="text-[10px] text-emerald-300">+91 {basicProfile.phone}</p>
            <p className="text-[9px] text-slate-400 truncate">{basicProfile.savedLocation}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800">
          {!editingBasicInfo ? (
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-400">
                {canEditThisMonth ? 'Monthly Edit Ready (OTP Required)' : `Locked for ${30 - daysSinceLastEdit}d`}
              </span>
              <button
                onClick={() => canEditThisMonth && setEditingBasicInfo(true)}
                className="bg-slate-800 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-xl text-[9px] font-black cursor-pointer"
              >
                Edit Basic Info (1x/Mo)
              </button>
            </div>
          ) : (
            <div className="space-y-2 bg-slate-950 p-2.5 rounded-2xl border border-amber-400/50">
              <input
                type="text"
                value={basicProfile.fullName}
                onChange={(e) => setBasicProfile({ ...basicProfile, fullName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
              />
              <input
                type="tel"
                maxLength={10}
                value={basicProfile.phone}
                onChange={(e) => setBasicProfile({ ...basicProfile, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
              />
              {!basicEditOtpSent ? (
                <button
                  onClick={() => {
                    const code = String(Math.floor(1000 + Math.random() * 9000));
                    setBasicEditOtpSent(code);
                    setBasicEditOtpInput(code);
                    onTriggerToast(`OTP Sent: ${code}`);
                  }}
                  className="w-full bg-amber-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                >
                  Send OTP to Verify
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (basicEditOtpInput === basicEditOtpSent) {
                      setBasicProfile({ ...basicProfile, lastModifiedTimestamp: Date.now() });
                      setCurrentUser({ ...currentUser, fullName: basicProfile.fullName, phone: basicProfile.phone });
                      setEditingBasicInfo(false);
                      setBasicEditOtpSent('');
                      onTriggerToast('Basic Profile updated & locked for 30 days!');
                    }
                  }}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                >
                  Verify OTP ({basicEditOtpInput}) & Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bank Account & UPI ID (Editable Anytime) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-black text-emerald-400 text-xs">Bank Account &amp; UPI ID (Modify Anytime)</h4>
          <button
            onClick={() => setEditingBank(!editingBank)}
            className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-xl text-[9px] font-black cursor-pointer"
          >
            {editingBank ? 'Close' : 'Edit Bank/UPI'}
          </button>
        </div>
        {!editingBank ? (
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[10px] space-y-0.5">
            <p>UPI ID: <strong className="text-amber-300">{bankDetails.upiId}</strong></p>
            <p>Bank: <strong>{bankDetails.bankName}</strong> ({bankDetails.accountNumber})</p>
          </div>
        ) : (
          <div className="space-y-1.5 bg-slate-950 p-2 rounded-xl">
            <input
              type="text"
              value={bankDetails.upiId}
              onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
              placeholder="UPI ID"
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
            />
            <input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              placeholder="Account Number"
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
            />
            <button
              onClick={() => {
                setEditingBank(false);
                onTriggerToast('Bank & UPI details saved!');
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
            >
              Save Bank &amp; UPI
            </button>
          </div>
        )}
      </div>

      {/* PIN & Biometric Security + Consumer Interoperability */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setAccountSecurity({ ...accountSecurity, pinEnabled: !accountSecurity.pinEnabled })}
            className={`py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
              accountSecurity.pinEnabled ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800'
            }`}
          >
            PIN Login: {accountSecurity.pinEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setAccountSecurity({ ...accountSecurity, biometricEnabled: !accountSecurity.biometricEnabled })}
            className={`py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
              accountSecurity.biometricEnabled ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800'
            }`}
          >
            Biometric: {accountSecurity.biometricEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            maxLength={4}
            value={newPinInput}
            onChange={(e) => setNewPinInput(e.target.value)}
            className="w-20 bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-center font-mono text-white"
          />
          <button
            onClick={() => {
              setAccountSecurity({ ...accountSecurity, fastPin: newPinInput });
              onTriggerToast('PIN Updated!');
            }}
            className="flex-1 bg-slate-800 text-amber-300 font-bold rounded-xl text-[10px] cursor-pointer"
          >
            Save PIN
          </button>
          <button
            onClick={() => setBrightTheme(!brightTheme)}
            className="bg-slate-800 text-emerald-300 font-bold px-2.5 rounded-xl text-[10px] cursor-pointer"
          >
            {brightTheme ? 'Dark' : 'Bright'}
          </button>
          <button
            onClick={onLockApp}
            className="bg-rose-600 text-white font-black px-3 rounded-xl text-[10px] cursor-pointer"
          >
            Lock
          </button>
        </div>
        {activePortal !== 'customer' && (
          <button
            onClick={() => setActivePortal('customer')}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer"
          >
            Shop as Consumer (Personal Shopping Mode)
          </button>
        )}
      </div>

      {/* Role Switcher (No Admin Button Shown to Regular Users) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <p className="font-bold text-slate-400 text-[10px]">Switch Module Portal:</p>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          {[
            { id: 'customer', label: '1. Customer App' },
            { id: 'merchant', label: '2. Product Merchant' },
            { id: 'service_provider', label: '3. Service Provider' },
            { id: 'decorator', label: '4. Decorator & Halls' },
            { id: 'rider', label: '5. Captain Radar' }
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
      </div>
    </div>
  );
}