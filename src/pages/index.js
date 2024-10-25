import React, { useRef, useEffect, useState } from "react"; // Importing React and necessary hooks
import PropTypes from "prop-types"; // Importing PropTypes for type checking
import { Helmet } from "react-helmet"; // Importing Helmet for managing document head
import L from "leaflet"; // Importing Leaflet for map functionalities
import { useMap } from "react-leaflet"; // Importing useMap to access the map instance
import axios from "axios"; // Importing axios for making API requests

import Layout from "components/Layout"; // Importing the Layout component for consistent page structure
import Container from "components/Container"; // Importing the Container component for layout styling
import Map from "components/Map"; // Importing our custom Map component
import Snippet from "components/Snippet"; // This component might be for displaying snippets of information (not used here)
import InfoCenter from "components/InfoCenter"; // Importing the InfoCenter component for educational content

const LOCATION = {
  lat: 0,
  lng: 0,
}; // Default location coordinates (0, 0) for centering the map
const CENTER = [LOCATION.lat, LOCATION.lng]; // Centering the map using the default location
const DEFAULT_ZOOM = 2; // Default zoom level for the map
const FOCUS_ZOOM = 5; // Zoom level for focusing on a single country

// MapEffect component is responsible for fetching and displaying COVID-19 data on the map
const MapEffect = ({ searchTerm }) => {
  const map = useMap(); // Get the map instance from react-leaflet

  useEffect(() => {
    async function mapEffect() {
      let response;

      // Fetching COVID-19 data for countries
      try {
        response = await axios.get('https://disease.sh/v3/covid-19/countries'); // Updated endpoint to get country data
      } catch (e) {
        console.log(`Failed to fetch countries: ${e.message}`, e); // Log error if fetching fails
        return; // Exit if there's an error
      }

      const { data = [] } = response; // Extracting data from the response
      const hasData = Array.isArray(data) && data.length > 0; // Check if data is valid

      if (!hasData) return; // Exit if no data is found

      // Filtering data based on the user's search term
      const filteredData = data.filter((country) =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase()) // Case insensitive search
      );

      // Creating GeoJSON features from the filtered country data
      const geoJson = {
        type: 'FeatureCollection',
        features: filteredData.map((country = {}) => {
          const { countryInfo = {} } = country; // Extract country info
          const { lat, long: lng } = countryInfo; // Get latitude and longitude
          return {
            type: 'Feature',
            properties: {
              ...country, // Include all country properties
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat] // GeoJSON format requires coordinates in [lng, lat]
            }
          };
        })
      };

      // Creating a GeoJSON layer with custom markers
      const geoJsonLayers = new L.GeoJSON(geoJson, {
        pointToLayer: (feature = {}, latlng) => {
          const { properties = {} } = feature; // Extract properties from feature
          let updatedFormatted; // Variable to store formatted update time
          let casesString; // Variable to format cases string

          const { country, updated, cases, deaths, recovered } = properties; // Destructure properties

          // Formatting cases to show "1k+" if over 1000
          casesString = `${cases}`; // Start with the raw case number
          if (cases > 1000) {
            casesString = `${casesString.slice(0, -3)}k+`; // Change format if greater than 1000
          }

          // Formatting the updated date
          if (updated) {
            updatedFormatted = new Date(updated).toLocaleString(); // Format the update time for display
          }

          // Create the HTML for the marker and tooltip
          const html = `
            <span class="icon-marker">
              <span class="icon-marker-tooltip">
                <h2>${country}</h2>
                <ul>
                  <li><strong>Confirmed:</strong> ${cases}</li>
                  <li><strong>Deaths:</strong> ${deaths}</li>
                  <li><strong>Recovered:</strong> ${recovered}</li>
                  <li><strong>Last Update:</strong> ${updatedFormatted}</li>
                </ul>
              </span>
              ${casesString}
            </span>
          `;

          // Returning a marker with the tooltip
          return L.marker(latlng, {
            icon: L.divIcon({
              className: 'icon',
              html,
            }),
            riseOnHover: true, // Make marker rise on hover
          });
        }
      });

      // Add GeoJSON layers to the map
      geoJsonLayers.addTo(map);
      const bounds = L.geoJSON(geoJson).getBounds(); // Calculate bounds for the markers

      // Adjust zoom behavior based on the number of markers
      if (filteredData.length > 1) {
        map.fitBounds(bounds); // Fit bounds if there are multiple markers
      } else if (filteredData.length === 1) {
        const { countryInfo } = filteredData[0];
        const { lat, long: lng } = countryInfo;
        map.setView([lat, lng], FOCUS_ZOOM); // Focus zoom level if one marker is found
      } else {
        map.setView(CENTER, DEFAULT_ZOOM); // Reset to default center if no markers are found
      }
    }

    mapEffect(); // Call the function to fetch data
  }, [map, searchTerm]); // Only run this effect when the map or searchTerm changes

  return null; // This component doesn't render anything itself
};

// IndexPage is the main component for the page
const IndexPage = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term input

  // Handle changes in the search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Update search term based on input
  };

  // Map settings for centering and zoom level
  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
  };

  // Render the main layout of the page
  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title> {/* Title for the page */}
      </Helmet>

      {/* Search input for country */}
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Render the Map component with the search term effect */}
      <Map {...mapSettings}>
        <MapEffect searchTerm={searchTerm} />
      </Map>

      {/* Main content section */}
      <Container type="content" className="text-center home-start">
        <h2>My first try of creating a dynamic website</h2>
        <p>Thanks to the Gatsby tutorial</p>
      </Container>

      <InfoCenter /> {/* Add the InfoCenter component here for educational content */}
    </Layout>
  );
};

export default IndexPage; // Exporting the main page component
