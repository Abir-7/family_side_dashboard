import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth/useAuth";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";
import bgImg from "../../assets/bg.png";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Password must be at least 4 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data: LoginFormValues) => {
    if (data.username === "admin" && data.password === "admin") {
      login("admin");
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .login-btn {
          width: 100%;
          padding: 13px;
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
        .login-btn:hover { background: #d14d56; }
        .login-btn:active { transform: scale(0.98); }
        .login-btn:disabled { background: #f2a7ad; cursor: not-allowed; }
        .login-checkbox { width: 15px; height: 15px; accent-color: #E55F68; cursor: pointer; }
        .forgot-btn {
          font-size: 13px;
          color: #E55F68;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .forgot-btn:hover { text-decoration: underline; }
        .contact-btn {
          color: #E55F68;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
        }
        .contact-btn:hover { text-decoration: underline; }
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
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "2.5rem 2rem",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          }}
        >
          {/* Header */}
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#1a1a2e",
              textAlign: "center",
              margin: "0 0 6px",
            }}
          >
            Login To Your Account
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#888",
              textAlign: "center",
              margin: "0 0 1.8rem",
              lineHeight: 1.5,
            }}
          >
            Please log in to manage your dashboard and access
            <br />
            all your administrative tools
          </p>

          {/* Form */}
          <FormWrapper
            schema={loginSchema}
            onSubmit={onSubmit}
            defaultValues={{ username: "admin", password: "admin" }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <FormInput
              name="username"
              label="Username"
              placeholder="admin"
              autoComplete="username"
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {/* Remember me & Forgot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "13px",
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" className="login-checkbox" />
                Remember me
              </label>
              <button 
                type="button" 
                className="forgot-btn"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Terms */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontSize: "12.5px",
                color: "#555",
                cursor: "pointer",
                lineHeight: 1.5,
              }}
            >
              <input
                type="checkbox"
                className="login-checkbox"
                style={{ marginTop: "2px", flexShrink: 0 }}
              />
              I agree to the{" "}
              <span style={{ color: "#E55F68", fontWeight: 500 }}>
                Terms &amp; Conditions
              </span>{" "}
              and{" "}
              <span style={{ color: "#E55F68", fontWeight: 500 }}>
                Privacy Policy
              </span>
            </label>

            {/* Submit */}
            <button type="submit" className="login-btn">
              Login
            </button>
          </FormWrapper>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#888",
              marginTop: "1.2rem",
            }}
          >
            Don't have an account?{" "}
            <button className="contact-btn">Contact admin</button>
          </p>
        </div>
      </div>
    </>
  );
}
