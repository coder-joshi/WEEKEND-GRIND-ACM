import { useState } from "react";
import axios from "axios";
import Scanner from "../components/Scanner";

const ScanPage = () => {
  const [scannedDate, setScannedDate] = useState(null); // date extracted from QR
  const [studentId, setStudentId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1: QR scanned — extract the date
  const handleScan = (decodedText) => {
    setScannedDate(decodedText); // e.g. "2026-03-20"
    setResult(null);
  };

  // Step 2: Student submits their ID
  const handleSubmit = async () => {
    if (!studentId.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/scan", {
        studentId,
        scannedDate,
      });
      setResult(res.data);
    } catch (err) {
      setResult(err.response?.data || { message: "Error occurred" });
    } finally {
      setLoading(false);
    }
  };

  // Reset to scan again
  const handleReset = () => {
    setScannedDate(null);
    setStudentId("");
    setResult(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍽️ Food Attendance</h2>

      {/* Step 1: Scan QR */}
      {!scannedDate && (
        <>
          <p style={styles.subtitle}>Scan today's QR code to continue</p>
          <Scanner onScan={handleScan} />
        </>
      )}

      {/* Step 2: Enter Student ID */}
      {scannedDate && !result && (
        <div style={styles.card}>
          <p style={styles.success}>✅ QR Scanned for <strong>{scannedDate}</strong></p>
          <p style={styles.subtitle}>Enter your Student ID</p>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. STU001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button style={styles.button} onClick={handleSubmit} disabled={loading}>
            {loading ? "Checking..." : "Submit"}
          </button>
        </div>
      )}

      {/* Step 3: Show result */}
      {result && (
        <div style={styles.card}>
          <h3 style={{ color: result.name ? "green" : "red" }}>{result.message}</h3>
          {result.name && (
            <>
              <p>👤 Name: <strong>{result.name}</strong></p>
              <p>🆔 ID: <strong>{result.studentId}</strong></p>
              <p>🥗 Preference: <strong>{result.preference}</strong></p>
              <p>🏠 Hostel: <strong>{result.hostelName}</strong></p>
            </>
          )}
          <button style={styles.resetButton} onClick={handleReset}>
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "24px 16px",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#666",
    marginBottom: "16px",
  },
  card: {
    background: "#f9f9f9",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "16px",
  },
  success: {
    color: "green",
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "12px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  resetButton: {
    marginTop: "16px",
    padding: "8px 20px",
    background: "#eee",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ScanPage;