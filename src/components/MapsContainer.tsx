import {useState} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import {
  useQuery
} from '@tanstack/react-query'
import './MapContainer.css';
import { BuildingsListing } from './types/types';
import { CustomAdvancedMarker } from './custom-advanced-marker/custom-advanced-marker';

const MapContainer = () => {

  const fetchUsers = async () => {
    const res = await fetch("https://kwqr317z-5050.uks1.devtunnels.ms/buildings");
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  };

  const {data} = useQuery({ queryKey: ['todos'], queryFn: fetchUsers});
  
  return (
    <div style={{ height: '100vh' }} className="advanced-marker-example">
        <APIProvider  apiKey={process.env.REACT_APP_NOT_SECRET_CODE as string}>
          <Map
          mapId={'bf51a910020fa25a'}
          defaultZoom={10}
          defaultCenter={{lat: 41.39, lng: 2.1}}
          gestureHandling={'greedy'}
          disableDefaultUI>
          {data ? data.map((build: any) => (<CustomAdvancedMarker buildingListing={build} />)) : null}
          </Map>
        </APIProvider>
    </div>
  );
};

export default MapContainer;