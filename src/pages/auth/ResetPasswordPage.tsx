import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { toast } from "sonner";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const onSubmit = (data: ResetPasswordFormValues) => {
    console.log("Resetting password for data:", data);
    toast.success("Password reset successfully!");
    navigate("/signin");
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
            Reset Password
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#888",
              margin: "0 0 1.8rem",
              lineHeight: 1.5,
            }}
          >
            Please enter your new password below.
            <br />
            Make sure it's strong and secure.
          </p>

          {/* Form */}
          <FormWrapper
            schema={resetPasswordSchema}
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}
          >
            <FormInput
              name="password"
              label="New Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {/* Submit */}
            <button type="submit" className="submit-btn">
              Reset Password
            </button>
          </FormWrapper>
        </div>
      </div>
    </>
  );
}
