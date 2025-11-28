import React, { useState } from "react";
import { authAPI } from "../api";

function LoginPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(loginEmail, loginPassword);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", loginEmail.split("@")[0]);
      onLoginSuccess(loginEmail.split("@")[0]);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.register(
        regName,
        regEmail,
        regPassword,
        regPhone
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", regName);
      onLoginSuccess(regName);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          color: "#fff",
          animation: "fadeIn 0.8s ease",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          🏛️ Civic Portal
        </h2>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <button
            onClick={() => setActiveTab("login")}
            style={{
              flex: 1,
              padding: "10px",
              background: activeTab === "login" ? "#fff" : "transparent",
              color: activeTab === "login" ? "#000" : "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            style={{
              flex: 1,
              padding: "10px",
              background: activeTab === "register" ? "#fff" : "transparent",
              color: activeTab === "register" ? "#000" : "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#ff4d4d",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center",
              color: "#fff",
            }}
          >
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "15px" }}>
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <button style={btnPrimary} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: "15px" }}>
              <label>Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Phone</label>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                pattern="[0-9]{10}"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <button style={btnPrimary} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        {/* GOOGLE LOGIN BUTTON */}
        <button style={googleBtn}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="google"
            style={{ height: "22px", marginRight: "10px" }}
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.4)",
  background: "rgba(255,255,255,0.2)",
  color: "#fff",
  outline: "none",
};

const btnPrimary = {
  width: "100%",
  padding: "12px",
  background: "#4CAF50",
  color: "#fff",
  fontWeight: "700",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "10px",
};

const googleBtn = {
  width: "100%",
  padding: "12px",
  background: "#fff",
  color: "#444",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  marginTop: "15px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default LoginPage;
