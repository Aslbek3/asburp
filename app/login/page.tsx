"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldCheck, Moon, Sun, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const [email, setEmail] = useState("admin@corepanel.uz");
  const [password, setPassword] = useState("corepanel123");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  const onLogin = () => {
    login();
    router.push("/");
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center p-6 bg-bg-0">
      <button
        type="button"
        title="Tema"
        onClick={toggleTheme}
        className="absolute top-5 right-5 w-[34px] h-[34px] flex items-center justify-center border border-border-1 rounded-[9px] bg-bg-1 text-text-2 hover:bg-bg-2 cursor-pointer"
      >
        {theme === "dark" ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
      </button>

      <div className="w-full max-w-[360px]">
        <div className="flex flex-col items-center gap-[11px] mb-6">
          <div className="w-[46px] h-[46px] rounded-xl bg-accent flex items-center justify-center text-white font-semibold text-2xl">
            C
          </div>
          <div className="text-center">
            <div className="text-[19px] font-semibold tracking-[-0.02em]">CorePanel</div>
            <div className="text-xs text-text-3 mt-[3px]">VPS &amp; hosting boshqaruv paneli</div>
          </div>
        </div>

        <div className="bg-bg-1 border border-border-1 rounded-xl p-[22px]">
          <Field label="Email" icon={Mail}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-none outline-none bg-transparent text-[13px] text-text-1 font-mono"
            />
          </Field>

          <div className="mb-[14px]">
            <div className="flex items-center justify-between mb-[6px]">
              <span className="text-[11.5px] font-medium text-text-2">Parol</span>
              <span className="text-[11px] text-accent cursor-pointer">Unutdingizmi?</span>
            </div>
            <div className="flex items-center gap-[9px] h-[38px] px-3 bg-bg-2 border border-border-1 rounded-[9px]">
              <Lock size={15} strokeWidth={1.7} className="text-text-3 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 border-none outline-none bg-transparent text-[13px] text-text-1 font-mono"
              />
            </div>
          </div>

          <div className="mb-[18px]">
            <div className="text-[11.5px] font-medium text-text-2 mb-[6px]">
              2FA kod <span className="text-text-3 font-normal">(ixtiyoriy)</span>
            </div>
            <div className="flex items-center gap-[9px] h-[38px] px-3 bg-bg-2 border border-border-1 rounded-[9px]">
              <ShieldCheck size={15} strokeWidth={1.7} className="text-text-3 shrink-0" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000 000"
                className="flex-1 border-none outline-none bg-transparent text-[13px] text-text-1 font-mono tracking-[0.15em]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 mb-[18px] cursor-pointer">
            <span
              onClick={() => setRemember((r) => !r)}
              className={cn(
                "w-4 h-4 rounded-[4px] flex items-center justify-center",
                remember ? "bg-accent" : "bg-bg-3 border border-border-2",
              )}
            >
              {remember && <Check size={11} strokeWidth={3} className="text-white" />}
            </span>
            <span className="text-[12px] text-text-2">Meni eslab qol</span>
          </label>

          <button
            type="button"
            onClick={onLogin}
            className="w-full h-10 border-none rounded-[9px] bg-accent text-white text-[13.5px] font-medium cursor-pointer"
          >
            Kirish
          </button>
        </div>

        <div className="text-center text-[11px] text-text-3 mt-4">
          Self-hosted · Contabo VPS · Germaniya
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[14px]">
      <div className="text-[11.5px] font-medium text-text-2 mb-[6px]">{label}</div>
      <div className="flex items-center gap-[9px] h-[38px] px-3 bg-bg-2 border border-border-1 rounded-[9px]">
        <Icon size={15} strokeWidth={1.7} className="text-text-3 shrink-0" />
        {children}
      </div>
    </div>
  );
}
