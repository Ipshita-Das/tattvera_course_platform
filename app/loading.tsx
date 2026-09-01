export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-8 border-[#1C1917] border-t-[#8A3A32] animate-spin rounded-full"></div>
        <h2 className="text-2xl font-black text-[#1C1917] uppercase tracking-widest">
          Loading...
        </h2>
      </div>
    </div>
  );
}