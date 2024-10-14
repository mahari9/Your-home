/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { usePositionContext } from "../../context/PositionContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import styles from "./Map.module.scss";
import Spinner from "../../ui/Spinner/Spinner";

const API_KEY = "0cebbc4b6c944c7ea656d4af8dc67519";
const URL = "https://api.opencagedata.com/geocode/v1/json";

const customIcon = new L.icon({
  iconUrl: "/building.svg",
  iconSize: [32, 32],
});

export default function Map({ location }) {
  const [position, setPosition] = useState({});
  useEffect(() => {
    async function getCoords() {
      const res = await fetch(`${URL}?q=${location}&key=${API_KEY}`);
      const data = await res.json();
      setPosition(data.results[0]?.geometry);
    }

    getCoords();
  }, [location]);

  //registering click on map to save in database as location
  const { position: clickPosition } = usePositionContext();

  if (!position.lat) return <Spinner />;
  return (
    <div className={styles.mapContainer}>
      <span className={styles.mapLabel}>Mark on the map where your property is located</span>
      <div id="map">
        <MapContainer
          center={[position?.lat, position?.lng]}
          zoom={17}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png" />
          {clickPosition.length > 0 && (
            <Marker position={clickPosition} icon={customIcon} />
          )}
          <DetectClick />
          <ChangeCenter position={[position.lat, position.lng]} />
        </MapContainer>
      </div>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const { setPosition } = usePositionContext();
  useMapEvents({
    click(e) {
      setPosition([e.latlng?.lat, e.latlng?.lng]);
    },
  });
}
