import React, { useState } from "react";
import ReactMapGL, { NavigationControl, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { Pins } from "./Pin";

const accessToken =
  "pk.eyJ1IjoiYnJpYW5iYW5jcm9mdCIsImEiOiJsVGVnMXFzIn0.7ldhVh3Ppsgv4lCYs65UdA";

const navControlStyle = {
  position: "absolute",
  bottom: 70,
  right: 0,
  padding: "10px",
};
const geolocateStyle = {
  position: "absolute",
  bottom: 100,
  left: 0,
  margin: 10,
};

function App() {
  const [viewport, setViewport] = useState({
    latitude: 30.0,
    longitude: 40.0,
    width: "100vw",
    height: "100vh",
    zoom: 3,
  });
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={accessToken}
        mapStyle={"mapbox://styles/mapbox/outdoors-v11"}
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
        minZoom={1}
        maxZoom={20}
        doubleClickZoom={true}
        scrollZoom={true}
        touchZoom={true}
      >
        <div style={geolocateStyle}>
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            showUserLocation={true}
          >
            <Pins data={viewport} />
          </GeolocateControl>
        </div>
        <div className="viewPortnfo">
          <div>
            <strong>Zoom:</strong> <span>{viewport.zoom}</span>
          </div>
        </div>
        <div style={navControlStyle}>
          <NavigationControl compassLabel="Ruhe im Norden" />
        </div>
      </ReactMapGL>
    </div>
  );
}

export default App;
