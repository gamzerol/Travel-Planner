import PlannerPanel from "../components/PlannerPanel";

const Home = () => {
  return (
    <main className="min-h-screen bg-[#ecedf8] p-4">
      <nav className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />
          AI Travel Planner
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>Saved Trips</span>
          <span>About</span>
        </div>
      </nav>
      <PlannerPanel />
    </main>
  );
};

export default Home;
