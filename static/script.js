import { coordinatesArray } from './coordinates.js';

// Define the AppState constructor function to manage the application state
function AppState() {
    this.state = {
        mapInstance: null, // Google Maps instance
        userLocation: null, // User's current location
        closestLocation: null, // Closest location for viewing the eclipse
        showSpinner: false, // Flag to show/hide a loading spinner
        dataFetched: false, // Flag to indicate if data has been fetched
    };
}

// Method to update the application state
AppState.prototype.setState = function(key, value) {
    this.state[key] = value;
};

// Utility function to convert degrees to radians
AppState.deg2rad = function(deg) {
    return deg * (Math.PI / 180);
};

// Function to calculate the distance between two coordinates using the Haversine formula
AppState.calculateDistance = function(lat1, lng1, lat2, lng2) {
    console.log(`Calculating distance between (${lat1}, ${lng1}) and (${lat2}, ${lng2})`);
    // Validate input coordinates
    if ([lat1, lng1, lat2, lng2].some(coord => typeof coord !== 'number' || coord == null)) {
        console.error('Invalid or missing input values for calculateDistance');
        throw new Error('Invalid or missing input values for calculateDistance');
    }
    const R = 6371; // Earth's radius in kilometers
    const dLat = AppState.deg2rad(lat2 - lat1); // Delta latitude in radians
    const dLng = AppState.deg2rad(lng2 - lng1); // Delta longitude in radians
    // Apply the Haversine formula
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(AppState.deg2rad(lat1)) * Math.cos(AppState.deg2rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

// Method to get the user's current location using the Geolocation API
AppState.prototype.getUserLocation = async function() {
    console.log('getUserLocation method invoked');
    // Check if Geolocation is supported
    if (!('geolocation' in navigator)) {
        console.error('Geolocation is not supported by this browser.');
        throw new Error('Geolocation is not supported by this browser.');
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            this.setState('userLocation', { lat: latitude, lng: longitude });
            console.log('User Location Set:', { lat: latitude, lng: longitude });
            resolve();
        }, error => {
            console.error('Geolocation error:', error);
            reject(error);
        });
    });
};

// Method to find the closest polygon coordinates to the user's location
AppState.prototype.findClosestPolyCoordinates = async function() {
    console.log('Attempting to find closest polygon coordinates with user location:', this.state.userLocation);
    // Validate user location and coordinates array
    if (!this.state.userLocation || typeof this.state.userLocation.lat !== 'number' || typeof this.state.userLocation.lng !== 'number') {
        console.error('User location is not set or contains invalid values.');
        throw new Error('User location is not set or contains invalid values.');
    }
    if (!coordinatesArray || coordinatesArray.length === 0) {
        console.error('Coordinates array is not available or empty.');
        throw new Error('Coordinates array is not available or empty.');
    }

    let closestDistance = Number.MAX_VALUE;
    let closestPolyCoordinates = null;

    // Iterate through coordinates to find the closest one
    coordinatesArray.forEach(coord => {
        const distance = AppState.calculateDistance(this.state.userLocation.lat, this.state.userLocation.lng, coord.lat, coord.lng);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestPolyCoordinates = coord;
        }
    });

    // Update state with the closest location
    if (closestPolyCoordinates) {
        this.setState('closestLocation', closestPolyCoordinates);
        console.log(`Closest polygon coordinates found at (${closestPolyCoordinates.lat}, ${closestPolyCoordinates.lng})`);
    } else {
        console.error('No closest polygon coordinates found within a reasonable distance.');
        throw new Error('No closest polygon coordinates found within a reasonable distance.');
    }
};

// Method to display the map modal
AppState.prototype.openMapModal = function() {
    const modal = document.getElementById('mapModal');
    modal.style.display = 'block';
    // Initialize the map after the modal is visible
    this.initializeMap().then(() => {
        if (this.state.mapInstance) {
            // Trigger a resize event in case the map was not properly initialized
            google.maps.event.trigger(this.state.mapInstance, 'resize');
            this.addRedPolyline(); // Call to add the polyline after map initialization
        }
    });
};

// Method to initialize the Google Maps instance
AppState.prototype.initializeMap = async function() {
    // Check if Google Maps API is available
    if (!window.google || !window.google.maps) {
        console.error('Google Maps API is not available.');
        throw new Error('Google Maps API is not available.');
    }
    // Validate closest location
    if (!this.state.closestLocation) {
        console.error('No closest location found. Cannot initialize the map.');
        throw new Error('No closest location found. Cannot initialize the map.');
    }
    const coordinates = this.state.closestLocation;
    const mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(coordinates.lat, coordinates.lng),
    };
    // Create a new map instance
    this.state.mapInstance = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Create the content for the info window
    const infoWindowContent = `
        <div style="font-family: Arial, sans-serif; color: #323232;">
            <h3>Total Solar Eclipse</h3>
            <p><strong>Address:</strong> ${coordinates.coord}</p>
            <p><strong>Time:</strong> ${coordinates.time}</p>
            <p><strong>Duration:</strong> ${coordinates.duration}</p>
            <p><a href="https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}" target="_blank">Get Directions</a></p>
        </div>
    `;

    // Create an info window with the content
    const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });

    // Create a marker for the closest location and add a click listener to open the info window
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(coordinates.lat, coordinates.lng),
        map: this.state.mapInstance,
        title: 'Closest Location'
    });

    marker.addListener('click', () => {
        infoWindow.open(this.state.mapInstance, marker);
    });
};

// Method to add a red polyline to the map
AppState.prototype.addRedPolyline = function() {
    const polyline = new google.maps.Polyline({
        path: coordinatesArray,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    polyline.setMap(this.state.mapInstance);
};

// Initialize the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const appState = new AppState();

    // Function to prepare the map by getting the user location and finding the closest coordinates
    async function prepareMap() {
        try {
            await appState.getUserLocation();
            await appState.findClosestPolyCoordinates();
            // The map initialization is called after the modal is opened to ensure visibility
        } catch (error) {
            console.error('Error preparing the map:', error);
            // Handle the error appropriately, possibly informing the user
        }
    }

    // Add a click event listener to the "Find Optimal Viewing Location" button
    const findLocationButton = document.getElementById('findLocation');
    findLocationButton.addEventListener('click', async function() {
        await prepareMap();
        appState.openMapModal(); // Open the map modal after preparing the map
    });

    // ... other event listeners and functions ...
});
