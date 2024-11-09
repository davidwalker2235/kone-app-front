import {useEffect, useState} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';


import './MapContainer.css';
import { RealEstateListing } from './types/types';
import { CustomAdvancedMarker } from './custom-advanced-marker/custom-advanced-marker';
import { loadRealEstateListing } from './libs/load-real-estate-listing';
import { loadRealEstateListingTwo } from './libs/load-real-estate-listing-two';

const MapContainer = () => {
  const [realEstateListing, setRealEstateListing] =
    useState<RealEstateListing | null>(null);
    const [realEstateListingTwo, setRealEstateListingTwo] =
    useState<RealEstateListing | null>(null);

  useEffect(() => {
    void loadRealEstateListing().then((data: any) => {
      setRealEstateListing(data);
    });
    void loadRealEstateListingTwo().then((data: any) => {
        setRealEstateListingTwo(data);
      });
  }, []);

  return (
    <div style={{ height: '100vh' }} className="advanced-marker-example">
        <APIProvider  apiKey={process.env.REACT_APP_NOT_SECRET_CODE as string}>
                <Map
                mapId={'bf51a910020fa25a'}
                defaultZoom={10}
                defaultCenter={{lat: 41.39, lng: 2.1}}
                gestureHandling={'greedy'}
                disableDefaultUI>
                {realEstateListing && (
                    <CustomAdvancedMarker realEstateListing={realEstateListing} />
                )}
                {realEstateListingTwo && (
                    <CustomAdvancedMarker realEstateListing={realEstateListingTwo} />
                )}
                </Map>
        </APIProvider>
    </div>
  );
};

export default MapContainer;