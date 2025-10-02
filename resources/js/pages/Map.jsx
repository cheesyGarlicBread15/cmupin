import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import AppLayout from "../layouts/AppLayout";

export default function Map() {
    return (
        <AppLayout>
            <div className="h-screen w-full bg-gray-900 text-white">
                <MapContainer
                    center={[12.8797, 121.7740]} // Center of PH
                    zoom={6}
                    scrollWheelZoom={true}
                    className="h-full w-full rounded-lg"
                >
                    {/* Base map tiles */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
                    />

                </MapContainer>
            </div>
        </AppLayout>
    );
}