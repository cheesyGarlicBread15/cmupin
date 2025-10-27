import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Droplets, Activity, Map } from 'lucide-react';

export default function MapControls({
    baseMap,
    setBaseMap,
    showHeatmap,
    setShowHeatmap,
    showEarthquakes,
    setShowEarthquakes,
    showHazards,
    setShowHazards,
    isLoadingPrecip,
    isLoadingEarthquakes,
    lastUpdatePrecip,
    lastUpdateEarthquakes,
    earthquakes,
    heatmapData,
    hazards,
    hazardTypes,
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <>
            {/* Desktop: Side Panel */}
            <div className="hidden md:block">
                {/* Collapsed State - Handle on right edge */}
                {isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="fixed right-0 top-1/2 -translate-y-1/2 z-[1000]
                        flex flex-col items-center gap-2 bg-white/95 backdrop-blur-sm 
                        rounded-l-xl shadow-lg px-3 py-6 border border-r-0 border-gray-200
                        hover:bg-white transition-all duration-300 hover:shadow-xl hover:px-4"
                    >
                        <Map className="w-5 h-5 text-gray-700" />
                        <div className="writing-mode-vertical text-sm font-medium text-gray-900">
                            Map Controls
                        </div>
                        <ChevronUp className="w-4 h-4 text-gray-500 rotate-90" />
                    </button>
                )}

                {/* Expanded State - Full side panel */}
                {!isCollapsed && (
                    <div className="fixed right-0 top-0 h-full z-[1000] w-[400px]
                        bg-white/95 backdrop-blur-sm shadow-2xl border-l border-gray-200 
                        flex flex-col animate-slideIn">
                        {/* Header with collapse button */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
                            <div className="flex items-center gap-3">
                                <Map className="w-6 h-6 text-gray-700" />
                                <h3 className="text-lg font-semibold text-gray-900">Map Controls</h3>
                            </div>
                            <button
                                onClick={() => setIsCollapsed(true)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Collapse panel"
                            >
                                <ChevronDown className="w-5 h-5 text-gray-600 -rotate-90" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
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

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Hazard Toggle */}
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5 text-orange-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.658-1.14 1.1-2.05L13.1 4.05c-.526-.878-1.774-.878-2.3 0L4.982 17.95c-.558.91.046 2.05 1.08 2.05z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">Hazards</span>
                                                {showHazards && (
                                                    <div className="text-xs text-gray-500">
                                                        {`Currently showing ${hazards?.length || 0} hazards`}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={showHazards}
                                                onChange={(e) => setShowHazards(e.target.checked)}
                                            />
                                            <div
                                                className={`w-12 h-6 rounded-full transition-all duration-300 ${showHazards ? 'bg-orange-600' : 'bg-gray-300'
                                                    }`}
                                            ></div>
                                            <div
                                                className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full 
                transition-transform duration-300 shadow-sm ${showHazards ? 'translate-x-6' : ''
                                                    }`}
                                            ></div>
                                        </div>
                                    </label>

                                    {/* Optional Legend for Hazards */}
                                    {showHazards && hazardTypes?.length > 0 && (
                                        <div className="ml-14 pl-1 space-y-2 animate-fadeIn">
                                            <div className="text-xs font-medium text-gray-600">Hazard Types</div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {hazardTypes.map((type) => (
                                                    <div
                                                        key={type.id}
                                                        className="flex items-center gap-1 text-xs text-gray-700"
                                                    >
                                                        <span
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: type.color }}
                                                        ></span>
                                                        {type.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile: Bottom Sheet */}
            <div className="md:hidden">
                {/* Collapsed State - Button at bottom */}
                {isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000]
                        flex items-center gap-2 bg-white/95 backdrop-blur-sm 
                        rounded-full shadow-lg px-6 py-3 border border-gray-200
                        hover:bg-white transition-all duration-300 hover:shadow-xl"
                    >
                        <Map className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">Map Controls</span>
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    </button>
                )}

                {/* Expanded State - Bottom sheet */}
                {!isCollapsed && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/30 z-[999] animate-fadeIn"
                            onClick={() => setIsCollapsed(true)}
                        ></div>

                        {/* Bottom Sheet */}
                        <div className="fixed bottom-0 left-0 right-0 z-[1000] 
                            bg-white rounded-t-3xl shadow-2xl animate-slideUp max-h-[85vh] flex flex-col">
                            {/* Handle */}
                            <div className="flex justify-center py-3 shrink-0">
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pb-4 shrink-0">
                                <div className="flex items-center gap-3">
                                    <Map className="w-6 h-6 text-gray-700" />
                                    <h3 className="text-lg font-semibold text-gray-900">Map Controls</h3>
                                </div>
                                <button
                                    onClick={() => setIsCollapsed(true)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Collapse controls"
                                >
                                    <ChevronDown className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6">
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

                                    {/* Divider */}
                                    <div className="border-t border-gray-200"></div>

                                    {/* Hazard Toggle */}
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-5 h-5 text-orange-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.658-1.14 1.1-2.05L13.1 4.05c-.526-.878-1.774-.878-2.3 0L4.982 17.95c-.558.91.046 2.05 1.08 2.05z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900">Hazards</span>
                                                    {showHazards && (
                                                        <div className="text-xs text-gray-500">
                                                            {`Currently showing ${hazards?.length || 0} hazards`}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={showHazards}
                                                    onChange={(e) => setShowHazards(e.target.checked)}
                                                />
                                                <div
                                                    className={`w-12 h-6 rounded-full transition-all duration-300 ${showHazards ? 'bg-orange-600' : 'bg-gray-300'
                                                        }`}
                                                ></div>
                                                <div
                                                    className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full 
                transition-transform duration-300 shadow-sm ${showHazards ? 'translate-x-6' : ''
                                                        }`}
                                                ></div>
                                            </div>
                                        </label>

                                        {/* Optional Legend for Hazards */}
                                        {showHazards && hazardTypes?.length > 0 && (
                                            <div className="ml-14 pl-1 space-y-2 animate-fadeIn">
                                                <div className="text-xs font-medium text-gray-600">Hazard Types</div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    {hazardTypes.map((type) => (
                                                        <div
                                                            key={type.id}
                                                            className="flex items-center gap-1 text-xs text-gray-700"
                                                        >
                                                            <span
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: type.color }}
                                                            ></span>
                                                            {type.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

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
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
        </>
    );
}