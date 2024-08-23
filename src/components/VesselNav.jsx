import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import Leaf from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css'; 

// Images
import vesselIcon from '../assets/frame.png';
import startIcon from '../assets/location1.png';
import endIcon from '../assets/location2.png';

const VesselNav = ({ startCoords, endCoords, speed }) => {
  const [position, setPosition] = useState(startCoords);
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    const latDiff = endCoords[0] - startCoords[0];
    const lonDiff = endCoords[1] - startCoords[1];
    const totalDistance = Math.sqrt(latDiff ** 2 + lonDiff ** 2);

    const moveVessel = () => {
      setPosition(([lat, lon]) => {
        const distanceTraveled = speed / 3600; 

        const newLat = lat + (distanceTraveled * latDiff) / totalDistance;
        const newLon = lon + (distanceTraveled * lonDiff) / totalDistance;

        const angle = Math.atan2(lonDiff, latDiff) * (180 / Math.PI);
        setRotationAngle(angle);

        const distanceToEnd = Math.sqrt(
          (newLat - endCoords[0]) ** 2 + (newLon - endCoords[1]) ** 2
        );

        if (distanceToEnd < distanceTraveled) {
         
          return startCoords; 
        }

        return [newLat, newLon]; 
      });
    };

    const intervalId = setInterval(moveVessel, 500); 
    return () => clearInterval(intervalId);
  }, [startCoords, endCoords, speed]);

  const vesselIconCustom = new Leaf.DivIcon({
    html: `<img src="${vesselIcon}" style="transform: rotate(${rotationAngle}deg); width: 20px; height: 100px;" alt="vessel"/>`,
    className: 'vessel-icon',
    iconSize: [30, 90],
    iconAnchor: [15, 45],
  });

  const startMarkerIcon = new Leaf.Icon({
    iconUrl: startIcon,
    iconSize: [25, 25],
  });

  const endMarkerIcon = new Leaf.Icon({
    iconUrl: endIcon,
    iconSize: [25, 25],
  });

  return (
    //the info of the vessel
    <div>
      <div className="vessel-info">
        <div className="vessel-info-section">
          <p><strong>Starting</strong></p>
          <p><span>Lat:</span>{startCoords[0]}</p>
          <p><span>Long:</span>{startCoords[1]}</p>
        </div>
        <div className="vessel-info-section">
          <p className="speed"><strong>Speed:</strong> {speed} km/h</p>
        </div>
        <div className="vessel-info-section">
          <p><strong>Ending</strong></p>
          <p><span>Lat:</span>{endCoords[0]}</p>
          <p><span>Long:</span>{endCoords[1]}</p>
        </div>
        
      </div>
      {/* About the map */}
      <MapContainer center={startCoords} zoom={13} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={vesselIconCustom}></Marker>
        <Marker position={startCoords} icon={startMarkerIcon}></Marker>
        <Marker position={endCoords} icon={endMarkerIcon}></Marker>
      </MapContainer>
    </div>
  );
};
VesselNav.propTypes = {
  startCoords: PropTypes.arrayOf(PropTypes.number).isRequired,
  endCoords: PropTypes.arrayOf(PropTypes.number).isRequired,
  speed: PropTypes.number.isRequired,
};

export default VesselNav;
