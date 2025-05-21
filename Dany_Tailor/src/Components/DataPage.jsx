import React, { useEffect, useState } from "react";
import "./DataPage.css";
import Data from "./Data";
import FormPage from "./FormPage";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  db,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "../Config/Firebase.jsx";

const DataPage = () => {
  const [activeTab, setActiveTab] = useState("form");
  const [menuOpen, setMenuOpen] = useState(false);
  const [totalSuits, setTotalSuits] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to calculate and store total suits & total fees in Firestore
  const updateTotalSuits = async () => {
    try {
      const customersSnapshot = await getDocs(collection(db, "Deny-Customer"));
      let total = 0;
      let fees = 0;

      for (const customerDoc of customersSnapshot.docs) {
        const customerData = customerDoc.data();
        const suits = customerData.suits || [];

        suits.forEach((suit) => {
          if (suit.quantity) {
            total += Number(suit.quantity);
          }
          if (suit.totalFees) {
            fees += Number(suit.totalFees);
          }
        });
      }

      await setDoc(doc(db, "total-suits", "total"), {
        count: total,
        totalFees: fees,
        updatedAt: new Date(),
      });

      console.log("✅ Total suits and fees updated:", total, fees);
    } catch (error) {
      console.error("❌ Error calculating or saving total:", error);
    }
  };

  // Fetch total suits and fees from Firestore
  const fetchTotalSuits = async () => {
    try {
      const docRef = doc(db, "total-suits", "total");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalSuits(data.count || 0);
        setTotalFees(data.totalFees || 0);

        // Handle the updatedAt field correctly
        const updatedAt = data.updatedAt
          ? new Date(data.updatedAt.seconds * 1000)
          : null; // Convert Firestore timestamp to JS date
        setLastUpdated(updatedAt);
      } else {
        console.warn("No total suits document found.");
        setTotalSuits(0);
        setTotalFees(0);
        setLastUpdated(null);
      }
    } catch (error) {
      console.error("❌ Error fetching totals:", error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteDoc(doc(db, "Deny-Customer", customerId));
      console.log(`✅ Customer ${customerId} removed successfully.`);
      await updateTotalSuits();
      await fetchTotalSuits();
    } catch (error) {
      console.error("❌ Error removing customer:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await updateTotalSuits();
      await fetchTotalSuits();
    };
    init();
  }, []);

  return (
    <div className="main-page">
   
      <header className="responsive-navbar">
        <div className="navbar-content">
          <h2 className="logo">📋 Dany Panel</h2>

          <div
            className="hamburger"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>

          <div className={`menu-items ${menuOpen ? "open" : ""}`}>
            <button
              className={`tab-btn ${activeTab === "form" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("form");
                setMenuOpen(false);
              }}
            >
              ✏️ Form
            </button>
            <button
              className={`tab-btn ${activeTab === "data" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("data");
                setMenuOpen(false);
              }}
            >
              📊 Data
            </button>
            <Link to="/" className="tab-btn" onClick={() => setMenuOpen(false)}>
              ⬅️ Back
            </Link>

            <div className="refresh-button-container">
              <button
                className="tab-btn"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    window.location.reload();
                  }, 300);
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Refreshing...
                  </>
                ) : (
                  "Refresh"
                )}
              </button>
            </div>

   
            <div className="total-suits-container">
              <button
                className="total-suits-button"
                onClick={() => setShowBusinessModal(true)}
              >
                💼 Business
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="tab-content">
        {activeTab === "form" ? (
          <FormPage />
        ) : (
          <Data handleDeleteCustomer={handleDeleteCustomer} />
        )}
      </div>

      {/* Business Modal */}
      {showBusinessModal && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -20%)",
            backgroundColor: "#fff",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
            zIndex: 1000,
            minWidth: "300px",
            textAlign: "center",
          }}
        >
          <h2>📊 Business Summary</h2>
          <p style={{ fontSize: "18px", margin: "10px 0" }}>
            👔 Total Suits: <strong>{totalSuits}</strong>
          </p>
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>
            💰 Total Fees: <strong>Rs {totalFees}</strong>
          </p>
          <p style={{ fontSize: "14px", color: "gray", marginBottom: "20px" }}>
            ⏱️ Last Updated:{" "}
            <strong>
              {lastUpdated
                ? lastUpdated.toLocaleString()
                : "Not available"}
            </strong>
          </p>

          <button
            onClick={() => setShowBusinessModal(false)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#222673",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default DataPage;
