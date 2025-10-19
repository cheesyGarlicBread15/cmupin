import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Droplets, Activity, Map } from 'lucide-react';

export default function MapControls({
    baseMap,
    setBaseMap,
    showHeatmap,
    setShowHeatmap,
    showEarthquakes,
    setShowEarthquakes,
    isLoadingPrecip,
    isLoadingEarthquakes,
    lastUpdatePrecip,
    lastUpdateEarthquakes,
    earthquakes,
    heatmapData
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <>
            {/* Collapsed State - Simple button */}
            {isCollapsed && (
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 md:bottom-6 z-[1000]
                    flex items-center gap-2 bg-white/95 backdrop-blur-sm 
                    rounded-full shadow-lg px-6 py-3 border border-gray-200
                    hover:bg-white transition-all duration-300 hover:shadow-xl"
                >
                    <Map className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">Map Controls</span>
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                </button>
            )}

            {/* Expanded State - Full controls */}
            {!isCollapsed && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 md:bottom-6 z-[1000] w-[95%] max-w-md md:max-w-sm
                    bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Header with collapse button */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-2">
                            <Map className="w-5 h-5 text-gray-700" />
                            <h3 className="text-base font-semibold text-gray-900">Map Controls</h3>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Collapse controls"
                        >
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 max-h-[60vh] overflow-y-auto">
                        <div className="flex flex-col gap-4">
                            {/* Map Type Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Map className="w-4 h-4" />
                                    Map Style
                                </label>
                                <select
                                    value={baseMap}
                                    onChange={(e) => setBaseMap(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                    rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all cursor-pointer hover:bg-gray-100"
                                >
                                    <option value="street">Street Map</option>
                                    <option value="dark">Dark Mode</option>
                                    <option value="satellite">Satellite View</option>
                                    <option value="terrain">Terrain</option>
                                </select>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200"></div>

                            {/* Precipitation Toggle */}
                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <Droplets className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Precipitation</span>
                                            {showHeatmap && lastUpdatePrecip && (
                                                <div className="text-xs text-gray-500">
                                                    {isLoadingPrecip
                                                        ? 'Loading...'
                                                        : `Updated ${lastUpdatePrecip.toLocaleTimeString()}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={showHeatmap}
                                            onChange={(e) => setShowHeatmap(e.target.checked)}
                                        />
                                        <div
                                            className={`w-12 h-6 rounded-full transition-all duration-300 ${showHeatmap ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                        ></div>
                                        <div
                                            className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full 
                        transition-transform duration-300 shadow-sm ${showHeatmap ? 'translate-x-6' : ''
                                                }`}
                                        ></div>
                                    </div>
                                </label>

                                {/* Precipitation Legend */}
                                {showHeatmap && heatmapData.length > 0 && (
                                    <div className="ml-14 pl-1 space-y-2 animate-fadeIn">
                                        <div className="text-xs font-medium text-gray-600">Intensity (mm/h)</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 w-6">0</span>
                                            <div
                                                className="flex-1 h-2.5 rounded-full shadow-inner"
                                                style={{
                                                    background:
                                                        'linear-gradient(to right, #00ff00, #c8ff00, #ffff00, #ffc800, #ff6400, #ff0000)',
                                                }}
                                            ></div>
                                            <span className="text-xs text-gray-500 w-8 text-right">50+</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200"></div>

                            {/* Earthquake Toggle */}
                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                            <Activity className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Earthquakes</span>
                                            {showEarthquakes && lastUpdateEarthquakes && (
                                                <div className="text-xs text-gray-500">
                                                    {isLoadingEarthquakes
                                                        ? 'Loading...'
                                                        : `${earthquakes.length} events • Updated ${lastUpdateEarthquakes.toLocaleTimeString()}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={showEarthquakes}
                                            onChange={(e) => setShowEarthquakes(e.target.checked)}
                                        />
                                        <div
                                            className={`w-12 h-6 rounded-full transition-all duration-300 ${showEarthquakes ? 'bg-red-600' : 'bg-gray-300'
                                                }`}
                                        ></div>
                                        <div
                                            className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full 
                        transition-transform duration-300 shadow-sm ${showEarthquakes ? 'translate-x-6' : ''
                                                }`}
                                        ></div>
                                    </div>
                                </label>

                                {/* Earthquake Legend */}
                                {showEarthquakes && earthquakes.length > 0 && (
                                    <div className="ml-14 pl-1 space-y-2 animate-fadeIn">
                                        <div className="text-xs font-medium text-gray-600">Magnitude</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 w-6">4.0</span>
                                            <div
                                                className="flex-1 h-2.5 rounded-full shadow-inner"
                                                style={{
                                                    background:
                                                        'linear-gradient(to right, #ffffff, #ffcccc, #ff6666, #cc0000, #990000)',
                                                }}
                                            ></div>
                                            <span className="text-xs text-gray-500 w-8 text-right">7.0+</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </>
    );
}