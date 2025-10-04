import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import AppLayout from "../layouts/AppLayout";

// Component to handle heatmap layer
function HeatmapLayer({ show, data, opacity, animationPhase }) {
    const map = useMap();
    const heatLayerRef = useRef(null);

    useEffect(() => {
        if (!show) {
            if (heatLayerRef.current) {
                map.removeLayer(heatLayerRef.current);
                heatLayerRef.current = null;
            }
            return;
        }

        if (data.length === 0) {
            console.log("No data to render");
            return;
        }

        console.log(`Rendering heatmap with ${data.length} points`, data.slice(0, 3));

        // Remove existing layer
        if (heatLayerRef.current) {
            map.removeLayer(heatLayerRef.current);
            heatLayerRef.current = null;
        }

        // Vary radius and blur more dramatically for noticeable pulsing effect
        const radiusVariation = animationPhase === 0 ? 0 : 15; // Bigger change
        const blurVariation = animationPhase === 0 ? 0 : 10;
        const opacityVariation = animationPhase === 0 ? 0.3 : 0.4; // Pulse the minOpacity too

        // Create new heatmap layer with blue gradient
        heatLayerRef.current = L.heatLayer(data, {
            radius: 50 + radiusVariation, // Will alternate between 50 and 65
            blur: 35 + blurVariation,     // Will alternate between 35 and 45
            maxZoom: 17,
            minOpacity: opacityVariation, // Will pulse between 0.3 and 0.4
            max: 1.0,
            gradient: {
                0.0: 'rgba(0, 255, 0, 0)',     // transparent green
                0.3: 'rgba(0, 255, 0, 0.3)',   // solid green
                0.6: 'rgba(100, 255, 0, 0.6)', // bright green
                0.8: 'rgba(255, 165, 0, 0.8)', // orange (starts late)
                0.9: 'rgba(255, 100, 0, 0.9)', // orange-red
                1.0: 'rgba(255, 0, 0, 1)'      // solid red
            }
        });

        // Add to map
        heatLayerRef.current.addTo(map);

        // Force redraw
        setTimeout(() => {
            if (heatLayerRef.current) {
                heatLayerRef.current.redraw();
            }
        }, 100);

        console.log("Heatmap layer added to map");

        return () => {
            if (heatLayerRef.current) {
                map.removeLayer(heatLayerRef.current);
                heatLayerRef.current = null;
            }
        };
    }, [map, show, data, animationPhase]);

    // Handle opacity changes separately
    useEffect(() => {
        if (heatLayerRef.current && show) {
            try {
                // Get the canvas element from the heatmap layer
                const canvas = heatLayerRef.current._canvas;
                if (canvas) {
                    canvas.style.opacity = opacity;
                    canvas.style.transition = 'opacity 0.3s ease-in-out';
                }
            } catch (err) {
                console.log("Could not set opacity:", err);
            }
        }
    }, [opacity, show]);

    return null;
}

