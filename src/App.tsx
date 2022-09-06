import bgImage from "./TheFactoryMustGrowBg.jpg";
import "./App.scss";

function introScreen() {
  return (
    <div className="w-full h-full">
      <div className="m-auto bg-logo w-full min-h-screen">
        <div className="h-96" />
        <ul className="text-6xl ml-48 text-slate-50 font-synkopy list-disc">
          <li>Continue</li>
          <li>New Game</li>
          <li>Load Game</li>
          <li>Planner</li>
          <li>Help</li>
          <li>Credits</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return <>{introScreen()}</>;
}

export default App;
