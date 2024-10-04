import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sequence } from "../main";
import "./account.css";

interface FormData {
  fullName: string;
  birthday: string;
  country: string;
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

export default function Account() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    birthday: "",
    country: "",
  });
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [countryError, setCountryError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { idToken } = await sequence.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/user/getProfile`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setEmail(userData.email);
        setWallet(userData.wallet);
      }
    };
    fetchUserData();
  }, []);

  const validateCountry = (country: string) => {
    return countries.includes(country);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCountry(formData.country)) {
      setCountryError("Please select a valid country from the list.");
      return;
    }

    const { idToken } = await sequence.getIdToken();
    const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/user/updateProfile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        name: formData.fullName,
        email: email,
        wallet: wallet,
        birthdate: formData.birthday,
        residence: formData.country
      })
    });

    if (response.ok) {
      console.log("User registered successfully");
      navigate("/");
    } else {
      console.error("Registration failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    if (id === "country" && countryError) {
      setCountryError(null);  // Clear error if the user is typing in the country field
    }
  };

  return (
    <div className="account-page">
      <img src="/sura.svg" alt="" className="account-page__header-img" />
      <h1 className="account-page__title">Contanos sobre vos</h1>
      <form onSubmit={handleSubmit} className="account-form">
        <div className="account-form-group">
          <input
            type="text"
            id="fullName"
            className="form-input"
            placeholder="Nombre completo"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="account-form-group custom-date-input">
          <input
            type="date"
            id="birthday"
            className={`form-input date-input ${formData.birthday ? 'filled' : ''}`}
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>
        <div className="account-form-group">
          <select
            id="country"
            className="form-input"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">Nacionalidad</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {countryError && <p className="error-message">{countryError}</p>}
        </div>
        <button type="submit" className="account-form-button">
          Confirmar
        </button>
        <a href="/" className="form-skip">
          <p>Saltar</p>
          <img src="/flechader.svg" alt="" className="form-skip-img" />
        </a>
      </form>
    </div>
  );
}
