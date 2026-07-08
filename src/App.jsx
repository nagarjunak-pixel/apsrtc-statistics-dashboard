import React, { useState, useEffect, useMemo } from 'react';
import { Bus, Ticket, DollarSign, Leaf, ChevronDown, Activity, MapPin } from 'lucide-react';
import Header from './components/Header';
import KPICards from './components/KPICards';
import FleetAnalytics from './components/FleetAnalytics';
import TicketAnalytics from './components/TicketAnalytics';
import FinancialAnalytics from './components/FinancialAnalytics';
import WhatIfSimulator from './components/WhatIfSimulator';
import EVTracker from './components/EVTracker';
import AIChatPanel from './components/AIChatPanel';
import MissionControl from './components/MissionControl';
import RouteHeatmap from './components/RouteHeatmap';

import {
  FLEET_CATEGORIES,
  BUS_CATEGORIES_METRICS,
  MONTHLY_FINANCIALS,
  DISTRICTS
} from './data/apsrtcData';

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [activeTab, setActiveTab] = useState('mission'); // 'mission', 'fleet', 'tickets', 'financials', 'routes', 'ev'
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Apply dark mode theme class to HTML element on change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Get active district weights
  const activeDistrictInfo = useMemo(() => {
    return DISTRICTS.find(d => d.id === selectedDistrict) || DISTRICTS[0];
  }, [selectedDistrict]);

  // Dynamically scale datasets based on selected district multipliers
  const scaledData = useMemo(() => {
    const { fleetMult, occMult, revMult } = activeDistrictInfo;

    // 1. Scale Fleet Categories
    const scaledFleet = JSON.parse(JSON.stringify(FLEET_CATEGORIES));
    Object.values(scaledFleet).forEach(cat => {
      cat.subcategories.forEach(sub => {
        sub.count = Math.max(1, Math.round(sub.count * fleetMult));
        sub.owned = Math.max(1, Math.round(sub.owned * fleetMult));
        sub.hired = Math.max(0, Math.round(sub.hired * fleetMult));
      });
    });

    // 2. Scale Ticket Bookings Metrics
    const scaledTickets = BUS_CATEGORIES_METRICS.map(item => {
      return {
        ...item,
        monthlyTickets: Math.max(100, Math.round(item.monthlyTickets * fleetMult * occMult)),
        occupancyRate: Math.min(98, Math.round(item.occupancyRate * occMult))
      };
    });

    // 3. Scale Monthly Financials
    const scaledFinancials = MONTHLY_FINANCIALS.map(m => {
      const scaledRev = {};
      const scaledExp = {};
      
      Object.entries(m.revenue).forEach(([k, v]) => {
        scaledRev[k] = Number((v * revMult).toFixed(1));
      });

      Object.entries(m.expense).forEach(([k, v]) => {
        scaledExp[k] = Number((v * revMult).toFixed(1));
      });

      return {
        ...m,
        revenue: scaledRev,
        expense: scaledExp
      };
    });

    return {
      fleet: scaledFleet,
      tickets: scaledTickets,
      financials: scaledFinancials
    };
  }, [activeDistrictInfo]);

  const tabs = [
    { id: 'mission', label: 'Mission Control', icon: Activity },
    { id: 'fleet', label: 'Fleet & Geography', icon: Bus },
    { id: 'tickets', label: 'Ticket Bookings', icon: Ticket },
    { id: 'financials', label: 'Financials & Cargo', icon: DollarSign },
    { id: 'routes', label: 'Route Analytics', icon: MapPin },
    { id: 'ev', label: 'EV & Sustainability', icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 transition-colors flex flex-col font-sans">
      {/* Header */}
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-8 space-y-6">
        
        {/* District Selector & Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm transition-colors">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              APSRTC Regional Scope Selector
            </h2>
            <p className="text-xs text-zinc-500">
              Filter stats to observe local depot counts and revenue contributions
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              {DISTRICTS.map(dist => (
                <option key={dist.id} value={dist.id}>
                  {dist.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* KPI metrics row (reactive to scaled data) */}
        <KPICards
          fleetData={scaledData.fleet}
          ticketData={scaledData.tickets}
          financialData={scaledData.financials}
        />

        {/* Tab Selection Row */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Body Render */}
        <div className="transition-all duration-300">
          {activeTab === 'mission' && (
            <MissionControl
              fleetData={scaledData.fleet}
              ticketData={scaledData.tickets}
              financialData={scaledData.financials}
            />
          )}
          {activeTab === 'fleet' && (
            <FleetAnalytics fleetData={scaledData.fleet} theme={theme} />
          )}
          {activeTab === 'tickets' && (
            <TicketAnalytics ticketData={scaledData.tickets} theme={theme} />
          )}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <FinancialAnalytics financialData={scaledData.financials} theme={theme} />
              <WhatIfSimulator financialData={scaledData.financials} ticketData={scaledData.tickets} />
            </div>
          )}
          {activeTab === 'routes' && (
            <RouteHeatmap theme={theme} />
          )}
          {activeTab === 'ev' && (
            <EVTracker theme={theme} />
          )}
        </div>
      </main>

      {/* Floating Collapsible AI Chat Panel */}
      <AIChatPanel />

      {/* Footer info */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 bg-white dark:bg-[#0c0c0f] transition-colors mt-12">
        <p className="max-w-[1600px] mx-auto px-6">
          © {new Date().getFullYear()} Andhra Pradesh State Road Transport Corporation (APSRTC). Operational Data Statistics Dashboard.
        </p>
      </footer>
    </div>
  );
}
