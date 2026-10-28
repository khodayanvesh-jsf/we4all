import React, { useState, useEffect } from 'react';

// ============================================================================
// MODULE: src/modules/ads/GeoTargetedAdBanner.jsx
// PURPOSE: Plays advertisements strictly ordered by:
//          Priority 1: Hyperlocal Geo-Location (Adilabad Town / Mandal GPS)
//          Priority 2: State Level (Telangana State Offers)
//          Priority 3: National Brand Level Ads
// ============================================================================

export default function GeoTargetedAdBanner({
  adsList = [],
  userTown = 'Adilabad',
  userState = 'Telangana',
  brightTheme = true,
  onOpenDealBox
}) {
  // Active Ad Tier Filter: 'ALL_PRIORITY' | 'GEO_LOCAL' | 'STATE_LEVEL' | 'BRAND_NATIONAL'
  const [selectedTier, setSelectedTier] = useState('ALL_PRIORITY');
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  // Sort ads strictly: 1st GEO_LOCAL -> 2nd STATE_LEVEL -> 3rd BRAND_NATIONAL
  const tierWeight = { GEO_LOCAL: 1, STATE_LEVEL: 2, BRAND_NATIONAL: 3 };
  const sortedAds = [...adsList]
    .filter((ad) => selectedTier === 'ALL_PRIORITY' || ad.tier === selectedTier)
    .sort((a, b) => (tierWeight[a.tier] || 9) - (tierWeight[b.tier] || 9));

  // Auto-rotate carousel every 4.5 seconds
  useEffect(() => {
    if (sortedAds.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % sortedAds.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [sortedAds.length, selectedTier]);

  const currentAd = sortedAds[activeSlideIdx % Math.max(1, sortedAds.length)] || sortedAds[0];
  if (!currentAd) return null;

  return (
    <div
      className={`rounded-2xl p-2.5 border transition-all space-y-2 ${
        brightTheme
          ? 'bg-gradient-to-r from-emerald-50 via-amber-50 to-teal-50 border-emerald-300 shadow-sm'
          : 'bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border-emerald-500/40'
      }`}
    >
      {/* Top Tier Selector Pills: 1st Local Geo -> 2nd State -> 3rd Brand */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: 'ALL_PRIORITY', label: '1\u21922\u21923 Auto Geo' },
            { id: 'GEO_LOCAL', label: `1. ${userTown} Geo` },
            { id: 'STATE_LEVEL', label: `2. ${userState}` },
            { id: 'BRAND_NATIONAL', label: '3. Brand Ads' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTier(t.id);
                setActiveSlideIdx(0);
              }}
              className={`px-2 py-0.5 rounded-full text-[8px] font-black cursor-pointer shrink-0 ${
                selectedTier === t.id
                  ? 'bg-emerald-600 text-white'
                  : brightTheme
                  ? 'bg-white text-slate-600 border border-slate-200'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={onOpenDealBox}
          className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-lg text-[8px] cursor-pointer shrink-0 shadow-xs"
        >
          Deal Box
        </button>
      </div>

      {/* Active Ad Display Card */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-400 text-slate-950 text-[7px] font-black px-1.5 py-0.5 rounded uppercase">
              {currentAd.tier === 'GEO_LOCAL'
                ? `1ST PRIORITY • ${currentAd.regionLabel}`
                : currentAd.tier === 'STATE_LEVEL'
                ? `2ND PRIORITY • ${currentAd.regionLabel}`
                : `3RD PRIORITY • ${currentAd.regionLabel}`}
            </span>
            <span className="text-[8px] font-bold text-emerald-600">
              Slide {(activeSlideIdx % sortedAds.length) + 1}/{sortedAds.length}
            </span>
          </div>
          <p
            className={`text-[11px] font-black truncate mt-0.5 ${
              brightTheme ? 'text-slate-900' : 'text-white'
            }`}
          >
            {currentAd.title}
          </p>
          <p
            className={`text-[9px] truncate ${
              brightTheme ? 'text-slate-600' : 'text-emerald-300'
            }`}
          >
            {currentAd.subtitle}
          </p>
        </div>
        {currentAd.image && (
          <img
            src={currentAd.image}
            alt={currentAd.title}
            className="w-12 h-12 rounded-xl object-cover border border-emerald-400/50 shrink-0"
          />
        )}
      </div>
    </div>
  );
}