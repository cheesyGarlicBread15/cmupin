import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import AppLayout from "@/layouts/AppLayout";
import MapControls from "@/components/MapControls";
import HazardReportModal from "@/components/HazardReportModal";

function MapRightClickHandler({ setContextMenu }) {
    const map = useMap();

    useEffect(() => {
        const handleRightClick = (e) => {
            setContextMenu({
                visible: true,
                x: e.originalEvent.clientX,
                y: e.originalEvent.clientY,
                latlng: e.latlng,
            });

        };

        const handleLeftClick = () => {
            setContextMenu({ visible: false });
        };

        map.on("contextmenu", handleRightClick);
        map.on("click", handleLeftClick);

        return () => {
            map.off("contextmenu", handleRightClick);
            map.off("click", handleLeftClick);
        };
    }, [map, setContextMenu]);

    return null;
}


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
    const [baseMap, setBaseMap] = useState('street');
    const [showHazardModal, setShowHazardModal] = useState(false);
    const [hazardCoords, setHazardCoords] = useState(null);


    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        latlng: null,
    });


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

                    }

                } catch (err) {
                    console.error("Batch fetch error:", err);
                    continue;
                }

                await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
            }

            console.log("allData: ", allData);

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
            <div className="fixed inset-0 bg-gray-900 text-white">
                <MapContainer
                    center={[12.8797, 121.7740]}
                    zoom={6}
                    zoomControl={false}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >
                    <MapRightClickHandler setContextMenu={setContextMenu} />

                    {baseMap === "street" && (
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
                        />
                    )}

                    {baseMap === "dark" && (
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        />
                    )}

                    {baseMap === "satellite" && (
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution='Tiles &copy; Esri'
                        />
                    )}

                    {baseMap === "terrain" && (
                        <TileLayer
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            attribution='Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                        />
                    )}

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

                {/* right click menu */}
                {contextMenu.visible && (
                    <div
                        className="absolute z-[2000] bg-white text-gray-800 rounded-md shadow-lg p-2"
                        style={{
                            top: contextMenu.y,
                            left: contextMenu.x,
                            transform: "translate(5px, 5px)",
                            minWidth: "140px",
                        }}
                        onMouseLeave={() => setContextMenu({ visible: false })}
                    >
                        <button
                            className="flex items-center w-full text-left hover:bg-gray-100 px-3 py-2 rounded text-sm font-medium"
                            onClick={() => {
                                setHazardCoords(contextMenu.latlng);
                                setContextMenu({ visible: false });
                                setShowHazardModal(true);
                            }}
                        >
                            <span className="mr-2">📍</span> Report Hazard
                        </button>
                    </div>
                )}

                {/* Hazard Report Modal */}
                <HazardReportModal
                    show={showHazardModal}
                    onClose={() => setShowHazardModal(false)}
                    coordinates={hazardCoords}
                />

                {/* New Modern Map Controls */}
                <MapControls
                    baseMap={baseMap}
                    setBaseMap={setBaseMap}
                    showHeatmap={showHeatmap}
                    setShowHeatmap={setShowHeatmap}
                    showEarthquakes={showEarthquakes}
                    setShowEarthquakes={setShowEarthquakes}
                    isLoadingPrecip={isLoadingPrecip}
                    isLoadingEarthquakes={isLoadingEarthquakes}
                    lastUpdatePrecip={lastUpdatePrecip}
                    lastUpdateEarthquakes={lastUpdateEarthquakes}
                    earthquakes={earthquakes}
                    heatmapData={heatmapData}
                />

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
                                <span className="font-semibold">Location:</span>{" "}
                                {selectedEarthquake.properties.place}
                            </div>
                            <div>
                                <span className="font-semibold">Time:</span>{" "}
                                {new Date(
                                    selectedEarthquake.properties.time
                                ).toLocaleString()}
                            </div>
                            <div>
                                <span className="font-semibold">Depth:</span>{" "}
                                {selectedEarthquake.geometry.coordinates[2].toFixed(2)} km
                            </div>
                            <div>
                                <span className="font-semibold">Type:</span>{" "}
                                {selectedEarthquake.properties.magType}
                            </div>
                            {selectedEarthquake.properties.felt && (
                                <div>
                                    <span className="font-semibold">Felt Reports:</span>{" "}
                                    {selectedEarthquake.properties.felt}
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