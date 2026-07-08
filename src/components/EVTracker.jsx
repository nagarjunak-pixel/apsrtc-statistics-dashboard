import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Leaf, Zap, HelpCircle, ShieldCheck } from 'lucide-react';
import { EV_DEPOT_CHARGING } from '../data/apsrtcData';

export default function EVTracker({ theme }) {
  
  // Calculations
  const stats = useMemo(() => {
    let totalChargers = 0;
    let activeEVs = 0;
    let totalPower = 0;
    let sumUtil = 0;

    EV_DEPOT_CHARGING.forEach(depot => {
      totalChargers += depot.totalChargers;
      activeEVs += depot.activeBuses;
      totalPower += depot.powerConsMo;
      sumUtil += depot.avgUtilization;
    });

    const avgUtilization = sumUtil / EV_DEPOT_CHARGING.length;

    // Dynamic Carbon Savings
    // Standard BS6 Diesel bus emits ~1.1 kg CO2 per km.
    // Average bus runs ~300 km daily.
    // Daily CO2 per diesel bus = 300 * 1.1 = 330 kg = 0.33 metric tons.
    // For our EV fleet (100 buses) over a month (30 days):
    // 100 * 0.33 * 30 = 990 metric tons of CO2 offset monthly!
    const co2SavedMonthly = activeEVs * 0.33 * 30;

    return {
      totalChargers,
      activeEVs,
      totalPower,
      avgUtilization,
      co2SavedMonthly
    };
  }, []);

  // ECharts options for charger utilization
  const chartOptionDepot = useMemo(() => {
    const isDark = theme === 'dark';
    const depots = EV_DEPOT_CHARGING.map(d => d.depot.split(' ')[0]);
    const utils = EV_DEPOT_CHARGING.map(d => d.avgUtilization);
    const powers = EV_DEPOT_CHARGING.map(d => d.powerConsMo / 1000); // to MWh

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#1e1e24' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 11 }
      },
      legend: {
        data: ['Avg Utilization %', 'Energy Consumed (MWh)'],
        textStyle: { color: isDark ? '#a1a1aa' : '#52525b', fontFamily: 'DM Sans, sans-serif' }
      },
      grid: {
        top: '15%',
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: depots,
        axisLabel: { color: isDark ? '#a1a1aa' : '#52525b', fontFamily: 'DM Sans, sans-serif' },
        axisLine: { lineStyle: { color: isDark ? '#27272a' : '#e4e4e7' } }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Utilization %',
          min: 0,
          max: 100,
          axisLabel: { color: isDark ? '#a1a1aa' : '#52525b', formatter: '{value}%' },
          splitLine: { lineStyle: { color: isDark ? '#1e1e24' : '#f4f4f5' } }
        },
        {
          type: 'value',
          name: 'Power (MWh)',
          axisLabel: { color: isDark ? '#a1a1aa' : '#52525b', formatter: '{value} MWh' },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'Avg Utilization %',
          type: 'bar',
          data: utils,
          itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] }
        },
        {
          name: 'Energy Consumed (MWh)',
          type: 'line',
          yAxisIndex: 1,
          data: powers,
          itemStyle: { color: '#3b82f6' },
          lineStyle: { width: 3 }
        }
      ]
    };
  }, [theme]);

  return (
    <div className="space-y-6">
      {/* Visual Sustainability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Carbon Offset Card */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              Monthly CO₂ Emission Offset
            </span>
            <h4 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 mt-0.5 font-mono">
              {Math.round(stats.co2SavedMonthly)} Metric Tons
            </h4>
            <span className="text-[9px] text-zinc-400 font-medium">
              Offset equivalent to planting ~45,000 trees
            </span>
          </div>
        </div>

        {/* Energy Consumption Card */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              Total Power Consumed
            </span>
            <h4 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 mt-0.5 font-mono">
              {(stats.totalPower / 1000).toFixed(1)} MWh
            </h4>
            <span className="text-[9px] text-zinc-400 font-medium">
              Total energy consumed by EV dispatches monthly
            </span>
          </div>
        </div>

        {/* Active Chargers Card */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4 transition-colors">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              Active Charger Networks
            </span>
            <h4 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 mt-0.5 font-mono">
              {stats.totalChargers} Plugs
            </h4>
            <span className="text-[9px] text-zinc-400 font-medium">
              Across 3 major municipal charging corridors
            </span>
          </div>
        </div>
      </div>

      {/* Depot Charging EChart & Status table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Chart */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-1">
            Depot Charger Load & Energy Consumed
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Comparison of charger utilization and monthly energy draw across active electric depots
          </p>
          <div className="h-[250px]">
            <ReactECharts option={chartOptionDepot} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Depot Status List */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-1">
              Active Electrification Depots Status
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Detailed tracking metrics of charging installations
            </p>

            <div className="space-y-4">
              {EV_DEPOT_CHARGING.map(depot => (
                <div key={depot.depot} className="border border-zinc-100 dark:border-zinc-800 p-3 rounded-lg flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/10">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {depot.depot}
                    </h4>
                    <span className="text-[10px] text-zinc-400">
                      Active EV Buses: <b>{depot.activeBuses}</b>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                      {depot.avgUtilization}% Utilized
                    </span>
                    <p className="text-[11px] font-mono text-zinc-500 mt-1">
                      {(depot.powerConsMo / 1000).toFixed(0)} MWh
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/80 rounded-lg text-[10px] text-zinc-500 dark:text-zinc-400 flex items-start gap-2 mt-4">
            <HelpCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              APSRTC is executing a transition roadmap to convert 8,321 diesel buses to electric in phased intervals. High charger utilization at Tirupati is driven by heavy passenger traffic on Tirupati-Tirumala ghat routes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
