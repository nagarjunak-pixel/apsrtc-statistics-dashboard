import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Ticket, Users, TrendingUp, Info } from 'lucide-react';

export default function TicketAnalytics({ ticketData, theme }) {
  // Aggregate Seater vs Sleeper
  const aggregates = useMemo(() => {
    let sleeperVolume = 0;
    let sleeperRevenue = 0;
    let seaterVolume = 0;
    let seaterRevenue = 0;

    ticketData.forEach(item => {
      // Split Night Rider mixed capacity: 50% sleeper, 50% seater
      if (item.id === 'night_rider') {
        const halfTickets = item.monthlyTickets / 2;
        sleeperVolume += halfTickets;
        sleeperRevenue += halfTickets * item.avgFare;
        seaterVolume += halfTickets;
        seaterRevenue += halfTickets * item.avgFare;
      } else if (item.id === 'vennela' || item.id === 'star_liner') {
        sleeperVolume += item.monthlyTickets;
        sleeperRevenue += item.monthlyTickets * item.avgFare;
      } else {
        seaterVolume += item.monthlyTickets;
        seaterRevenue += item.monthlyTickets * item.avgFare;
      }
    });

    return {
      sleeper: { volume: sleeperVolume, revenue: sleeperRevenue / 10000000 }, // to Cr
      seater: { volume: seaterVolume, revenue: seaterRevenue / 10000000 } // to Cr
    };
  }, [ticketData]);

  // ECharts Seater vs Sleeper Share Option
  const chartOptionShare = useMemo(() => {
    const isDark = theme === 'dark';
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: <b>{c} M</b> tickets/mo ({d}%)',
        backgroundColor: isDark ? '#1e1e24' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 12 }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: { color: isDark ? '#a1a1aa' : '#52525b', fontFamily: 'DM Sans, sans-serif' }
      },
      series: [
        {
          name: 'Coach Ticket Share',
          type: 'pie',
          radius: '70%',
          center: ['60%', '50%'],
          itemStyle: {
            borderRadius: 4,
            borderColor: isDark ? '#0c0c0f' : '#ffffff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          data: [
            { name: 'Sleeper Coaches', value: Number((aggregates.sleeper.volume / 1000000).toFixed(2)), itemStyle: { color: '#f59e0b' } },
            { name: 'Seating Coaches', value: Number((aggregates.seater.volume / 1000000).toFixed(2)), itemStyle: { color: '#3b82f6' } }
          ]
        }
      ]
    };
  }, [aggregates, theme]);

  // ECharts Occupancy bar chart option
  const chartOptionOccupancy = useMemo(() => {
    const isDark = theme === 'dark';
    
    // Sort ticket categories by occupancy rate
    const sortedData = [...ticketData].sort((a, b) => b.occupancyRate - a.occupancyRate);
    const names = sortedData.map(d => d.id.replace('_', ' ').toUpperCase());
    const occupancyRates = sortedData.map(d => d.occupancyRate);

    return {
      grid: {
        top: '10%',
        bottom: '20%',
        left: '10%',
        right: '5%'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: <b>{c}%</b> Occupancy',
        backgroundColor: isDark ? '#1e1e24' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 12 }
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: {
          rotate: 45,
          color: isDark ? '#a1a1aa' : '#52525b',
          fontSize: 9,
          fontFamily: 'DM Sans, sans-serif'
        },
        axisLine: { lineStyle: { color: isDark ? '#27272a' : '#e4e4e7' } }
      },
      yAxis: {
        type: 'value',
        min: 60,
        max: 100,
        axisLabel: { color: isDark ? '#a1a1aa' : '#52525b', fontFamily: 'DM Sans, sans-serif' },
        splitLine: { lineStyle: { color: isDark ? '#1e1e24' : '#f4f4f5' } }
      },
      series: [
        {
          name: 'Occupancy Rate',
          type: 'bar',
          data: occupancyRates,
          itemStyle: {
            color: '#10b981',
            borderRadius: [4, 4, 0, 0]
          }
        }
      ]
    };
  }, [ticketData, theme]);

  return (
    <div className="space-y-6">
      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Share Chart */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors">
          <h3 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-1 flex items-center gap-1.5">
            <Ticket className="h-4 w-4 text-blue-500" /> Ticket Volume Distribution (Sleeper vs Seater)
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Comparison of monthly tickets booked by sleeper berth vs passenger seats
          </p>
          <div className="h-[230px]">
            <ReactECharts option={chartOptionShare} style={{ height: '100%', width: '100%' }} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
            <div>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase">Sleeper Coach Volume</span>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                {Math.round(aggregates.sleeper.volume).toLocaleString()} Tickets/mo
              </p>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase">Seating Coach Volume</span>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                {Math.round(aggregates.seater.volume).toLocaleString()} Tickets/mo
              </p>
            </div>
          </div>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors">
          <h3 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-1 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-emerald-500" /> Passenger Occupancy Ratio (OR) by Class
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Percentage of occupied capacity per dispatch service (Average OR: 92%)
          </p>
          <div className="h-[230px]">
            <ReactECharts option={chartOptionOccupancy} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Ticket Metrics Table */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-1">
            Detailed Ticket Bookings Analysis
          </h3>
          <p className="text-xs text-zinc-500">
            Granular revenue and capacity calculations per vehicle classification
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Service Category</th>
                <th className="px-6 py-4 text-right">Avg Ticket Fare</th>
                <th className="px-6 py-4 text-right">Monthly Tickets</th>
                <th className="px-6 py-4 text-right">Occupancy Rate</th>
                <th className="px-6 py-4 text-right">Monthly Revenue</th>
                <th className="px-6 py-4 text-right">Trips / Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-200">
              {ticketData.map(item => {
                const monthlyRev = (item.monthlyTickets * item.avgFare) / 10000000; // in Cr
                return (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 font-bold">
                      {item.id.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold">
                      ₹{item.avgFare}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-zinc-600 dark:text-zinc-300">
                      {item.monthlyTickets.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        item.occupancyRate >= 92 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                          : item.occupancyRate >= 88
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        {item.occupancyRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      ₹{monthlyRev.toFixed(2)} Cr
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-zinc-500">
                      {item.tripsPerDay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Info panel */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800 flex gap-2.5 items-center text-zinc-500 dark:text-zinc-400 text-xs">
          <Info className="h-4 w-4 text-blue-500 shrink-0" />
          <span>
            <b>Fare Calculations:</b> Tickets sold count includes free-travel tickets claimed under the <i>Stree Shakti</i> scheme, which are reimbursed by the Government of Andhra Pradesh at standard fare values.
          </span>
        </div>
      </div>
    </div>
  );
}
