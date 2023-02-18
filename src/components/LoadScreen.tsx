import { SaveCard } from "./SaveCard";

export function LoadScreen() {
  return (
    <div className="w-full h-full">
      <div className="m-auto bg-logo w-full min-h-screen">
        <SaveCard onConfirm={() => false} />
      </div>
    </div>
  );
}
