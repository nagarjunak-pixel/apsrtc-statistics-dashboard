import React, { useState, useEffect } from 'react';
import { Bus, Ticket, DollarSign, Sliders } from 'lucide-react';
import Header from './components/Header';
import KPICards from './components/KPICards';
import FleetAnalytics from './components/FleetAnalytics';
import TicketAnalytics from './components/TicketAnalytics';
import FinancialAnalytics from './components/FinancialAnalytics';
import WhatIfSimulator from './components/WhatIfSimulator';

import {
  FLEET_CATEGORIES,
  BUS_CATEGORIES_METRICS,
  MONTHLY_FINANCIALS
} from './data/apsrtcData';

export default function App() {
  const [theme, setTheme] = useState(() => {
    // Initial check from localStorage or system theme preferences
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet', 'tickets', 'financials', 'simulator'

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 transition-colors flex flex-col font-sans">
      {/* Head header */}
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-8">
        
        {/* KPI metrics row */}
        <KPICards
          fleetData={FLEET_CATEGORIES}
          ticketData={BUS_CATEGORIES_METRICS}
          financialData={MONTHLY_FINANCIALS}
        />

        {/* Tab Selection Row */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto scrollbar-none">
          {[
            { id: 'fleet', label: 'Fleet & Categories', icon: Bus },
            { id: 'tickets', label: 'Ticket Bookings', icon: Ticket },
            { id: 'financials', label: 'Revenue vs Expenses', icon: DollarSign },
            { id: 'simulator', label: 'What-If Policy Simulator', icon: Sliders }
          ].map(tab => {
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
          {activeTab === 'fleet' && (
            <FleetAnalytics fleetData={FLEET_CATEGORIES} theme={theme} />
          )}
          {activeTab === 'tickets' && (
            <TicketAnalytics ticketData={BUS_CATEGORIES_METRICS} theme={theme} />
          )}
          {activeTab === 'financials' && (
            <FinancialAnalytics financialData={MONTHLY_FINANCIALS} theme={theme} />
          )}
          {activeTab === 'simulator' && (
            <WhatIfSimulator financialData={MONTHLY_FINANCIALS} ticketData={BUS_CATEGORIES_METRICS} />
          )}
        </div>
      </main>

      {/* Footer info */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 bg-white dark:bg-[#0c0c0f] transition-colors mt-12">
        <p className="max-w-[1600px] mx-auto px-6">
          © {new Date().getFullYear()} Andhra Pradesh State Road Transport Corporation (APSRTC). Operational Data Statistics Dashboard.
        </p>
      </footer>
    </div>
  );
}
