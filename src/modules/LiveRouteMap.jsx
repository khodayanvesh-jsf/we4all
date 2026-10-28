import React, { useState, useEffect } from "react";

// ============================================================================
// MODULE: src/modules/LiveRouteMap.jsx
// PURPOSE: Touch-safe in-app Live GPS Route Map with moving Captain marker
//          from Captain Start -> Merchant Shop(s) -> Consumer Doorstep.
//          Touching the map NEVER redirects to external Google Maps app.
// ============================================================================
export default function LiveRouteMap({
  captainName = "Raju Local Rider",
  vehicleLabel = "2W Bike Captain",
  merchantStops = ["Sri Laxmi Supermart"],
  consumerAddress = "Subhash Nagar, Adilabad",
  distanceKm = 2.4,
  orderStatus = "OUT_FOR_DELIVERY_LIVE_MAP"
}) {
  const [progressPct, setProgressPct] = useState(12);
  const [zoomView, setZoomView] = useState("route"); // "route" | "satellite"

  useEffect(() => {
    const timer = setInterval(() => {
      setProgressPct((prev) => (prev >= 96 ? 15 : prev + 4));
    }, 900);
    return () => clearInterval(timer);
  }, []);

  // Calculate SVG coordinates along the 3-point curve:
  // Point A (Captain Start): (35, 135) -> Point B (Merchant Hub): (165, 55) -> Point C (Consumer Home): (295, 125)
  const getRiderCoords = (pct) => {
    const t = pct / 100;
    if (t < 0.5) {
      const seg = t * 2;
      return {
        x: 35 + (165 - 35) * seg,
        y: 135 + (55 - 135) * seg,
        leg: `En Route to ${merchantStops[0] || "Merchant"}`
      };
    } else {
      const seg = (t - 0.5) * 2;
      return {
        x: 165 + (295 - 165) * seg,
        y: 55 + (125 - 55) * seg,
        leg: `Picked Up -> Heading to ${consumerAddress.split(",")[0]}`
      };
    }
  };

  const pos = getRiderCoords(progressPct);
  const remainingKm = Math.max(0.2, Number((distanceKm * (1 - progressPct / 100)).toFixed(1)));
  const etaMins = Math.max(2, Math.ceil(remainingKm * 4));

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full rounded-2xl overflow-hidden border-2 border-emerald-500/60 bg-slate-950 text-white select-none shadow-lg"
    >
      {/* Top Map Telemetry Bar */}
      <div className="bg-slate-900 px-3 py-1.5 flex justify-between items-center text-[10px] border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-black text-emerald-300">{pos.leg}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-amber-300 font-bold">
            {remainingKm} km | ~{etaMins} mins
          </span>
          <button
            type="button"
            onClick={() => setZoomView(zoomView === "route" ? "satellite" : "route")}
            className="bg-slate-800 px-1.5 py-0.5 rounded text-[9px] text-slate-200 cursor-pointer"
          >
            {zoomView === "route" ? "Grid" : "Radar"}
          </button>
        </div>
      </div>

      {/* Interactive Touch-Safe SVG Map Canvas */}
      <div
        className={`relative w-full h-44 ${
          zoomView === "route"
            ? "bg-gradient-to-br from-[#071922] via-[#0b2430] to-[#06151d]"
            : "bg-gradient-to-br from-[#0d1f18] via-[#122b22] to-[#081410]"
        }`}
      >
        <svg viewBox="0 0 330 170" className="w-full h-full">
          {/* Town Road Grid */}
          <g stroke="rgba(148,163,184,0.12)" strokeWidth="1">
            <line x1="0" y1="40" x2="330" y2="40" />
            <line x1="0" y1="85" x2="330" y2="85" />
            <line x1="0" y1="130" x2="330" y2="130" />
            <line x1="65" y1="0" x2="65" y2="170" />
            <line x1="165" y1="0" x2="165" y2="170" />
            <line x1="265" y1="0" x2="265" y2="170" />
          </g>

          {/* Secondary Town Roads */}
          <path
            d="M 10 150 Q 95 110 165 55 T 315 115"
            fill="none"
            stroke="rgba(51,65,85,0.7)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Highlighted 3-Point Route Polyline: Captain -> Merchant -> Consumer */}
          <polyline
            points="35,135 165,55 295,125"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeDasharray="6 4"
          />

          {/* Stop 1: Captain Starting Point */}
          <circle cx="35" cy="135" r="7" fill="#14b8a6" stroke="#fff" strokeWidth="2" />
          <text x="12" y="156" fill="#5eead4" fontSize="8" fontWeight="bold">
            1. Captain Start
          </text>

          {/* Stop 2: Merchant Shop(s) Pickup */}
          <circle cx="165" cy="55" r="8" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
          <text x="115" y="38" fill="#fcd34d" fontSize="8.5" fontWeight="bold">
            2. {merchantStops.join(" + ").slice(0, 24)}
          </text>

          {/* Stop 3: Consumer Doorstep Destination */}
          <circle cx="295" cy="125" r="8" fill="#10b981" stroke="#fff" strokeWidth="2" />
          <text x="225" y="148" fill="#6ee7b7" fontSize="8.5" fontWeight="bold">
            3. {consumerAddress.slice(0, 18)}
          </text>

          {/* Animated Moving Delivery Captain Vehicle Marker */}
          <g transform={`translate(${pos.x}, ${pos.y})`}>
            <circle cx="0" cy="0" r="13" fill="rgba(245,158,11,0.28)" />
            <circle cx="0" cy="0" r="8" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
            <text x="-5" y="3" fontSize="9">
              {"\uD83D\uDEF5"}
            </text>
          </g>
        </svg>

        {/* Bottom Overlay Route Legend */}
        <div className="absolute bottom-1.5 inset-x-2 bg-slate-950/90 border border-slate-800 rounded-xl px-2.5 py-1 flex justify-between items-center text-[9px]">
          <span className="text-slate-300 truncate">
            Captain: <strong className="text-emerald-400">{captainName}</strong> ({vehicleLabel})
          </span>
          <span className="text-amber-300 font-mono font-bold">
            Route Progress: {progressPct}%
          </span>
        </div>
      </div>
    </div>
  );
}