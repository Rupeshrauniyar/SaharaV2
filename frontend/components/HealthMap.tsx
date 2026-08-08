"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

type Position = {
  lat: number;
  lng: number;
};

const hospitalIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:32px;
      height:32px;
      background:#2563eb;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 3px 12px rgba(0,0,0,.25);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:16px;
      font-weight:bold;
    ">+</div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:22px;
      height:22px;
      background:#dc2626;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 3px 12px rgba(0,0,0,.25);
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const hospitals = [
  {
    name: "Tribhuvan University Teaching Hospital",
    lat: 27.7367,
    lng: 85.3301,
  },
  {
    name: "Bir Hospital",
    lat: 27.7044,
    lng: 85.3131,
  },
  {
    name: "Patan Hospital",
    lat: 27.6685,
    lng: 85.3213,
  },
];

function RecenterMap({ position }: { position: Position | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 14);
    }
  }, [position, map]);

  return null;
}

export default function HealthMap() {
  const [position, setPosition] = useState<Position | null>(null);
  const [status, setStatus] = useState("Location not detected.");

  function detectLocation() {
    if (!navigator.geolocation) {
      setStatus("Location is not supported by your browser.");
      return;
    }

    setStatus("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      (result) => {
        setPosition({
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        });

        setStatus("Your location is visible on the map.");
      },
      () => {
        setStatus("Unable to access location. Check browser permissions.");
      }
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Your Location</p>
          <p className="mt-1 text-sm text-slate-500">{status}</p>
        </div>

        <button
          type="button"
          onClick={detectLocation}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Use My Location
        </button>
      </div>

      <div className="h-[500px] overflow-hidden rounded-3xl border border-slate-200">
        <MapContainer
          center={[27.7172, 85.324]}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap position={position} />

          {position && (
            <Marker
              position={[position.lat, position.lng]}
              icon={userIcon}
            >
              <Popup>Your current location</Popup>
            </Marker>
          )}

          {hospitals.map((hospital) => (
            <Marker
              key={hospital.name}
              position={[hospital.lat, hospital.lng]}
              icon={hospitalIcon}
            >
              <Popup>{hospital.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}