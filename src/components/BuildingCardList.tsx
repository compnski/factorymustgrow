import { SyntheticEvent, useState } from "react";
import { InserterIdForBuilding } from "../building";
import { FactoryGameState, ReadonlyRegion } from "../factoryGameState";
import { GameAction } from "../GameAction";
import { Belt, BeltHandlerFunc } from "../types";
import { showUserError } from "../utils";
import { BuildingCard } from "./BuildingCard";
import { InserterCard } from "./InserterCard";
type ClickInfo = {
  clientX: number;
  clientY: number;
  buildingIdx: number;
  laneId: number;
};

const initialBelts: Belt[] = [
  {
    laneIdx: 1,
    startingSlotIdx: 0,
    length: 2,
    beltDirection: "DOWN",
    endDirection: "RIGHT",
    entity: "copper-ore",
  },

  {
    laneIdx: 2,
    startingSlotIdx: 0,
    length: 3,
    beltDirection: "DOWN",
    endDirection: "RIGHT",
    entity: "copper-ore",
  },
  {
    laneIdx: 4,
    startingSlotIdx: 1,
    length: 3,
    beltDirection: "DOWN",
    endDirection: "LEFT",
    entity: "copper-plate",
  },
  {
    laneIdx: 5,
    startingSlotIdx: 1,
    length: 4,
    beltDirection: "UP",
    endDirection: "LEFT",
    entity: "copper-plate",
  },
  {
    laneIdx: 1,
    startingSlotIdx: 4,
    length: 4,
    beltDirection: "UP",
    endDirection: "RIGHT",
    entity: "automation-science-pack",
  },
  {
    laneIdx: 3,
    startingSlotIdx: 5,
    length: 4,
    beltDirection: "UP",
    endDirection: "NONE",
    entity: "iron-plate",
  },
  {
    laneIdx: 6,
    startingSlotIdx: 3,
    length: 4,
    beltDirection: "DOWN",
    endDirection: "NONE",
    entity: "transport-belt",
  },
];

export const BuildingCardList = ({
  region,
  uxDispatch,
  gameState,
}: {
  region: ReadonlyRegion;
  uxDispatch: (a: GameAction) => void;
  gameState: FactoryGameState;
}) => {
  const regionId = region.Id;
  const [dragIdx, setDragIdx] = useState(-1);
  const [beltState, setBeltState] = useState<Belt[]>([]); //initialBelts);

  const handleDrag = (buildingIdx: number) => () => {
    console.log("drag start");
    setDragIdx(buildingIdx);
    //e.preventDefault();
    //e.stopPropagation();
  };

  const handleDrop =
    (dropIdx: number, isDropOnLastBuilding: boolean) => (e: SyntheticEvent) => {
      console.log(dragIdx, dropIdx);
      uxDispatch({
        type: "ReorderBuildings",
        regionId,
        buildingIdx: dragIdx,
        dropBuildingIdx: dropIdx,
        isDropOnLastBuilding,
      });
      e.preventDefault();
      //e.stopPropagation();
    };

  const moveUp = (buildingIdx: number) => {
    for (let i = buildingIdx; i >= 0; i--) {
      if (region.BuildingSlots[i].Building.kind === "Empty") {
        uxDispatch({
          type: "ReorderBuildings",
          regionId,
          buildingIdx: buildingIdx,
          dropBuildingIdx: i,
          isDropOnLastBuilding: false,
        });
        return;
      }
    }
    showUserError("No empty slot found");
    return;
  };

  const moveDown = (buildingIdx: number) => {
    for (let i = buildingIdx; i < region.BuildingSlots.length; i++) {
      if (region.BuildingSlots[i].Building.kind === "Empty") {
        uxDispatch({
          type: "ReorderBuildings",
          regionId,
          buildingIdx: buildingIdx,
          dropBuildingIdx: i,
          isDropOnLastBuilding: false,
        });
        return;
      }
    }
    showUserError("No empty slot found");
    return;
  };

  function xDir(evt: { clientX: number }, clickInfo: ClickInfo) {
    const delta = evt.clientX - clickInfo.clientX;
    return delta > 15 ? "RIGHT" : delta < -15 ? "LEFT" : "NONE";
  }

  function yDir(evt: { clientY: number }, clickInfo: ClickInfo) {
    const delta = evt.clientY - clickInfo.clientY;
    return delta > 0 ? "DOWN" : "UP";
  }

  const [clickInfo, setClickInfo] = useState<ClickInfo | undefined>();
  const [ghostBelt, setGhostBelt] = useState<Belt | undefined>();

  const beltHandler: BeltHandlerFunc = (
    evt: SyntheticEvent<HTMLDivElement, MouseEvent>,

    action: string,
    laneId: number,
    buildingIdx: number
  ) => {
    evt.stopPropagation();
    //    console.log(action, laneId, buildingIdx);
    //    console.log(evt.type);
    //console.log(evt.type);
    switch (evt.type) {
      case "mousedown":
        setClickInfo({
          clientX: evt.nativeEvent.clientX,
          clientY: evt.nativeEvent.clientY,
          buildingIdx,
          laneId,
        });
        break;
      case "mouseup":
      case "mouseleave":
        if (ghostBelt) setBeltState([...beltState, ghostBelt]);
        setClickInfo(undefined);
        setGhostBelt(undefined);
        break;
      case "mouseenter":
        if (clickInfo != undefined)
          if (clickInfo.buildingIdx == buildingIdx) setGhostBelt(undefined);
          else
            setGhostBelt({
              laneIdx: clickInfo.laneId,
              startingSlotIdx: Math.min(clickInfo.buildingIdx, buildingIdx),
              length: Math.abs(clickInfo.buildingIdx - buildingIdx) + 1,
              endDirection: xDir(evt.nativeEvent, clickInfo),
              beltDirection: yDir(evt.nativeEvent, clickInfo),
              entity: "",
            });
    }
  };

  const cards = region.BuildingSlots.map((buildingSlot, idx) => {
    const isFirstBuilding = idx === 0,
      isLastBuilding = idx === region.BuildingSlots.length - 1,
      allowsDrop = buildingSlot.Building.kind === "Empty" || isLastBuilding;

    return (
      <div key={idx}>
        {isFirstBuilding && (
          <div key="i-top" className="inserter-card wide">
            <div className="inserter-rectangle" />
          </div>
        )}
        <BuildingCard
          key={`b-${idx}`}
          region={region}
          buildingIdx={idx}
          buildingSlot={buildingSlot}
          uxDispatch={uxDispatch}
          handleDrag={handleDrag(idx)}
          handleDrop={allowsDrop ? handleDrop(idx, isLastBuilding) : undefined}
          moveUp={() => moveUp(idx)}
          moveDown={() => moveDown(idx)}
          gameState={gameState}
          beltHandler={beltHandler}
          beltState={ghostBelt ? beltState.concat([ghostBelt]) : beltState}
        />
        {!isLastBuilding && (
          <InserterCard
            key={`i-${idx}`}
            variant="wide"
            inserter={buildingSlot.Inserter}
            inserterId={InserterIdForBuilding(regionId, idx)}
            uxDispatch={uxDispatch}
          />
        )}
      </div>
    );
  });

  return (
    <div
      onMouseLeave={(e) => beltHandler(e, "leave", -1, -1)}
      onMouseUp={(e) => beltHandler(e, "up", -1, -1)}
      className="producerCardList"
    >
      {cards}
    </div>
  );
};
