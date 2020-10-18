import React, { useState, useEffect } from "react";
import ReactMapGL, { Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { Pins } from "./Pin.js";
import axios from "axios";
import EarthQuakeInfo from "./EarthQuakeInfo";
const accessToken =
  "pk.eyJ1IjoiYnJpYW5iYW5jcm9mdCIsImEiOiJsVGVnMXFzIn0.7ldhVh3Ppsgv4lCYs65UdA";

const getPreviousWeekdateInISOFormat = () => {
  const priorDate = new Date().setDate(new Date().getDate() - 7);
  // Set that to an ISO8601 timestamp as required by the USGS earthquake API
  const priorDateTs = new Date(priorDate);
  const sevenDaysAgo = priorDateTs.toISOString();
  return sevenDaysAgo;
};
const extractEqDataFromGeoJsonResponse = (eqResponseData) => {
  const eqInfoObjectAarray = [];

  const { features } = eqResponseData;
  //extract interest data and build objects
  features.forEach((feature) => {
    const { mag, place } = feature.properties;
    const lat = feature.geometry.coordinates[0];
    const lng = feature.geometry.coordinates[1];
    eqInfoObjectAarray.push({
      mag: mag,
      place: place,
      longitude: lat,
      latitude: lng,
    });
  });

  return eqInfoObjectAarray;
};

function App() {
  const [viewport, setViewport] = useState({
    latitude: 0.0,
    longitude: 0.0,
    width: "100vw",
    height: "100vh",
    zoom: 1.25,
  });
  const [eqData, seEqtData] = useState([]);
  const [popupInfo, setPopUpInfo] = useState(null);
  const onMarkerClick = (earthquake) => {
    setPopUpInfo(earthquake);
  };

  const renderPopup = () => {
    return (
      popupInfo && (
        <Popup
          className="popupStyle"
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => setPopUpInfo(null)}
          dynamicPosition={false}
        >
          <EarthQuakeInfo earthquakeInfo={popupInfo} />
        </Popup>
      )
    );
  };
  useEffect(() => {
    const prevWeekDate = getPreviousWeekdateInISOFormat();
    axios
      .get(
        "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&minmagnitude=2&starttime=" +
          prevWeekDate
      )
      .then((response) => {
        const eqDataArray = extractEqDataFromGeoJsonResponse(response.data);
        seEqtData((eqData) => [...eqData, ...eqDataArray]);
      });
  }, []);
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={accessToken}
        mapStyle={"mapbox://styles/mapbox/dark-v10"}
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {renderPopup()}
        {<Pins data={eqData} onClick={onMarkerClick} />}
      </ReactMapGL>
    </div>
  );
}

export default App;
