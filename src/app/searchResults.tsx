import { WaterResourceComputed, WaterResource } from "./api/api";

// A list of search results
export function SearchResults({
  title,
  searchResults,
}: {
  title: string;
  searchResults: WaterResourceComputed[];
}) {
  return (
    <div>
      {searchResults.length ? (
        <h3 className="text-2xl my-6 text-center">{title}</h3>
      ) : (
        <></>
      )}
      {searchResults.map((searchResult) => (
        <SearchResult searchResult={searchResult} />
      ))}
    </div>
  );
}

// A single search result
function SearchResult({
  searchResult,
}: {
  searchResult: WaterResourceComputed;
}) {
  const mapsLink = getMapsLink(searchResult);
  const mapButton = mapsLink ? (
    <a
      href={mapsLink}
      target="_blank"
      rel="noreferrer"
      className="text-blue-500 hover:underline"
    >
      Map
    </a>
  ) : (
    <></>
  );

  return (
    <div className="border border-gray-300 bg-slate-950 rounded p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{searchResult.name}</h2>
      <p className="text-gray-400 mb-2">
        {mapButton} {searchResult.address}{" "}
      </p>
      <p className="text-gray-400 mb-2">
        {formatDistance(searchResult.distance)}
      </p>
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
    const addr = searchResult.address
      ? searchResult.address
      : searchResult.name;
    if (isApple) {
      return addr
        ? `http://maps.apple.com/?daddr=${encodeURIComponent(addr)}`
        : null;
    } else if (isAndroid) {
      return addr
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            addr
          )}`
        : null;
    }
  } else {
    // If not mobile, use the Google Maps URL
    const geo =
      searchResult.latitude && searchResult.longitude
        ? `${searchResult.latitude},${searchResult.longitude}`
        : searchResult.address
        ? searchResult.address
        : searchResult.name;
    return geo
      ? `https://www.google.com/maps/search/?api=1&query=${geo}`
      : null;
  }
}

function isMobileDevice() {
  return /Mobi|Android|iPhone/i.test(navigator.userAgent);
}

function formatDistance(distance: number) {
  const km = `${distance.toFixed(2)} km`;
  const mi = `${(distance * 0.621371).toFixed(2)} mi`;
  return (
    <>
      {km}
      <span className="text-slate-700"> | </span>
      {mi}
    </>
  );
}
