import React, { useState } from 'react';
import './SuitSearchPage.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { collection, getDocs, query, where , db} from '../Config/Firebase.jsx';


const SuitSearchPage = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
  if (input.trim() === '') return;

  setLoading(true);
  setStatus(null);

  try {
    const customerRef = collection(db, 'Deny-Customer');

    const phoneQuery = query(customerRef, where('phone', '==', input.trim()));
    const serialQuery = query(customerRef, where('serial', '==', input.trim()));

    const [phoneSnap, serialSnap] = await Promise.all([
      getDocs(phoneQuery),
      getDocs(serialQuery),
    ]);

    const snapshot = !phoneSnap.empty ? phoneSnap : serialSnap;

    if (snapshot.empty) {
      setStatus({
        type: 'error',
        message: '❌ Record nahi mila. Sahi number ya token dobara check karein.',
        suggestion: 'Agar masla barqarar rahe to humein call karein: 0306-1004045',
      });
    } else {
      const docData = snapshot.docs[0].data();
      const quantity = docData.suitQuantity || 0;
      const suitStatus = docData.suitStatus || '';
      const readyDate = docData.readyStatus || '';

      if (!quantity || quantity === 0) {
        setStatus({
          type: 'info',
          message: 'ℹ️ Aap ne abhi tak silai ke liye suit nahi diya hai.',
        });
      } else if (suitStatus.toLowerCase() === 'pending') {
        setStatus({
          type: 'warning',
          message: `⌛ Aap ne ${quantity} suit diya hai jo abhi tak tayar nahi hua.`,
        });
      } else if (suitStatus.toLowerCase() === 'ready') {
        setStatus({
          type: 'success',
          message: `✅ Aap ke ${quantity} suit ${readyDate} ko tayar ho chuke hain. Barae mehrbani receive kar lein.`,
        });
      } else {
        setStatus({
          type: 'info',
          message: 'ℹ️ Status system mein updated nahi hai. Barae mehrbani rabta karein.',
        });
      }
    }
  } catch (err) {
    console.error(err);
    setStatus({
      type: 'error',
      message: '⚠️ Kuch masla ho gaya. Dobara koshish karein.',
    });
  }

  setLoading(false);
};


  return (
    <div className="search-page">
      <div className="search-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft className="arrow-icon" />
          Back
        </button>

        <h2>🔍 Suit Status Check</h2>
        <p className="sub">Apna Phone ya Token Number neeche darj karein</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter Phone or Token Number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Checking...' : 'Check Now'}
          </button>
        </div>

        {status && (
          <div className={`status-box ${status.type}`}>
            <p>{status.message}</p>
            {status.date && <p className="extra">{status.date}</p>}
            {status.suggestion && <p className="extra">{status.suggestion}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuitSearchPage;
