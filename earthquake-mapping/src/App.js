import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJpYW5iYW5jcm9mdCIsImEiOiJsVGVnMXFzIn0.7ldhVh3Ppsgv4lCYs65UdA";

function getPreviousWeekdateInISOFormat() {
  const priorDate = new Date().setDate(new Date().getDate() - 7);
  // Set that to an ISO8601 timestamp as required by the USGS earthquake API
  const priorDateTs = new Date(priorDate);
  const sevenDaysAgo = priorDateTs.toISOString();
  return sevenDaysAgo;
}

function App() {
  const [state, setState] = useState({
    lng: -122.44121,
    lat: 37.76132,
    zoom: 3.5,
  });
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [earthquakeInfo, setEarthquakeInfo] = useState({});

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
      const prevWeekDate = getPreviousWeekdateInISOFormat();
      map.on("load", () => {
        setMap(map);
        map.resize();
        map.addSource("earthquakes", {
          type: "geojson",
          data:
            "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&minmagnitude=2&starttime=" +
            prevWeekDate,
          generateId: true, // This ensures that all features have unique IDs
        });

        map.addLayer({
          id: "earthquakes-viz",
          type: "circle",
          source: "earthquakes",
          // paint: {
          //   "circle-radius": 5,
          //   "circle-color": "#AAAAAA",
          //   "circle-stroke-color": "#000",
          //   "circle-stroke-width": 1,
          // },
          paint: {
            "circle-radius": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1,
                8,
                1.5,
                10,
                2,
                12,
                2.5,
                14,
                3,
                16,
                3.5,
                18,
                4.5,
                20,
                6.5,
                22,
                8.5,
                24,
                10.5,
                26,
              ],
              5,
            ],

            "circle-stroke-color": "#000",
            "circle-stroke-width": 1,
            // The feature-state dependent circle-color expression will render
            // the color according to its magnitude when
            // a feature's hover state is set to true
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1,
                "#fff7ec",
                1.5,
                "#fee8c8",
                2,
                "#fdd49e",
                2.5,
                "#fdbb84",
                3,
                "#fc8d59",
                3.5,
                "#ef6548",
                4.5,
                "#d7301f",
                6.5,
                "#b30000",
                8.5,
                "#7f0000",
                10.5,
                "#000",
              ],
              "#AAA",
            ], // end of circle color
          }, // end of paint
        }); //layer
      });
      let quakeID = null;
      map.on("mousemove", "earthquakes-viz", (e) => {
        map.getCanvas().style.cursor = "crosshair";
        // Set variables equal to the current feature's magnitude, location, and time
        let quakeMagnitude = e.features[0].properties.mag;
        let quakeLocation = e.features[0].properties.place;
        let quakeDate = new Date(e.features[0].properties.time);

        // Check whether features exist
        if (e.features.length > 0) {
          setEarthquakeInfo({
            mag: quakeMagnitude,
            loc: quakeLocation,
            date: quakeDate.toISOString(),
          });

          // If quakeID for the hovered feature is not null,
          // use removeFeatureState to reset to the default behavior
          if (quakeID) {
            map.removeFeatureState({
              source: "earthquakes",
              id: quakeID,
            });
          }

          quakeID = e.features[0].id;
          // When the mouse moves over the earthquakes-viz layer, update the
          // feature state for the feature under the mouse
          map.setFeatureState(
            {
              source: "earthquakes",
              id: quakeID,
            },
            {
              hover: true,
            }
          );

          map.on("mouseleave", "earthquakes-viz", (e) => {
            if (quakeID) {
              map.setFeatureState(
                {
                  source: "earthquakes",
                  id: quakeID,
                },
                {
                  hover: false,
                }
              );
            }

            quakeID = null;

            setEarthquakeInfo({ mag: "", loc: "", date: "" });
            // Reset the cursor style
            map.getCanvas().style.cursor = "";
          });
        }
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map, state]);

  return (
    <>
      <div ref={(el) => (mapContainer.current = el)} style={styles} />
      <div className="quakeInfo">
        <div>
          <strong>Magnitude:</strong> <span id="mag">{earthquakeInfo.mag}</span>
        </div>
        <div>
          <strong>Location:</strong> <span id="loc">{earthquakeInfo.loc}</span>
        </div>
        <div>
          <strong>Date:</strong> <span id="date">{earthquakeInfo.date}</span>
        </div>
      </div>
    </>
  );
}

export default App;
