export type StartCardProps = {
  resources: { kind: string; count: number }[];
  inventory: { kind: string; count: number }[];
  onClick: (skipFight: boolean) => void;
};

const prettyResourceKind = (k: string): string => {
  switch (k) {
    case "space":
      return "building slots";
  }
  return k.replaceAll("-", " ");
};

const prettyInventoryKind = (k: string): string => {
  return k.replaceAll("-", " ") + "s";
};

const itemList = (
  resources: { kind: string; count: number }[],
  prettyKind: (s: string) => string
): JSX.Element[] =>
  resources.map(({ kind, count }) => (
    <li>
      {count} {prettyKind(kind)}
    </li>
  ));

export const StartCard = ({
  resources,
  inventory,
  onClick,
}: StartCardProps) => {
  return (
    <div className="startCard">
      <div className="title">Claim New Territory</div>
      <div className="bodyText">
        All the surrounding land has been claimed by the bugs. Clear out the
        hives to expand! <em>The factory must grow!</em>
      </div>
      <div className="resourceList">
        This region contains:
        <ul>{itemList(resources, prettyResourceKind)}</ul>
      </div>
      <div className="inventoryList">
        You've brought the following supplies from home. Anything unused will be
        refunded.
        <ul>{itemList(inventory, prettyInventoryKind)}</ul>
      </div>
      <div className="buttonList">
        <div className="clickable button action" onClick={() => onClick(false)}>
          Fight!
        </div>
        <div className="clickable button action" onClick={() => onClick(true)}>
          Avoid Violence
        </div>
      </div>
    </div>
  );
};
