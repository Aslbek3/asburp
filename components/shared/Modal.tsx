"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/45 z-[90]" />
        <Dialog.Content className="fixed z-[91] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-bg-1 border border-border-1 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-[14.5px] font-semibold">{title}</Dialog.Title>
            <Dialog.Close className="w-7 h-7 flex items-center justify-center rounded-[7px] text-text-3 hover:bg-bg-2 cursor-pointer">
              <X size={16} />
            </Dialog.Close>
          </div>
          <div className="text-[13px] text-text-2">{children}</div>
          {footer && <div className="mt-5 flex items-center justify-end gap-2">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  danger,
  confirmLabel = "Tasdiqlash",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  danger?: boolean;
  confirmLabel?: string;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
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
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={
              danger
                ? "h-9 px-4 rounded-lg border border-red bg-red text-white text-[12.5px] font-medium cursor-pointer"
                : "h-9 px-4 rounded-lg border border-accent bg-accent text-white text-[12.5px] font-medium cursor-pointer"
            }
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {description}
    </Modal>
  );
}
