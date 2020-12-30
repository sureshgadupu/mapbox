import React, { useState, useEffect, useCallback } from "react";
import ReactMapGL, { Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { Pins } from "./Pin.js";
import axios from "axios";
import EarthQuakeInfo from "./EarthQuakeInfo";
import { LocationPin } from "./LocationPin";
import { RangePanel } from "./RangePanel";

const accessToken =
  "pk.eyJ1IjoiYnJpYW5iYW5jcm9mdCIsImEiOiJsVGVnMXFzIn0.7ldhVh3Ppsgv4lCYs65UdA";

const getPreviousWeekdateInISOFormat = () => {
  const priorDate = new Date().setDate(new Date().getDate() - 7);
  // Set that to an ISO8601 timestamp as required by the USGS earthquake API
  const priorDateTs = new Date(priorDate);
  const sevenDaysAgo = priorDateTs.toISOString();
  return sevenDaysAgo;
};
function getBounds(location, range) {
  const R = 6371e3; // Radius of earth in meters
  const radius = parseInt(range) * 1000; // convert range into meters

  let lat = parseFloat(location.latitude);
  let lon = parseFloat(location.longitude);
  let minLat = lat - ((radius / R) * 180) / Math.PI;
  let maxLat = lat + ((radius / R) * 180) / Math.PI;
  let minLon =
    lon - ((radius / R) * 180) / Math.PI / Math.cos((lat * Math.PI) / 180);
  let maxLon =
    lon + ((radius / R) * 180) / Math.PI / Math.cos((lat * Math.PI) / 180);
  var bounds = {
    lat_min: minLat,
    lon_min: minLon,
    lat_max: maxLat,
    lon_max: maxLon,
  };
  return bounds;
}
function inPointInBoundingBox(boundbox, lat, lng) {
  let isLongInRange = lng >= boundbox.lon_min && lng <= boundbox.lon_max;
  let isLatiInRange = lat >= boundbox.lat_min && lat <= boundbox.lat_max;
  return isLongInRange && isLatiInRange;
}

const calculateDistance = (location, lat, lng) => {
  let p = 0.017453292519943295; // Math.PI / 180
  let c = Math.cos;
  let a =
    0.5 -
    c((lat - location.latitude) * p) / 2 +
    (c(location.latitude * p) *
      c(lat * p) *
      (1 - c((lng - location.longitude) * p))) /
      2;

  return (12742e3 * Math.asin(Math.sqrt(a))) / 1000; // 2 * R; R = 6371 km
};

const extractEqDataFromGeoJsonResponseByLocation = (
  eqResponseData,
  location,
  range
) => {
  const eqInfoObjectAarray = [];

  const { features } = eqResponseData;

  const boundbox = getBounds(location, range);

  features.forEach((feature) => {
    const { mag, place } = feature.properties;
    const lng = feature.geometry.coordinates[0];
    const lat = feature.geometry.coordinates[1];

    if (
      inPointInBoundingBox(boundbox, lat, lng) &&
      calculateDistance(location, lat, lng) < range
    ) {
      eqInfoObjectAarray.push({
        mag: mag,
        place: place,
        longitude: lng,
        latitude: lat,
      });
    }
  });

  return eqInfoObjectAarray;
};

function App() {
  const [viewport, setViewport] = useState({
    latitude: 37.785164,
    longitude: -100,
    width: "100vw",
    height: "100vh",
    zoom: 3.25,
  });
  const [eqData, seEqtData] = useState([]);
  const [popupInfo, setPopUpInfo] = useState(null);

  const [range, setRange] = useState(200);

  const onMarkerClick = (earthquake) => {
    setPopUpInfo(earthquake);
  };
  const [location, setLocation] = useState({
    latitude: 39.944045319131525,
    longitude: -122.61582049766759,
  });

  const onMarkerDragEnd = useCallback(
    (event) => {
      setLocation({
        ...location,
        longitude: event.lngLat[0],
        latitude: event.lngLat[1],
      });
    },
    [location]
  );
  const onRangeChange = useCallback((range) => {
    setRange(range);
  }, []);
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
        const eqDataArray = extractEqDataFromGeoJsonResponseByLocation(
          response.data,
          location,
          range
        );
        seEqtData([...eqDataArray]);
      });
  }, [location, range]);
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
        <LocationPin location={location} onDragEnd={onMarkerDragEnd} />
        {renderPopup()}
        <Pins data={eqData} onClick={onMarkerClick} />
        <RangePanel range={range} onRangeChange={onRangeChange} />
      </ReactMapGL>
    </div>
  );
}

export default App;
