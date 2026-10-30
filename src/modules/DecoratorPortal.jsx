import React, { useState } from "react";

export default function DecoratorPortal({
  footerTab,
  setFooterTab,
  currentUser,
  setCurrentUser,
  functionHalls = [],
  setFunctionHalls = () => {},
  decorPortfolio = [],
  setDecorPortfolio = () => {},
  decorReverseBids = [],
  setDecorReverseBids = () => {},
  decorEscrowBookings = [],
  setDecorEscrowBookings = () => {},
  pendingDecorators = [],
  onSwitchToPersonalShop,
  onTriggerToast,
  renderAccountTab
}) {
  // Determine if logged-in user is "function_hall" or "flower_decorator"
  const subRole = currentUser?.decoratorSubRole || "flower_decorator";
  const isHallMerchant = subRole === "function_hall";
  const isFlowerDecorator = subRole === "flower_decorator";

  const myPendingRecord = (pendingDecorators || []).find(
    (d) => d.phone === currentUser?.phone || d.businessName === currentUser?.fullName
  );
  const isApprovedLive = !myPendingRecord || myPendingRecord.status === "Approved";

  // Tab 1: Hall Calendar States (Function Hall Merchant Only)
  const [selectedHallDate, setSelectedHallDate] = useState("2026-11-05");
  const [selectedShift, setSelectedShift] = useState("FULL_DAY");
  const [hallRateEdit, setHallRateEdit] = useState(35000);
  const [hallCapacityEdit, setHallCapacityEdit] = useState(800);

  // Tab 2: Reverse Bids States (Flower Decorator Only) & Hall Inquiries (Hall Merchant Only)
  const [bidAmountInputs, setBidAmountInputs] = useState({});
  const [bidNoteInputs, setBidNoteInputs] = useState({});

  // Tab 3: 35% | 85% | 100% Milestone Escrow States
  const [escrowFilter, setEscrowFilter] = useState("ALL");

  // Tab 4: Portfolio High-Res Stock Form
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    decorType: isHallMerchant ? "AC Banquet & Marriage Hall" : "Royal Floral Wedding Mandap",
    materialUsed: isHallMerchant
      ? "Central AC, Crystal Chandeliers, 800 Banquet Chairs, Valet Parking"
      : "Fresh Imported Bangkok Orchids, Dutch Roses, Warm LED Truss & Velvet Drapes",
    albumName: isHallMerchant ? "2026 Grand Muhurtham Hall Album" : "2026 Royal Floral Collection",
    dimensionsSize: isHallMerchant ? "12,000 sq.ft (800 Pax)" : "40 ft x 16 ft Stage",
    approxPrice: isHallMerchant ? 35000 : 24500,
    highResImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=85",
    imageSourceLabel: "Default High-Res Sample"
  });

  // High-Res Photo Capture (Camera or Gallery) for Portfolio
  const handlePortfolioPhotoSelect = (e, sourceType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPortfolioForm({
        ...portfolioForm,
        highResImage: String(reader.result || ""),
        imageSourceLabel: `${sourceType}: ${file.name}`
      });
      onTriggerToast(`Loaded High-Res Photo from ${sourceType}: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  // Upload Stage/Hall Readiness Proof Photo for 85% Escrow Milestone
  const handleUploadMilestoneProof = (bookingId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const proofUrl = String(reader.result || "");
      setDecorEscrowBookings(
        decorEscrowBookings.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                setupProofImage: proofUrl,
                milestoneStatus: "85_PERCENT_REQUESTED_WITH_PHOTO",
                requested85At: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
            : b
        )
      );
      onTriggerToast(
        `Uploaded Readiness Photo & Raised 85% Escrow Release Request for #${bookingId}!`
      );
    };
    reader.readAsDataURL(file);
  };

  // Printable PDF Escrow Statement
  const handleDownloadEscrowPdf = (bk) => {
    const win = window.open("", "_blank", "width=720,height=800");
    if (!win) {
      onTriggerToast("Please allow popups to export PDF Escrow Statement.");
      return;
    }
    const total = Number(bk.totalContractAmount || 30000);
    const m35 = Math.round(total * 0.35);
    const m50 = Math.round(total * 0.5);
    const m15 = total - m35 - m50;
    const gst = Number((total * 0.05).toFixed(2));

    win.document.write(`
      <html>
        <head>
          <title>WE4ALL_Escrow_Statement_${bk.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            .box { border: 2px solid #d97706; border-radius: 12px; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; }
          </style>
        </head>
        <body>
          <div class="box">
            <h2 style="margin:0;color:#d97706;">WE4ALL 35% | 85% | 100% MILESTONE ESCROW TAX STATEMENT</h2>
            <p style="font-size:12px;margin:4px 0;">
              <strong>Merchant:</strong> ${bk.merchantName} (${bk.subRole === "function_hall" ? "Function Hall" : "Flower Decorator"}) |
              <strong>Booking ID:</strong> #${bk.id} |
              <strong>Event Date:</strong> ${bk.eventDate}
            </p>
            <p style="font-size:12px;margin:4px 0;">
              <strong>Customer:</strong> ${bk.customerName} (${bk.venueAddress})
            </p>
            <table>
              <thead>
                <tr style="background:#fef3c7;">
                  <th style="text-align:left;">Escrow Milestone Stage</th>
                  <th>Consort Rule</th>
                  <th>Status</th>
                  <th style="text-align:right;">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Stage 1: 35% Booking Advance</td>
                  <td>Material & Date Blocking</td>
                  <td>${bk.stage35Paid ? "RELEASED TO MERCHANT" : "REQUESTED"}</td>
                  <td style="text-align:right;">Rs.${m35.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td>Stage 2: +50% (85% Cumulative)</td>
                  <td>On-Site Stage / Hall Setup Ready</td>
                  <td>${bk.stage85Paid ? "RELEASED TO MERCHANT" : bk.milestoneStatus}</td>
                  <td style="text-align:right;">Rs.${m50.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td>Stage 3: +15% (100% Final Settlement)</td>
                  <td>Event Completion Handover</td>
                  <td>${bk.stage100Paid ? "SETTLED 100%" : "HELD IN ESCROW"}</td>
                  <td style="text-align:right;">Rs.${m15.toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top:14px;text-align:right;font-size:13px;">
              <p>Total Contract Value: <strong>Rs.${total.toLocaleString("en-IN")}</strong></p>
              <p>5% Platform GST Ledger: <strong>Rs.${gst.toLocaleString("en-IN")}</strong></p>
              <h3 style="color:#059669;">Net Merchant Escrow Entitlement: Rs.${(total - gst).toLocaleString("en-IN")}</h3>
            </div>
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

  const myHallObj =
    functionHalls.find(
      (h) =>
        h.ownerPhone === currentUser?.phone ||
        h.name?.toLowerCase() === currentUser?.fullName?.toLowerCase()
    ) || functionHalls[0];

  // Filter Portfolio & Escrow Bookings strictly to the logged-in merchant
  const myPortfolioItems = decorPortfolio.filter(
    (item) =>
      item.ownerId === currentUser?.id ||
      item.ownerPhone === currentUser?.phone ||
      item.merchantName === currentUser?.fullName ||
      item.subRole === subRole
  );

  const myEscrowBookings = decorEscrowBookings.filter(
    (b) =>
      b.ownerId === currentUser?.id ||
      b.merchantName === currentUser?.fullName ||
      b.subRole === subRole
  );

  return (
    <div className="space-y-3 text-xs text-white">
      {/* TOP PORTAL HEADER WITH STRICT SUB-ROLE BADGE & ROLE SWITCHER */}
      <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-black text-amber-400 text-xs">
                {currentUser?.fullName ||
                  (isHallMerchant
                    ? "Sri Venkateswara Grand Function Hall"
                    : "Padmavathi Royal Flower Decorators")}
              </h3>
              <span
                className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                  isHallMerchant
                    ? "bg-purple-500/20 border border-purple-400 text-purple-200"
                    : "bg-pink-500/20 border border-pink-400 text-pink-200"
                }`}
              >
                {isHallMerchant ? "FUNCTION HALL MERCHANT" : "FLOWER DECORATOR MERCHANT"}
              </span>
              {isApprovedLive ? (
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
              {isHallMerchant
                ? "Authorized for: 1. Hall Calendar, Hall Bookings, 35%|85% Escrow & Hall Portfolio"
                : "Authorized for: 2. Reverse Bids, 35%|85% Escrow & High-Res Flower Portfolio"}
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToPersonalShop}
            className="bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer shrink-0"
          >
            Personal Shop
          </button>
        </div>

        {/* Sub-Role Toggle so Founder/User can test both Function Hall & Flower Decorator rules */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]">
          <button
            type="button"
            onClick={() => {
              const updated = {
                ...currentUser,
                decoratorSubRole: "flower_decorator",
                fullName:
                  currentUser?.decoratorSubRole === "function_hall"
                    ? "Padmavathi Royal Flower Decorators"
                    : currentUser?.fullName
              };
              setCurrentUser(updated);
              onTriggerToast("Active Login Mode: Flower Decorator Merchant");
            }}
            className={`py-1.5 rounded-lg font-black cursor-pointer ${
              isFlowerDecorator ? "bg-pink-500 text-white" : "text-slate-400"
            }`}
          >
            \uD83C\uDF38 Flower Decorator Login
          </button>
          <button
            type="button"
            onClick={() => {
              const updated = {
                ...currentUser,
                decoratorSubRole: "function_hall",
                fullName:
                  currentUser?.decoratorSubRole !== "function_hall"
                    ? "Sri Venkateswara Grand Function Hall"
                    : currentUser?.fullName
              };
              setCurrentUser(updated);
              onTriggerToast("Active Login Mode: Function Hall Merchant");
            }}
            className={`py-1.5 rounded-lg font-black cursor-pointer ${
              isHallMerchant ? "bg-purple-500 text-white" : "text-slate-400"
            }`}
          >
            \uD83C\uDFDB\uFE0F Function Hall Login
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: HALL CALENDAR ("home") - FUNCTION HALL MERCHANT ONLY!         */}
      {/* ==================================================================== */}
      {footerTab === "home" && (
        <div className="space-y-3">
          {!isHallMerchant ? (
            <div className="bg-rose-950/40 border-2 border-rose-500/60 rounded-2xl p-4 text-center space-y-2.5">
              <div className="text-2xl">\uD83D\uDD12</div>
              <h4 className="font-black text-rose-300 text-sm">
                Access Restricted: Function Hall Merchants Only
              </h4>
              <p className="text-[11px] text-slate-300">
                You are currently logged in as a <strong>Flower Decorator Merchant</strong>. As per platform consort rules, Function Hall Calendar & Hall Slot Blocking cannot be accessed by Flower Decorators.
              </p>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setFooterTab("bids")}
                  className="bg-amber-400 text-slate-950 font-black px-3 py-2 rounded-xl text-[10px] cursor-pointer"
                >
                  Go to 2. Reverse Bids &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setFooterTab("portfolio")}
                  className="bg-emerald-400 text-slate-950 font-black px-3 py-2 rounded-xl text-[10px] cursor-pointer"
                >
                  Go to 4. Flower Portfolio &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-purple-500/40 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-black text-purple-300 text-xs">
                    1. Function Hall Master Calendar & Muhurtham Date Manager
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Manage booked wedding dates, block offline bookings & update hall rent
                  </p>
                </div>
                <input
                  type="date"
                  value={selectedHallDate}
                  onChange={(e) => setSelectedHallDate(e.target.value)}
                  className="bg-slate-950 border border-purple-400 rounded-xl p-1.5 text-white font-bold text-[10px]"
                />
              </div>

              {myHallObj && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-black text-white text-xs">{myHallObj.name}</h5>
                      <p className="text-[10px] text-slate-400">
                        Capacity: {myHallObj.capacity || hallCapacityEdit} Guests | Rent: Rs.
                        {(myHallObj.pricePerDay || hallRateEdit).toLocaleString("en-IN")}/day
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        (myHallObj.bookedDates || []).includes(selectedHallDate)
                          ? "bg-rose-500/20 border border-rose-400 text-rose-300"
                          : "bg-emerald-500/20 border border-emerald-400 text-emerald-300"
                      }`}
                    >
                      {(myHallObj.bookedDates || []).includes(selectedHallDate)
                        ? `BOOKED ON ${selectedHallDate}`
                        : `AVAILABLE ON ${selectedHallDate}`}
                    </span>
                  </div>

                  {/* Interactive Date Grid */}
                  <div>
                    <p className="text-[10px] font-bold text-amber-300 mb-1.5">
                      Upcoming Muhurtham & Event Dates (Tap any date to toggle Booked / Available):
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        "2026-11-02",
                        "2026-11-05",
                        "2026-11-08",
                        "2026-11-12",
                        "2026-11-15",
                        "2026-11-20"
                      ].map((dt) => {
                        const isBooked = (myHallObj.bookedDates || []).includes(dt);
                        return (
                          <button
                            key={dt}
                            type="button"
                            onClick={() => {
                              const currentDates = myHallObj.bookedDates || [];
                              const nextDates = isBooked
                                ? currentDates.filter((d) => d !== dt)
                                : [...currentDates, dt];
                              setFunctionHalls(
                                functionHalls.map((h) =>
                                  h.id === myHallObj.id ? { ...h, bookedDates: nextDates } : h
                                )
                              );
                              setSelectedHallDate(dt);
                              onTriggerToast(
                                `${myHallObj.name}: ${dt} marked ${
                                  isBooked ? "AVAILABLE" : "BOOKED / LOCKED"
                                }!`
                              );
                            }}
                            className={`p-2 rounded-xl border text-center cursor-pointer ${
                              isBooked
                                ? "bg-rose-950/50 border-rose-500 text-rose-200"
                                : "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                            }`}
                          >
                            <div className="font-black text-[10px]">{dt}</div>
                            <div className="text-[8px] font-bold mt-0.5">
                              {isBooked ? "BOOKED \uD83D\uDD12" : "OPEN \u2713"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shift & Tariff Controls */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800">
                    <select
                      value={selectedShift}
                      onChange={(e) => setSelectedShift(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-white text-[10px] font-bold"
                    >
                      <option value="FULL_DAY">Full Day (24 Hrs)</option>
                      <option value="MORNING">Morning Muhurtham</option>
                      <option value="EVENING">Evening Reception</option>
                    </select>
                    <input
                      type="number"
                      value={hallRateEdit}
                      onChange={(e) => setHallRateEdit(Number(e.target.value) || 25000)}
                      placeholder="Rent/Day (Rs.)"
                      className="bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-emerald-300 font-bold text-[10px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const currentDates = myHallObj.bookedDates || [];
                        const isBooked = currentDates.includes(selectedHallDate);
                        const nextDates = isBooked
                          ? currentDates.filter((d) => d !== selectedHallDate)
                          : [...currentDates, selectedHallDate];
                        setFunctionHalls(
                          functionHalls.map((h) =>
                            h.id === myHallObj.id
                              ? { ...h, bookedDates: nextDates, pricePerDay: hallRateEdit }
                              : h
                          )
                        );
                        onTriggerToast(
                          `Updated ${selectedHallDate} (${selectedShift}) & synced to Customer App!`
                        );
                      }}
                      className="bg-purple-500 text-white font-black rounded-xl text-[10px] cursor-pointer"
                    >
                      Toggle {selectedHallDate}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: REVERSE BIDS ("bids") - STRICT SUB-ROLE SEPARATION            */}
      {/* ==================================================================== */}
      {footerTab === "bids" && (
        <div className="space-y-3">
          {isHallMerchant ? (
            /* FUNCTION HALL MERCHANT VIEW: Sees Hall Slot Booking Requests ONLY (Blocked from Flower Reverse Bids) */
            <div className="space-y-3">
              <div className="bg-amber-950/30 border border-amber-400/50 rounded-2xl p-3">
                <p className="font-black text-amber-300 text-[11px]">
                  \uD83D\uDD12 Flower Reverse Bidding Locked for Function Hall Merchants
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Function Hall Merchants manage direct **Hall Date & Slot Bookings** below. Flower Decoration Reverse Bids are restricted strictly to registered Flower Decorators.
                </p>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-2xl border border-purple-500/40 space-y-2.5">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-purple-300 text-xs">
                    Customer Function Hall Booking & Slot Inquiries
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newHallBk = {
                        id: `HALL-${Math.floor(1000 + Math.random() * 9000)}`,
                        subRole: "function_hall",
                        merchantName:
                          currentUser?.fullName || "Sri Venkateswara Grand Function Hall",
                        customerName: "Suresh Deshmukh (Adilabad)",
                        venueAddress: myHallObj?.name || "Bypass Road, Adilabad",
                        eventDate: selectedHallDate,
                        packageTitle: `Full-Day AC Hall + Dining (${selectedShift})`,
                        totalContractAmount: hallRateEdit,
                        stage35Paid: true,
                        stage85Paid: false,
                        stage100Paid: false,
                        milestoneStatus: "35_PERCENT_ADVANCE_RECEIVED"
                      };
                      setDecorEscrowBookings([newHallBk, ...decorEscrowBookings]);
                      setFooterTab("escrow");
                      onTriggerToast(
                        `Hall Booking #${newHallBk.id} confirmed! Added to 35%|85% Escrow Ledger.`
                      );
                    }}
                    className="bg-purple-500 text-white font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer"
                  >
                    + Simulate Hall Booking
                  </button>
                </div>

                {myEscrowBookings.map((hb) => (
                  <div
                    key={hb.id}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-white text-[11px]">
                        #{hb.id} &bull; {hb.customerName} ({hb.eventDate})
                      </p>
                      <p className="text-[10px] text-purple-300">
                        {hb.packageTitle} | Rent: Rs.{hb.totalContractAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFooterTab("escrow")}
                      className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1.5 rounded-lg text-[9px] cursor-pointer"
                    >
                      Manage Escrow &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* FLOWER DECORATOR VIEW: Full Live Reverse Bidding Desk (Blocked from Hall Bookings) */
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-pink-500/40 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-black text-pink-300 text-xs">
                    2. Live Flower Decoration Reverse Bids ({decorReverseBids.length})
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Customers selected portfolio designs into their Decor Cart. Submit your lowest bid to win!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const simReq = {
                      id: `BID-${Math.floor(1000 + Math.random() * 9000)}`,
                      customerName: "Maheshwar Rao (Adilabad)",
                      eventDate: "2026-11-12",
                      venueName: "Subhash Nagar Function Hall, Adilabad",
                      selectedDesigns: [
                        "Royal Bangkok Orchid Wedding Mandap (40x16 ft)",
                        "Warm Amber LED Walkway & Entrance Arch"
                      ],
                      estimatedBudget: 32000,
                      lowestBidSoFar: 29500,
                      mySubmittedBid: null,
                      status: "OPEN_FOR_REVERSE_BIDS"
                    };
                    setDecorReverseBids([simReq, ...decorReverseBids]);
                    onTriggerToast(`New Customer Reverse Bid Request #${simReq.id} received!`);
                  }}
                  className="bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer shrink-0"
                >
                  + Test Bid Request
                </button>
              </div>

              {decorReverseBids.map((rfq) => (
                <div
                  key={rfq.id}
                  className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-amber-400">
                        #{rfq.id} &bull; Event Date: {rfq.eventDate}
                      </span>
                      <p className="font-bold text-white text-[11px] mt-0.5">
                        Customer: {rfq.customerName} | Venue: {rfq.venueName}
                      </p>
                    </div>
                    <span className="bg-pink-500/20 border border-pink-400 text-pink-200 px-2 py-0.5 rounded text-[9px] font-black">
                      Lowest Bid: Rs.{rfq.lowestBidSoFar.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-[9px] text-slate-400 font-bold">
                      Customer Selected Portfolio Designs:
                    </p>
                    {(rfq.selectedDesigns || []).map((d, idx) => (
                      <p key={idx} className="text-[10px] text-emerald-300 font-bold">
                        &bull; {d}
                      </p>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="number"
                      placeholder={`Beat Rs.${rfq.lowestBidSoFar}`}
                      value={bidAmountInputs[rfq.id] ?? ""}
                      onChange={(e) =>
                        setBidAmountInputs({ ...bidAmountInputs, [rfq.id]: e.target.value })
                      }
                      className="bg-slate-900 border border-amber-400/60 rounded-xl p-1.5 text-amber-300 font-bold text-[10px]"
                    />
                    <input
                      type="text"
                      placeholder="Included Flowers / Free Add-on"
                      value={bidNoteInputs[rfq.id] ?? ""}
                      onChange={(e) =>
                        setBidNoteInputs({ ...bidNoteInputs, [rfq.id]: e.target.value })
                      }
                      className="col-span-2 bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-white text-[10px]"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const myPrice =
                          Number(bidAmountInputs[rfq.id]) || rfq.lowestBidSoFar - 1000;
                        setDecorReverseBids(
                          decorReverseBids.map((b) =>
                            b.id === rfq.id
                              ? {
                                  ...b,
                                  lowestBidSoFar: Math.min(b.lowestBidSoFar, myPrice),
                                  mySubmittedBid: myPrice,
                                  myBidNotes:
                                    bidNoteInputs[rfq.id] ||
                                    "Fresh Grade-A Imported Flowers + Free Garland Set",
                                  status: "BID_SUBMITTED_L1_RANK"
                                }
                              : b
                          )
                        );
                        onTriggerToast(
                          `Submitted Reverse Bid of Rs.${myPrice.toLocaleString("en-IN")} for #${rfq.id}!`
                        );
                      }}
                      className="flex-1 bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-[10px] cursor-pointer"
                    >
                      Submit Competitive Reverse Bid (Rs.
                      {bidAmountInputs[rfq.id] || rfq.lowestBidSoFar - 1000})
                    </button>

                    {rfq.mySubmittedBid && (
                      <button
                        type="button"
                        onClick={() => {
                          const wonBooking = {
                            id: `DEC-${Math.floor(1000 + Math.random() * 9000)}`,
                            subRole: "flower_decorator",
                            merchantName:
                              currentUser?.fullName || "Padmavathi Royal Flower Decorators",
                            customerName: rfq.customerName,
                            venueAddress: rfq.venueName,
                            eventDate: rfq.eventDate,
                            packageTitle: (rfq.selectedDesigns || [])[0] || "Full Event Flower Decor",
                            totalContractAmount: rfq.mySubmittedBid,
                            stage35Paid: true,
                            stage85Paid: false,
                            stage100Paid: false,
                            milestoneStatus: "35_PERCENT_ADVANCE_RECEIVED"
                          };
                          setDecorEscrowBookings([wonBooking, ...decorEscrowBookings]);
                          setFooterTab("escrow");
                          onTriggerToast(
                            `Bid Won! Created 35%|85%|100% Escrow Contract #${wonBooking.id}.`
                          );
                        }}
                        className="bg-amber-400 text-slate-950 font-black px-3 rounded-xl text-[10px] cursor-pointer"
                      >
                        Convert to 35%|85% Escrow &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: 35% | 85% | 100% MILESTONE ESCROW LEDGER ("escrow")           */}
      {/* ==================================================================== */}
      {footerTab === "escrow" && (
        <div className="space-y-3">
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-amber-500/40 space-y-2.5">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-black text-amber-400 text-xs">
                  3. 35% | 85% | 100% Milestone Escrow & Payment Request Desk
                </h4>
                <p className="text-[10px] text-slate-400">
                  All bookings for your {isHallMerchant ? "Function Hall" : "Flower Decoration"} account with milestone payment requests
                </p>
              </div>
              <select
                value={escrowFilter}
                onChange={(e) => setEscrowFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white text-[10px] font-bold"
              >
                <option value="ALL">All Bookings ({myEscrowBookings.length})</option>
                <option value="STAGE_35">35% Advance Stage</option>
                <option value="STAGE_85">85% Setup Ready Stage</option>
                <option value="COMPLETED">100% Settled</option>
              </select>
            </div>

            {/* Consort Rules Explainer Banner */}
            <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950 p-2 rounded-xl border border-slate-800 text-[9px]">
              <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                <p className="font-black text-emerald-400">1st Release: 35%</p>
                <p className="text-slate-400">On Booking & Material/Date Block</p>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40">
                <p className="font-black text-amber-300">2nd Release: 85%</p>
                <p className="text-slate-400">+50% on Venue Setup Photo Proof</p>
              </div>
              <div className="p-1.5 rounded-lg bg-teal-950/40 border border-teal-500/40">
                <p className="font-black text-teal-300">Final: 100%</p>
                <p className="text-slate-400">+15% on Event Completion</p>
              </div>
            </div>

            {myEscrowBookings
              .filter((bk) => {
                if (escrowFilter === "STAGE_35") return bk.stage35Paid && !bk.stage85Paid;
                if (escrowFilter === "STAGE_85") return bk.stage85Paid && !bk.stage100Paid;
                if (escrowFilter === "COMPLETED") return bk.stage100Paid;
                return true;
              })
              .map((bk) => {
                const total = Number(bk.totalContractAmount || 30000);
                const amt35 = Math.round(total * 0.35);
                const amt50 = Math.round(total * 0.5);
                const amt15 = total - amt35 - amt50;

                return (
                  <div
                    key={bk.id}
                    className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2.5"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-black text-emerald-400 text-xs">
                          #{bk.id} &bull; Event Date: {bk.eventDate}
                        </span>
                        <p className="font-bold text-white text-[11px] mt-0.5">
                          {bk.packageTitle}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Customer: <strong>{bk.customerName}</strong> | Venue: {bk.venueAddress}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadEscrowPdf(bk)}
                        className="bg-slate-800 border border-amber-400/50 text-amber-300 font-black px-2.5 py-1 rounded-lg text-[9px] cursor-pointer shrink-0"
                      >
                        PDF Statement
                      </button>
                    </div>

                    {/* 3-Stage Milestone Progress & Raise Payment Request Buttons */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-800">
                      {/* Stage 1: 35% */}
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded-xl">
                        <div>
                          <p className="font-bold text-white text-[10px]">
                            Milestone 1 (35% Advance): Rs.{amt35.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[9px] text-slate-400">
                            For raw flowers / hall date blocking
                          </p>
                        </div>
                        {bk.stage35Paid ? (
                          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg text-[9px] font-black">
                            35% RECEIVED \u2713
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setDecorEscrowBookings(
                                decorEscrowBookings.map((x) =>
                                  x.id === bk.id
                                    ? {
                                        ...x,
                                        stage35Paid: true,
                                        milestoneStatus: "35_PERCENT_ADVANCE_RELEASED"
                                      }
                                    : x
                                )
                              );
                              onTriggerToast(
                                `Raised & Released 35% Advance (Rs.${amt35}) for #${bk.id}!`
                              );
                            }}
                            className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[9px] cursor-pointer"
                          >
                            Raise 35% Payment Req
                          </button>
                        )}
                      </div>

                      {/* Stage 2: +50% = 85% Cumulative */}
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded-xl gap-2">
                        <div>
                          <p className="font-bold text-amber-300 text-[10px]">
                            Milestone 2 (85% Setup Ready): +Rs.{amt50.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[9px] text-slate-400">
                            Upload live stage/hall readiness photo via Camera or Gallery to claim
                          </p>
                        </div>
                        {bk.stage85Paid ? (
                          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg text-[9px] font-black shrink-0">
                            85% RELEASED \u2713
                          </span>
                        ) : (
                          <div className="flex gap-1 shrink-0">
                            <label className="bg-amber-400 text-slate-950 font-black px-2 py-1 rounded-lg text-[9px] cursor-pointer">
                              \uD83D\uDCF7 Camera Proof
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => handleUploadMilestoneProof(bk.id, e)}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setDecorEscrowBookings(
                                  decorEscrowBookings.map((x) =>
                                    x.id === bk.id
                                      ? {
                                          ...x,
                                          stage85Paid: true,
                                          milestoneStatus: "85_PERCENT_CUMULATIVE_RELEASED"
                                        }
                                      : x
                                  )
                                );
                                onTriggerToast(
                                  `Raised 85% Milestone Request (+Rs.${amt50}) for #${bk.id}!`
                                );
                              }}
                              className="bg-indigo-500 text-white font-black px-2 py-1 rounded-lg text-[9px] cursor-pointer"
                            >
                              Raise 85% Req
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Stage 3: +15% = 100% Final Settlement */}
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded-xl">
                        <div>
                          <p className="font-bold text-teal-300 text-[10px]">
                            Milestone 3 (100% Final): +Rs.{amt15.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[9px] text-slate-400">
                            Final 15% handover after event completion
                          </p>
                        </div>
                        {bk.stage100Paid ? (
                          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg text-[9px] font-black">
                            100% SETTLED \u2713
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setDecorEscrowBookings(
                                decorEscrowBookings.map((x) =>
                                  x.id === bk.id
                                    ? {
                                        ...x,
                                        stage35Paid: true,
                                        stage85Paid: true,
                                        stage100Paid: true,
                                        milestoneStatus: "100_PERCENT_COMPLETED_SETTLED"
                                      }
                                    : x
                                )
                              );
                              onTriggerToast(
                                `Raised Final 100% Settlement Request (+Rs.${amt15}) for #${bk.id}!`
                              );
                            }}
                            className="bg-teal-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[9px] cursor-pointer"
                          >
                            Raise Final 15% Req
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: HIGH-RES PORTFOLIO & STOCK MAINTENANCE ("portfolio")          */}
      {/* ==================================================================== */}
      {footerTab === "portfolio" && (
        <div className="space-y-3">
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-emerald-500/40 space-y-2.5">
            <h4 className="font-black text-emerald-400 text-xs">
              4. High-Resolution Portfolio & Stock Maintenance ({isHallMerchant ? "Function Hall" : "Flower Decorator"})
            </h4>
            <p className="text-[10px] text-slate-400">
              Maintain your albums, materials, stage sizes & approx prices. Strictly isolated to your login account & synced to Customer App for Cart & Reverse Bidding.
            </p>

            {/* High-Res Camera or Gallery Upload Box */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/50 space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={portfolioForm.highResImage}
                  alt="High Res Preview"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400 shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <p className="font-bold text-amber-300 text-[10px]">
                    High-Resolution Album Photo ({portfolioForm.imageSourceLabel})
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <label className="bg-emerald-400 text-slate-950 font-black py-1.5 px-2 rounded-lg text-[9px] text-center cursor-pointer">
                      \uD83D\uDCF7 Take Camera Photo
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handlePortfolioPhotoSelect(e, "Mobile Camera")}
                        className="hidden"
                      />
                    </label>
                    <label className="bg-indigo-500 text-white font-black py-1.5 px-2 rounded-lg text-[9px] text-center cursor-pointer">
                      \uD83D\uDDBC\uFE0F Upload from Gallery
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePortfolioPhotoSelect(e, "Phone Gallery")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                value={portfolioForm.title}
                onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                placeholder={
                  isHallMerchant
                    ? "Hall Package Name (e.g. Grand AC Muhurtham Hall)"
                    : "Decoration Name (e.g. Royal Lotus Orchid Mandap)"
                }
                className="col-span-2 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <input
                type="text"
                value={portfolioForm.decorType}
                onChange={(e) =>
                  setPortfolioForm({ ...portfolioForm, decorType: e.target.value })
                }
                placeholder="Type (Mandap / Reception / Haldi / Hall)"
                className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <input
                type="text"
                value={portfolioForm.albumName}
                onChange={(e) =>
                  setPortfolioForm({ ...portfolioForm, albumName: e.target.value })
                }
                placeholder="Album Name (e.g. Wedding 2026 Album)"
                className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <input
                type="text"
                value={portfolioForm.materialUsed}
                onChange={(e) =>
                  setPortfolioForm({ ...portfolioForm, materialUsed: e.target.value })
                }
                placeholder="Material (Fresh Orchids, LED Truss, Velvet)"
                className="col-span-2 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <input
                type="text"
                value={portfolioForm.dimensionsSize}
                onChange={(e) =>
                  setPortfolioForm({ ...portfolioForm, dimensionsSize: e.target.value })
                }
                placeholder="Size / Dimensions (e.g. 40x16 ft Stage)"
                className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <input
                type="number"
                value={portfolioForm.approxPrice}
                onChange={(e) =>
                  setPortfolioForm({
                    ...portfolioForm,
                    approxPrice: Number(e.target.value) || 15000
                  })
                }
                placeholder="Estimated Approx Price (Rs.)"
                className="bg-slate-950 border border-emerald-500/50 rounded-xl p-2 text-emerald-300 font-bold"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!portfolioForm.title.trim()) {
                  alert("Please enter the Decoration / Hall Package Name.");
                  return;
                }
                const newItem = {
                  id: `pf_${Date.now()}`,
                  ownerId: currentUser?.id || 401,
                  ownerPhone: currentUser?.phone || "9848044556",
                  merchantName:
                    currentUser?.fullName ||
                    (isHallMerchant
                      ? "Sri Venkateswara Grand Function Hall"
                      : "Padmavathi Royal Flower Decorators"),
                  subRole,
                  title: portfolioForm.title.trim(),
                  decorType: portfolioForm.decorType,
                  materialUsed: portfolioForm.materialUsed,
                  albumName: portfolioForm.albumName,
                  dimensionsSize: portfolioForm.dimensionsSize,
                  baseEstimate: Number(portfolioForm.approxPrice) || 22000,
                  image: portfolioForm.highResImage,
                  updatedAt: new Date().toLocaleDateString("en-IN"),
                  isApproved: isApprovedLive
                };
                setDecorPortfolio([newItem, ...decorPortfolio]);
                setPortfolioForm({ ...portfolioForm, title: "" });
                onTriggerToast(
                  `Saved "${newItem.title}" to your High-Res Portfolio & synced to Customer Decor Cart!`
                );
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
            >
              + Add High-Res Album Item to My Portfolio Stock
            </button>
          </div>

          {/* Owner-Isolated Portfolio Stock List */}
          <div className="space-y-2">
            <h5 className="font-black text-amber-400 text-xs px-1">
              My Uploaded Portfolio Albums ({myPortfolioItems.length} Items - Owner & Admin Control Only)
            </h5>
            {myPortfolioItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex gap-3 items-center"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover border border-amber-400/50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] text-amber-300 font-black">
                    {item.albumName} &bull; {item.decorType}
                  </span>
                  <h5 className="font-black text-white text-xs truncate">{item.title}</h5>
                  <p className="text-[10px] text-slate-300 truncate">
                    Material: {item.materialUsed}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold">
                    Size: {item.dimensionsSize} | Est. Price: Rs.
                    {Number(item.baseEstimate).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDecorPortfolio(decorPortfolio.filter((x) => x.id !== item.id));
                    onTriggerToast(`Removed ${item.title} from your Portfolio.`);
                  }}
                  className="bg-rose-950 border border-rose-500/40 text-rose-300 px-2.5 py-1.5 rounded-xl text-[9px] font-black cursor-pointer shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}