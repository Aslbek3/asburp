"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";

export function AddServerModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("22");
  const [sshUser, setSshUser] = useState("root");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setIp("");
    setPort("22");
    setSshUser("root");
  };

  const submit = async () => {
    if (!name || !ip || !sshUser) {
      toast.error("Nom, IP va SSH foydalanuvchi shart");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/vps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ip, port: Number(port) || 22, sshUser }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${name} qo'shildi — ulanish tekshirilmoqda`);
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      queryClient.invalidateQueries({ queryKey: ["processes"] });
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Server qo'shilmadi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Yangi server qo'shish"
      footer={
        <>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 rounded-lg border border-border-1 bg-bg-1 text-text-2 text-[12.5px] font-medium cursor-pointer hover:bg-bg-2"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={submit}
            className="h-9 px-4 rounded-lg border border-accent bg-accent text-white text-[12.5px] font-medium cursor-pointer disabled:opacity-60"
          >
            {submitting ? "Tekshirilmoqda..." : "Qo'shish"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="text-[11.5px] text-text-3 bg-bg-2 border border-border-1 rounded-lg p-3">
          Avval shu serverda monitoring foydalanuvchi yarating va quyidagi public key&apos;ni{" "}
          <code className="font-mono">~/.ssh/authorized_keys</code> ga qo&apos;shing — &quot;Server qo&apos;shish
          uchun tayyorlash&quot; promptiga qarang.
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-[11.5px] text-text-3">Nomi</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="masalan: vps germany-02"
            className="h-9 px-3 rounded-lg border border-border-1 bg-bg-1 text-[13px] outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11.5px] text-text-3">IP manzil</span>
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="194.163.45.12"
            className="h-9 px-3 rounded-lg border border-border-1 bg-bg-1 text-[13px] outline-none focus:border-accent font-mono"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11.5px] text-text-3">SSH port</span>
            <input
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="22"
              className="h-9 px-3 rounded-lg border border-border-1 bg-bg-1 text-[13px] outline-none focus:border-accent font-mono"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11.5px] text-text-3">SSH foydalanuvchi</span>
            <input
              value={sshUser}
              onChange={(e) => setSshUser(e.target.value)}
              placeholder="corepanel"
              className="h-9 px-3 rounded-lg border border-border-1 bg-bg-1 text-[13px] outline-none focus:border-accent font-mono"
            />
          </label>
        </div>
      </div>
    </Modal>
  );
}
