import { Loader2 } from 'lucide-react';

export function DefaultLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="w-full flex items-center justify-center py-16 rounded-3xl my-6">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-[#0B3C5D] animate-spin" />
        <p className="text-sm font-semibold text-[#0B3C5D]">{message}</p>
      </div>
    </div>
  );
}

export function FullScreenLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F6]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-[#0B3C5D] animate-spin" />
        <p className="text-sm font-semibold text-[#0B3C5D]">{message}</p>
      </div>
    </div>
  );
}
