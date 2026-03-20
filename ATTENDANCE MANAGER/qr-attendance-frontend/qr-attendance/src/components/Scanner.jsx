import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

const Scanner = ({ onScan }) => {
  const [mode, setMode] = useState("camera");
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Camera scanner
  useEffect(() => {
    if (mode !== "camera") return;

    let scanned = false;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    };

    const scanner = new Html5QrcodeScanner("reader", config, false);

    function onScanSuccess(decodedText) {
      if (scanned) return;
      scanned = true;
      onScan(decodedText);
      scanner.clear().catch(() => {});
    }

    scanner.render(onScanSuccess);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [mode, onScan]);

  // Image upload scan using jsQR
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError(null);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);

  console.log("Image size:", img.width, img.height); // ← add this
  console.log("jsQR result:", code);                 // ← add this

  if (code) {
    onScan(code.data);
  } else {
    setUploadError("No QR code found. Try a clearer image.");
  }
};
  };

  return (
    <div style={styles.wrapper}>
      {/* Tab toggle */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(mode === "camera" ? styles.activeTab : {}) }}
          onClick={() => setMode("camera")}
        >
          📷 Camera
        </button>
        <button
          style={{ ...styles.tab, ...(mode === "upload" ? styles.activeTab : {}) }}
          onClick={() => setMode("upload")}
        >
          🖼️ Upload Image
        </button>
      </div>

      {/* Camera mode */}
      {mode === "camera" && <div id="reader" style={styles.reader} />}

      {/* Upload mode */}
      {mode === "upload" && (
        <div style={styles.uploadBox}>
          <div
            style={styles.dropZone}
            onClick={() => fileInputRef.current?.click()}
          >
            <p style={styles.dropText}>📂 Click to select a QR image</p>
            <p style={styles.dropSub}>PNG, JPG, GIF supported</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {uploadError && <p style={styles.error}>{uploadError}</p>}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "360px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  tabs: {
    display: "flex",
    marginBottom: "16px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #ddd",
  },
  tab: {
    flex: 1,
    padding: "10px",
    background: "#f5f5f5",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background 0.2s",
  },
  activeTab: {
    background: "#111",
    color: "#fff",
  },
  reader: {
    width: "100%",
  },
  uploadBox: {
    padding: "16px 0",
  },
  dropZone: {
    border: "2px dashed #bbb",
    borderRadius: "12px",
    padding: "40px 20px",
    cursor: "pointer",
    textAlign: "center",
  },
  dropText: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
  },
  dropSub: {
    margin: "8px 0 0",
    fontSize: "12px",
    color: "#999",
  },
  error: {
    marginTop: "12px",
    color: "red",
    fontSize: "13px",
    textAlign: "center",
  },
};

export default Scanner;