import React, { useState, useEffect, useCallback } from 'react';
import Geocode from 'react-geocode';

// google maps api
const geocode_api_key = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY;
const geocode_endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';

// preferred class sol'n is to use Geocode, I am using it here so as
// backup and comparison and not to lose example

Geocode.setApiKey(geocode_api_key);

// component to input city from form, convert to lat long
// https://developers.google.com/maps/documentation/geocoding/overview?hl=en_US
// https://stackoverflow.com/questions/tagged/google-geocoding-api
export default function GeoForm({ setLatLong }) {
  const [address, setAddress] = useState('San Francisco');
  const [lookup, setLookup] = useState(false);

  // geoCodeAddress
  async function geoCodeAddress(address) {
    const query = `address=${encodeURI(address)}&key=${geocode_api_key}`;

    const response = await fetch(`${geocode_endpoint}?${query}`);
    const data = await response.json();
    // console.log('GeoForm -> data', data);
    // we have data!

    const { status, results } = data;

    if (results.length > 0) {
      const [{ geometry, formatted_address }] = results;
      const { lat = '', lng: long = '' } = geometry.location;
      const latLong = {
        status,
        lat,
        long,
      };
      setLatLong(latLong);
      setAddress(formatted_address);
    }
  }

  // getGeoCodeAddress
  const getGeoCodeAddress = useCallback((address) => {
    // console.log('memoizing...');
    geoCodeAddress(address);
  }, []);

  useEffect(() => {
    // console.log('UseEffect: address', address);

    if (address && lookup) {
      // comparison: how does Geocode package do?
      /*       
      Geocode.fromAddress(address).then((res) => {
        console.log('Geocode.fromAddress:res', res);
      });
      */

      getGeoCodeAddress(address);
    }

    setLookup(false);
  }, [address, lookup, getGeoCodeAddress]);

  const lookupAddress = (e) => {
    e.preventDefault();
    setLookup(true);
  };
  //  /*
  return (
    <form onSubmit={lookupAddress}>
      <input
        type="text"
        placeholder="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {/* <button>whether</button> */}
    </form>
  );
}
