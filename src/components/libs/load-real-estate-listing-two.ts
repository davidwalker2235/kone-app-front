import { BuildingsListing } from '../types/types';

export async function loadRealEstateListingTwo(): Promise<BuildingsListing> {
  const url = new URL('../data/real-estate-listing-two.json', import.meta.url);

  const listing = (await fetch(url).then(res =>
    res.json()
  )) as BuildingsListing;

  return listing;
}