import { GameDispatch } from "../GameDispatch";
import { ItemBuffer, NewEntityStack } from "../types";
import { showPlaceBeltLineSelector } from "./selectors";

export function getEntityIconDoubleClickHandler(buildingIdx: number) {
  return (
    evt: {
      clientX: number;
      clientY: number;
      shiftKey: boolean;
      //target: { hasOwnProperty(p: string): boolean };
      nativeEvent: { offsetX: number; offsetY: number };
    },
    buffer: ItemBuffer,
    entity: string
  ): void => {
    if (evt.shiftKey) {
      buffer.Add(NewEntityStack(entity, 1));
      return;
    }
    const clickY = evt.nativeEvent.offsetY;
    if (clickY < 20) {
      GameDispatch({
        type: "TransferFromInventory",
        entity: entity,
        otherStackKind: "Building",
        buildingIdx: buildingIdx,
      });
    }

    if (clickY > 30) {
      GameDispatch({
        type: "TransferToInventory",
        entity: entity,
        otherStackKind: "Building",
        buildingIdx: buildingIdx,
      });
    }
  };
}

// const inventoryDoubleClickHandler = function inventoryDoubleClickHandler(
//   evt: { shiftKey: boolean },
//   itemBuffer: ItemBuffer,
//   entity: string
// ) {
//   if (evt.shiftKey) {
//     GameDispatch({
//       type: "TransferFromInventory",
//       entity,
//       otherStackKind: "Void",
//     });
//   } else {
//     // Place Item
//     if (entity === "transport-belt")
//       showPlaceBeltLineSelector(
//         generalDialog,
//         gameState.Inventory,
//         gameState.Regions
//       );
//     else if (IsBuilding(entity))
//       GameDispatch({
//         type: "PlaceBuilding",
//         entity,
//       });
//   }
// };
