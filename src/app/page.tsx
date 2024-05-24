'use client';

// import Image from "next/image";
import { useState } from "react";
import { UserLocation, getLocationAsync } from "./geolocation";
import { WaterResource, WaterResourceComputed, getResults } from "./api/api";

export default function Home() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const [searchResultsWater, setSearchResultsWater] = useState<WaterResourceComputed[]>([]);
  const [searchResultsRestroom, setSearchResultsRestroom] = useState<WaterResourceComputed[]>([]);

  async function onClick() {
    setLoading(true);
    const userLocation = await getLocationAsync(
      setLoading,
      setError
    );
    setUserLocation(userLocation);

    if (!userLocation) {
      setLoading(false);
      setError("Could not get location");
      return;
    }

    // Update results
    const searchResultsWater = getResults(userLocation, "drinking_water");
    const searchResultsRestroom = getResults(userLocation, "restroom");

    setSearchResultsWater(searchResultsWater);
    setSearchResultsRestroom(searchResultsRestroom);
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
        ) : error !== null ? (
          <p>Error: {error}</p>
        ) : (
          <p>
            Your location: {userLocation?.latitude}, {userLocation?.longitude}
          </p>
        )}
      </div>

      {/* List of results */}
      <div>
        <SearchResults title="Water Fountains" searchResults={searchResultsWater} />
        <SearchResults title="Restrooms" searchResults={searchResultsRestroom} />
      </div>

      {/* Button to find water */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded" onClick={onClick}>
        Find Water
      </button>
    </main>
  );
}

// A list of search results
function SearchResults({ title, searchResults }: { title: string, searchResults: WaterResourceComputed[] }) {
  return (
    <div>
      <h3 className="text-2xl text-center">{title}</h3>
      {searchResults.map((searchResult) => (
        <SearchResult searchResult={searchResult} />
      ))}
    </div>
  );
}

// A single search result
function SearchResult({ searchResult }: { searchResult: WaterResourceComputed }) {
  const mapsLink = getMapsLink(searchResult);
  
  return (
    <div className="border border-gray-300 rounded p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{searchResult.name}</h2>
      <p className="text-gray-600 mb-2">{searchResult.address}</p>
      <p className="text-gray-600 mb-2">{formatDistance(searchResult.distance)}</p>
      {mapsLink ? (
        <a href={mapsLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
          Map
        </a>
      ) : (
        <></>
      )}
    </div>
  );
}

function getMapsLink(searchResult: WaterResource) {
  // If Apple phones, use the Apple Maps URL
  // If Android phones, use the Google Maps URL
  const isApple = navigator.vendor.includes("Apple");
  const isAndroid = navigator.vendor.includes("Google");

  const isMobile = isMobileDevice();

  if (isMobile) {
    if (isApple) {
      const addr = searchResult.address ? searchResult.address : searchResult.name;
      return addr ? `http://maps.apple.com/?daddr=${encodeURIComponent(addr)}` : null;
    } else if (isAndroid) {
      const geo = searchResult.latitude && searchResult.longitude ? `${searchResult.latitude},${searchResult.longitude}` : null;
      return geo ? `geo:${geo}` : null;
    }
  } else {
    // If not mobile, use the Google Maps URL
    const geo = searchResult.latitude && searchResult.longitude ? `${searchResult.latitude},${searchResult.longitude}` : null;
    return geo ? `https://www.google.com/maps/search/?api=1&query=${geo}` : null;
  }
}

function isMobileDevice() {
  return /Mobi|Android|iPhone/i.test(navigator.userAgent);
}

function formatDistance(distance: number) {
  return `${distance.toFixed(2)} km | ${(distance * 0.621371).toFixed(2)} mi`;
}