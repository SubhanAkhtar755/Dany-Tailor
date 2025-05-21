import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaScissors } from "react-icons/fa6";
import { Modal } from "antd";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  db,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "../Config/Firebase.jsx";
import "./Data.css";

const urduLabels = {
  date: "تاریخ",
  serial: "سیریل نمبر",
  address: "پتہ",
  name: "نام",
  deliveryDate: "تاریخ واپسی",
  receiveDate: "تاریخ وصولی",
  phone: "فون نمبر",
  shirtLength: "قمیض لمبائی",
  sleeve: "بازو",
  tiara: "تیرا",
  neck: "گلا",
  chest: "چھاتی",
  waist: "کمر",
  bottomWidth: "گھیرا",
  shalwar: "شلوار",
  paancha: "پائنچہ",
  shirt: "شلوار",
  pant: "سائیڈ",
  sleeves: "فرنٹ",
  Pleat: "پلیٹ",
  length: "کف",
  sleeveType: "کالر/بین",
  remaining: "بقایا",
  advance: "ایڈوانس",
  total: "ٹوٹل",
  extraNote: "نوٹ", // Added the extraNote label for Urdu
};

const englishLabels = {
  date: "Date",
  serial: "Serial",
  address: "Address",
  name: "Name",
  deliveryDate: "Delivery Date",
  receiveDate: "Receive Date",
  phone: "Phone",
  shirtLength: "Shirt Length",
  sleeve: "Sleeve",
  tiara: "Tiara",
  neck: "Neck",
  chest: "Chest",
  waist: "Waist",
  bottomWidth: "Bottom Width",
  shalwar: "Shalwar",
  paancha: "Paancha",
  shirt: "Shirt",
  pant: "Pant",
  sleeves: "Sleeves",
  Pleat: "Pleat",
  length: "Length",
  sleeveType: "Sleeve Type",
  remaining: "Remaining",
  advance: "Advance",
  total: "Total",
  extraNote: "Note", // Added the extraNote label for English
};

