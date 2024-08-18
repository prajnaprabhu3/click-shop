import { CheckCircle2 } from "lucide-react";

export const FormSuccess = ({ message }: { message: string }) => {
  if (!message) return null;

  return (
    <div className="bg-teal-400/30 flex items-center text-xs gap-x-2 font-medium rounded text-green-800 text-secondary-foreground p-3 my-1 w-full">
      <CheckCircle2 size={14} strokeWidth={2} />
      <p>{message}</p>
    </div>
  );
};