export default function Map() {
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [heatmapData, setHeatmapData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [opacity, setOpacity] = useState(1);
    const [animationPhase, setAnimationPhase] = useState(0);

    // Fetch precipitation data from Open-Meteo (Philippines only)
    const fetchPrecipitationData = async () => {
        setIsLoading(true);
        try {
            // DUMMY DATA for testing - remove this and uncomment API code below when ready
            console.log("Using dummy precipitation data for testing...");

            const dummyData = [];

            // Extended bounds to include surrounding waters
            // South China Sea, Philippine Sea, Celebes Sea, Sulu Sea

            // Manila area (heavy rain) - extends to South China Sea
            for (let i = 0; i < 20; i++) {
                dummyData.push([
                    14.5 + (Math.random() - 0.5) * 3,
                    120.0 + (Math.random() - 0.5) * 3,
                    0.6 + Math.random() * 0.4
                ]);
            }

            // Cebu area (moderate rain) - Visayan Sea
            for (let i = 0; i < 15; i++) {
                dummyData.push([
                    10.3 + (Math.random() - 0.5) * 2.5,
                    123.9 + (Math.random() - 0.5) * 2.5,
                    0.3 + Math.random() * 0.3
                ]);
            }

            // Davao area (light rain) - extends to Philippine Sea
            for (let i = 0; i < 12; i++) {
                dummyData.push([
                    7.1 + (Math.random() - 0.5) * 2,
                    125.6 + (Math.random() - 0.5) * 2.5,
                    0.1 + Math.random() * 0.2
                ]);
            }

            // Baguio area (heavy rain)
            for (let i = 0; i < 15; i++) {
                dummyData.push([
                    16.4 + (Math.random() - 0.5) * 1.5,
                    120.6 + (Math.random() - 0.5) * 1.5,
                    0.7 + Math.random() * 0.3
                ]);
            }

            // Palawan - Sulu Sea
            for (let i = 0; i < 12; i++) {
                dummyData.push([
                    9.8 + (Math.random() - 0.5) * 2,
                    118.7 + (Math.random() - 0.5) * 2,
                    0.4 + Math.random() * 0.3
                ]);
            }

            // Northern Luzon - extends to Luzon Strait
            for (let i = 0; i < 15; i++) {
                dummyData.push([
                    18.5 + (Math.random() - 0.5) * 2.5,
                    121.5 + (Math.random() - 0.5) * 2,
                    0.5 + Math.random() * 0.3
                ]);
            }

            // Mindanao Sea area
            for (let i = 0; i < 10; i++) {
                dummyData.push([
                    8.5 + (Math.random() - 0.5) * 2,
                    123.5 + (Math.random() - 0.5) * 2,
                    0.35 + Math.random() * 0.25
                ]);
            }

            // Random scattered rain across extended area (including surrounding waters)
            for (let i = 0; i < 40; i++) {
                dummyData.push([
                    4 + Math.random() * 18, // Extended from 4°N to 22°N
                    115 + Math.random() * 12, // Extended from 115°E to 127°E
                    Math.random() * 0.5
                ]);
            }

            console.log(`Generated ${dummyData.length} dummy data points`);
            setHeatmapData(dummyData);
            setLastUpdate(new Date());

            // Fade in animation
            setOpacity(0);
            setTimeout(() => setOpacity(1), 50);

            setIsLoading(false);

            /* REAL API CODE - Uncomment when ready to use real data
            const latMin = 5;
            const latMax = 20;
            const lonMin = 117;
            const lonMax = 126;
            const gridStep = 1.0;

            const points = [];
            
            for (let lat = latMin; lat <= latMax; lat += gridStep) {
                for (let lon = lonMin; lon <= lonMax; lon += gridStep) {
                    points.push({ lat, lon });
                }
            }

            console.log(`Fetching data for ${points.length} points...`);

            const batchSize = 10;
            const allData = [];
            const delayBetweenBatches = 500;

            for (let i = 0; i < points.length; i += batchSize) {
                const batch = points.slice(i, i + batchSize);
                const lats = batch.map(p => p.lat).join(',');
                const lons = batch.map(p => p.lon).join(',');

                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=precipitation&timezone=auto`;
                
                try {
                    const response = await fetch(url);
                    
                    if (response.status === 429) {
                        console.warn("Rate limited, waiting before retry...");
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    
                    if (!response.ok) {
                        console.warn(`API error: ${response.status}`);
                        continue;
                    }

                    const data = await response.json();
                    
                    if (data.latitude && Array.isArray(data.latitude)) {
                        for (let j = 0; j < data.latitude.length; j++) {
                            const precip = data.current?.precipitation?.[j] || data.current_weather?.precipitation?.[j] || 0;
                            
                            if (precip > 0) {
                                const intensity = Math.min(precip / 50, 1);
                                allData.push([
                                    data.latitude[j],
                                    data.longitude[j],
                                    intensity
                                ]);
                            }
                        }
                    } else if (data.current) {
                        const precip = data.current.precipitation || 0;
                        if (precip > 0) {
                            const intensity = Math.min(precip / 50, 1);
                            allData.push([
                                batch[0].lat,
                                batch[0].lon,
                                intensity
                            ]);
                        }
                    }
                } catch (err) {
                    console.error("Batch fetch error:", err);
                    continue;
                }

                await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
            }

            console.log(`Collected ${allData.length} data points`);
            setHeatmapData(allData);
            setLastUpdate(new Date());
            
            setOpacity(0);
            setTimeout(() => setOpacity(1), 50);
            */

        } catch (error) {
            console.error("Error fetching precipitation data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-refresh every 1 minute when heatmap is enabled
    useEffect(() => {
        if (!showHeatmap) return;

        // Initial fetch
        fetchPrecipitationData();

        // Set up interval for 1 minute (60000ms)
        const interval = setInterval(() => {
            fetchPrecipitationData();
        }, 60000);

        return () => clearInterval(interval);
    }, [showHeatmap]);

    // Subtle pulsing animation every 2 seconds (faster for more noticeable effect)
    useEffect(() => {
        if (!showHeatmap) return;

        const pulseInterval = setInterval(() => {
            setAnimationPhase(prev => (prev + 1) % 2); // Toggle between 0 and 1
        }, 2000); // Faster animation

        return () => clearInterval(pulseInterval);
    }, [showHeatmap]);

    return (
        <AppLayout>
            <div className="h-screen w-full bg-gray-900 text-white relative">
                <MapContainer
                    center={[12.8797, 121.7740]}
                    zoom={6}
                    scrollWheelZoom={true}
                    className="h-full w-full rounded-lg"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
                    />

                    <HeatmapLayer
                        show={showHeatmap}
                        data={heatmapData}
                        opacity={opacity}
                        animationPhase={animationPhase}
                    />
                </MapContainer>

                {/* Toggle Control - Bottom Right */}
                <div className="absolute bottom-6 right-6 z-[1000] bg-white rounded-lg shadow-lg p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={showHeatmap}
                                        onChange={(e) => setShowHeatmap(e.target.checked)}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition ${showHeatmap ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${showHeatmap ? 'translate-x-6' : ''
                                        }`}></div>
                                </div>
                                <span className="ml-3 text-gray-900 font-medium">
                                    Precipitation
                                </span>
                            </label>
                        </div>

                        {showHeatmap && (
                            <div className="text-xs text-gray-600 border-t pt-2">
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                        <span>Loading...</span>
                                    </div>
                                ) : lastUpdate ? (
                                    <div>
                                        Last update: {lastUpdate.toLocaleTimeString()}
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* Legend */}
                        {showHeatmap && heatmapData.length > 0 && (
                            <div className="border-t pt-2">
                                <div className="text-xs text-gray-700 font-medium mb-1">
                                    Precipitation (mm/h)
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-600">0</span>
                                    <div className="flex-1 h-3 rounded"
                                        style={{
                                            background: 'linear-gradient(to right, #d0e8ff, #7cb5ff, #4a90ff, #1e5eff, #0033cc)'
                                        }}
                                    ></div>
                                    <span className="text-xs text-gray-600">50+</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}