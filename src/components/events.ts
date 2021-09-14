import { GameDispatch } from "../factoryGame";
import { EntityStack, FillEntityStack } from "../types";

export function getEntityIconDoubleClickHandler(buildingIdx: number) {
  return (
    evt: {
      clientX: number;
      clientY: number;
      shiftKey: boolean;
      //target: { hasOwnProperty(p: string): boolean };
      nativeEvent: { offsetX: number; offsetY: number };
    },
    stack: EntityStack
  ): void => {
    if (evt.shiftKey) {
      FillEntityStack(stack, 1);
      return;
    }
    const clickY = evt.nativeEvent.offsetY;
    if (clickY < 20) {
      GameDispatch({
        type: "TransferFromInventory",
        entity: stack.Entity,
        otherStackKind: "Building",
        buildingIdx: buildingIdx,
      });
    }

    if (clickY > 30) {
      GameDispatch({
        type: "TransferToInventory",
        entity: stack.Entity,
        otherStackKind: "Building",
        buildingIdx: buildingIdx,
      });
    }
  };
}
