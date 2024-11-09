import React, {useState, FunctionComponent, MouseEvent} from 'react';

import './real-estate-gallery.css';
import ModelContainer from '../ModelContainer';

interface Props {
  images: string[];
  isExtended: boolean;
}

export const RealEstateGallery: FunctionComponent<Props> = ({
  images,
  isExtended = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <div className={`photo-gallery ${isExtended ? 'extended' : ''}`}>
      <div className="gallery-navigation">
        <ModelContainer />
      </div>
    </div>
  );
};