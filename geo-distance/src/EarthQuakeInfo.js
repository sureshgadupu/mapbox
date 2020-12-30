import React from "react";

const EarthQuakeInfo = ({ earthquakeInfo }) => {
  return (
    <div>
      <div>
        <div>Place : {earthquakeInfo.place}</div>
        <div>Magnitude : {earthquakeInfo.mag}</div>
        <div>
          Lattitude : {earthquakeInfo.latitude} , Longitude :
          {earthquakeInfo.longitude}
        </div>
      </div>
    </div>
  );
};

export default EarthQuakeInfo;
