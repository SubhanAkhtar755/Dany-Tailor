import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../Pages/Home.jsx";
import Admin from "../Pages/Admin.jsx";
import SecretTrigger from '../Components/SecretTrigger.jsx'
import SuitSearchPage from "../Pages/SuitSearchPage.jsx";


function Approuter() {

  return (
    <BrowserRouter>
     <SecretTrigger />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/003456" element={<Admin />} />
             <Route path="/check-suit" element={<SuitSearchPage />} />
          </Routes>
      
    </BrowserRouter>
  );
}

export default Approuter;