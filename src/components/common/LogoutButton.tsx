import { LogOut, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../../services/api/auth";

const clearChatbotSessions = () => {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];
  for (let index = 0; index < window.sessionStorage.length; index += 1) {
    const key = window.sessionStorage.key(index);
    if (key?.startsWith("page-chatbot:")) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => window.sessionStorage.removeItem(key));
};

export default function LogoutButton() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutApi();
    } catch {
      // Proceed even if the server call fails so the client session is always cleared.
    } finally {
      clearChatbotSessions();
      localStorage.removeItem("current_user");
      localStorage.removeItem("employee_id");
      localStorage.removeItem("rememberMe");
      setIsOpen(false);
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <button
        className="icon-button"
        type="button"
        aria-label="Logout"
        onClick={() => setIsOpen(true)}
        style={{
          color: "#f8f4ea",
          border: "1px solid rgba(200, 164, 93, 0.25)",
          background: "rgba(16, 27, 44, 0.8)",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 12px",
          minHeight: "38px",
        }}
      >
        <LogOut aria-hidden="true" size={17} />
        <span>Logout</span>
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(4, 10, 20, 0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: "16px",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              borderRadius: "16px",
              background: "#0f172a",
              border: "1px solid rgba(200, 164, 93, 0.25)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              padding: "20px",
              color: "#f8f4ea",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Confirm logout</h3>
              <button
                type="button"
                aria-label="Close logout dialog"
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", color: "#c9d3df", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: "0 0 18px", color: "#c9d3df", lineHeight: 1.5 }}>
              Are you sure you want to log out?
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "transparent",
                  color: "#f8f4ea",
                  borderRadius: "999px",
                  padding: "9px 14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{
                  border: "none",
                  background: "linear-gradient(135deg, #c8a45d, #a67c2b)",
                  color: "#111827",
                  borderRadius: "999px",
                  padding: "9px 14px",
                  cursor: isLoggingOut ? "wait" : "pointer",
                  fontWeight: 700,
                }}
              >
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
