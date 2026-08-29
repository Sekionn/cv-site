import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./Login.css"

export default function Register() {
    const navigate = useNavigate();
    const { t } = useLanguage();
  
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleRegister = async () => {
      try {
        
        navigate("/");
      } catch (err) {
        console.error(err);
        alert(t("register.loginFailed"));
      }
    };
  
    return (
      <div className="center-content">
        <div className="login-container">
          <h1>{t("register.title")}</h1>
  
          <input
            name="username"
            type="text"
            placeholder={t("register.usernamePlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />

          <input
            name="email"
            type="email"
            placeholder={t("register.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
  
          <input
            name="password"
            type="password"
            placeholder={t("register.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
  
          <div className="button-placement">
            <button onClick={() => navigate("/")}>
              {t("register.goToLogin")}
            </button>
            <button onClick={handleRegister}>
              {t("register.submit")}
            </button>
          </div>
        </div>
      </div>
    );
}
