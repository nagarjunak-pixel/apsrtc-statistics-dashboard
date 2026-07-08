import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { MapPin, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

const ROUTE_DATA = [
  { from: 'Vijayawada', to: 'Visakhapatnam', distance: 350, passengers: 18500, revenue: 42.5, occupancy: 94, trips: 45, avgSpeed: 58 },
  { from: 'Vijayawada', to: 'Tirupati', distance: 430, passengers: 22000, revenue: 38.2, occupancy: 96, trips: 52, avgSpeed: 55 },
  { from: 'Vijayawada', to: 'Hyderabad', distance: 275, passengers: 15800, revenue: 35.8, occupancy: 91, trips: 38, avgSpeed: 62 },
  { from: 'Vijayawada', to: 'Guntur', distance: 35, passengers: 32000, revenue: 8.5, occupancy: 98, trips: 120, avgSpeed: 35 },
  { from: 'Tirupati', to: 'Chennai', distance: 135, passengers: 28000, revenue: 28.4, occupancy: 97, trips: 65, avgSpeed: 52 },
  { from: 'Tirupati', to: 'Hyderabad', distance: 550, passengers: 12500, revenue: 32.1, occupancy: 88, trips: 28, avgSpeed: 60 },
  { from: 'Visakhapatnam', to: 'Hyderabad', distance: 620, passengers: 9800, revenue: 28.9, occupancy: 85, trips: 22, avgSpeed: 58 },
  { from: 'Visakhapatnam', to: 'Rajahmundry', distance: 190, passengers: 14200, revenue: 18.5, occupancy: 92, trips: 35, avgSpeed: 50 },
  { from: 'Guntur', to: 'Nellore', distance: 210, passengers: 11000, revenue: 15.2, occupancy: 89, trips: 30, avgSpeed: 54 },
  { from: 'Kadapa', to: 'Tirupati', distance: 260, passengers: 16500, revenue: 22.8, occupancy: 93, trips: 42, avgSpeed: 48 },
  { from: 'Rajahmundry', to: 'Vijayawada', distance: 160, passengers: 19500, revenue: 16.8, occupancy: 95, trips: 40, avgSpeed: 52 },
  { from: 'Visakhapatnam', to: 'Bhubaneswar', distance: 450, passengers: 7200, revenue: 24.5, occupancy: 82, trips: 18, avgSpeed: 56 },
];

export default function RouteHeatmap({ theme }) {
  const [sortBy, setSortBy] = useState('revenue');
  const [hoveredRoute, setHoveredRoute] = useState(null);

  const sortedRoutes = useMemo(() => {
    return [...ROUTE_DATA].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [sortBy]);

  const maxPassengers = Math.max(...ROUTE_DATA.map(r => r.passengers));
  const maxRevenue = Math.max(...ROUTE_DATA.map(r => r.revenue));

  // Treemap-style heatmap using scatter
  const chartOption = useMemo(() => {
    const isDark = theme === 'dark';
    const data = ROUTE_DATA.map(r => ({
      name: `${r.from} → ${r.to}`,
      value: [r.distance, r.occupancy, r.revenue, r.passengers / 1000],
      itemStyle: {
        color: r.occupancy >= 95 ? '#10b981' : r.occupancy >= 90 ? '#3b82f6' : r.occupancy >= 85 ? '#f59e0b' : '#ef4444',
      }
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          const route = ROUTE_DATA.find(r => `${r.from} → ${r.to}` === params.name);
          if (!route) return '';
          return `<div style="font-size:11px;line-height:1.6">
            <b>${route.from} → ${route.to}</b><br/>
            Distance: ${route.distance} km<br/>
            Passengers: ${route.passengers.toLocaleString()}/day<br/>
            Revenue: ₹${route.revenue} Cr/mo<br/>
            Occupancy: ${route.occupancy}%<br/>
            Avg Speed: ${route.avgSpeed} km/h
          </div>`;
        },
        backgroundColor: isDark ? '#1e1e24' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 11 }
      },
      grid: { top: '8%', bottom: '15%', left: '12%', right: '8%' },
      xAxis: {
        name: 'Distance (km)',
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: { color: isDark ? '#a1a1aa' : '#52525b', fontSize: 10 },
        type: 'value',
        axisLabel: { color: isDark ? '#a1a1aa' : '#52525b', fontSize: 9 },
        splitLine: { lineStyle: { color: isDark ? '#1e1e24' : '#f4f4f5' } }
      },
      yAxis: {
        name: 'Occupancy %',
        nameLocation: 'middle',
        nameGap: 35,
        nameTextStyle: { color: isDark ? '#a1a1aa' : '#52525b', fontSize: 10 },
        type: 'value',
        min: 75,
        max: 100,
        axisLabel: { color: isDark ? '#a1a1aa' : '#52525b', fontSize: 9, formatter: '{value}%' },
        splitLine: { lineStyle: { color: isDark ? '#1e1e24' : '#f4f4f5' } }
      },
      series: [{
        type: 'scatter',
        symbolSize: function(val) {
          return Math.max(15, (val[3] / 32) * 60);
        },
        data: data,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            formatter: '{b}',
            position: 'top',
            fontSize: 10,
            color: isDark ? '#fafafa' : '#09090b'
          }
        }
      }]
    };
  }, [theme]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors">
        <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-1 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" /> Route Performance Heatmap
        </h3>
        <p className="text-xs text-zinc-500 mb-5">
          Bubble size = daily passenger volume | Color = occupancy rate (Green: 95%+, Blue: 90%+, Amber: 85%+, Red: &lt;85%)
        </p>
        <div className="h-[320px]">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Route Rankings Table */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Route Rankings & Performance</h3>
            <p className="text-[11px] text-zinc-500">Sort and compare intercity route economics</p>
          </div>
          <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-[#09090b] rounded-lg">
            {[
              { id: 'revenue', label: 'Revenue' },
              { id: 'passengers', label: 'Passengers' },
              { id: 'occupancy', label: 'Occupancy' },
              { id: 'distance', label: 'Distance' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                  sortBy === opt.id
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3 text-right">Distance</th>
                <th className="px-5 py-3 text-right">Daily Passengers</th>
                <th className="px-5 py-3 text-right">Revenue (₹ Cr/mo)</th>
                <th className="px-5 py-3 text-right">Occupancy</th>
                <th className="px-5 py-3 text-right">Avg Speed</th>
                <th className="px-5 py-3 text-right">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-200">
              {sortedRoutes.map((route, idx) => {
                const efficiency = ((route.revenue / route.distance) * 100).toFixed(1);
                return (
                  <tr
                    key={`${route.from}-${route.to}`}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredRoute(route)}
                    onMouseLeave={() => setHoveredRoute(null)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 font-mono text-[10px] w-5">#{idx + 1}</span>
                        <span className="font-bold">{route.from}</span>
                        <ArrowRight className="h-3 w-3 text-zinc-400" />
                        <span className="font-bold">{route.to}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono">{route.distance} km</td>
                    <td className="px-5 py-3 text-right font-mono">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(route.passengers / maxPassengers) * 100}%` }}
                          />
                        </div>
                        {(route.passengers / 1000).toFixed(1)}K
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      ₹{route.revenue}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        route.occupancy >= 95
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                          : route.occupancy >= 90
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
                          : route.occupancy >= 85
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                      }`}>
                        {route.occupancy}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-zinc-500">{route.avgSpeed} km/h</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-mono font-bold ${
                        Number(efficiency) > 10 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {efficiency}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
