import React from "react";

// ============================================================================
// MODULE: src/modules/RoleFooterNav.jsx
// PURPOSE: Dedicated 5-Button Bottom Navigation Footer tailored to each role
//          Visible persistently from login to logout.
// ============================================================================
export default function RoleFooterNav({
  activePortal,
  footerTab,
  setFooterTab,
  totalCartCount = 0,
  totalOrdersCount = 0,
  brightTheme = true
}) {
  const ROLE_TABS = {
    customer: [
      { id: "home", icon: "\uD83C\uDFE0", label: "Stores" },
      { id: "services", icon: "\uD83D\uDD27", label: "Services" },
      { id: "carts", icon: "\uD83D\uDED2", label: `Carts (${totalCartCount})` },
      { id: "orders", icon: "\uD83D\uDCE6", label: `Orders (${totalOrdersCount})` },
      { id: "account", icon: "\uD83D\uDC64", label: "Account" }
    ],
    merchant: [
      { id: "home", icon: "\uD83D\uDCE6", label: `Queue (${totalOrdersCount})` },
      { id: "stock", icon: "\uD83D\uDCCB", label: "Stock Manual" },
      { id: "add_brand", icon: "\u2795", label: "Add Brand" },
      { id: "orders", icon: "\uD83E\uDDFE", label: "Invoices" },
      { id: "account", icon: "\uD83D\uDC64", label: "Account" }
    ],
    service_provider: [
      { id: "home", icon: "\uD83D\uDEE0\uFE0F", label: `Visits (${totalOrdersCount})` },
      { id: "slots", icon: "\u23F0", label: "1-Hr Slots" },
      { id: "add_service", icon: "\u2795", label: "Rate Card" },
      { id: "orders", icon: "\uD83E\uDDFE", label: "Escrow Bills" },
      { id: "account", icon: "\uD83D\uDC64", label: "Account" }
    ],
    decorator: [
      { id: "home", icon: "\uD83C\uDFDB\uFE0F", label: "Hall Calendar" },
      { id: "bidding", icon: "\uD83D\uDD28", label: "Reverse Bids" },
      { id: "escrow", icon: "\uD83D\uDD12", label: "35%/85% Escrow" },
      { id: "portfolio", icon: "\uD83C\uDF38", label: "Portfolio" },
      { id: "account", icon: "\uD83D\uDC64", label: "Account" }
    ],
    rider: [
      { id: "home", icon: "\uD83D\uDEF5", label: `Radar (${totalOrdersCount})` },
      { id: "map", icon: "\uD83D\uDDFA\uFE0F", label: "3-Pt Live Map" },
      { id: "batching", icon: "\u26A1", label: "Smart Batch" },
      { id: "orders", icon: "\u2B50", label: "Scorecard" },
      { id: "account", icon: "\uD83D\uDC64", label: "Account" }
    ]
  };

  const tabsToRender = ROLE_TABS[activePortal] || ROLE_TABS.customer;

  return (
    <div
      className={`border-t px-1.5 py-1.5 grid grid-cols-5 gap-1 text-[10px] font-extrabold shrink-0 z-40 transition-colors ${
        brightTheme
          ? "bg-white border-slate-200 text-slate-600 shadow-lg"
          : "bg-slate-950 border-emerald-900/60 text-slate-400"
      }`}
    >
      {tabsToRender.map((tab) => {
        const isActive = footerTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setFooterTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl cursor-pointer transition ${
              isActive
                ? "bg-emerald-600 text-white shadow-sm"
                : brightTheme
                ? "hover:bg-slate-100 text-slate-700"
                : "hover:bg-slate-900 text-slate-300"
            }`}
          >
            <span className="text-sm leading-none">{tab.icon}</span>
            <span className="mt-0.5 truncate max-w-full px-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}