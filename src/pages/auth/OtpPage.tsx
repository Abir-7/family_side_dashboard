import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import bgImg from "../../assets/bg.png";

export default function OtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = [...otp];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputs.current[focusIndex]?.focus();
  };

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    toast.success("OTP verified successfully!");
    navigate("/reset-password");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .otp-box {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1.5px solid #E55F68;
          background: #fff;
          text-align: center;
          font-size: 20px;
          font-weight: 600;
          color: #E55F68;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          caret-color: #E55F68;
        }
        .otp-box:focus {
          border-color: #E55F68;
          box-shadow: 0 0 0 3px rgba(229, 95, 104, 0.15);
        }
        .verify-btn {
          width: 100%;
          padding: 14px;
          border-radius: 50px;
          background: #E55F68;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
          transition: background 0.2s, transform 0.1s;
        }
        .verify-btn:hover { background: #d14d56; }
        .verify-btn:active { transform: scale(0.98); }
        .resend-btn {
          font-size: 13px;
          color: #E55F68;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .resend-btn:hover { text-decoration: underline; }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1rem",
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "2.5rem 2rem",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Header */}
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "#1a1a2e",
                margin: "0 0 8px",
              }}
            >
              Recover Password
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#888",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Please provide the email address associated with your
              <br />
              account, and we'll send you verification code to reset
              <br />
              your password.
            </p>
          </div>

          {/* OTP Circles */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="otp-box"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button className="verify-btn" onClick={handleSubmit}>
            Verify
          </button>

          {/* Resend */}
          <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
            Didn't receive the code?{" "}
            <button
              className="resend-btn"
              onClick={() => toast.success("OTP resent successfully!")}
            >
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
