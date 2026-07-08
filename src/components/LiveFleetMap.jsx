import React, { useState, useEffect } from 'react';
import { Play, Pause, Navigation, Compass, AlertCircle } from 'lucide-react';
import { GPS_MARKERS } from '../data/apsrtcData';

export default function LiveFleetMap() {
  const [buses, setBuses] = useState(GPS_MARKERS);
  const [selectedBus, setSelectedBus] = useState(null);
  const [isLive, setIsLive] = useState(true);

  // Animate the markers slightly along schematic paths to simulate live movement
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setBuses(prev => 
        prev.map(bus => {
          // Add a tiny random offset to coordinates, keeping them in bounds
          const latOffset = (Math.random() - 0.5) * 0.005;
          const lngOffset = (Math.random() - 0.5) * 0.005;
          
          // Randomize speed slightly
          const speedVar = (Math.random() - 0.5) * 2;
          
          return {
            ...bus,
            lat: bus.lat + latOffset,
            lng: bus.lng + lngOffset,
            speed: Math.max(30, Math.min(80, Math.round(bus.speed + speedVar)))
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Sync selected bus details if it's moving
  const activeBusDetails = selectedBus 
    ? buses.find(b => b.id === selectedBus.id) 
    : null;

  return (
    <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5">
            <Navigation className="h-4.5 w-4.5 text-blue-500 animate-pulse" /> Live Telemetry GPS Tracking Map
          </h3>
          <p className="text-[11px] text-zinc-500">
            Real-time tracking of premium intercity coach dispatch routes (simulation)
          </p>
        </div>
        
        <button
          onClick={() => setIsLive(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
            isLive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40'
              : 'bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
          }`}
        >
          {isLive ? (
            <><Pause className="h-3.5 w-3.5" /> Simulation Live</>
          ) : (
            <><Play className="h-3.5 w-3.5" /> Simulation Paused</>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        {/* Schematic SVG Map */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/25 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl h-[380px] relative overflow-hidden flex items-center justify-center transition-colors">
          {/* AP Schematic Vector Outline */}
          <svg className="w-full h-full text-zinc-200 dark:text-zinc-800/40" viewBox="0 0 600 400" fill="none">
            {/* Schematic AP Boundary */}
            <path
              d="M 120,380 C 180,360 210,320 280,310 C 350,300 380,240 450,200 C 520,160 550,110 590,90 C 560,70 480,90 420,110 C 380,120 330,130 280,150 C 230,170 180,190 140,240 C 110,280 80,340 120,380 Z"
              fill="currentColor"
              opacity="0.3"
            />
            {/* Route connecting lines */}
            <path d="M 450,200 L 280,150" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" /> {/* Vsp - Vjw */}
            <path d="M 280,150 L 140,240" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" /> {/* Vjw - Tpt */}
            <path d="M 140,240 L 120,380" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" /> {/* Tpt - Nellore */}
            <path d="M 280,150 L 230,170" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" /> {/* Vjw - Guntur */}
          </svg>

          {/* District Nodes / City labels */}
          <div className="absolute top-[80px] right-[40px] text-center">
            <span className="h-2 w-2 rounded-full bg-zinc-400 inline-block"></span>
            <p className="text-[10px] text-zinc-400 font-semibold uppercase">Visakhapatnam</p>
          </div>
          <div className="absolute top-[160px] left-[270px] text-center">
            <span className="h-2 w-2 rounded-full bg-zinc-400 inline-block"></span>
            <p className="text-[10px] text-zinc-400 font-semibold uppercase">Vijayawada</p>
          </div>
          <div className="absolute top-[210px] left-[170px] text-center">
            <span className="h-2 w-2 rounded-full bg-zinc-400 inline-block"></span>
            <p className="text-[10px] text-zinc-400 font-semibold uppercase">Guntur</p>
          </div>
          <div className="absolute bottom-[100px] left-[110px] text-center">
            <span className="h-2 w-2 rounded-full bg-zinc-400 inline-block"></span>
            <p className="text-[10px] text-zinc-400 font-semibold uppercase">Tirupati</p>
          </div>
          <div className="absolute bottom-[40px] left-[90px] text-center">
            <span className="h-2 w-2 rounded-full bg-zinc-400 inline-block"></span>
            <p className="text-[10px] text-zinc-400 font-semibold uppercase">Kuppam</p>
          </div>

          {/* Active Bus Markers */}
          {buses.map(bus => {
            // Map lat/long values roughly to SVG viewport coordinates (600x400)
            // lat bounds: 13.5 to 17.5. lng bounds: 78 to 83
            const x = ((bus.lng - 77.5) / 5.5) * 600;
            const y = 400 - ((bus.lat - 13.0) / 4.5) * 400;

            const isSelected = selectedBus?.id === bus.id;
            const isEV = bus.category === 'Green Sapthagiri';

            return (
              <button
                key={bus.id}
                onClick={() => setSelectedRowOrBus(bus)}
                style={{ left: `${x}px`, top: `${y}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  {/* Ping animation */}
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${
                    isSelected 
                      ? 'bg-blue-500' 
                      : isEV 
                      ? 'bg-emerald-500' 
                      : 'bg-amber-500'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border border-white items-center justify-center ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : isEV 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-amber-500 text-white'
                  }`}>
                    <Compass className="h-2 w-2 animate-spin-slow" />
                  </span>
                </span>

                {/* Micro Hover Tooltip */}
                <span className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-zinc-900 text-white text-[9px] font-bold rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none shadow-md">
                  {bus.route} ({bus.speed} km/h)
                </span>
              </button>
            );
          })}
        </div>

        {/* Telemetry panel */}
        <div className="w-full lg:w-72 bg-zinc-50 dark:bg-zinc-900/35 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between transition-colors">
          {activeBusDetails ? (
            <div className="space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="text-[9px] font-bold uppercase text-blue-500 tracking-wider">
                  Active Dispatch telemetry
                </span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 font-mono mt-0.5">
                  {activeBusDetails.id.toUpperCase()}
                </h4>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Service Route:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-right">
                    {activeBusDetails.route}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Vehicle Category:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {activeBusDetails.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Telemetry Speed:</span>
                  <span className="font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                    {activeBusDetails.speed} km/h
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-zinc-500">GPS Coordinates:</span>
                  <span className="text-zinc-600 dark:text-zinc-300 text-[10px]">
                    {activeBusDetails.lat.toFixed(4)}N, {activeBusDetails.lng.toFixed(4)}E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Current Delay:</span>
                  <span className={`font-semibold ${
                    activeBusDetails.delay > 10 
                      ? 'text-rose-500' 
                      : activeBusDetails.delay > 0 
                      ? 'text-amber-500' 
                      : 'text-emerald-500'
                  }`}>
                    {activeBusDetails.delay === 0 ? 'On Time' : `${activeBusDetails.delay} mins`}
                  </span>
                </div>
              </div>

              {/* Progress bar fuel indicator */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-500">Charge / Fuel Level:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{activeBusDetails.fuel}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${activeBusDetails.fuel}%` }}
                    className={`h-full rounded-full ${
                      activeBusDetails.category === 'Green Sapthagiri' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-4">
              <Compass className="h-10 w-10 text-zinc-400 dark:text-zinc-600 animate-spin-slow mb-3" />
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-400">
                No GPS Node Selected
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">
                Click any of the pulsing route markers on the map to inspect live dispatcher telemetry details.
              </p>
            </div>
          )}

          {activeBusDetails?.delay > 15 && (
            <div className="mt-4 p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 text-[10px] rounded-lg flex items-start gap-1.5 border border-rose-200 dark:border-rose-900/10">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <p>
                <b>Route Delay Alert:</b> Bus is running behind schedule due to high density commuter loading at transit terminals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function setSelectedRowOrBus(bus) {
    setSelectedBus(bus);
  }
}