const Data = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("appLanguage") || "urdu";
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [password, setPassword] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0); // For total orders count

  const [selectedSuitStatus, setSelectedSuitStatus] = useState(null); // store selected entry
  const [suitModalVisible, setSuitModalVisible] = useState(false);
  const [suitStatus, setSuitStatus] = useState("Pending");
  const [suitQuantity, setSuitQuantity] = useState(1);

  const [suitDetailsModalVisible, setSuitDetailsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // store selected customer

  const labels = language === "urdu" ? urduLabels : englishLabels;
  const isUrdu = language === "urdu";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Deny-Customer"));
        const fetchedData = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setData(fetchedData);
        setFilteredData(fetchedData);
        setTotalOrders(fetchedData.length); // Set the total orders count
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (entry) =>
          entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.phone.includes(searchTerm) ||
          entry.serial.includes(searchTerm) || // Added filtering by serial number
          entry.date.includes(searchTerm) // Keep search by date
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const handleDelete = async () => {
    if (password === "003456") {
      try {
        const docIdToDelete = deleteItem.id;
        await deleteDoc(doc(db, "Deny-Customer", docIdToDelete));

        const updatedData = data.filter((item) => item.id !== docIdToDelete);
        setData(updatedData);
        setFilteredData(updatedData);
        setTotalOrders(updatedData.length);

        setShowPasswordPrompt(false);
        setPassword("");
        setDeleteItem(null);
        alert(isUrdu ? "آرڈر حذف ہو گیا ہے" : "Order has been deleted");
      } catch (error) {
        console.error("Error deleting document:", error);
        alert(isUrdu ? "ڈیلیٹ کرنے میں مسئلہ" : "Error deleting data");
      }
    } else {
      alert(isUrdu ? "غلط پاسورڈ" : "Incorrect password");
    }
  };

const handleSuitSave = async () => {
  if (!selectedSuitStatus) return;

  const customerId = selectedSuitStatus.id;
  const customerRef = doc(db, "Deny-Customer", customerId);

  const now = new Date();
  const readableDate = now.toLocaleString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    if (suitStatus === "Delivered") {
      const customerTotalFees = selectedSuitStatus.total || ""; // get current total from selected entry

      await updateDoc(customerRef, {
        suits: arrayUnion({
          quantity: parseInt(suitQuantity),
          deliveredAt: readableDate,
          totalFees: customerTotalFees, // 👈 include totalFees in delivered suit
        }),
        suitStatus: "",
        suitQuantity: "",
        readyStatus: "",
        total: "0", // 👈 reset total field
      });
    } else if (suitStatus === "Ready") {
      await updateDoc(customerRef, {
        suitStatus,
        suitQuantity: parseInt(suitQuantity),
        readyStatus: readableDate,
      });
    } else {
      await updateDoc(customerRef, {
        suitStatus,
        suitQuantity: parseInt(suitQuantity),
      });
    }

    alert(isUrdu ? "سوٹ کی معلومات محفوظ ہو گئیں" : "Suit info saved");
    setSuitModalVisible(false);
  } catch (error) {
    console.error("Error saving suit info:", error);
    alert(isUrdu ? "خرابی ہوئی" : "Something went wrong");
  }
};


  return (
    <div className={`data-page ${isUrdu ? "rtl" : "ltr"}`}>
      <div className={`lang-toggle ${isUrdu ? "right" : "left"}`}>
        <button
          onClick={() => {
            const newLang = isUrdu ? "english" : "urdu";
            setLanguage(newLang);
            localStorage.setItem("appLanguage", newLang); // 👈 yeh line add karein
          }}
        >
          {isUrdu ? "Switch to English" : "اردو پر جائیں"}
        </button>

        <span className="total-orders">
          {isUrdu
            ? `مجموعی آرڈرز: ${totalOrders}`
            : `Total Orders: ${totalOrders}`}
        </span>
      </div>

      <h2 className="data-title">
        {isUrdu ? "محفوظ شدہ آرڈرز" : "Saved Orders"}
      </h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder={
            isUrdu
              ? "نام یا فون تلاش کریں"
              : "Search by name, phone, serial number, or date"
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="toggle-show">
        <button onClick={() => setShowAll(!showAll)}>
          {showAll
            ? isUrdu
              ? "صرف آخری دکھائیں"
              : "Show Last Only"
            : isUrdu
            ? "سب دکھائیں"
            : "Show All"}
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-msg">
            {isUrdu ? "ڈیٹا لوڈ ہو رہا ہے..." : "Loading data..."}
          </p>
        </div>
      ) : filteredData.length === 0 ? (
        <p>{isUrdu ? "کوئی ڈیٹا دستیاب نہیں ہے" : "No data available"}</p>
      ) : (
        (showAll ? filteredData : filteredData.slice(-1)).map(
          (entry, index) => (
            <div className="data-card" key={index}>
              <div className="card-header">
                <h3>{isUrdu ? `آرڈر #${index + 1}` : `Order #${index + 1}`}</h3>
                <FaTrashAlt
                  className="delete-icon"
                  onClick={() => {
                    setDeleteItem(entry);
                    setShowPasswordPrompt(true);
                  }}
                />
              </div>

              <div className="suit-info-row">
                <div className="suit-box">
                  {isUrdu
                    ? `سوٹ کی حالت: ${entry.suitStatus || "زیر التواء"}`
                    : `Suit-Status: ${entry.suitStatus || "Pending"}`}
                </div>
                <div className="suit-box">
                  {isUrdu
                    ? `تعداد سوٹ :${entry.suitQuantity || 0}`
                    : `Suit-Qty: ${entry.suitQuantity || 0}`}
                </div>
                <div
                  className="suit-box"
                  onClick={() => {
                    setSelectedSuitStatus(entry);
                    setSuitStatus("Pending"); // default
                    setSuitQuantity(0); // default
                    setSuitModalVisible(true);
                  }}
                >
                  {isUrdu ? "سوٹ فارم " : "Suit Form"}
                </div>
                <div
                  className="suit-box"
                  onClick={() => {
                    setSelectedCustomer(entry); // ✅ store customer
                    setSuitDetailsModalVisible(true);
                  }}
                >
                  {isUrdu ? "سوٹ کی تفصیلات " : "Suit Details"}
                </div>
              </div>
              <div className="double-field-row">
                <Field label={labels.date} value={entry.date} />
                <Field label={labels.serial} value={entry.serial} />
              </div>
              <div className="double-field-row">
                <Field label={labels.address} value={entry.address} />
                <Field label={labels.name} value={entry.name} />
              </div>
              <div className="double-field-row">
                <Field label={labels.deliveryDate} value={entry.deliveryDate} />
                <Field label={labels.receiveDate} value={entry.receiveDate} />
              </div>
              <Field label={labels.phone} value={entry.phone} full />
              <div className="zigzag-grid">
                <Field
                  label={labels.shirtLength}
                  value={entry.shirtLength}
                  icon
                />
                <Field label={labels.sleeve} value={entry.sleeve} icon />
                <Field label={labels.tiara} value={entry.tiara} icon />
                <Field label={labels.neck} value={entry.neck} icon />
                <Field label={labels.chest} value={entry.chest} icon />
                <Field label={labels.waist} value={entry.waist} icon />
                <Field
                  label={labels.bottomWidth}
                  value={entry.bottomWidth}
                  icon
                />
                <Field label={labels.shalwar} value={entry.shalwar} icon />
                <Field label={labels.paancha} value={entry.paancha} icon />
              </div>

              <div className="zigzag-grid">
                <Field label={labels.shirt} value={entry.shirt} />
                <Field label={labels.pant} value={entry.pant} />
                <Field label={labels.sleeves} value={entry.sleeves} />
              </div>
              <div className="zigzag-grid">
                <Field label={labels.Pleat} value={entry.hips} />
                <Field label={labels.length} value={entry.length} />
                <Field label={labels.sleeveType} value={entry.sleeveType} />
              </div>
              <div className="zigzag-grid">
                <Field label={labels.remaining} value={entry.remaining} />
                <Field label={labels.advance} value={entry.advance} />
                <Field label={labels.total} value={entry.total} />
              </div>

              {/* Extra note field */}
              <Field label={labels.extraNote} value={entry.extra} full />
            </div>
          )
        )
      )}

      {showPasswordPrompt && (
        <div className="password-popup">
          <div className="popup-content">
            <h4>{isUrdu ? "پاسورڈ کی تصدیق کریں" : "Confirm Password"}</h4>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isUrdu ? "پاسورڈ درج کریں" : "Enter password"}
            />
            <div className="popup-buttons">
              <button onClick={handleDelete}>
                {isUrdu ? "حذف کریں" : "Delete"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPassword("");
                }}
              >
                {isUrdu ? "منسوخ کریں" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {suitModalVisible && (
        <div className="suit-modal">
          <div className="suit-modal-content">
            <h3>{isUrdu ? "سوٹ کی معلومات" : "Suit Details"}</h3>

            <label>{isUrdu ? "سوٹ کی تعداد" : "Number of Suits"}</label>
            <input
              type="number"
              min="1"
              value={suitQuantity}
              onChange={(e) => setSuitQuantity(e.target.value)}
            />

            <label>{isUrdu ? "سوٹ کی حالت" : "Suit Status"}</label>
            <select
              value={suitStatus}
              onChange={(e) => setSuitStatus(e.target.value)}
            >
              <option value="Pending">
                {isUrdu ? "زیر التواء" : "Pending"}
              </option>
              <option value="Ready">{isUrdu ? "تیار" : "Ready"}</option>
              <option value="Delivered">
                {isUrdu ? "ڈیلیور ہو گیا" : "Delivered"}
              </option>
            </select>

            <div className="popup-buttons">
              <button onClick={() => setSuitModalVisible(false)}>
                {isUrdu ? "بند کریں" : "Close"}
              </button>
              <button onClick={handleSuitSave}>
                {isUrdu ? "محفوظ کریں" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
   <Modal
  title={isUrdu ? "سوٹ کی تفصیلات" : "Suit Details"}
  open={suitDetailsModalVisible}
  onCancel={() => setSuitDetailsModalVisible(false)}
  footer={null}
>
  <div style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "10px" }}>
    {selectedCustomer?.suits && selectedCustomer.suits.length > 0 ? (
      selectedCustomer.suits.map((suit, index) => (
        <div
          key={index}
          style={{
            marginBottom: "15px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <p>
            <strong>{isUrdu ? "تاریخ حوالگی:" : "Delivered At:"}</strong>{" "}
            {suit.deliveredAt}
          </p>
          <p>
            <strong>{isUrdu ? "سوٹ کی تعداد:" : "Suit Quantity:"}</strong>{" "}
            {suit.quantity}
          </p>
          <p>
            <strong>{isUrdu ? "کل فیس:" : "Total Fees:"}</strong>{" "}
            {suit.totalFees}
          </p>
        </div>
      ))
    ) : (
      <p>{isUrdu ? "کوئی ڈیلیور شدہ سوٹ نہیں ملا۔" : "No delivered suits found."}</p>
    )}
  </div>
</Modal>

    </div>
  );
};

const Field = ({ label, value, icon, full }) => (
  <div className={`field-wrapper ${full ? "full" : ""}`}>
    <div className="field-label">
      <span>{label}</span>
    </div>
    <div className="field-value">
      {value} {icon && <FaScissors />}
    </div>
  </div>
);

export default Data;
