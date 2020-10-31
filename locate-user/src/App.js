import React, { useState } from "react";
import ReactMapGL, { GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

const accessToken =
  "pk.eyJ1IjoiYnJpYW5iYW5jcm9mdCIsImEiOiJsVGVnMXFzIn0.7ldhVh3Ppsgv4lCYs65UdA";
const geolocateStyle = {
  position: "absolute",
  bottom: 100,
  left: 0,
  margin: 10,
};

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
        <div style={geolocateStyle}>
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            showUserLocation={true}
            onGeolocate={(PositionOptions) =>
              console.log(PositionOptions["coords"])
            }
          />
        </div>
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
      </ReactMapGL>
    </div>
  );
}

export default App;
