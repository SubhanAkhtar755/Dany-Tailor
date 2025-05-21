// import React from 'react';
// import './FrontPage.css';

// const FrontPage = () => {
//   return (
//     <div className="advanced-frontpage">
//       <div className="floating-lights" />

//       <div className="glass-container">
//         <h1 className="glow-heading">Dany Tailor</h1>
//         <p className="glow-tagline">
//           Crafting bespoke fashion with elegance, finesse & timeless style.
//         </p>

//         <div className="contact-section">
//           <h2 className="contact-title">Contact Us</h2>
//           <p><strong>📍 Address:</strong> Old City Thana Road Hasilpur, Street No 7</p>
//           <p><strong>📞 Phone:</strong> <a href="tel:+923061004045">+92 306 1004045</a></p>
//           <p><strong>✉️ Email:</strong> <a href="mailto:rajadanyfashion4045@gmail.com">rajadanyfashion4045@gmail.com</a></p>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default FrontPage;
import React from "react";
import "./FrontPage.css";
import { useNavigate } from "react-router-dom";

const FrontPage = () => {
  const navigate = useNavigate();

  const handleCheckSuit = () => {
    navigate("/check-suit");
  };

  return (
    <div className="tailor-page">
   <header className="navbar">
  <div className="container">
    <h1 className="logo">Dany Tailor</h1>
    <button className="check-button" onClick={handleCheckSuit}>
      Check Suit Ready
    </button>
  </div>
</header>


      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h2>Professional Tailoring Services</h2>
          <p>
            Apke kapron ka perfect fitting solution. Shaadi, party, ya rozmarra
            kapron ke liye expert silai.
          </p>
          <button><a href="tel:03061004045">Appointment Book Karein</a></button>
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <h3>Hamari Services</h3>
        <div className="service-boxes">
          <div className="service">
            <h4>Gents Tailoring</h4>
            <p>Shalwar kameez, coat pants, waistcoat wagaira ke liye expert tailoring.</p>
          </div>
          <div className="service female-service">
            <h4>Ladies Tailoring</h4>
            <ul>
              <li>Not Provided This Service</li>
            </ul>
          </div>
          <div className="service">
            <h4>Alterations</h4>
            <p>Kapron ki fitting, sleeves, length, aur waist alteration services.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="brand">Dany Tailor</p>
          <p><span className="ssssss">Address:</span> Old City Thana Road Hasilpur, Street No 7</p>
          <p><span className="ssssss">Email: </span> <a className="frontpage-contact" href="mailto:rajadanyfashion4045@gmail.com">
              rajadanyfashion4045@gmail.com
            </a></p>
          <p><span className="ssssss">Phone: </span><a className="frontpage-contact" href="tel:+923061004045"> 0306-1004045</a></p>
          <p className="copy">&copy; 2025 Dany Tailor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FrontPage;
