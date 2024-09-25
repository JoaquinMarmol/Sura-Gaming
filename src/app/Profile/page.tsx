"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import "./profile.module.css";
import Link from "next/link";

export default function Profile() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    country: "",
    email: "john.doe@example.com", // Email inicial
  });
  
  const router = useRouter();

  // Simulación de la recuperación de datos del perfil
  useEffect(() => {
    const userData = {
      fullName: "John Doe",
      birthday: "1990-01-01",
      country: "Argentina",
      email: "john.doe@example.com", // Incluyendo el email
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
    // Aquí podrías hacer una llamada a la API para actualizar los datos del usuario
    router.push("/"); // Redirigir a la página de inicio o a otra página después de la actualización
  };

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <img src="/img/flechaizq.svg" alt="" className="profile-page__header-arrow" />
        <h3>Profile</h3>
        <img src="/img/question.svg" alt="" className="profile-page__header-question" />
      </header>
      <div className="profile-header">
        <Image src="/img/image1.png" alt="Background" width={300} height={300} className="profile-background" />
        <div className="profile-info">
          <Image src="/img/image1.png" alt="Profile Picture" width={80} height={80} className="profile-picture" />
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
          <span className="edit-icon">✏️</span>
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
          <span className="edit-icon">✏️</span>
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
          <span className="edit-icon">✏️</span>
        </div>
        <button type="submit" className="form-button">
          Save
        </button>
      </form>
      <div>
        <img src="/img/Property 1=Nab Var - Home.svg" alt="" className="connected-footer"/>
        <Link href="/">
          <img src="/img/Home-gray.svg" alt="" className="connected-home"/>
        </Link>
        <div className="connected-profile-wallet">
          <Link href="/Profile">
            <img src="/img/Profile.svg" alt="" className="connected-profile"/>
          </Link>
          <Link href="/Wallet">
            <img src="/img/Wallet-gray.svg" alt="" className="connected-wallet"/>          
          </Link>
        </div>
      </div>
    </div>
  );
}
