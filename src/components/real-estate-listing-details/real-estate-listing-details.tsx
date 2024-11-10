import React, {FunctionComponent} from 'react';

import './real-estate-listing-details.css';
import { BuildsDetails } from '../types/types';
import { useNavigate } from 'react-router-dom';

interface Props {
  details: BuildsDetails;
}

export const RealEstateListingDetails: FunctionComponent<Props> = ({
  details
}) => {
  const navigate = useNavigate();
  const {
    name,
    address,
    id
  } = details;

  const onClickSee = () => {
    navigate("/creator", {state: {id: id}});
  }

  return (
    <div className="details-container">
      <div className="listing-content">
        <h2>{name}</h2>
        <p>{address}</p>

        <p className="description">This elevator building is located in the heart of the city, just steps from the beach.</p>

        <p className="price">Next evaluation: 2025</p>
        <button onClick={onClickSee}>
            <span className="material-symbols-outlined"> See </span>
        </button>
      </div>
    </div>
  );
};