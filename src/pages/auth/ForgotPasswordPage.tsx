import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { toast } from "sonner";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log("Forgot password request for:", data.email);
    toast.success("If an account exists, a verification code has been sent to your email.");
    navigate("/verify-otp");
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
        
        .back-btn {
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
        .back-btn:hover { text-decoration: underline; }
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
            Forgot Password?
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#888",
              margin: "0 0 1.8rem",
              lineHeight: 1.5,
            }}
          >
            Enter your email address and we'll send you
            <br />
            a verification code to reset your password.
          </p>

          {/* Form */}
          <FormWrapper
            schema={forgotPasswordSchema}
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}
          >
            <FormInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
            />

            {/* Submit */}
            <button type="submit" className="submit-btn">
              Send Verification Code
            </button>
          </FormWrapper>

          {/* Back to Login */}
          <button 
            onClick={() => navigate("/signin")} 
            className="back-btn"
          >
            Back to Login
          </button>
        </div>
      </div>
    </>
  );
}
