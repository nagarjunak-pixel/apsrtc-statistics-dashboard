import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Activity, Radio, Clock, TrendingUp, Zap, Users, Bus, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

// Simulated real-time activity feed events
const EVENT_TEMPLATES = [
  { type: 'departure', text: 'Amaravathi AP-09-AB-1234 departed from PNBS Vijayawada', icon: Bus, color: 'blue' },
  { type: 'arrival', text: 'Vennela AP-07-XY-5678 arrived at Tirupati Bus Stand', icon: CheckCircle, color: 'emerald' },
  { type: 'alert', text: 'Express AP-05-QR-9012 running 18 mins late on Guntur-Vjw route', icon: AlertTriangle, color: 'amber' },
  { type: 'charging', text: 'Green Sapthagiri EV-001 plugged in at Alipiri Depot Charger #12', icon: Zap, color: 'emerald' },
  { type: 'passenger', text: 'Peak passenger surge detected at Dwaraka Bus Stand (VSP)', icon: Users, color: 'purple' },
  { type: 'revenue', text: '₹2.4 Cr fare collection processed for Vijayawada zone', icon: TrendingUp, color: 'blue' },
  { type: 'departure', text: 'Super Luxury AP-33-PL-4455 departed from Tirupati to Hyderabad', icon: Bus, color: 'blue' },
  { type: 'arrival', text: 'Metro Express AP-99-MM-8888 arrived at Maddilapalem Depot', icon: CheckCircle, color: 'emerald' },
  { type: 'alert', text: 'Fuel level critical (<15%) for Garuda AP-11-KK-3344 near Kadapa', icon: AlertTriangle, color: 'rose' },
  { type: 'passenger', text: 'Stree Shakti free tickets: 1.2M issued today across all zones', icon: Users, color: 'cyan' },
];

function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    startTime.current = null;
    const step = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(eased * target);
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return (
    <span>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}

