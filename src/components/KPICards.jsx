import React from 'react';
import { Bus, Ticket, TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function KPICards({ fleetData, ticketData, financialData }) {
  // 1. Fleet Calculations
  let totalBuses = 0;
  let ownedBuses = 0;
  let hiredBuses = 0;
  let evBuses = 0;
  
  Object.values(fleetData).forEach(cat => {
    cat.subcategories.forEach(sub => {
      totalBuses += sub.count;
      ownedBuses += sub.owned;
      hiredBuses += sub.hired;
      if (sub.isEV) evBuses += sub.count;
    });
  });

  // 2. Ticket Calculations
  const totalMonthlyTickets = ticketData.reduce((sum, item) => sum + item.monthlyTickets, 0);
  const avgOccupancy = ticketData.reduce((sum, item) => sum + item.occupancyRate, 0) / ticketData.length;

  // 3. Financial Calculations
  const latestMonth = financialData[financialData.length - 1];
  const latestRev = Object.values(latestMonth.revenue).reduce((a, b) => a + b, 0);
  const latestExp = Object.values(latestMonth.expense).reduce((a, b) => a + b, 0);
  const latestMargin = latestRev - latestExp;

  // Year average
  let totalRevYr = 0;
  let totalExpYr = 0;
  financialData.forEach(m => {
    totalRevYr += Object.values(m.revenue).reduce((a, b) => a + b, 0);
    totalExpYr += Object.values(m.expense).reduce((a, b) => a + b, 0);
  });
  const avgRev = totalRevYr / financialData.length;
  const avgExp = totalExpYr / financialData.length;
  const avgMargin = avgRev - avgExp;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Fleet Size */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Active Fleet</span>
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <Bus className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 font-mono">
            {totalBuses.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-zinc-500">Buses</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
            {evBuses} EVs ({Math.round((evBuses/totalBuses)*100)}%)
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {Math.round((ownedBuses/totalBuses)*100)}% Owned / {Math.round((hiredBuses/totalBuses)*100)}% Hired
          </span>
        </div>
      </div>

      {/* Ticket Sales */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Monthly Passenger Traffic</span>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Ticket className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 font-mono">
            {Math.round(totalMonthlyTickets / 10000000)} Cr
          </span>
          <span className="text-xs font-semibold text-zinc-500">Tickets/mo</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 flex items-center gap-1">
            <Percent className="h-3 w-3" /> {Math.round(avgOccupancy)}% OR
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ~4.5M Daily Passengers
          </span>
        </div>
      </div>

      {/* Average Monthly Revenue */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Avg Monthly Revenue</span>
          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 font-mono">
            ₹{avgRev.toFixed(1)} Cr
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> Peak: ₹27.6 Cr/day
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Incl. Fares & Subsidies
          </span>
        </div>
      </div>

      {/* Operating Profit/Loss Margin */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Operating Net Margin</span>
          <div className={`p-2 rounded-lg ${avgMargin >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'}`}>
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-3xl font-extrabold tracking-tight font-mono ${avgMargin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {avgMargin >= 0 ? '+' : ''}₹{avgMargin.toFixed(1)} Cr
          </span>
          <span className="text-xs font-semibold text-zinc-500">/mo</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${avgMargin >= 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30'}`}>
            {((avgMargin / avgRev) * 100).toFixed(1)}% margin
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            GoAP Assisted Deficit
          </span>
        </div>
      </div>
    </div>
  );
}
