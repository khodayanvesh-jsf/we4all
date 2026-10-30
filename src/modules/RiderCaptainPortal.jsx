import React, { useState } from "react";
import LiveRouteMap from "./LiveRouteMap";

export default function RiderCaptainPortal({
  footerTab,
  setFooterTab,
  currentUser,
  orders = [],
  setOrders = () => {},
  captainRadarJobs = [],
  setCaptainRadarJobs = () => {},
  pendingRiders = [],
  onSwitchToPersonalShop,
  onTriggerToast,
  renderAccountTab
}) {
  // Duty & 9:00 AM Auto-Online Default States (Req 2.4)
  const [isOnlineForDriving, setIsOnlineForDriving] = useState(true);
  const [autoOnline9AmEnabled, setAutoOnline9AmEnabled] = useState(true);

  // Tab 1: Radar Filter State
  const [radarTypeFilter, setRadarTypeFilter] = useState("ALL");

  // Tab 2: Active Route Map OTP Input State
  const [dropOtpInputs, setDropOtpInputs] = useState({});

  // Tab 3: Km Rate Configuration & Payment Request States
  const [customKmRate, setCustomKmRate] = useState({
    vehicleClass: currentUser?.vehicleClass || "2W Bike Captain (Up to 45kg)",
    baseFare2Km: 25,
    perKmRate: 6,
    waitingChargePer10Min: 10,
    heavyLoadBonus: 35,
    consortAccepted: true
  });

  // Tab 4: Earnings Period Filter
  const [earningsPeriod, setEarningsPeriod] = useState("ALL");

  // Check if current Captain is Pending Admin Approval or Published Live (Req 7)
  const myPendingCaptain = (pendingRiders || []).find(
    (r) => r.phone === currentUser?.phone || r.captainName === currentUser?.fullName
  );
  const isPublishedLive =
    !myPendingCaptain || myPendingCaptain.status === "Approved";

  // Combine platform store orders + radar jobs into unified captain trips
  const activeAcceptedTrips = [
    ...captainRadarJobs.filter((j) => j.status === "ACCEPTED_BY_CAPTAIN" || j.status === "PICKED_UP_EN_ROUTE"),
    ...orders.filter(
      (o) =>
        o.status === "READY_FOR_PICKUP_AGENT_ALERTED" ||
        o.status === "CAPTAIN_EN_ROUTE_TO_DROP"
    )
  ];

  const allMyCaptainBookings = [
    ...captainRadarJobs.filter((j) => j.assignedCaptain === (currentUser?.fullName || "Raju Local Rider") || j.status !== "OPEN_ON_RADAR"),
    ...orders
  ];

  // Printable PDF Earnings & Order Inventory Statement
  const handleDownloadCaptainStatementPdf = () => {
    const win = window.open("", "_blank", "width=720,height=800");
    if (!win) {
      onTriggerToast("Allow popups to export PDF Earnings Statement.");
      return;
    }
    const rowsHtml = allMyCaptainBookings
      .map(
        (bk, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>#${bk.id}</td>
          <td>${bk.rideType || "Merchant Order Delivery"}</td>
          <td>${bk.pickupPin || bk.shopName} &rarr; ${bk.dropPin || bk.address}</td>
          <td>${bk.distanceKm || 2.4} km</td>
          <td>${bk.paymentReqStatus || bk.status}</td>
          <td style="text-align:right;">Rs.${bk.captainPayout || bk.deliveryFee || 45}</td>
        </tr>`
      )
      .join("");

    const totalEarned = allMyCaptainBookings.reduce(
      (s, b) => s + Number(b.captainPayout || b.deliveryFee || 45),
      0
    );

    win.document.write(`
      <html>
        <head>
          <title>WE4ALL_Captain_Inventory_Statement</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            .box { border: 2px solid #0d9488; border-radius: 12px; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 7px; }
          </style>
        </head>
        <body>
          <div class="box">
            <h2 style="margin:0;color:#0d9488;">WE4ALL DELIVERY CAPTAIN ORDER INVENTORY & EARNINGS LEDGER</h2>
            <p style="font-size:12px;margin:4px 0;">
              <strong>Captain:</strong> ${currentUser?.fullName || "Raju Local Rider"} |
              <strong>Vehicle:</strong> ${customKmRate.vehicleClass} |
              <strong>Default Duty Schedule:</strong> Every Morning 09:00 AM Online
            </p>
            <table>
              <thead>
                <tr style="background:#f0fdfa;">
                  <th>#</th>
                  <th>Trip ID</th>
                  <th>Service Type</th>
                  <th>Route (Pickup &rarr; Drop)</th>
                  <th>Distance</th>
                  <th>Payment Status</th>
                  <th style="text-align:right;">Payout</th>
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
            <h3 style="text-align:right;color:#0d9488;margin-top:14px;">
              Total Captain Earnings: Rs.${totalEarned.toLocaleString("en-IN")}
            </h3>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  if (footerTab === "account") {
    return renderAccountTab();
  }

  return (
    <div className="space-y-3 text-xs text-white">
      {/* TOP CAPTAIN STATUS HEADER + LIVE DUTY BAR */}
      <div className="bg-slate-900 p-3 rounded-2xl border border-teal-500/40 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-black text-teal-300 text-xs">
                {currentUser?.fullName || "Raju Local Rider"}
              </h3>
              {isPublishedLive ? (
                <span className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[8px] font-black px-1.5 py-0.5 rounded">
                  LIVE IN MARKET
                </span>
              ) : (
                <span className="bg-amber-500/20 border border-amber-400 text-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded animate-pulse">
                  PENDING ADMIN APPROVAL
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isPublishedLive
                ? `${customKmRate.vehicleClass} | Auto-Online: 09:00 AM Daily`
                : "Limited to Captain Portal & Admin until Admin verifies your 5-Point KYC Checklist"}
            </p>
          </div>

          <button
            type="button"
            onClick={onSwitchToPersonalShop}
            className="bg-teal-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer shrink-0"
          >
            Personal Shop
          </button>
        </div>

        {/* Quick Duty Status Bar */}
        <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnlineForDriving ? "bg-emerald-400 animate-ping" : "bg-rose-500"
              }`}
            />
            <span className="text-[10px] font-bold text-slate-200">
              {isOnlineForDriving
                ? "ON-DUTY (LIVE FOR RIDES & DELIVERIES)"
                : "OFF-DUTY (RADAR PAUSED - AUTO RESUMES 9:00 AM)"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextState = !isOnlineForDriving;
              setIsOnlineForDriving(nextState);
              onTriggerToast(
                nextState
                  ? "You are now LIVE ON-DUTY for Rides & Deliveries!"
                  : "Switched to OFF-DUTY. Default auto-online set for 09:00 AM tomorrow."
              );
            }}
            className={`px-2.5 py-1 rounded-lg font-black text-[9px] cursor-pointer ${
              isOnlineForDriving
                ? "bg-emerald-400 text-slate-950"
                : "bg-rose-600 text-white"
            }`}
          >
            {isOnlineForDriving ? "Go Offline" : "Go Live Now"}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: LIVE RIDE & DELIVERY RADAR ("home")                           */}
      {/* ==================================================================== */}
      {footerTab === "home" && (
        <div className="space-y-2.5">
          <div className="bg-slate-900 p-3 rounded-2xl border border-teal-500/40 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-black text-teal-300 text-xs">
                  1. Live Ride, Taxi, P2P Parcel & Merchant Order Radar
                </h4>
                <p className="text-[10px] text-slate-400">
                  Shows Ride Type, Distance from You, Trip Price & Customer/Merchant requester
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const types = [
                    {
                      rideType: "BIKE_TAXI_PASSENGER",
                      badge: "2W Bike Taxi (Self Ride)",
                      bookedBy: "Consumer: Karthik Goud (For Self)",
                      pickupPin: "RTC Bus Stand, Adilabad",
                      dropPin: "Collectorate Chowk, Adilabad",
                      distFromCaptainKm: 0.6,
                      distanceKm: 2.8,
                      captainPayout: 48
                    },
                    {
                      rideType: "P2P_PARCEL_DROP",
                      badge: "P2P Urgent Box / Tiffin Delivery",
                      bookedBy: "Consumer: Sunitha Devi (For Daughter)",
                      pickupPin: "Subhash Nagar H.No 4-2, Adilabad",
                      dropPin: "Girls Junior College, Adilabad",
                      distFromCaptainKm: 0.9,
                      distanceKm: 3.1,
                      captainPayout: 55
                    },
                    {
                      rideType: "MERCHANT_STORE_DISPATCH",
                      badge: "Supermart Kirana Delivery (12 kg)",
                      bookedBy: "Merchant: Sri Laxmi Supermart",
                      pickupPin: "Sri Laxmi Supermart, Main Bazar",
                      dropPin: "Vidya Nagar Colony, Adilabad",
                      distFromCaptainKm: 0.4,
                      distanceKm: 2.2,
                      captainPayout: 42
                    },
                    {
                      rideType: "AUTO_3W_RIDE",
                      badge: "3W Auto Ride (Booked for Parents)",
                      bookedBy: "Consumer: Naveen Kumar (For Parents)",
                      pickupPin: "RIMS Hospital Gate, Adilabad",
                      dropPin: "Railway Station Road, Adilabad",
                      distFromCaptainKm: 1.1,
                      distanceKm: 3.5,
                      captainPayout: 85
                    }
                  ];
                  const pick = types[Math.floor(Math.random() * types.length)];
                  const newJob = {
                    id: `RDR-${Math.floor(1000 + Math.random() * 9000)}`,
                    ...pick,
                    createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    periodTag: "TODAY",
                    secretOtp: String(Math.floor(1000 + Math.random() * 9000)),
                    status: "OPEN_ON_RADAR",
                    paymentReqStatus: "PENDING_TRIP_COMPLETION"
                  };
                  setCaptainRadarJobs([newJob, ...captainRadarJobs]);
                  onTriggerToast(`New ${pick.badge} (#${newJob.id}) broadcast on Radar!`);
                }}
                className="bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer shrink-0"
              >
                + Test Radar Ride
              </button>
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-4 gap-1 text-[9px] bg-slate-950 p-1 rounded-xl">
              {[
                { id: "ALL", label: "All Radar" },
                { id: "BIKE_TAXI_PASSENGER", label: "Bike/Auto Taxi" },
                { id: "P2P_PARCEL_DROP", label: "P2P Parcel" },
                { id: "MERCHANT_STORE_DISPATCH", label: "Store Orders" }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setRadarTypeFilter(f.id)}
                  className={`py-1.5 rounded-lg font-black cursor-pointer ${
                    radarTypeFilter === f.id
                      ? "bg-teal-400 text-slate-950"
                      : "text-slate-400"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {!isOnlineForDriving ? (
            <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 text-center space-y-2">
              <p className="font-black text-rose-300 text-xs">
                You are currently OFF-DUTY
              </p>
              <p className="text-[10px] text-slate-300">
                Tap &ldquo;Go Live Now&rdquo; above to receive live consumer rides, P2P parcels, and merchant deliveries.
              </p>
            </div>
          ) : (
            captainRadarJobs
              .filter(
                (j) =>
                  radarTypeFilter === "ALL" ||
                  j.rideType === radarTypeFilter ||
                  (radarTypeFilter === "BIKE_TAXI_PASSENGER" && j.rideType === "AUTO_3W_RIDE")
              )
              .map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="bg-teal-500/20 border border-teal-400 text-teal-200 text-[9px] font-black px-2 py-0.5 rounded">
                        {job.badge}
                      </span>
                      <h5 className="font-black text-white text-xs mt-1">
                        #{job.id} &bull; {job.bookedBy}
                      </h5>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-emerald-400 text-sm block">
                        Rs.{job.captainPayout}
                      </span>
                      <span className="text-[9px] text-amber-300 font-bold">
                        {job.distFromCaptainKm} km from you
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1 text-[10px]">
                    <p className="text-emerald-300 font-bold">
                      \uD83D\uDFE2 Pickup: <span className="text-white">{job.pickupPin}</span>
                    </p>
                    <p className="text-amber-300 font-bold">
                      \uD83D\uDD34 Drop: <span className="text-white">{job.dropPin}</span>
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Trip Distance: <strong>{job.distanceKm} km</strong> | Drop OTP:{" "}
                      <strong>{job.secretOtp}</strong>
                    </p>
                  </div>

                  {job.status === "OPEN_ON_RADAR" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCaptainRadarJobs(
                          captainRadarJobs.map((x) =>
                            x.id === job.id
                              ? {
                                  ...x,
                                  status: "ACCEPTED_BY_CAPTAIN",
                                  assignedCaptain: currentUser?.fullName || "Raju Local Rider"
                                }
                              : x
                          )
                        );
                        setFooterTab("batch");
                        onTriggerToast(
                          `Accepted #${job.id} (Rs.${job.captainPayout})! Switched to 2. Route Map.`
                        );
                      }}
                      className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer shadow"
                    >
                      Accept Ride / Delivery (Rs.{job.captainPayout}) &rarr;
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFooterTab("batch")}
                      className="w-full bg-teal-500/20 border border-teal-400 text-teal-200 font-black py-1.5 rounded-xl cursor-pointer"
                    >
                      Status: {job.status.replace(/_/g, " ")} &bull; Open Route Map &rarr;
                    </button>
                  )}
                </div>
              ))
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ACTIVE ORDERS 3-POINT LIVE ROUTE MAP ("batch")                */}
      {/* ==================================================================== */}
      {footerTab === "batch" && (
        <div className="space-y-3">
          <div className="bg-slate-900 p-3 rounded-2xl border border-teal-500/40 flex justify-between items-center">
            <div>
              <h4 className="font-black text-teal-300 text-xs">
                2. Active Orders & 3-Point Live GPS Route Map ({activeAcceptedTrips.length})
              </h4>
              <p className="text-[10px] text-slate-400">
                Captain GPS &rarr; Pickup Shop/Point &rarr; Customer Drop with 4-Digit OTP
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFooterTab("home")}
              className="bg-slate-800 text-amber-300 font-black px-2.5 py-1 rounded-xl text-[10px] cursor-pointer"
            >
              + Radar
            </button>
          </div>

          {activeAcceptedTrips.length === 0 ? (
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center space-y-2">
              <p className="font-bold text-slate-300">
                No active route orders selected right now.
              </p>
              <button
                type="button"
                onClick={() => setFooterTab("home")}
                className="bg-teal-400 text-slate-950 font-black px-4 py-2 rounded-xl text-[10px] cursor-pointer"
              >
                Go to 1. Radar to Accept a Ride / Order &rarr;
              </button>
            </div>
          ) : (
            activeAcceptedTrips.map((trip) => {
              const pickupName = trip.pickupPin || trip.shopName || "Main Bazar, Adilabad";
              const dropName = trip.dropPin || trip.address || "Subhash Nagar, Adilabad";
              const payout = trip.captainPayout || trip.deliveryFee || 45;
              const otpCode = trip.secretOtp || "4499";

              return (
                <div
                  key={trip.id}
                  className="bg-slate-900 p-3 rounded-2xl border border-teal-500/40 space-y-2.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black text-emerald-400 text-xs">
                      #{trip.id} &bull; {trip.badge || "Store Order Delivery"}
                    </span>
                    <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[9px] font-black">
                      Payout: Rs.{payout}
                    </span>
                  </div>

                  {/* Interactive 3-Point Animated Route Map */}
                  <LiveRouteMap
                    pickupLabel={pickupName}
                    dropLabel={dropName}
                    riderName={currentUser?.fullName || "Raju Local Rider"}
                    vehicle={customKmRate.vehicleClass}
                    distanceKm={trip.distanceKm || 2.5}
                  />

                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder={`Drop OTP (${otpCode})`}
                      value={dropOtpInputs[trip.id] ?? ""}
                      onChange={(e) =>
                        setDropOtpInputs({ ...dropOtpInputs, [trip.id]: e.target.value })
                      }
                      className="w-32 bg-slate-950 border border-amber-400 rounded-xl p-2 text-center font-mono text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const entered = (dropOtpInputs[trip.id] || "").trim() || otpCode;
                        if (entered !== otpCode) {
                          alert(`Invalid Drop OTP! Customer OTP is ${otpCode}`);
                          return;
                        }
                        setCaptainRadarJobs(
                          captainRadarJobs.map((x) =>
                            x.id === trip.id
                              ? {
                                  ...x,
                                  status: "COMPLETED_DELIVERED",
                                  paymentReqStatus: "ELIGIBLE_FOR_PAYOUT_REQ"
                                }
                              : x
                          )
                        );
                        setOrders(
                          orders.map((o) =>
                            o.id === trip.id ? { ...o, status: "DELIVERED_COMPLETED" } : o
                          )
                        );
                        onTriggerToast(
                          `OTP (${otpCode}) Verified! Trip #${trip.id} Completed & added to Km Rate / Earnings!`
                        );
                      }}
                      className="flex-1 bg-emerald-400 text-slate-950 font-black rounded-xl text-[10px] cursor-pointer"
                    >
                      Verify OTP ({otpCode}) & Complete Trip &rarr;
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: KM RATE CARD & BOOKING PAYMENT REQUEST DESK ("rates")         */}
      {/* ==================================================================== */}
      {footerTab === "rates" && (
        <div className="space-y-3">
          {/* Section A: Official Captain Km Rate Card & Consort Rules */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/40 space-y-2.5">
            <h4 className="font-black text-teal-300 text-xs">
              3. Delivery Captain Km Rate Card & Platform Consort Slabs
            </h4>
            <p className="text-[10px] text-slate-400">
              Configure your vehicle class & per-km slabs under WE4ALL Logistics Consort Rules
            </p>

            <select
              value={customKmRate.vehicleClass}
              onChange={(e) =>
                setCustomKmRate({ ...customKmRate, vehicleClass: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
            >
              <option value="2W Bike Captain (Up to 45kg)">
                2W Bike Taxi & Parcel Captain (Up to 45kg | Base Rs.25 + Rs.6/km)
              </option>
              <option value="3W Cargo & Passenger Auto (Up to 300kg)">
                3W Auto Passenger & Cargo (Up to 300kg | Base Rs.60 + Rs.15/km)
              </option>
              <option value="4W Mini Truck / Heavy Transport (Over 300kg)">
                4W Mini Truck / Heavy Transport (Over 300kg | Base Rs.300 + Rs.25/km)
              </option>
            </select>

            <div className="grid grid-cols-3 gap-1.5">
              <div>
                <label className="block text-[9px] text-slate-400">Base Fare (2 km):</label>
                <input
                  type="number"
                  value={customKmRate.baseFare2Km}
                  onChange={(e) =>
                    setCustomKmRate({
                      ...customKmRate,
                      baseFare2Km: Number(e.target.value) || 25
                    })
                  }
                  className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl p-1.5 text-emerald-300 font-black mt-0.5"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-400">Per-Km Rate (Rs.):</label>
                <input
                  type="number"
                  value={customKmRate.perKmRate}
                  onChange={(e) =>
                    setCustomKmRate({
                      ...customKmRate,
                      perKmRate: Number(e.target.value) || 6
                    })
                  }
                  className="w-full bg-slate-950 border border-teal-400/50 rounded-xl p-1.5 text-teal-300 font-black mt-0.5"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-400">Heavy/Wait Bonus:</label>
                <input
                  type="number"
                  value={customKmRate.heavyLoadBonus}
                  onChange={(e) =>
                    setCustomKmRate({
                      ...customKmRate,
                      heavyLoadBonus: Number(e.target.value) || 35
                    })
                  }
                  className="w-full bg-slate-950 border border-amber-400/50 rounded-xl p-1.5 text-amber-300 font-black mt-0.5"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onTriggerToast("Captain Km Rate Slabs & Vehicle Consort Rules Saved!")
              }
              className="w-full bg-teal-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer shadow"
            >
              Save Km Rate Card to Server
            </button>
          </div>

          {/* Section B: All Bookings of Logged-in Captain + Raise Payment Request (Req 2.3) */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-amber-500/40 space-y-2.5">
            <h4 className="font-black text-amber-400 text-xs">
              My Captain Bookings & Payment Request Desk ({allMyCaptainBookings.length} Trips)
            </h4>
            <p className="text-[10px] text-slate-400">
              View complete booking details & raise instant UPI settlement requests for your trips
            </p>

            {allMyCaptainBookings.map((bk) => {
              const fare = Number(bk.captainPayout || bk.deliveryFee || 45);
              const dist = bk.distanceKm || 2.5;
              const isPaidOut = bk.paymentReqStatus === "PAYMENT_RELEASED_TO_UPI";

              return (
                <div
                  key={bk.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-teal-300 text-[11px]">
                        #{bk.id} &bull; {bk.badge || "Merchant Order Dispatch"}
                      </span>
                      <p className="text-[10px] text-slate-300 mt-0.5">
                        Route: {bk.pickupPin || bk.shopName} &rarr; {bk.dropPin || bk.address}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Distance: <strong>{dist} km</strong> | Base + Km Calc: Rs.{fare} | Status:{" "}
                        <strong className="text-amber-300">{bk.status}</strong>
                      </p>
                    </div>
                    <span className="font-black text-emerald-400 text-xs">Rs.{fare}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                    <span className="text-[9px] text-slate-400">
                      UPI Settlement ({currentUser?.upiId || "captain@ybl"}):
                    </span>
                    {isPaidOut ? (
                      <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg text-[9px] font-black">
                        SETTLED TO UPI \u2713
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setCaptainRadarJobs(
                            captainRadarJobs.map((x) =>
                              x.id === bk.id
                                ? { ...x, paymentReqStatus: "PAYMENT_RELEASED_TO_UPI" }
                                : x
                            )
                          );
                          setOrders(
                            orders.map((o) =>
                              o.id === bk.id
                                ? { ...o, paymentReqStatus: "PAYMENT_RELEASED_TO_UPI" }
                                : o
                            )
                          );
                          onTriggerToast(
                            `Payment Request Raised for #${bk.id}! Rs.${fare} released to ${
                              currentUser?.upiId || "captain@ybl"
                            }.`
                          );
                        }}
                        className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-lg text-[9px] cursor-pointer"
                      >
                        Raise Payment Request (Rs.{fare}) &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: EARNINGS, ORDER INVENTORY & 9 AM AUTO-DUTY ("orders")         */}
      {/* ==================================================================== */}
      {footerTab === "orders" && (
        <div className="space-y-3">
          {/* 9:00 AM Auto-Online Duty Scheduler Card (Req 2.4) */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-emerald-500/40 space-y-2.5">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-black text-emerald-400 text-xs">
                  Captain Duty Mode & 09:00 AM Auto-Online Rule
                </h4>
                <p className="text-[10px] text-slate-400">
                  Go Live for driving anytime, or switch Offline when off-duty
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOnlineForDriving(!isOnlineForDriving)}
                className={`px-3 py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
                  isOnlineForDriving
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-rose-600 text-white"
                }`}
              >
                {isOnlineForDriving ? "ONLINE (DRIVING)" : "OFFLINE (REST)"}
              </button>
            </div>

            <label className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 cursor-pointer">
              <div>
                <p className="font-bold text-amber-300 text-[10px]">
                  Default Morning 09:00 AM Auto-Online Duty Schedule
                </p>
                <p className="text-[9px] text-slate-400">
                  Automatically puts your Captain Radar Online every morning at 09:00 AM
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoOnline9AmEnabled}
                onChange={(e) => {
                  setAutoOnline9AmEnabled(e.target.checked);
                  onTriggerToast(
                    e.target.checked
                      ? "09:00 AM Daily Auto-Online Duty Enabled!"
                      : "09:00 AM Auto-Online Paused."
                  );
                }}
              />
            </label>
          </div>

          {/* Complete Order & Trip Inventory Ledger */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/40 space-y-2.5">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-black text-teal-300 text-xs">
                  4. Captain Earnings & Maintained Order Inventory
                </h4>
                <p className="text-[10px] text-slate-400">
                  All completed & active ride/delivery inventories maintained on your behalf
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadCaptainStatementPdf}
                className="bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer shrink-0"
              >
                Export PDF Ledger
              </button>
            </div>

            <select
              value={earningsPeriod}
              onChange={(e) => setEarningsPeriod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-bold text-[10px]"
            >
              <option value="ALL">Period: All Maintained Trips ({allMyCaptainBookings.length})</option>
              <option value="TODAY">Period: Today (Since 09:00 AM Duty)</option>
              <option value="WEEK">Period: This Week</option>
              <option value="MONTH">Period: This Month</option>
            </select>

            {(() => {
              const gross = allMyCaptainBookings.reduce(
                (s, b) => s + Number(b.captainPayout || b.deliveryFee || 45),
                0
              );
              const incentive = allMyCaptainBookings.length * 10;
              const netTotal = gross + incentive;

              return (
                <>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <p className="text-[9px] text-slate-400">Trip Fares</p>
                      <p className="font-black text-emerald-400 text-xs">
                        Rs.{gross.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <p className="text-[9px] text-slate-400">9AM Duty Bonus</p>
                      <p className="font-black text-amber-300 text-xs">
                        +Rs.{incentive.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <p className="text-[9px] text-slate-400">Total Take-Home</p>
                      <p className="font-black text-teal-300 text-xs">
                        Rs.{netTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {allMyCaptainBookings.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-white text-[11px]">
                            #{item.id} &bull; {item.badge || "Merchant Order Delivery"}
                          </p>
                          <p className="text-[9px] text-slate-400">
                            {item.pickupPin || item.shopName} &rarr; {item.dropPin || item.address} ({item.distanceKm || 2.4} km)
                          </p>
                        </div>
                        <span className="font-black text-emerald-400 text-xs">
                          +Rs.{item.captainPayout || item.deliveryFee || 45}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}