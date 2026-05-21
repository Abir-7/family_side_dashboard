import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { toast } from "sonner";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export default function OtpPage() {
  const navigate = useNavigate();

  const onSubmit = (data: OtpFormValues) => {
    console.log("Verifying OTP:", data.otp);
    toast.success("OTP verified successfully!");
    // In a real app, you might navigate to a Reset Password page here
    navigate("/reset-password");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 50px;
          background: #e05a6a;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
          transition: background 0.2s, transform 0.1s;
          margin-top: 0.5rem;
        }
        .submit-btn:hover { background: #c94a5a; }
        .submit-btn:active { transform: scale(0.98); }
        .submit-btn:disabled { background: #e9a0aa; cursor: not-allowed; }
        
        .resend-btn {
          font-size: 13px;
          color: #e05a6a;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          margin-top: 1.5rem;
        }
        .resend-btn:hover { text-decoration: underline; }

        .otp-input input {
            text-align: center;
            letter-spacing: 0.5rem;
            font-size: 1.5rem !important;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1rem",
          background:
            "linear-gradient(135deg, #b8c6db 0%, #f5f7fa 50%, #c3cfe2 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "2.5rem 2rem",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
            textAlign: "center",
          }}
        >
          {/* Header */}
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#1a1a2e",
              margin: "0 0 6px",
            }}
          >
            OTP Verification
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#888",
              margin: "0 0 1.8rem",
              lineHeight: 1.5,
            }}
          >
            We've sent a 6-digit verification code to your email.
            <br />
            Please enter it below to continue.
          </p>

          {/* Form */}
          <FormWrapper
            schema={otpSchema}
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}
          >
            <FormInput
              name="otp"
              label="Verification Code"
              type="text"
              placeholder="000000"
              maxLength={6}
              containerClassName="otp-input"
            />

            {/* Submit */}
            <button type="submit" className="submit-btn">
              Verify OTP
            </button>
          </FormWrapper>

          {/* Resend Code */}
          <p
            style={{
              fontSize: "13px",
              color: "#888",
              marginTop: "1.5rem",
            }}
          >
            Didn't receive the code?{" "}
            <button 
              onClick={() => toast.success("OTP resent successfully!")} 
              className="resend-btn"
              style={{ marginTop: 0 }}
            >
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
