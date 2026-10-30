import React from "react";
import { getLangText } from "./i18n/indianLanguages";

export default function RoleFooterNav({
  activePortal,
  footerTab,
  setFooterTab,
  totalCartCount = 0,
  totalOrdersCount = 0,
  brightTheme = false,
  lang = "EN"
}) {
  const t = getLangText(lang);
  const navConfig = {
    customer: [
      { id: "home", icon: "\uD83C\uDFEA", label: t.navStores },
      { id: "services", icon: "\uD83D\uDEE0\uFE0F", label: t.navServices },
      { id: "carts", icon: "\uD83D\uDED2", label: t.navCarts, badge: totalCartCount },
      { id: "orders", icon: "\uD83D\uDCE6", label: t.navOrders, badge: totalOrdersCount },
      { id: "account", icon: "\uD83D\uDC64", label: t.navAccount }
    ],
    merchant: [
      { id: "home", icon: "\uD83D\uDCE5", label: t.navQueue, badge: totalOrdersCount },
      { id: "stock", icon: "\uD83D\uDCCB", label: t.navStock },
      { id: "add_brand", icon: "\u2795", label: t.navAddBrand },
      { id: "orders", icon: "\uD83E\uDDFE", label: t.navInvoices },
      { id: "account", icon: "\uD83D\uDC64", label: t.navAccount }
    ],
    service_provider: [
      { id: "home", icon: "\uD83D\uDCCD", label: t.navVisits, badge: totalOrdersCount },
      { id: "slots", icon: "\u23F0", label: t.navSlots },
      { id: "add_service", icon: "\uD83D\uDCB3", label: t.navRateCard },
      { id: "orders", icon: "\uD83E\uDDFE", label: t.navEscrowBills },
      { id: "account", icon: "\uD83D\uDC64", label: t.navAccount }
    ],
    decorator: [
      { id: "home", icon: "\uD83C\uDFAA", label: t.navHallCal },
      { id: "bids", icon: "\uD83D\uDCB0", label: t.navRevBids, badge: totalOrdersCount },
      { id: "escrow", icon: "\uD83D\uDEE1\uFE0F", label: t.navMilestone },
      { id: "portfolio", icon: "\uD83D\uDCF8", label: t.navPortfolio },
      { id: "account", icon: "\uD83D\uDC64", label: t.navAccount }
    ],
    rider: [
      { id: "home", icon: "\uD83D\uDEF5", label: t.navRadar, badge: totalOrdersCount },
      { id: "batch", icon: "\uD83D\uDDFA\uFE0F", label: t.navRouteMap },
      { id: "rates", icon: "\u26FD", label: t.navKmRate },
      { id: "orders", icon: "\uD83E\uDDFE", label: t.navEarnings },
      { id: "account", icon: "\uD83D\uDC64", label: t.navAccount }
    ]
  };

  const tabs = navConfig[activePortal] || navConfig.customer;
  return (
    <nav
      className={`absolute bottom-0 inset-x-0 z-40 grid grid-cols-5 border-t px-1 py-1.5 select-none ${
        brightTheme
          ? "bg-white border-slate-200 text-slate-800 shadow-lg"
          : "bg-slate-950 border-slate-800 text-slate-200 shadow-2xl"
      }`}
    >
      {tabs.map((tab) => {
        const active = footerTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFooterTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
              active
                ? "bg-emerald-500/20 text-emerald-500 font-black"
                : "opacity-75 hover:opacity-100"
            }`}
          >
            <span className="text-sm leading-none">{tab.icon}</span>
            <span className="text-[9px] mt-1 truncate max-w-[70px]">{tab.label}</span>
            {tab.badge > 0 && (
              <span className="absolute top-0.5 right-2 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}