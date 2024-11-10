import React, {FunctionComponent, useState} from 'react';
import {AdvancedMarker} from '@vis.gl/react-google-maps';
import classNames from 'classnames';

import './custom-advanced-marker.css';
import { BuildingsListing, BuildsDetails } from '../types/types';
import { RealEstateListingDetails } from '../real-estate-listing-details/real-estate-listing-details';
import { RealEstateGallery } from '../real-estate-gallery/real-estate-gallery';
import { RealEstateIcon } from '../icons/real-estate-icon';

interface Props {
  buildingListing: BuildsDetails;
}

export const CustomAdvancedMarker: FunctionComponent<Props> = ({
  buildingListing
}) => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const position = {
    lat: buildingListing?.lat,
    lng: buildingListing?.lng
  };

  const renderCustomPin = () => {
    return (
      <>
        <div className="custom-pin">
          <button className="close-button">
            <span className="material-symbols-outlined"> close </span>
          </button>

          <div className="image-container">
            <span className="icon">
              <RealEstateIcon />
            </span>
          </div>

          <RealEstateListingDetails details={buildingListing} />
        </div>
        <div className="tip" />
      </>
    );
  };

  return (
    <>
      <AdvancedMarker
        position={position}
        title={'AdvancedMarker with custom html content.'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={classNames('real-estate-marker', {clicked, hovered})}
        onClick={() => setClicked(!clicked)}>
        {renderCustomPin()}
      </AdvancedMarker>
    </>
  );
};