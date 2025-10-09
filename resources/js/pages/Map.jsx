import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import AppLayout from "../layouts/AppLayout";
import { all } from "axios";

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

        if (data.length === 0) return;

        if (heatLayerRef.current) {
            map.removeLayer(heatLayerRef.current);
            heatLayerRef.current = null;
        }

        const radiusVariation = animationPhase * 15;
        const blurVariation = animationPhase * 10;
        const opacityVariation = 0.3 + (animationPhase * 0.1);

        console.log("data: ", data);

        heatLayerRef.current = L.heatLayer(data, {
            radius: 50 + radiusVariation,
            blur: 35 + blurVariation,
            maxZoom: 17,
            minOpacity: opacityVariation,
            max: 1.0,
            gradient: {
                0.0: 'rgba(0, 255, 0, 0)',
                0.2: 'rgba(100, 255, 0, 0.3)',
                0.4: 'rgba(200, 255, 0, 0.5)',
                0.6: 'rgba(255, 200, 0, 0.7)',
                0.8: 'rgba(255, 100, 0, 0.85)',
                1.0: 'rgba(255, 0, 0, 1)'
            }
        });

        heatLayerRef.current.addTo(map);

        setTimeout(() => {
            if (heatLayerRef.current) {
                heatLayerRef.current.redraw();
            }
        }, 100);

        return () => {
            if (heatLayerRef.current) {
                map.removeLayer(heatLayerRef.current);
                heatLayerRef.current = null;
            }
        };
    }, [map, show, data, animationPhase]);

    useEffect(() => {
        if (heatLayerRef.current && show) {
            try {
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

function EarthquakeMarkers({ show, earthquakes, onEarthquakeClick, pulsePhase }) {
    if (!show || earthquakes.length === 0) return null;

    const getMarkerStyle = (magnitude) => {
        let radius;
        if (magnitude < 4.5) radius = 6;
        else if (magnitude < 5.0) radius = 9;
        else if (magnitude < 5.5) radius = 12;
        else if (magnitude < 6.0) radius = 15;
        else if (magnitude < 6.5) radius = 18;
        else if (magnitude < 7.0) radius = 22;
        else radius = 26;

        const pulseSize = pulsePhase * 2;

        let color;
        if (magnitude < 4.5) color = '#ffffff';
        else if (magnitude < 5.0) color = '#ffcccc';
        else if (magnitude < 5.5) color = '#ff9999';
        else if (magnitude < 6.0) color = '#ff6666';
        else if (magnitude < 6.5) color = '#ff3333';
        else if (magnitude < 7.0) color = '#cc0000';
        else color = '#990000';

        return {
            radius: radius + pulseSize,
            fillColor: color,
            color: '#000000',
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.7
        };
    };

    return (
        <>
            {earthquakes.map((eq) => {
                const [lon, lat, depth] = eq.geometry.coordinates;
                const style = getMarkerStyle(eq.properties.mag);

                return (
                    <CircleMarker
                        key={eq.id}
                        center={[lat, lon]}
                        pathOptions={style}
                        radius={style.radius}
                        eventHandlers={{
                            click: () => onEarthquakeClick(eq),
                            mouseover: (e) => {
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                e.target.closePopup();
                            }
                        }}
                    >
                        <Popup closeButton={false}>
                            <div className="text-sm">
                                <div className="font-bold text-red-700">
                                    M {eq.properties.mag}
                                </div>
                                <div className="text-gray-800">
                                    {eq.properties.place}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    {new Date(eq.properties.time).toLocaleString()}
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </>
    );
}

export default function Map() {
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showEarthquakes, setShowEarthquakes] = useState(false);
    const [heatmapData, setHeatmapData] = useState([]);
    const [earthquakes, setEarthquakes] = useState([]);
    const [selectedEarthquake, setSelectedEarthquake] = useState(null);
    const [isLoadingPrecip, setIsLoadingPrecip] = useState(false);
    const [isLoadingEarthquakes, setIsLoadingEarthquakes] = useState(false);
    const [lastUpdatePrecip, setLastUpdatePrecip] = useState(null);
    const [lastUpdateEarthquakes, setLastUpdateEarthquakes] = useState(null);
    const [opacity, setOpacity] = useState(1);
    const [animationPhase, setAnimationPhase] = useState(0);
    const [pulsePhase, setPulsePhase] = useState(0);

    const fetchPrecipitationData = async () => {
        setIsLoadingPrecip(true);
        try {
            // Philippines bounds
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

            const batchSize = 10;
            const allData = [];
            const delayBetweenBatches = 100;

            for (let i = 0; i < points.length; i += batchSize) {
                console.log(i);
                const batch = points.slice(i, i + batchSize);
                const lats = batch.map(p => p.lat).join(',');
                const lons = batch.map(p => p.lon).join(',');

                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=precipitation&timezone=auto`;
                console.log(url);

                try {
                    const response = await fetch(url);

                    if (response.status === 429) {
                        console.warn("Rate limited, waiting before retry...");
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        continue;
                    }

                    if (!response.ok) {
                        console.warn(`API error: ${response.status}`);
                        continue;
                    }

                    const data = await response.json();

                    for (const point of data) {
                        if (point.latitude && point.latitude) {
                            const precip = point.current.precipitation || 0;
                            if (precip > 0) {
                                console.log("inside point loop lng: ", point.longitude);
                                const intensity = Math.min(precip / 50, 1);
                                allData.push([
                                    point.latitude,
                                    point.longitude,
                                    intensity
                                ]);
                            }
                        } else if (point.current) {
                            console.warn("Invalid point data: ", point);
                        }

                        console.log("allData loop: ", allData);
                    }

                } catch (err) {
                    console.error("Batch fetch error:", err);
                    continue;
                }

                await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
            }

            console.log("allData: ", allData);
            console.log("points: ", points);

            setHeatmapData(allData);
            setLastUpdatePrecip(new Date());
            setOpacity(0);
            setTimeout(() => setOpacity(1), 50);

        } catch (error) {
            console.error("Error fetching precipitation data:", error);
        } finally {
            setIsLoadingPrecip(false);
        }
    };

    const fetchEarthquakeData = async () => {
        setIsLoadingEarthquakes(true);
        try {
            const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=4.5&maxlatitude=21.0&minlongitude=116.0&maxlongitude=127.0&orderby=time';

            const response = await fetch(url);
            if (!response.ok) {
                console.error('Failed to fetch earthquake data');
                return;
            }

            const data = await response.json();
            console.log(`Fetched ${data.features.length} earthquakes`);
            setEarthquakes(data.features);
            setLastUpdateEarthquakes(new Date());

        } catch (error) {
            console.error("Error fetching earthquake data:", error);
        } finally {
            setIsLoadingEarthquakes(false);
        }
    };

    // Auto-refresh precipitation every 10 minute
    useEffect(() => {
        if (!showHeatmap) return;
        fetchPrecipitationData();
        const interval = setInterval(fetchPrecipitationData, 600000);
        return () => clearInterval(interval);
    }, [showHeatmap]);

    // Auto-refresh earthquakes every 1 minute
    useEffect(() => {
        if (!showEarthquakes) return;
        fetchEarthquakeData();
        const interval = setInterval(fetchEarthquakeData, 600000);
        return () => clearInterval(interval);
    }, [showEarthquakes]);

    // animation for precipitation
    useEffect(() => {
        if (!showHeatmap) return;
        let animationFrame;
        let startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const cycle = 3000;
            const phase = (Math.sin((elapsed / cycle) * Math.PI * 2) + 1) / 2;
            setAnimationPhase(phase);
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [showHeatmap]);

    // animation for earthquakes
    useEffect(() => {
        if (!showEarthquakes) return;
        let animationFrame;
        let startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const cycle = 4000;
            const phase = (Math.sin((elapsed / cycle) * Math.PI * 2) + 1) / 2;
            setPulsePhase(phase);
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [showEarthquakes]);

    const handleEarthquakeClick = (earthquake) => {
        setSelectedEarthquake(earthquake);
    };

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

                    <EarthquakeMarkers
                        show={showEarthquakes}
                        earthquakes={earthquakes}
                        onEarthquakeClick={handleEarthquakeClick}
                        pulsePhase={pulsePhase}
                    />
                </MapContainer>

                {/* Toggle Controls - Bottom Right */}
                <div className="absolute bottom-6 right-6 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-xs">
                    <div className="flex flex-col gap-3">
                        {/* Precipitation Toggle */}
                        <div className="flex items-center gap-3">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={showHeatmap}
                                        onChange={(e) => setShowHeatmap(e.target.checked)}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition ${showHeatmap ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${showHeatmap ? 'translate-x-6' : ''}`}></div>
                                </div>
                                <span className="ml-3 text-gray-900 font-medium">
                                    Precipitation
                                </span>
                            </label>
                        </div>

                        {showHeatmap && lastUpdatePrecip && (
                            <div className="text-xs text-gray-600 pl-1">
                                {isLoadingPrecip ? 'Loading...' : `Updated: ${lastUpdatePrecip.toLocaleTimeString()}`}
                            </div>
                        )}

                        {/* Earthquake Toggle */}
                        <div className="flex items-center gap-3 border-t pt-3">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={showEarthquakes}
                                        onChange={(e) => setShowEarthquakes(e.target.checked)}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition ${showEarthquakes ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${showEarthquakes ? 'translate-x-6' : ''}`}></div>
                                </div>
                                <span className="ml-3 text-gray-900 font-medium">
                                    Earthquakes
                                </span>
                            </label>
                        </div>

                        {showEarthquakes && lastUpdateEarthquakes && (
                            <div className="text-xs text-gray-600 pl-1">
                                {isLoadingEarthquakes ? 'Loading...' : `${earthquakes.length} earthquakes | Updated: ${lastUpdateEarthquakes.toLocaleTimeString()}`}
                            </div>
                        )}

                        {/* Precipitation Legend */}
                        {showHeatmap && heatmapData.length > 0 && (
                            <div className="border-t pt-2">
                                <div className="text-xs text-gray-700 font-medium mb-1">
                                    Precipitation (mm/h)
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-600">0</span>
                                    <div className="flex-1 h-3 rounded"
                                        style={{
                                            background: 'linear-gradient(to right, #00ff00, #c8ff00, #ffff00, #ffc800, #ff6400, #ff0000)'
                                        }}
                                    ></div>
                                    <span className="text-xs text-gray-600">50+</span>
                                </div>
                            </div>
                        )}

                        {/* Earthquake Legend */}
                        {showEarthquakes && earthquakes.length > 0 && (
                            <div className="border-t pt-2">
                                <div className="text-xs text-gray-700 font-medium mb-1">
                                    Magnitude
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-600">4.0</span>
                                    <div className="flex-1 h-3 rounded"
                                        style={{
                                            background: 'linear-gradient(to right, #ffffff, #ffcccc, #ff6666, #cc0000, #990000)'
                                        }}
                                    ></div>
                                    <span className="text-xs text-gray-600">7.0+</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Earthquake Detail Panel */}
                {selectedEarthquake && (
                    <div className="absolute top-6 right-6 z-[1001] bg-white rounded-lg shadow-2xl p-4 max-w-sm">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-gray-900">
                                Magnitude {selectedEarthquake.properties.mag}
                            </h3>
                            <button
                                onClick={() => setSelectedEarthquake(null)}
                                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-gray-700">
                            <div>
                                <span className="font-semibold">Location:</span> {selectedEarthquake.properties.place}
                            </div>
                            <div>
                                <span className="font-semibold">Time:</span> {new Date(selectedEarthquake.properties.time).toLocaleString()}
                            </div>
                            <div>
                                <span className="font-semibold">Depth:</span> {selectedEarthquake.geometry.coordinates[2].toFixed(2)} km
                            </div>
                            <div>
                                <span className="font-semibold">Type:</span> {selectedEarthquake.properties.magType}
                            </div>
                            {selectedEarthquake.properties.felt && (
                                <div>
                                    <span className="font-semibold">Felt Reports:</span> {selectedEarthquake.properties.felt}
                                </div>
                            )}
                            {selectedEarthquake.properties.tsunami === 1 && (
                                <div className="bg-red-100 text-red-800 p-2 rounded mt-2">
                                    ⚠️ Tsunami Warning
                                </div>
                            )}
                            <a
                                href={selectedEarthquake.properties.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                View Details on USGS →
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}