function ActivityFeed({ isPaused }) {
  const [events, setEvents] = useState(() => {
    return EVENT_TEMPLATES.slice(0, 4).map((e, i) => ({
      ...e,
      id: i,
      time: `${Math.floor(Math.random() * 5) + 1}m ago`,
    }));
  });

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      setEvents(prev => [
        {
          ...template,
          id: Date.now(),
          time: 'Just now',
        },
        ...prev.slice(0, 9),
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
      {events.map((event, idx) => {
        const Icon = event.icon;
        const colorMap = {
          blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
          emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
          amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
          rose: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
          purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
          cyan: 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400',
        };
        return (
          <div
            key={event.id}
            className={`flex items-start gap-3 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/20 transition-all duration-500 ${
              idx === 0 ? 'animate-in fade-in slide-in-from-top-2' : ''
            }`}
          >
            <div className={`p-1.5 rounded-md shrink-0 ${colorMap[event.color]}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-snug truncate">
                {event.text}
              </p>
              <span className="text-[9px] text-zinc-400 font-medium mt-0.5 block">{event.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniSparkline({ data, color = '#3b82f6', height = 40, width = 120 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="3"
        fill={color}
      />
    </svg>
  );
}

export default function MissionControl({ fleetData, ticketData, financialData }) {
  const [isPaused, setIsPaused] = useState(false);

  // Compute key metrics
  const metrics = useMemo(() => {
    let totalBuses = 0, evBuses = 0, totalCapacity = 0;
    Object.values(fleetData).forEach(cat => {
      cat.subcategories.forEach(sub => {
        totalBuses += sub.count;
        if (sub.isEV) evBuses += sub.count;
        totalCapacity += sub.count * sub.seats;
      });
    });

    const totalTickets = ticketData.reduce((s, t) => s + t.monthlyTickets, 0);
    const avgOccupancy = ticketData.reduce((s, t) => s + t.occupancyRate, 0) / ticketData.length;

    const latestMonth = financialData[financialData.length - 1];
    const latestRev = Object.values(latestMonth.revenue).reduce((a, b) => a + b, 0);
    const latestExp = Object.values(latestMonth.expense).reduce((a, b) => a + b, 0);

    // Simulated real-time stats
    const activeBuses = Math.round(totalBuses * 0.78);
    const onTimePerformance = 94.2;
    const dailyPassengers = Math.round(totalTickets / 30);

    return { totalBuses, evBuses, totalCapacity, totalTickets, avgOccupancy, latestRev, latestExp, activeBuses, onTimePerformance, dailyPassengers };
  }, [fleetData, ticketData, financialData]);

  // Sparkline data (simulated trends)
  const revenueSparkline = useMemo(() => financialData.map(m => Object.values(m.revenue).reduce((a, b) => a + b, 0)), [financialData]);
  const passengerSparkline = [4.1, 4.3, 4.0, 4.5, 4.2, 4.6, 4.4, 4.5, 4.7, 4.5, 4.3, 4.5];
  const occupancySparkline = [91, 92, 90, 93, 91, 94, 92, 93, 95, 92, 91, 92];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Mission Control Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnptLTItMjJoMnYyaC0yVjhoMnYyaC0yVjhoMnYyaC0yVjh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Mission Control Center</h2>
                <p className="text-xs text-white/70">Real-time APSRTC Operations Overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Operations
              </span>
            </div>
          </div>

          {/* Hero Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Active Fleet</span>
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
              </div>
              <p className="text-2xl font-extrabold font-mono">
                <AnimatedCounter target={metrics.activeBuses} suffix=" / " />
                {metrics.totalBuses.toLocaleString()}
              </p>
              <p className="text-[10px] text-white/50 mt-1">buses on road now</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Daily Passengers</span>
                <Users className="h-4 w-4 text-blue-300" />
              </div>
              <p className="text-2xl font-extrabold font-mono">
                <AnimatedCounter target={metrics.dailyPassengers} prefix="" suffix="" />M
              </p>
              <p className="text-[10px] text-white/50 mt-1">passengers today</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">On-Time Performance</span>
                <Clock className="h-4 w-4 text-amber-300" />
              </div>
              <p className="text-2xl font-extrabold font-mono">
                <AnimatedCounter target={metrics.onTimePerformance} decimals={1} suffix="%" />
              </p>
              <p className="text-[10px] text-white/50 mt-1">within 5 min window</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">EV Fleet Share</span>
                <Zap className="h-4 w-4 text-emerald-300" />
              </div>
              <p className="text-2xl font-extrabold font-mono">
                <AnimatedCounter target={Math.round((metrics.evBuses / metrics.totalBuses) * 100)} suffix="%" />
              </p>
              <p className="text-[10px] text-white/50 mt-1">{metrics.evBuses} electric buses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Sparklines + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Sparkline */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Revenue Trend</span>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono">₹{revenueSparkline[revenueSparkline.length - 1].toFixed(1)} Cr</h4>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +8.2%
            </div>
          </div>
          <MiniSparkline data={revenueSparkline} color="#3b82f6" height={50} width={200} />
          <p className="text-[10px] text-zinc-400 mt-2">12-month revenue trajectory (₹ Cr)</p>
        </div>

        {/* Passenger Trend */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Daily Passengers (M)</span>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono">{passengerSparkline[passengerSparkline.length - 1]}M</h4>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +4.8%
            </div>
          </div>
          <MiniSparkline data={passengerSparkline} color="#10b981" height={50} width={200} />
          <p className="text-[10px] text-zinc-400 mt-2">Daily passenger volume trend (millions)</p>
        </div>

        {/* Occupancy Trend */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Avg Occupancy Rate</span>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono">{occupancySparkline[occupancySparkline.length - 1]}%</h4>
            </div>
            <div className="flex items-center gap-1 text-zinc-500 text-xs font-bold">
              <Minus className="h-3.5 w-3.5" />
              Stable
            </div>
          </div>
          <MiniSparkline data={occupancySparkline} color="#f59e0b" height={50} width={200} />
          <p className="text-[10px] text-zinc-400 mt-2">Fleet occupancy ratio over 12 months</p>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm transition-colors">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-md">
              <Radio className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Live Operations Feed</h3>
              <p className="text-[10px] text-zinc-500">Real-time dispatch events and alerts</p>
            </div>
          </div>
          <button
            onClick={() => setIsPaused(p => !p)}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
              isPaused
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40'
                : 'bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
            }`}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
        </div>
        <div className="p-4">
          <ActivityFeed isPaused={isPaused} />
        </div>
      </div>
    </div>
  );
}
