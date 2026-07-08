import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Search, ChevronRight, X, Info, HelpCircle, Map, List } from 'lucide-react';
import LiveFleetMap from './LiveFleetMap';

export default function FleetAnalytics({ fleetData, theme }) {
  const [subTab, setSubTab] = useState('list'); // 'list' or 'map'
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'ac', 'non_ac', 'ev', 'hired'

  // Flatten subcategories with parent information
  const allSubcategories = useMemo(() => {
    const list = [];
    Object.entries(fleetData).forEach(([catId, cat]) => {
      cat.subcategories.forEach(sub => {
        list.push({
          ...sub,
          categoryId: catId,
          categoryLabel: cat.label,
          color: cat.color
        });
      });
    });
    return list;
  }, [fleetData]);

  // Filter list based on search query and category filters
  const filteredSubcategories = useMemo(() => {
    return allSubcategories.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (selectedFilter === 'ac') matchesFilter = sub.categoryId === 'ac';
      else if (selectedFilter === 'non_ac') matchesFilter = sub.categoryId !== 'ac';
      else if (selectedFilter === 'ev') matchesFilter = sub.isEV;
      else if (selectedFilter === 'hired') matchesFilter = sub.hired > 0;
      
      return matchesSearch && matchesFilter;
    });
  }, [allSubcategories, searchQuery, selectedFilter]);

  // Chart data formatting
  const chartOption = useMemo(() => {
    const isDark = theme === 'dark';
    
    // Group counts
    const data = Object.entries(fleetData).map(([id, cat]) => {
      const count = cat.subcategories.reduce((sum, s) => sum + s.count, 0);
      return {
        name: cat.label,
        value: count,
        itemStyle: { color: cat.color }
      };
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: <b>{c}</b> buses ({d}%)',
        backgroundColor: isDark ? '#1e1e24' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: {
          color: isDark ? '#fafafa' : '#09090b',
          fontSize: 12
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: '0%',
        textStyle: {
          color: isDark ? '#a1a1aa' : '#52525b',
          fontFamily: 'DM Sans, sans-serif'
        }
      },
      series: [
        {
          name: 'Fleet Share',
          type: 'pie',
          radius: ['45%', '75%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: isDark ? '#0c0c0f' : '#ffffff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              formatter: '{b}\n{c} Buses',
              color: isDark ? '#fafafa' : '#09090b'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };
  }, [fleetData, theme]);

  return (
    <div className="space-y-6">
      {/* Fleet Sub-tabs */}
      <div className="flex justify-between items-center bg-zinc-100/50 dark:bg-zinc-900/10 p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors">
        <span className="text-xs font-semibold text-zinc-500 pl-2">Fleet Geographic View</span>
        <div className="flex gap-1 bg-zinc-200/50 dark:bg-[#09090b] p-1 rounded-lg">
          <button
            onClick={() => setSubTab('list')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              subTab === 'list'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <List className="h-3.5 w-3.5" /> Table Directory
          </button>
          <button
            onClick={() => setSubTab('map')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              subTab === 'map'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Map className="h-3.5 w-3.5" /> GPS Telemetry Map
          </button>
        </div>
      </div>

      {subTab === 'map' ? (
        <LiveFleetMap />
      ) : (
        <>
          {/* Visual Chart Card */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors">
            <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-1">
              Fleet Composition Distribution
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Analytical visualization of APSRTC's 10,951 buses classified by operational tiers
            </p>
            <div className="h-[280px]">
              <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          {/* Main Content Split: Table and Side Details Panel */}
          <div className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in duration-200">
            {/* Table Container */}
            <div className={`transition-all duration-300 w-full ${selectedRow ? 'lg:w-2/3' : 'lg:w-full'}`}>
              <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors">
                
                {/* Toolbar */}
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3 justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/10">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search bus categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Segmented control filters */}
                  <div className="flex flex-wrap gap-1 p-1 bg-zinc-100 dark:bg-[#09090b] rounded-lg">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'ac', label: 'AC' },
                      { id: 'non_ac', label: 'Non-AC' },
                      { id: 'ev', label: 'EVs' },
                      { id: 'hired', label: 'Hired' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedFilter(opt.id)}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                          selectedFilter === opt.id
                            ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Service Tier</th>
                        <th className="px-6 py-4">Category Class</th>
                        <th className="px-6 py-4 text-right">Count</th>
                        <th className="px-6 py-4 text-right">Cap. / Bus</th>
                        <th className="px-6 py-4">Structure</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-200">
                      {filteredSubcategories.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                            No bus categories match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredSubcategories.map(sub => (
                          <tr
                            key={sub.id}
                            onClick={() => setSelectedRow(sub)}
                            className={`hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors ${
                              selectedRow?.id === sub.id ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <td className="px-6 py-4 flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: sub.color }}
                              />
                              <span className="font-bold">{sub.name}</span>
                            </td>
                            <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                              {sub.categoryLabel}
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-bold">
                              {sub.count}
                            </td>
                            <td className="px-6 py-4 text-right font-mono">
                              {sub.seats} Seats
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                {sub.isEV && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 uppercase">
                                    Electric
                                  </span>
                                )}
                                <span className="text-zinc-400">
                                  {sub.owned} Owned / {sub.hired} Hired
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Side Details Drawer */}
            {selectedRow && (
              <div className="w-full lg:w-1/3 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-5 animate-in fade-in slide-in-from-right-5 duration-200 transition-all">
                <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Category details
                    </span>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
                      {selectedRow.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedRow(null)}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase">Total Buses</span>
                    <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {selectedRow.count}
                    </p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase">Unit Capacity</span>
                    <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {selectedRow.seats} seats
                    </p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase">RTC Owned</span>
                    <p className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {selectedRow.owned}
                    </p>
                    <span className="text-[9px] text-zinc-400 font-semibold">
                      {Math.round((selectedRow.owned / selectedRow.count) * 100)}% of Class
                    </span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase">Hired Out</span>
                    <p className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {selectedRow.hired}
                    </p>
                    <span className="text-[9px] text-zinc-400 font-semibold">
                      {Math.round((selectedRow.hired / selectedRow.count) * 100)}% of Class
                    </span>
                  </div>
                </div>

                {/* Calculations Panel */}
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 p-4 rounded-lg space-y-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-blue-500" /> Operational Capacity calculations
                  </span>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Max Single-trip Capacity:</span>
                      <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {(selectedRow.count * selectedRow.seats).toLocaleString()} Seats
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Fleet Energy Classification:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {selectedRow.isEV ? 'Electric (EV)' : 'Diesel (BS-VI)'}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-2 mt-1">
                      <span className="text-zinc-500 font-medium">RTC Sub-Tier Grouping:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedRow.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Help tip */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 text-xs rounded-lg flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Clicking different service classes filters specific details for that class. Hired buses are private assets operating under APSRTC logistics contracts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
