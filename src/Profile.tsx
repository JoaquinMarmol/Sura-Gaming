"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function Profile() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    country: "",
    email: "john.doe@example.com",
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = {
      fullName: "John Doe",
      birthday: "1990-01-01",
      country: "Argentina",
      email: "john.doe@example.com",
    };
    setFormData(userData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Profile Data:", formData);
    navigate("/");
  };

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <a href="/">
          <img src="/flechaizq.svg" alt="" className="profile-page__header-arrow" />
        </a>
        <h3>Profile</h3>
        <img src="/question.svg" alt="" className="profile-page__header-question" />
      </header>
      <div className="profile-header">
        <img src="/image1.png" alt="Background" width={300} height={300} className="profile-background" />
        <div className="profile-info">
          <img src="/image1.png" alt="Profile Picture" width={80} height={80} className="profile-picture" />
          <h2>{formData.fullName}</h2>
          <p>{formData.email}</p>
          <span className="edit-button">Edit</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <input
            type="text"
            id="fullName"
            className="form-input"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <div className="edit-icon-container">
            <span className="edit-icon">✏️</span>
          </div>
        </div>
        <div className="form-group custom-date-input">
          <input
            type="date"
            id="birthday"
            className={`form-input date-input ${formData.birthday ? 'filled' : ''}`}
            value={formData.birthday}
            onChange={handleChange}
            required
          />
          {!formData.birthday && <span className="date-placeholder">Birthday</span>}
          <div className="edit-icon-container">
            <span className="edit-icon">✏️</span>
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            id="country"
            className="form-input"
            placeholder="Country of Residence"
            value={formData.country}
            onChange={handleChange}
            required
          />
          <div className="edit-icon-container">
            <span className="edit-icon">✏️</span>
          </div>
        </div>
        <button type="submit" className="form-button">
          Save
        </button>
      </form>
      <div>
        <img src="/Property 1=Nab Var - Home.svg" alt="" className="connected-footer"/>
        <a href="/">
          <img src="/Home-gray.svg" alt="" className="connected-home"/>
        </a>
        <div className="connected-profile-wallet">
          <a href="./#/profile">
            <img src="/Profile.svg" alt="" className="connected-profile"/>
          </a>
          <a href="./#/wallet">
            <img src="/Wallet-gray.svg" alt="" className="connected-wallet"/>          
          </a>
        </div>
      </div>
    </div>
  );
}
