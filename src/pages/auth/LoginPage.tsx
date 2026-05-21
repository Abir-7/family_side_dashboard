import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "../../lib/redux/authSlice";

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: LoginFormValues) => {
    if (data.username === "admin" && data.password === "admin") {
      dispatch(login({ role: "admin" }));
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #b8c6db 0%, #f5f7fa 50%, #c3cfe2 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .login-input {
          width: 100%;
          padding: 11px 16px;
          border-radius: 50px;
          border: 1.5px solid #e0e0e0;
          font-size: 14px;
          color: #333;
          background: #fafafa;
          outline: none;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s;
        }
        .login-input::placeholder { color: #aaa; }
        .login-input:focus { border-color: #c0bfff; }
        .login-input.error { border-color: #e05a6a; }
        .login-btn {
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
        }
        .login-btn:hover:not(:disabled) { background: #c94a5a; }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .login-btn:disabled { background: #e9a0aa; cursor: not-allowed; }
      `}</style>

      <div
        style={{
          background: "#fff",
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#333",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <input
              id="username"
              {...register("username")}
              placeholder="admin"
              className={`login-input${errors.username ? " error" : ""}`}
            />
            {errors.username && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#e05a6a",
                  marginTop: "4px",
                  paddingLeft: "4px",
                }}
              >
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#333",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={`login-input${errors.password ? " error" : ""}`}
            />
            {errors.password && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#e05a6a",
                  marginTop: "4px",
                  paddingLeft: "4px",
                }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

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
              <input
                type="checkbox"
                style={{
                  width: "15px",
                  height: "15px",
                  accentColor: "#e05a6a",
                }}
              />
              Remember me
            </label>
            <button
              type="button"
              style={{
                fontSize: "13px",
                color: "#e05a6a",
                fontWeight: 500,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
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
              style={{
                marginTop: "2px",
                width: "15px",
                height: "15px",
                accentColor: "#e05a6a",
                flexShrink: 0,
              }}
            />
            I agree to the{" "}
            <span
              style={{ color: "#e05a6a", fontWeight: 500, cursor: "pointer" }}
            >
              Terms &amp; Conditions
            </span>
            &nbsp;and{" "}
            <span
              style={{ color: "#e05a6a", fontWeight: 500, cursor: "pointer" }}
            >
              Privacy Policy
            </span>
          </label>

          {/* Submit */}
          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Login"}
          </button>
        </form>

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
          <span
            style={{ color: "#e05a6a", fontWeight: 500, cursor: "pointer" }}
          >
            Contact admin
          </span>
        </p>
      </div>
    </div>
  );
}
