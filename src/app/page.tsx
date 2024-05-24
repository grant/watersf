'use client';

import Image from "next/image";
import { useState } from "react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // Create an async function that gets the user's location
  function getLocation(successCallback: PositionCallback, errorCallback: PositionErrorCallback) {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      // Get the user's location
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      // Alert the user that their browser does not support geolocation
      alert("Geolocation is not supported by this browser.");
    }
  }

  function getLocationAsync(): Promise<UserLocation | null> {
    return new Promise((resolve) => {
      // Get the user's location
      getLocation((position) => {
        console.log('position', position);
        setLoading(false);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }, (error) => {
        console.error(error);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setError("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
        }
        setLoading(false);
        resolve(null);
      });
    });
  }

  async function onClick() {
    console.log("Button clicked");
    setLoading(true);
    setUserLocation(await getLocationAsync());
    console.log('water', userLocation);
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      {/* Top logo and location */}
      <div className="text-center">
        <h1 className="text-4xl">Water SF</h1>
        <h3>Find Water Fountains in San Francisco</h3>
        {loading === null ? (
          <></>
        ) : loading ?  (
          <p>Loading...</p>
        ) : (
          <p>
            Your location: {userLocation?.latitude}, {userLocation?.longitude}
          </p>
        )}
      </div>

      {/* List of results */}

      {/* Button to find water */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClick}>
        Find Water
      </button>
    </main>
  );
}
