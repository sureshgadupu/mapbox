import React, { useState } from "react";
import ReactMapGL, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

const accessToken =
  "pk.eyJ1IjoiYnJpYW5iYW5jcm9mdCIsImEiOiJsVGVnMXFzIn0.7ldhVh3Ppsgv4lCYs65UdA";

function App() {
  const [viewport, setViewport] = useState({
    latitude: 0.0,
    longitude: 0.0,
    width: "100vw",
    height: "100vh",
    zoom: 1.25,
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
      >
        {/* <div className="viewPortnfo">
          <div>
            <strong>Longitude:</strong>
            <span> {viewport.longitude}</span>
          </div>
          <div>
            <strong>Latitude:</strong> <span>{viewport.latitude}</span>
          </div>
          <div>
            <strong>Zoom:</strong> <span>{viewport.zoom}</span>
          </div>
        </div> */}
        <NavigationControl />
      </ReactMapGL>
    </div>
  );
}

export default App;
