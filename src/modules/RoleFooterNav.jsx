import React from 'react';

// ============================================================================
// MODULE: RoleFooterNav.jsx
// PURPOSE: Provides a dedicated 5-button persistent bottom footer tailored to
//          each specific role (Customer, Merchant, Service Provider, Decorator, Captain)
//          visible from Login to Logout.
// ============================================================================

/* LEGACY REPLACED CODE (Retained as comment for maintenance history):
   Previously, a single static consumer footer was rendered for all portals:
   <div className="grid grid-cols-5">Home | Services | Carts | Orders | Account</div>
*/

export default function RoleFooterNav({
  activePortal,
  footerTab,
  setFooterTab,
  totalCartCount = 0,
  totalOrdersCount = 0,
  brightTheme = false
}) {
  // Define role-specific 5-tab configurations so each module holder gets their own tools
  const ROLE_TABS = {
    customer: [
      { id: 'home', icon: '🏠', label: 'Home' },
      { id: 'services', icon: '🔧', label: 'Services' },
      { id: 'carts', icon: '🛒', label: `Carts (${totalCartCount})` },
      { id: 'orders', icon: '📦', label: `Orders (${totalOrdersCount})` },
      { id: 'account', icon: '👤', label: 'Account' }
    ],
    merchant: [
      { id: 'home', icon: '📥', label: `Queue (${totalOrdersCount})` },
      { id: 'stock', icon: '📦', label: 'Stock Manual' },
      { id: 'add_brand', icon: '➕', label: 'Add Brand' },
      { id: 'orders', icon: '🧾', label: 'Order History' },
      { id: 'account', icon: '👤', label: 'Account' }
    ],
    service_provider: [
      { id: 'home', icon: '🔧', label: `Visits (${totalOrdersCount})` },
      { id: 'slots', icon: '🕒', label: '1-Hr Slots' },
      { id: 'add_service', icon: '➕', label: 'Add Service' },
      { id: 'orders', icon: '🔒', label: 'Escrow History' },
      { id: 'account', icon: '👤', label: 'Account' }
    ],
    decorator: [
      { id: 'home', icon: '🏛️', label: 'Hall Schedule' },
      { id: 'bidding', icon: '🎪', label: 'Reverse Bids' },
      { id: 'escrow', icon: '⚖️', label: '35/85% Escrow' },
      { id: 'portfolio', icon: '📸', label: 'Portfolio' },
      { id: 'account', icon: '👤', label: 'Account' }
    ],
    rider: [
      { id: 'home', icon: '📡', label: 'Radar' },
      { id: 'live_map', icon: '🗺️', label: 'Live Map' },
      { id: 'batching', icon: '⚡', label: 'Smart Batch' },
      { id: 'orders', icon: '🏆', label: 'Trips & Score' },
      { id: 'account', icon: '👤', label: 'Account' }
    ]
  };

  const tabsToRender = ROLE_TABS[activePortal] || ROLE_TABS.customer;

  return (
    <div
      className={`border-t px-1.5 py-1.5 grid grid-cols-5 gap-1 text-[9px] font-extrabold shrink-0 z-40 transition-colors ${
        brightTheme
          ? 'bg-white border-slate-200 text-slate-600 shadow-lg'
          : 'bg-[#040b0e] border-emerald-950/90 text-slate-400'
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
                ? brightTheme
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'hover:opacity-80'
            }`}
          >
            <span className="text-sm leading-none mb-0.5">{tab.icon}</span>
            <span className="truncate max-w-full px-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}