import { AlertCircle, CheckCircle2 } from 'lucide-react';

type StatusMessageProps = {
  variant: 'success' | 'error';
  message: string;
};

export function StatusMessage({ variant, message }: StatusMessageProps) {
  const Icon = variant === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`status-message status-message--${variant}`} role="status">
      <span className="status-message__icon">
        <Icon size={18} />
      </span>
      <span>{message}</span>
    </div>
  );
}
