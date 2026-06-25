import React, { useState, useMemo } from 'react';
import { Sliders, RefreshCw, AlertTriangle, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function WhatIfSimulator({ financialData, ticketData }) {
  // Simulator input parameters
  const [fuelChange, setFuelChange] = useState(0); // -50% to +50%
  const [fareChange, setFareChange] = useState(0); // -20% to +50%
  const [occupancyChange, setOccupancyChange] = useState(0); // -15% to +15%
  const [evRate, setEvRate] = useState(1); // 1% to 100% EV conversion (baseline is ~1%)

  // Baseline Monthly Calculations (from historical seed)
  const baseline = useMemo(() => {
    let revSum = 0;
    let expSum = 0;
    financialData.forEach(m => {
      revSum += Object.values(m.revenue).reduce((a, b) => a + b, 0);
      expSum += Object.values(m.expense).reduce((a, b) => a + b, 0);
    });
    
    const avgRev = revSum / financialData.length;
    const avgExp = expSum / financialData.length;
    const avgMargin = avgRev - avgExp;
    
    // Average Monthly Fares, Fuel, Tickets
    const avgFares = financialData.reduce((sum, m) => sum + m.revenue.fare, 0) / financialData.length;
    const avgStreeShakti = financialData.reduce((sum, m) => sum + m.revenue.streeShakti, 0) / financialData.length;
    const avgFuel = financialData.reduce((sum, m) => sum + m.expense.fuel, 0) / financialData.length;
    const avgMaintenance = financialData.reduce((sum, m) => sum + m.expense.maintenance, 0) / financialData.length;
    
    const totalTickets = ticketData.reduce((sum, item) => sum + item.monthlyTickets, 0);

    return {
      avgRev,
      avgExp,
      avgMargin,
      avgFares,
      avgStreeShakti,
      avgFuel,
      avgMaintenance,
      totalTickets
    };
  }, [financialData, ticketData]);

  // Projected Monthly Calculations based on slider inputs
  const projected = useMemo(() => {
    // 1. Revenue projections
    // Fares (Cash + GoAP Reimbursement) are affected by Fare Change and Occupancy Change
    // Fares multiplier
    const fareMult = 1 + fareChange / 100;
    const occMult = 1 + occupancyChange / 100;
    
    const projectedFares = baseline.avgFares * fareMult * occMult;
    const projectedStreeShakti = baseline.avgStreeShakti * occMult; // GoAP covers occupancy but not user cash fare hike directly
    
    // Other revenue (logistics, commercial, subsidies) remains baseline
    const otherRev = baseline.avgRev - baseline.avgFares - baseline.avgStreeShakti;
    const totalProjectedRev = projectedFares + projectedStreeShakti + otherRev;

    // 2. Expense projections
    // Fuel expense is affected by Fuel Change and EV conversion rate (EV saves 50% fuel costs compared to diesel)
    const dieselFuelFraction = 1 - (evRate / 100);
    const evFuelFraction = evRate / 100;
    
    // Adjusted fuel cost based on fuel price change
    const adjustedDieselFuel = baseline.avgFuel * (1 + fuelChange / 100) * dieselFuelFraction;
    const adjustedEvFuel = baseline.avgFuel * 0.4 * evFuelFraction; // EV fuel/charging is 60% cheaper
    const totalProjectedFuel = adjustedDieselFuel + adjustedEvFuel;

    // Maintenance cost is reduced by EV conversion (EVs have 30% lower maintenance)
    const adjustedDieselMaint = baseline.avgMaintenance * dieselFuelFraction;
    const adjustedEvMaint = baseline.avgMaintenance * 0.7 * evFuelFraction;
    const totalProjectedMaint = adjustedDieselMaint + adjustedEvMaint;

    // Other expenses (personnel, hire charges, govt deposits, others) remain baseline
    const otherExp = baseline.avgExp - baseline.avgFuel - baseline.avgMaintenance;
    const totalProjectedExp = totalProjectedFuel + totalProjectedMaint + otherExp;

    // 3. Passenger projections
    const totalProjectedTickets = baseline.totalTickets * occMult;

    return {
      rev: totalProjectedRev,
      exp: totalProjectedExp,
      margin: totalProjectedRev - totalProjectedExp,
      tickets: totalProjectedTickets
    };
  }, [baseline, fuelChange, fareChange, occupancyChange, evRate]);

  const resetSliders = () => {
    setFuelChange(0);
    setFareChange(0);
    setOccupancyChange(0);
    setEvRate(1);
  };

  const marginDiff = projected.margin - baseline.avgMargin;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors">
        <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-5">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-0.5 flex items-center gap-1.5">
              <Sliders className="h-5 w-5 text-blue-500" /> Operational policy "What-If" Simulator
            </h3>
            <p className="text-xs text-zinc-500">
              Simulate adjustments in fuel markets, fare structures, transit demand, and electrification targets
            </p>
          </div>
          <button
            onClick={resetSliders}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-300 transition-colors shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset Default
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sliders Control Panel */}
          <div className="space-y-5">
            {/* Fare Adjustment */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label className="text-zinc-700 dark:text-zinc-300">Passenger Fare Hike / Discount</label>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {fareChange >= 0 ? '+' : ''}{fareChange}%
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                value={fareChange}
                onChange={(e) => setFareChange(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>-20% (Fare Drop)</span>
                <span>0% (Baseline)</span>
                <span>+50% (Hike)</span>
              </div>
            </div>

            {/* Fuel Price Change */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label className="text-zinc-700 dark:text-zinc-300">Fuel Market Price Shift (HSD/Diesel)</label>
                <span className="font-mono font-bold text-red-500">
                  {fuelChange >= 0 ? '+' : ''}{fuelChange}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={fuelChange}
                onChange={(e) => setFuelChange(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>-50% (Market Drop)</span>
                <span>0% (Baseline)</span>
                <span>+50% (Price Spike)</span>
              </div>
            </div>

            {/* Occupancy Rate Change */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label className="text-zinc-700 dark:text-zinc-300">Passenger Occupancy (OR) Variance</label>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {occupancyChange >= 0 ? '+' : ''}{occupancyChange}%
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                value={occupancyChange}
                onChange={(e) => setOccupancyChange(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>-15% (Less ridership)</span>
                <span>0% (92% OR Baseline)</span>
                <span>+15% (Capacity Peak)</span>
              </div>
            </div>

            {/* EV Conversion Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label className="text-zinc-700 dark:text-zinc-300">EV Fleet Electrification Conversion Target</label>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {evRate}% EV
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={evRate}
                onChange={(e) => setEvRate(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>1% (Current BS6)</span>
                <span>50% (Mid-term)</span>
                <span>100% (Zero Emission)</span>
              </div>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Projected Monthly Financials Summary
            </span>

            <div className="space-y-4">
              {/* Revenue */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-zinc-500">Projected Revenue</span>
                  <p className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-50">
                    ₹{projected.rev.toFixed(1)} Cr
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400">Baseline</span>
                  <p className="text-xs font-semibold font-mono text-zinc-500">
                    ₹{baseline.avgRev.toFixed(1)} Cr
                  </p>
                </div>
              </div>

              {/* Expenditure */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-zinc-500">Projected Expenditures</span>
                  <p className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-50">
                    ₹{projected.exp.toFixed(1)} Cr
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400">Baseline</span>
                  <p className="text-xs font-semibold font-mono text-zinc-500">
                    ₹{baseline.avgExp.toFixed(1)} Cr
                  </p>
                </div>
              </div>

              {/* Net Margin Result */}
              <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <div>
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Projected Margin</span>
                  <p className={`text-2xl font-extrabold font-mono ${projected.margin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {projected.margin >= 0 ? '+' : ''}₹{projected.margin.toFixed(1)} Cr
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400">Variance vs. Baseline</span>
                  <div className={`flex items-center gap-1 text-xs font-bold justify-end ${marginDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                    {marginDiff >= 0 ? (
                      <><ArrowUpRight className="h-4 w-4" /> +₹{marginDiff.toFixed(1)} Cr</>
                    ) : (
                      <><ArrowDownRight className="h-4 w-4" /> -₹{Math.abs(marginDiff).toFixed(1)} Cr</>
                    )}
                  </div>
                </div>
              </div>

              {/* Passengers tickets */}
              <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800/80 pt-3 text-xs">
                <span className="text-zinc-500">Projected Monthly Passengers:</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">
                  {Math.round(projected.tickets).toLocaleString()} Tickets/mo
                </span>
              </div>
            </div>

            {/* Warning alert if net margin is heavily negative */}
            {projected.margin < -30 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 text-xs rounded-lg flex items-start gap-2 border border-red-200 dark:border-red-800/20">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  <b>High Deficit Risk:</b> Selected policies exceed the sustainable subsidy bounds of APSRTC operations, creating severe treasury liabilities.
                </p>
              </div>
            )}

            {/* Profit alert */}
            {projected.margin >= 0 && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-xs rounded-lg flex items-start gap-2 border border-emerald-200 dark:border-emerald-800/20">
                <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  <b>Operating Surplus Achieved:</b> Simulator predicts APSRTC will achieve positive financial self-reliance under these policies, minimizing state dependency.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
