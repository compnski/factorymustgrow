import { SyntheticEvent, useEffect, useState } from "react";
import { IWithShortcut, withShortcut } from "react-keybind";
import { InserterIdForBuilding } from "../building";
import {
  FactoryGameState,
  ReadonlyBuilding,
  ReadonlyRegion,
} from "../factoryGameState";
import { GameAction } from "../GameAction";
import { GetRecipe, MaybeGetRecipe } from "../gen/entities";
import { useGeneralDialog } from "../GeneralDialogProvider";
import { availableItems } from "../research";
import { BeltConnectionAddress } from "../state/address";
import { Belt, BeltHandlerFunc } from "../types";
import { BuildingHasInput, BuildingHasOutput, showUserError } from "../utils";
import { BuildingCard } from "./BuildingCard";
import { InserterCard } from "./InserterCard";
import { showSetLaneEntitySelector } from "./selectors";
type ClickInfo = {
  clientX: number;
  clientY: number;
  buildingIdx: number;
  laneId: number;
};

type BeltWithOriginal = Belt & { originalUpperSlotIdx?: number };

const BuildingCardListWithShortcut = ({
  region,
  uxDispatch,
  shortcut,
  gameState,
}: {
  region: ReadonlyRegion;
  uxDispatch: (a: GameAction) => void;
  gameState: FactoryGameState;
} & IWithShortcut) => {
  const regionId = region.Id;
  const [dragIdx, setDragIdx] = useState(-1);
  const [beltState, setBeltState] = useState<Belt[]>(
    region.Bus.Belts as Belt[]
  );
  const [removedBelts, setRemovedBelts] = useState<Belt[]>([]);

  useEffect(() => {
    setBeltState(region.Bus.Belts as Belt[]);
  }, [region.Bus.Belts]);

  /* useEffect(() => {
   *   if (shortcut && shortcut.registerShortcut) {
   *     shortcut.registerShortcut(
   *       clearEdits,
   *       ["escape"],
   *       "Escape",
   *       "Cancel Action"
   *     );
   *     return () => {
   *       if (shortcut.unregisterShortcut) shortcut.unregisterShortcut(["esc"]);
   *     };
   *   }
   * }, [clearEdits]);
   */
  const generalDialog = useGeneralDialog();

  function maybeAddGhostConnection(
    {
      regionId,
      buildingIdx,
      laneId,
      connectionIdx,
    }: BeltConnectionAddress & { laneId?: number },
    belt: Belt | undefined
  ) {
    const building = region.BuildingSlots[buildingIdx].Building;
    if (laneId != undefined && belt?.entity) {
      const buffer = buildingHasEntity(building, belt.entity);
      if (!buffer) return;

      const direction = buffer == "input" ? "FROM_BUS" : "TO_BUS";

      uxDispatch({
        type: "AddMainBusConnection",
        regionId,
        buildingIdx,
        laneId,
        direction,
      });
    }
  }

  function actuallyAddRemoveBelts(
    beltState: Belt[],
    ghostBelt: BeltWithOriginal | undefined
  ) {
    /* if (ghostBelt) {
     *   setBeltState([...beltState, ghostBelt]);
     *   console.log([...beltState, ghostBelt]);
     * }
     */
    if (removedBelts.length && !ghostBelt) {
      console.log("Remove", removedBelts);
      uxDispatch({
        type: "RemoveLane",
        regionId,
        laneId: removedBelts[0].laneIdx,
        upperSlotIdx: removedBelts[0].upperSlotIdx,
        lowerSlotIdx: removedBelts[0].lowerSlotIdx,
      });
    }

    if (ghostBelt && shouldCreateBelt(ghostBelt, beltState)) {
      uxDispatch({
        type: "AddLane",
        regionId,
        laneId: ghostBelt.laneIdx,
        upperSlotIdx: ghostBelt.upperSlotIdx,
        lowerSlotIdx: ghostBelt.lowerSlotIdx,
        beltDirection: ghostBelt.beltDirection,
      });

      // TODO: ghostBelt should always have an entity if there was a removed belt
      if (!ghostBelt.entity && !removedBelts.at(0)?.entity)
        void showSetLaneEntitySelector(
          generalDialog,
          regionId,
          ghostBelt.laneIdx,
          ghostBelt.upperSlotIdx,
          availableItems(gameState.Research)
        );
    }
  }

  const handleDrag = (buildingIdx: number) => () => {
    console.log("drag start");
    setDragIdx(buildingIdx);
    //e.preventDefault();
    //e.stopPropagation();
  };

  // TODO: Drag inserters to belts?
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
    return "NONE";
    const delta = evt.clientX - clickInfo.clientX;
    return delta > 15 ? "RIGHT" : delta < -15 ? "LEFT" : "NONE";
  }

  function yDir(evt: { clientY: number }, clickInfo: ClickInfo) {
    const delta = evt.clientY - clickInfo.clientY;
    return delta > 0 ? "DOWN" : "UP";
  }

  const [clickInfo, setClickInfo] = useState<ClickInfo | undefined>();
  const [ghostBelt, setGhostBelt] = useState<BeltWithOriginal | undefined>();
  const [ghostConnection, setGhostConnection] = useState<
    (BeltConnectionAddress & { laneId?: number }) | undefined
  >();

  function findBelt(
    laneId: number,
    beltStartingLaneIdx: number
  ): Belt | undefined {
    return beltState.find(
      (b) => b.laneIdx == laneId && b.upperSlotIdx == beltStartingLaneIdx
    );
  }

  function removeBelt(existingBelt: Belt) {
    setRemovedBelts(removedBelts.concat(existingBelt));
    setBeltState(
      beltState.filter((b) => {
        const z = !(
          b.laneIdx == existingBelt.laneIdx &&
          b.upperSlotIdx == existingBelt.upperSlotIdx
        );
        console.log(b, z);
        return z;
      })
    );
  }

  function clearEdits() {
    setClickInfo(undefined);
    setGhostBelt(undefined);
    setGhostConnection(undefined);
    setRemovedBelts([]);
    setBeltState(region.Bus.Belts as Belt[]);
  }

  const beltInserterMouseDown = (
    evt: SyntheticEvent<HTMLElement, MouseEvent>,
    buildingIdx: number,
    connectionIdx: number
  ) => {
    // TODO: If not empty, if not existing connection
    // if has input or output
    setGhostConnection({ regionId, buildingIdx, connectionIdx });
  };

  const beltHandler: BeltHandlerFunc = (
    evt: SyntheticEvent<HTMLDivElement, MouseEvent>,

    action: string,
    laneId: number,
    buildingIdx: number,
    beltStartingLaneIdx?: number
  ) => {
    evt.stopPropagation();
    evt.preventDefault();
    if (action == "cancel") {
      setBeltState(region.Bus.Belts as Belt[]);
      setGhostBelt(undefined);
      return;
    }

    const existingBelt =
      beltStartingLaneIdx != undefined
        ? findBelt(laneId, beltStartingLaneIdx)
        : undefined;

    if (
      existingBelt &&
      ghostBelt?.originalUpperSlotIdx &&
      existingBelt.upperSlotIdx != ghostBelt.originalUpperSlotIdx
    )
      return; //  Don't allow connectiong more than 1 belt at once

    //    console.log(action, laneId, buildingIdx);
    //    console.log(evt.type);
    //console.log(evt.type);

    // Staring on existing belt:
    // - remove exsiting belt, set it as ghost belt
    // ending on existing belt:
    // - if same direction, join it
    // - if other mission, do not extend?
    // TODO: Move this out of this file
    // TODO: Handle entity selection on belt connection creation
    // Try to infer, if not, show a list
    // Need a way to change/override if we guess wrong
    // Need to store belt state in region
    // Reconcile beltState with regional state?
    // Question is when do we remove the belt we drag over, probably on mouseup or whenever ghostBelt is removed
    // TODO: Deal with entities and entity mismatches
    // TODO: Deal with more than one belt

    switch (evt.type) {
      case "mousedown":
        if (existingBelt) {
          if (
            buildingIdx != existingBelt.lowerSlotIdx &&
            buildingIdx != existingBelt.upperSlotIdx
          ) {
            break;
          }
          setClickInfo({
            clientX: evt.nativeEvent.clientX,
            clientY: evt.nativeEvent.clientY,
            buildingIdx:
              existingBelt.beltDirection == "UP"
                ? existingBelt.lowerSlotIdx
                : existingBelt.upperSlotIdx,
            laneId,
          });

          setGhostBelt({
            ...existingBelt,
            originalUpperSlotIdx: existingBelt.upperSlotIdx,
          });
          removeBelt(existingBelt);
        } else {
          setClickInfo({
            clientX: evt.nativeEvent.clientX,
            clientY: evt.nativeEvent.clientY,
            buildingIdx,
            laneId,
          });
        }
        break;
      case "mouseup":
      case "mouseleave":
        if (ghostConnection && existingBelt)
          maybeAddGhostConnection(ghostConnection, existingBelt);
        if (ghostConnection) setGhostConnection(undefined);

        actuallyAddRemoveBelts(beltState, ghostBelt);
        clearEdits();
        break;
      case "mouseenter":
        if (ghostConnection) setGhostConnection({ ...ghostConnection, laneId });
        if (clickInfo != undefined)
          if (clickInfo.buildingIdx == buildingIdx) setGhostBelt(undefined);
          else {
            const beltDirection = yDir(evt.nativeEvent, clickInfo);
            if (existingBelt && existingBelt.laneIdx == clickInfo.laneId) {
              if (existingBelt.beltDirection == beltDirection) {
                removeBelt(existingBelt);
                setGhostBelt(
                  extendBelt(
                    {
                      ...existingBelt,
                      originalUpperSlotIdx: existingBelt.upperSlotIdx,
                    },
                    clickInfo,
                    buildingIdx,
                    beltDirection
                  )
                );
              }
            } else {
              setGhostBelt({
                laneIdx: clickInfo.laneId,
                upperSlotIdx: Math.min(clickInfo.buildingIdx, buildingIdx),
                lowerSlotIdx: Math.max(clickInfo.buildingIdx, buildingIdx),
                endDirection: xDir(evt.nativeEvent, clickInfo),
                beltDirection,
                entity: ghostBelt ? ghostBelt.entity : "",
                internalBeltBuffer: new Array(0),
              });
            }
          }
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
          beltState={
            ghostBelt
              ? beltState.concat([{ ...ghostBelt, isGhost: true }])
              : beltState
          }
          beltInserterMouseDown={beltInserterMouseDown}
          ghostConnection={
            ghostConnection?.buildingIdx == idx ? ghostConnection : undefined
          }
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

// TODO: When extending a belt, dont change direciont, just get longer
function extendBelt(
  existingBelt: Belt & { originalUpperSlotIdx: number },
  clickInfo: ClickInfo,
  buildingIdx: number,
  beltDirection: "UP" | "DOWN"
): Belt & { originalUpperSlotIdx: number } {
  const upperSlotIdx = Math.min(
    existingBelt.upperSlotIdx,
    buildingIdx,
    clickInfo.buildingIdx
  );
  const lowerSlotIdx = Math.max(
    existingBelt.upperSlotIdx,
    buildingIdx,
    clickInfo.buildingIdx
  );
  const newLength =
    lowerSlotIdx -
    upperSlotIdx -
    (existingBelt.lowerSlotIdx - existingBelt.upperSlotIdx);

  const newBuffer = newLength > 0 ? new Array(newLength) : new Array(0);

  return {
    laneIdx: clickInfo.laneId,
    upperSlotIdx,
    lowerSlotIdx,
    endDirection: "NONE", // xDir(evt.nativeEvent, clickInfo), // TODO: Only change if on first/last cell of belt
    beltDirection,
    entity: existingBelt.entity,
    internalBeltBuffer: new Array(0),
    originalUpperSlotIdx: existingBelt.originalUpperSlotIdx,
  };
}

export const BuildingCardList = withShortcut(BuildingCardListWithShortcut);

function buildingHasEntity(
  building: ReadonlyBuilding,
  entity: string
): false | "input" | "output" {
  if (BuildingHasInput(building, entity)) return "input";
  if (BuildingHasOutput(building, entity)) return "output";
  return false;
}

function shouldCreateBelt(ghostBelt: BeltWithOriginal, beltState: Belt[]) {
  if (ghostBelt.lowerSlotIdx - ghostBelt.upperSlotIdx < 1) return false;
  return true;
}
