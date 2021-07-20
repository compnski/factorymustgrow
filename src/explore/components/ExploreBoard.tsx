import { Turret } from "./Turret";
import { Bug } from "./Bug";
import { Spawner } from "./Spawner";
import { Boulder } from "./Boulder";
import { Star, Cloud } from "./Icons";

import { EntityProps } from "../svg";
import { EntityDef, TerrainDef } from "../defs";

import { ReactElement, FunctionComponent } from "react";

export type GhostInfo = {
  x: number;
  y: number;
  kind: "Turret" | "Spawner" | "Bug";
};

export type ExploreBoardProps = {
  bugs: Map<number, EntityDef>;
  turrets: Map<number, EntityDef>;
  terrain: Map<number, TerrainDef>;
  placementGhostInfo: GhostInfo | null;
  [x: string]: any;
};

function placementGhost(ghost: GhostInfo): JSX.Element | null {
  var GhostType;
  switch (ghost.kind) {
    case "Turret":
      GhostType = Turret;
      break;
    case "Spawner":
      GhostType = Spawner;
      break;
    case "Bug":
      GhostType = Bug;
      break;
  }
  return (
    <g className="placementGhost">
      <GhostType key="ghost" rotation={0} x={ghost.x} y={ghost.y} />
    </g>
  );
}

function renderBugs(bugs: Map<number, EntityDef>): ReactElement[] {
  const renderedBugs: ReactElement[] = [];
  bugs.forEach((bug) => {
    const fill = bug.kind == "MeleeBug" ? "darkred" : "darkblue";
    const BugElement = bug.kind === "Spawner" ? Spawner : Bug;
    renderedBugs.push(
      <BugElement
        key={bug.id}
        fill={fill}
        rotation={bug.rotation || 0}
        hpPercent={bug.currentHP / bug.maxHP}
        x={bug.x}
        y={bug.y}
      />
    );
  });
  return renderedBugs;
}

function renderTurrets(turrets: Map<number, EntityDef>): ReactElement[] {
  const renderedTurrets: ReactElement[] = [];
  turrets.forEach((turret) => {
    renderedTurrets.push(
      <Turret
        key={turret.id}
        hpPercent={turret.currentHP / turret.maxHP}
        rotation={turret.rotation}
        x={turret.x}
        y={turret.y}
      />
    );
  });
  return renderedTurrets;
}

function renderShootingEffects(
  entities: Map<number, EntityDef>,
  effect: FunctionComponent<EntityProps>
): ReactElement[] {
  const renderedEffects: ReactElement[] = [];
  const Effect = effect;
  entities.forEach((ent) => {
    const rotationRad = (ent.rotation * Math.PI) / 180;
    const deltaX = Math.cos(rotationRad);
    const deltaY = Math.sin(rotationRad);

    if (ent.isAttacking && ent.currentTarget != null)
      renderedEffects.push(
        <g>
          <Effect
            x={ent.x + ent.hitRadius * deltaX}
            y={ent.y + ent.hitRadius * deltaY}
            rotation={0}
          />
          <Effect
            x={ent.currentTarget.x - ent.currentTarget.hitRadius * deltaX}
            y={ent.currentTarget.y - ent.currentTarget.hitRadius * deltaY}
            rotation={0}
          />
        </g>
      );
  });

  return renderedEffects;
}

function renderTerrain(terrain: Map<number, TerrainDef>): ReactElement[] {
  return [...terrain.values()].map((t) => (
    <Boulder key={t.id} x={t.x} y={t.y} rotation={0} />
  ));
}

export const ExploreBoard = ({
  bugs,
  turrets,
  terrain,
  placementGhostInfo,
  ...props
}: ExploreBoardProps) => {
  return (
    <div {...props} className="exploreBoard">
      <svg id="exploreCanvas" version="2.0" width="600" height="600">
        <rect x="0" y="0" fill="none" width="100%" height="100%" />
        {placementGhostInfo ? placementGhost(placementGhostInfo) : null}
        {renderTerrain(terrain)}
        {renderTurrets(turrets)}
        {renderBugs(bugs)}
        {renderShootingEffects(bugs, Cloud)}
        {renderShootingEffects(turrets, Star)}
      </svg>
    </div>
  );
};
