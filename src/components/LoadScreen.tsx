import { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SaveCard } from "./SaveCard";

export function LoadScreen() {
  const navigate = useNavigate();
  function loadGame(evt: SyntheticEvent, saveData: string) {
    if (!saveData) {
      navigate("/");
    }
    navigate("/game");

    console.log(saveData);
  }

  return (
    <div className="w-full h-full">
      <div className="m-auto bg-logo w-full min-h-screen">
        <SaveCard onConfirm={loadGame} showSaveButton={false} />
      </div>
    </div>
  );
}
