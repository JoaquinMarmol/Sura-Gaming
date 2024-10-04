"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import { sequence } from '../main';

interface UserProfile {
  name: string;
  birthdate: string;
  residence: string;
  email: string;
  wallet: string;
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", 
  "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", 
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", 
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. \"Swaziland\")", "Ethiopia", "Fiji", "Finland", 
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
  "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", 
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", 
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", 
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", 
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", 
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", 
  "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", 
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", 
  "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
  "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", 
  "Zambia", "Zimbabwe"
];

export default function Profile() {
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    birthdate: "",
    residence: "",
    email: "",
    wallet: "",
  });

  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const handleResidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "residence") {
      setFilteredCountries(
        countries.filter((country) =>
          country.toLowerCase().startsWith(value.toLowerCase())
        )
      );
      setShowDropdown(true);
    }

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCountryClick = (country: string) => {
    setFormData((prevData) => ({
      ...prevData,
      residence: country,
    }));
    setShowDropdown(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { idToken } = await sequence.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/user/getProfile`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });
        if (response.ok) {
          const userData: UserProfile = await response.json();
          setFormData({
            name: userData.name || "",
            birthdate: userData.birthdate || "",
            residence: userData.residence || "",
            email: userData.email || "",
            wallet: userData.wallet || "",
          });
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false); // Deshabilitar el estado de carga cuando los datos estén listos
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si el país ingresado es válido
    if (!countries.includes(formData.residence)) {
      alert("Please select a valid country.");
      return;
    }

    try {
      const { idToken } = await sequence.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/user/updateProfile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Profile updated successfully");
        navigate("/");
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <a href="/">
          <img src="/flechaizq.svg" alt="" className="profile-page__header-arrow" />
        </a>
        <h3>Perfil</h3>
      </header>
      {isLoading ? (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <h3>Nombre</h3>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group custom-date-input">
            <h3>Fecha de nacimiento</h3>
            <input
              type="date"
              id="birthdate"
              className={`form-input date-input ${formData.birthdate ? 'filled' : ''}`}
              value={formData.birthdate.split('T')[0]}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <h3>Pais/Region</h3>
            <input
              type="text"
              id="residence"
              className="form-input"
              placeholder="Country of Residence"
              value={formData.residence}
              onChange={handleResidenceChange}
              autoComplete="off"
              required
            />
            {showDropdown && (
              <ul className="dropdown">
                {filteredCountries.slice(0, 10).map((country) => (
                  <li
                    key={country}
                    onClick={() => handleCountryClick(country)}
                    className="dropdown-item"
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="form-button">
            Guardar
          </button>
        </form>
      )}

      <div>
        <img src="/Property 1=Nab Var - Home.svg" alt="" className="connected-footer"/>
        <a href="/">
          <img src="/footerProfile.svg" alt="" className="connected-home"/>
        </a>
        <div className="connected-profile-wallet">
          <a href="/" className='connected-home-link'></a>
          <a href="./#/wallet" className="connected-wallet"></a>
          <a href="./#/profile" className="connected-profile"></a>
        </div>
      </div>
    </div>
  );
}

