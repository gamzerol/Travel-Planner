import PlannerPanel from "../components/PlannerPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ecedf8]">
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />
          AI Travel Planner
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-gray-800 transition">
            Saved Trips
          </span>
          <span className="cursor-pointer hover:text-gray-800 transition">
            About
          </span>
        </div>
      </nav>
      <PlannerPanel />
    </main>
  );
}
