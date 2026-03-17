import * as React from "react"
import { X } from "lucide-react"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      {/* Content */}
      {children}
    </div>
  )
}

const DialogContent = ({ children, className = "" }: DialogContentProps) => {
  return (
    <div className={`relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-h-[90vh] overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}

const DialogHeader = ({ children, className = "" }: DialogHeaderProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

const DialogTitle = ({ children, className = "" }: DialogTitleProps) => {
  return (
    <h2 className={`text-lg font-semibold text-neutral-950 ${className}`}>
      {children}
    </h2>
  )
}

const DialogDescription = ({ children, className = "" }: DialogDescriptionProps) => {
  return (
    <p className={`text-sm text-neutral-600 mt-2 ${className}`}>
      {children}
    </p>
  )
}

const DialogFooter = ({ children, className = "" }: DialogFooterProps) => {
  return (
    <div className={`mt-6 flex items-center justify-end gap-2 ${className}`}>
      {children}
    </div>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }