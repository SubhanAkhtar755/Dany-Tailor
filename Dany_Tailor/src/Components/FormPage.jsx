import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';
import { FaScissors } from 'react-icons/fa6';
import { collection, doc, setDoc, getDoc, deleteDoc, getDocs, db } from '../Config/Firebase.jsx';
import './FormPage.css';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

// Regular input field
const Field = ({ name, urduLabel, englishLabel, placeholder, showIcon, isUrdu }) => (
  <Form.Item
    name={name}
    className={`urdu-field ${showIcon ? 'decorated-label' : ''}`}
    label={
      <div className="field-label">
        <span className="urdu-label">{isUrdu ? urduLabel : englishLabel}</span>
      </div>
    }
  >
    <Input
      placeholder={placeholder || name}
      suffix={showIcon ? <FaScissors /> : null}
      className="input-box"
    />
  </Form.Item>
);

// Date input field
const DateField = ({ name, urduLabel, englishLabel, isUrdu }) => (
  <Form.Item
    name={name}
    className="urdu-field"
    label={
      <div className="field-label">
        <span className="urdu-label">{isUrdu ? urduLabel : englishLabel}</span>
      </div>
    }
  >
    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} className="input-box" />
  </Form.Item>
);

// Dropdown field
const DropdownField = ({ name, urduLabel, englishLabel, isUrdu, options }) => (
  <Form.Item
    name={name}
    className="urdu-field"
    label={
      <div className="field-label">
        <span className="urdu-label">{isUrdu ? urduLabel : englishLabel}</span>
      </div>
    }
  >
    <select className="input-box">
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {isUrdu ? opt.urdu : opt.english}
        </option>
      ))}
    </select>
  </Form.Item>
);

