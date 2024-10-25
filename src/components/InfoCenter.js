// components/InfoCenter.js
import React from 'react';
import './InfoCenter.css'; // Import the CSS file for styling the InfoCenter component

const InfoCenter = () => {
  return (
    <div className="info-center"> {/* Main container for the InfoCenter */}
      <h2>COVID-19 Info Center</h2> {/* Main heading for the section */}
      
      <h3>Prevention Tips</h3> {/* Subheading for tips on preventing COVID-19 */}
      <ul> {/* Unordered list for listing prevention tips */}
        <li>Wash your hands frequently.</li> {/* List item for washing hands */}
        <li>Maintain social distancing.</li> {/* List item for social distancing */}
        <li>Wear a mask in crowded places.</li> {/* List item for wearing masks */}
        <li>Avoid touching your face.</li> {/* List item for avoiding face touching */}
        <li>Stay home if you feel unwell.</li> {/* List item for staying home when unwell */}
      </ul>
      
      <h3>Vaccination Information</h3> {/* Subheading for vaccination info */}
      <p>
        Vaccines are safe and effective at preventing severe illness and death. {/* Information about vaccines */}
        <a 
          href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/index.html" 
          target="_blank" 
          rel="noopener noreferrer">
          Learn more about COVID-19 vaccines. {/* Link to more vaccine information */}
        </a>
      </p>
      
      <h3>Reliable Health Resources</h3> {/* Subheading for health resources */}
      <ul> {/* Unordered list for reliable health resource links */}
        <li>
          <a 
            href="https://www.who.int" 
            target="_blank" 
            rel="noopener noreferrer">
            World Health Organization (WHO) {/* Link to WHO */}
          </a>
        </li>
        <li>
          <a 
            href="https://www.cdc.gov" 
            target="_blank" 
            rel="noopener noreferrer">
            Centers for Disease Control and Prevention (CDC) {/* Link to CDC */}
          </a>
        </li>
        <li>
          <a 
            href="https://www.nhs.uk" 
            target="_blank" 
            rel="noopener noreferrer">
            National Health Service (NHS) {/* Link to NHS */}
          </a>
        </li>
      </ul>
      
      <h3>Infographics</h3> {/* Subheading for infographics */}
      <p>See below for a summary of important COVID-19 information:</p> {/* Instruction for users */}
      <img 
        src={require('./infographic.png').default} 
        alt="COVID-19 Infographic" /> {/* Image showing infographic */}
    </div>
  );
};

export default InfoCenter; // Export the InfoCenter component for use in other parts of the app
