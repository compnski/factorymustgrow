export type EndCardProps = {
  resources: { kind: string; count: number }[];
  inventory: { kind: string; count: number }[];
  onClick: () => void;
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
    <li key={kind}>
      {count} {prettyKind(kind)}
    </li>
  ));

export const EndCard = ({ resources, inventory, onClick }: EndCardProps) => {
  return (
    <div className="startCard">
      <div className="modalBg">
        <div className="modalContent">
          <div className="title">Success!</div>
          <div className="bodyText">
            The surrounding land has been claimed. <em>The factory grows!</em>
          </div>
          <div className="resourceList">
            This region contains:
            <ul>{itemList(resources, prettyResourceKind)}</ul>
          </div>
          <div className="inventoryList">
            The follow supplies have survied and will be refunded.
            <ul>{itemList(inventory, prettyInventoryKind)}</ul>
          </div>
          <div className="buttonList">
            <div className="clickable button action" onClick={onClick}>
              Next
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
