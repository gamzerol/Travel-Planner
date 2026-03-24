import Link from "next/link";
import AuthButton from "../components/AuthButton";
import PlannerPanel from "../components/PlannerPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ecedf8]">
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <div className="w-7 h-7 flex justify-center items-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500">
            ✈
          </div>
          AI Travel Planner
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link
            href="/saved-trips"
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            Saved Trips
          </Link>
        </div>
        <AuthButton />
      </nav>
      <PlannerPanel />
    </main>
  );
}
