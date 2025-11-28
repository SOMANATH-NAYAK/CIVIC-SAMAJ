import React, { useState } from "react";
import { authAPI } from "../api";

export default function LoginPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const [adminId, setAdminId] = useState("");

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
      const response = await authAPI.login(loginEmail, loginPassword, role, adminId);
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
        regPhone,
        role,
        adminId
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

  const handleGoogleLogin = () => {
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID",
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.prompt();
  };

  const handleGoogleResponse = async (response) => {
    try {
      const res = await authAPI.googleLogin(response.credential);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);
      onLoginSuccess(res.data.name);
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🏛 Civic Samaj</h2>

        {/* ROLE SELECTION */}
        <div style={styles.roleBox}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            User
          </label>

          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            Admin
          </label>
        </div>

        {/* SHOW ADMIN ID IF ADMIN SELECTED */}
        {role === "admin" && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Admin ID</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Enter Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
          </div>
        )}

        {/* TABS */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab("login")}
            style={{
              ...styles.tabButton,
              ...(activeTab === "login" ? styles.activeTab : {}),
            }}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("register")}
            style={{
              ...styles.tabButton,
              ...(activeTab === "register" ? styles.activeTab : {}),
            }}
          >
            Register
          </button>
        </div>

        {/* ERROR */}
        {error && <div style={styles.error}>{error}</div>}

        {/* LOGIN FORM */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                style={styles.input}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* GOOGLE BUTTON */}
            <button type="button" style={styles.googleBtn} onClick={handleGoogleLogin}>
              <img
                src="/google.svg"
                alt=""
                style={{ height: 22, marginRight: 10 }}
              />
              Continue with Google
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                style={styles.input}
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                style={styles.input}
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                style={styles.input}
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>

            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            {/* GOOGLE BUTTON */}
            <button type="button" style={styles.googleBtn} onClick={handleGoogleLogin}>
              <img
                src="/google.svg"
                alt=""
                style={{ height: 22, marginRight: 10 }}
              />
              Continue with Google
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------------ INLINE STYLE DEFINITIONS ------------------ */

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    background: "linear-gradient(to bottom, #cdd4c1, #e6eadf)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    width: 420,
    background: "#ffffff",
    padding: "35px 40px",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    border: "2px solid #d6decf",
  },

  title: {
    textAlign: "center",
    marginBottom: 25,
    fontSize: 28,
    color: "#41512c",
    fontWeight: 700,
  },

  roleBox: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },

  radioLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4f5c39",
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20,
    marginTop: 10,
  },

  tabButton: {
    padding: "8px 18px",
    borderRadius: 8,
    background: "#e8eddf",
    border: "1px solid #c8d2bc",
    cursor: "pointer",
    fontWeight: "600",
    color: "#4d5938",
  },

  activeTab: {
    background: "#8ca471",
    color: "white",
    border: "1px solid #748a5b",
  },

  formGroup: { marginBottom: 15 },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4d5938",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: 5,
    borderRadius: 8,
    border: "1px solid #bfc8b5",
    outline: "none",
    fontSize: 15,
  },

  btn: {
    width: "100%",
    padding: "12px",
    marginTop: 10,
    background: "#6f8455",
    color: "white",
    fontWeight: "700",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },

  googleBtn: {
    width: "100%",
    padding: "12px",
    marginTop: 10,
    background: "white",
    border: "1px solid #dadada",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    padding: "10px",
    background: "#ffdddd",
    borderRadius: 8,
    color: "#cc0000",
    marginBottom: 15,
    textAlign: "center",
  },
};
