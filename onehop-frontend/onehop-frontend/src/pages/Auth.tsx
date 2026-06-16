import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { CityscapeBanner } from "@/components/illustrations/CityscapeBanner";
import { useAuthStore } from "@/store/authStore";

type Mode = "login" | "signup";

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup, status, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<Mode>("login");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loading = status === "loading";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        await signup(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate("/home", { replace: true });
    } catch {
      // error is already set in the store
    }
  };

  const switchMode = (next: Mode) => {
    clearError();
    setMode(next);
  };

  return (
    <div className="flex min-h-screen flex-col bg-app-bg">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-12 sm:max-w-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
            Welcome to <span className="text-primary">OneHop</span>
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            {mode === "login" ? "Sign in to continue your journey" : "Create an account to start planning"}
          </p>
        </div>

        {error && (
          <Alert tone="danger" className="mt-6" onDismiss={clearError}>
            {error}
          </Alert>
        )}

        <div className="mt-8 space-y-3">
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-4 text-[15px] font-semibold text-ink opacity-60"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-4 text-[15px] font-semibold text-ink opacity-60"
          >
            <Phone size={18} className="text-primary" />
            Continue with Phone
          </button>

          <button
            type="button"
            onClick={() => setShowEmailForm((v) => !v)}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-4 text-[15px] font-semibold text-ink transition-colors hover:border-primary"
          >
            <Mail size={18} className="text-primary" />
            Continue with Email
          </button>
        </div>

        {showEmailForm && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            {mode === "signup" && (
              <Input
                label="Full name"
                placeholder="Ananya Sharma"
                leftIcon={<UserIcon size={18} />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>
        )}

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-sm text-muted">or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <p className="text-center text-sm text-body">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button type="button" onClick={() => switchMode("signup")} className="font-semibold text-primary">
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("login")} className="font-semibold text-primary">
                Sign In
              </button>
            </>
          )}
        </p>

        <div className="mt-auto pt-10">
          <CityscapeBanner className="mx-auto w-full max-w-sm" />
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.97h3.86c2.26-2.09 3.56-5.17 3.56-8.79z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.07C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.32A7.2 7.2 0 0 1 4.9 12c0-.81.14-1.6.37-2.32V6.61H1.29A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.29 5.39l3.98-3.07z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.98 3.07C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}
