import { useState } from "react";

import "leaflet/dist/leaflet.css";

import arrow from "./assets/icon-arrow.svg";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

function App() {
    const [input, setInput] = useState("");

    const [location, setLocation] = useState(null);

    const [error, setError] = useState(null);

    const api_Key = "at_KnmnHltpCyQOGwclEyXCZpYXVJ5qW";

    const handleChangeInput = (event) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            const response = await fetch(
                `https://geo.ipify.org/api/v2/country,city?apiKey=${api_Key}&ipAddress=${input}`
            );
            const resData = await response.json();
            setLocation(resData);
        } catch (error) {
            setError("Failed to fetch the location data...");
        }
    };

    const customIcon = new Icon({
        iconUrl: "/icon-location.svg",
        iconSize: [32, 38],
    });

    return (
        <>
            <header>
                <h1>IP Address Tracker</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={handleChangeInput}
                        placeholder="Search for any IP address or domain"
                    />
                    <button>
                        <img src={arrow} alt="" />
                    </button>
                </form>
                {error && <p>{error}</p>}
            </header>
            <section className="address">
                <div>
                    <span>ip address</span>
                    {location && <p>{location.ip}</p>}
                </div>
                <div>
                    <span>location</span>
                    {location && (
                        <p>{`${location.location.city}, ${location.location.country}`}</p>
                    )}
                </div>
                <div>
                    <span>timezone</span>
                    {location && <p>{`UTC ${location.location.timezone}`}</p>}
                </div>
                <div>
                    <span>isp</span>
                    {location && (
                        <p>{location.isp === "" ? "N.A." : location.isp}</p>
                    )}
                </div>
            </section>
            <MapContainer
                center={[28.519185, 77.213005]}
                zoom={15}
                className="mapContainer"
            >
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[28.519185, 77.213005]} icon={customIcon}>
                    <Popup>
                        <div>
                            <h2>New Delhi,IN</h2>
                            <p>28.519185, 77.213005</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
            {location && (
                <MapContainer
                    center={[location.location.lat, location.location.lng]}
                    zoom={15}
                >
                    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                        position={[
                            location.location.lat,
                            location.location.lng,
                        ]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div>
                                <h2>{`${location.location.city}, ${location.location.country}`}</h2>
                                <p>{`${location.location.lat}, ${location.location.lng}`}</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            )}
        </>
    );
}

export default App;
