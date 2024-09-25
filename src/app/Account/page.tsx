"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./account.module.css";

interface FormData {
  fullName: string;
  birthday: string;
  country: string;
}

export default function Account() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    birthday: "",
    country: "",
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="account-page">
      <header className="account-page__header">
        <img src="/img/flechaizq.svg" alt="" className="account-page__header-arrow" />
        <h3>Create Account</h3>
      </header>
      <img src="/img/sura.svg" alt="" className="account-page__header-img" />
      <h1 className="account-page__title">Tell us about you</h1>
      <form onSubmit={handleSubmit} className="account-form">
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
        </div>
        <button type="submit" className="form-button">
          Finish
        </button>
        <div className="form-skip">
          <p>Skip for now</p>
          <img src="/img/flechader.svg" alt="" className="form-skip-img" />
        </div>
      </form>
    </div>
  );
}