const FormPage = () => {
  const [isUrdu, setIsUrdu] = useState(true);
  const [form] = Form.useForm();
  const [modal, setModal] = useState({ visible: false, message: '', title: '', onOk: () => {} });
  const [loading, setLoading] = useState(false);
  const [showExtraField, setShowExtraField] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('isUrdu');
    if (savedLang !== null) {
      setIsUrdu(JSON.parse(savedLang));
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = !isUrdu;
    setIsUrdu(newLang);
    localStorage.setItem('isUrdu', JSON.stringify(newLang));
  };

  const toggleExtraField = () => {
    setShowExtraField((prev) => !prev);
  };

  const showModal = (title, message, onOk) => {
    setModal({
      visible: true,
      title,
      message,
      onOk: () => {
        onOk();
        setModal((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  const handleCancel = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const handleAddOrUpdate = async () => {
    let values = form.getFieldsValue();

    ['date', 'deliveryDate', 'receiveDate'].forEach((field) => {
      if (values[field]) {
        values[field] = dayjs(values[field]).format('YYYY-MM-DD');
      }
    });

    if (!values.name) {
      showModal('Error', 'Name required to add/update.', () => {});
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'Deny-Customer', values.name);
      await setDoc(docRef, values, { merge: true });
      showModal('Success', 'Data added/updated successfully!', () => {
        form.resetFields();
        setShowExtraField(false);
      });
    } catch (error) {
      console.error(error);
      showModal('Error', `Add/Update failed: ${error.message}`, () => {});
    }
    setLoading(false);
  };

  const handleRead = async () => {
    const searchValue = form.getFieldValue('serial') || form.getFieldValue('name') || form.getFieldValue('phone'); // Added phone
    if (!searchValue) {
      showModal('Error', 'Enter serial number, name, or mobile number to fetch data.', () => {});
      return;
    }

    setLoading(true);
    try {
      // Check if serial number, name, or mobile number is available in the Firestore documents
      const querySnapshot = await getDocs(collection(db, 'Deny-Customer'));
      const docRef = querySnapshot.docs.find(doc => 
        doc.data().serial === searchValue || 
        doc.data().name === searchValue || 
        doc.data().phone === searchValue // Added check for mobile number
      );

      if (docRef) {
        const data = docRef.data();
        ['date', 'deliveryDate', 'receiveDate'].forEach((field) => {
          if (data[field]) {
            data[field] = dayjs(data[field]);
          }
        });

        form.setFieldsValue(data);
        setShowExtraField(!!data.extra);
        showModal('Success', 'Data fetched successfully!', () => {});
      } else {
        showModal('Error', 'No data found for the given serial number, name, or mobile number!', () => {});
      }
    } catch (error) {
      console.error(error);
      showModal('Error', `Read failed: ${error.message}`, () => {});
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const name = form.getFieldValue('name');
    if (!name) {
      showModal('Error', 'Enter name to delete data.', () => {});
      return;
    }

    const password = prompt('Please enter the password to delete the data:');
    if (password !== '003456') {
      showModal('Error', 'Incorrect password!', () => {});
      return;
    }

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'Deny-Customer', name));
      showModal('Success', 'Data deleted!', () => {
        form.resetFields();
        setShowExtraField(false);
      });
    } catch (error) {
      console.error(error);
      showModal('Error', `Delete failed: ${error.message}`, () => {});
    }
    setLoading(false);
  };

  return (
    <div className={`form-page-container ${loading ? 'loading' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      <div className="lang-toggle">
        <button onClick={toggleLanguage}>
          {isUrdu ? 'Switch to English' : 'اردو پر جائیں'}
        </button>
      </div>

      <h2 className="form-title">Dany Tailor - Custom Order Form</h2>

      <div className="spin-container">
        <Spin spinning={loading} indicator={<div className="spinner" />}>
          <Form layout="vertical" form={form} className="custom-form">
            <div className="double-field-row">
              <DateField name="date" urduLabel="تاریخ" englishLabel="Date" isUrdu={isUrdu} />
              <Field name="serial" urduLabel="سیریل نمبر" englishLabel="Serial Number" isUrdu={isUrdu} />
            </div>

            <div className="double-field-row">
              <Field name="address" urduLabel="پتہ" englishLabel="Address" isUrdu={isUrdu} />
              <Field name="name" urduLabel="نام" englishLabel="Name" isUrdu={isUrdu} />
            </div>

            <div className="double-field-row">
              <DateField name="deliveryDate" urduLabel="تاریخ واپسی" englishLabel="Delivery Date" isUrdu={isUrdu} />
              <DateField name="receiveDate" urduLabel="تاریخ وصولی" englishLabel="Receive Date" isUrdu={isUrdu} />
            </div>

            <Field name="phone" urduLabel="فون نمبر" englishLabel="Phone Number" isUrdu={isUrdu} />

            <div className="zigzag-group">
              <Field name="shirtLength" urduLabel="قمیض لمبائی" englishLabel="Shirt Length" showIcon isUrdu={isUrdu} />
              <Field name="sleeve" urduLabel="بازو" englishLabel="Sleeve" showIcon isUrdu={isUrdu} />
              <Field name="tiara" urduLabel="تیرا" englishLabel="Tiara" showIcon isUrdu={isUrdu} />
              <Field name="neck" urduLabel="گلہ" englishLabel="Neck" showIcon isUrdu={isUrdu} />
              <Field name="chest" urduLabel="چھاتی" englishLabel="Chest" showIcon isUrdu={isUrdu} />
              <Field name="waist" urduLabel="کمر" englishLabel="Waist" showIcon isUrdu={isUrdu} />
              <Field name="bottomWidth" urduLabel="گھیرا" englishLabel="Bottom Width" showIcon isUrdu={isUrdu} />
              <Field name="shalwar" urduLabel="شلوار" englishLabel="Shalwar" showIcon isUrdu={isUrdu} />
              <Field name="paancha" urduLabel="پائنچہ" englishLabel="Paancha" showIcon isUrdu={isUrdu} />
            </div>

            <div className="triple-field-row">
              <Field name="shirt" urduLabel="شلوار/گھیرا" englishLabel="Shirt/Bottom Width" isUrdu={isUrdu} />
              <Field name="pant" urduLabel="سائیڈ" englishLabel="Side" isUrdu={isUrdu} />
              <Field name="sleeves" urduLabel="فرنٹ" englishLabel="Front" isUrdu={isUrdu} />
            </div>

            <div className="triple-field-row">
              <Field name="hips" urduLabel="پلیٹ" englishLabel="Pleat" isUrdu={isUrdu} />
              <Field name="length" urduLabel="کف" englishLabel="Cuff" isUrdu={isUrdu} />
              <DropdownField
                name="sleeveType"
                urduLabel="کالر/بین"
                englishLabel="Collar/Band"
                isUrdu={isUrdu}
                options={[
                  { value: 'Select', urdu: 'Select', english: 'Select' },
                  { value: 'collar', urdu: 'کالر', english: 'Collar' },
                  { value: 'band', urdu: 'بین', english: 'Band' }
                ]}
              />
            </div>

            <div className="triple-field-row">
              <Field name="remaining" urduLabel="بقایا" englishLabel="Remaining" isUrdu={isUrdu} />
              <Field name="advance" urduLabel="ایڈوانس" englishLabel="Advance" isUrdu={isUrdu} />
              <Field name="total" urduLabel="ٹوٹل" englishLabel="Total" isUrdu={isUrdu} />
            </div>

            <Button type="dashed" onClick={toggleExtraField} style={{ marginBottom: '10px' }}>
              {isUrdu ? (showExtraField ? 'اضافی بند کریں' : 'اضافی فیلڈ کھولیں') : (showExtraField ? 'Hide Extra' : 'Add Extra')}
            </Button>

            {showExtraField && (
              <Field name="extra" urduLabel="اضافی" englishLabel="Extra" isUrdu={isUrdu} />
            )}

            <div className="button-group-advanced">
              <Button onClick={handleAddOrUpdate} icon={<EditOutlined />} className="custom-button add-btn">
                {isUrdu ? 'جمع / اپڈیٹ کریں' : 'Add / Update'}
              </Button>
              <Button onClick={handleRead} icon={<SearchOutlined />} className="custom-button read-btn">
                {isUrdu ? 'ڈیٹا حاصل کریں' : 'Read'}
              </Button>
              <Button onClick={handleDelete} icon={<DeleteOutlined />} className="custom-button delete-btn">
                {isUrdu ? 'ڈیلیٹ کریں' : 'Delete'}
              </Button>
            </div>
          </Form>
        </Spin>
      </div>

      <div className="footer-text">Dany_Tailor</div>

      <Modal title={modal.title} open={modal.visible} onOk={modal.onOk} onCancel={handleCancel}>
        <p>{modal.message}</p>
      </Modal>
    </div>
  );
};

export default FormPage;
