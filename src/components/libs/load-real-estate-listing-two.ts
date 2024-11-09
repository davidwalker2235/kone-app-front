import frontImage from '../images/front.jpg';
import bedroomImage from '../images/bedroom.jpg';
import backImage from '../images/back.jpg';
import { RealEstateListing } from '../types/types';

export async function loadRealEstateListingTwo(): Promise<RealEstateListing> {
  const url = new URL('../data/real-estate-listing-two.json', import.meta.url);

  const listing = (await fetch(url).then(res =>
    res.json()
  )) as RealEstateListing;

  listing.images = [frontImage, bedroomImage, backImage];

  return listing;
}