import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const AdminPage = () => {
  const [today, setToday] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qrRes, todayRes] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/daily-qr"),
        axios.get("http://localhost:3000/api/admin/today"),
      ]);
      setToday(qrRes.data.qrData);
      setStats(todayRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const vegCount = stats?.list.filter((s) => s.preference === "veg").length || 0;
  const nonVegCount = stats?.list.filter((s) => s.preference === "non-veg").length || 0;

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />

      <div style={styles.header}>
        <h1 style={styles.title}>Admin Panel</h1>
        <p style={styles.date}>{today}</p>
        <button style={styles.refreshBtn} onClick={fetchData}>↻ Refresh</button>
      </div>

      <div style={styles.body}>
        {/* Left — QR */}
        <div style={styles.qrCard}>
          <p style={styles.qrLabel}>TODAY'S QR CODE</p>
          {today && (
            <div style={styles.qrWrapper}>
              <QRCodeCanvas value={today} size={220} />
            </div>
          )}
          <p style={styles.qrSub}>Show this to students for scanning</p>
        </div>

        {/* Right — Stats + List */}
        <div style={styles.rightCol}>

          {/* Stats */}
          <div style={styles.statsRow}>
            <div style={{ ...styles.statCard, background: "#0f172a" }}>
              <p style={styles.statNum}>{stats?.totalTaken ?? "—"}</p>
              <p style={styles.statLabel}>Taken Today</p>
            </div>
            <div style={{ ...styles.statCard, background: "#166534" }}>
              <p style={styles.statNum}>{stats?.totalStudents ?? "—"}</p>
              <p style={styles.statLabel}>Total Students</p>
            </div>
            <div style={{ ...styles.statCard, background: "#854d0e" }}>
              <p style={styles.statNum}>{vegCount}</p>
              <p style={styles.statLabel}>Veg</p>
            </div>
            <div style={{ ...styles.statCard, background: "#7f1d1d" }}>
              <p style={styles.statNum}>{nonVegCount}</p>
              <p style={styles.statLabel}>Non-Veg</p>
            </div>
          </div>

          {/* Attendance list */}
          <div style={styles.listCard}>
            <p style={styles.listTitle}>Students Who Ate Today</p>
            {loading ? (
              <p style={styles.empty}>Loading...</p>
            ) : stats?.list.length === 0 ? (
              <p style={styles.empty}>No one has scanned yet.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["Name", "Student ID", "Preference", "Hostel"].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.list.map((s, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td style={styles.td}>{s.name}</td>
                      <td style={styles.td}>{s.studentId}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: s.preference === "veg" ? "#dcfce7" : "#fee2e2",
                          color: s.preference === "veg" ? "#166534" : "#991b1b",
                        }}>
                          {s.preference}
                        </span>
                      </td>
                      <td style={styles.td}>{s.hostelName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
  
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'DM Sans', sans-serif",
    padding: "32px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "28px",
    fontWeight: 800,
    margin: 0,
    color: "#0f172a",
  },
  date: {
    background: "#0f172a",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 500,
    margin: 0,
  },
  refreshBtn: {
    marginLeft: "auto",
    padding: "8px 16px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
  },
  body: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  qrCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "28px 24px",
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    minWidth: "280px",
  },
  qrLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: "#94a3b8",
    marginBottom: "20px",
  },
  qrWrapper: {
    display: "inline-block",
    padding: "16px",
    background: "#fff",
    borderRadius: "12px",
    border: "2px solid #f1f5f9",
  },
  qrSub: {
    marginTop: "16px",
    fontSize: "12px",
    color: "#94a3b8",
  },
  rightCol: {
    flex: 1,
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },
  statCard: {
    borderRadius: "12px",
    padding: "16px",
    color: "#fff",
    textAlign: "center",
  },
  statNum: {
    fontSize: "28px",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    margin: 0,
  },
  statLabel: {
    fontSize: "11px",
    opacity: 0.8,
    margin: "4px 0 0",
  },
  listCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  },
  listTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "15px",
    marginBottom: "16px",
    color: "#0f172a",
  },
  empty: {
    color: "#94a3b8",
    fontSize: "14px",
    textAlign: "center",
    padding: "20px 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: "#94a3b8",
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "10px 12px",
    color: "#334155",
  },
  rowEven: { background: "#fff" },
  rowOdd: { background: "#f8fafc" },
  badge: {
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 500,
  },
};

export default AdminPage;