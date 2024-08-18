import { AlertCircle } from "lucide-react";

export const FormError = ({ message }: { message: string }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/30 flex items-center text-xs gap-x-2 font-medium rounded text-red-800 text-secondary-foreground p-3">
      <AlertCircle size={12} strokeWidth="2" />
      <p>{message}</p>
    </div>
  );
};
