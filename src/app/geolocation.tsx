export interface UserLocation {
  latitude: number;
  longitude: number;
}


export function getLocationAsync(
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void
): Promise<UserLocation | null> {
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
          setError("Geolocation permission denied. Please enable location services.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          setError("Geolocation timed out.");
          break;
      }
      setLoading(false);
      resolve(null);
    });
  });
}


// Create an async function that gets the user's location
export function getLocation(successCallback: PositionCallback, errorCallback: PositionErrorCallback) {
  // Check if the browser supports geolocation
  if (navigator.geolocation) {
    // Get the user's location
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    // Alert the user that their browser does not support geolocation
    alert("Geolocation is not supported by this browser.");
  }
}