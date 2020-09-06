import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJpYW5iYW5jcm9mdCIsImEiOiJsVGVnMXFzIn0.7ldhVh3Ppsgv4lCYs65UdA";

function App() {
  const [state, setState] = useState({
    lng: 0,
    lat: 0,
    zoom: 1.5,
  });
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const styles = {
    width: "100vw",
    height: "100vh",
    position: "absolute",
  };
  useEffect(() => {
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v11",
        center: [state.lng, state.lat],
        zoom: state.zoom,
      });

      map.on("load", () => {
        setMap(map);
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map, state]);

  return (
    <>
      <div ref={(el) => (mapContainer.current = el)} style={styles} />
    </>
  );
}

export default App;
