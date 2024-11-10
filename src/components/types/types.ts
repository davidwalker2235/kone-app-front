export interface BuildingsListing {
    uuid: string;
    details: BuildsDetails;
  }
  
  export interface BuildsDetails {
    id: "string",
    buildingId: "string",
    name: "string",
    address: "string",
    zip: "string",
    lat: 0,
    lng: 0,
    createdByUsername: "string",
    model: "string"
  }