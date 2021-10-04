import { GameDispatch } from "../factoryGame";
import { ItemBuffer, NewEntityStack } from "../types";

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
