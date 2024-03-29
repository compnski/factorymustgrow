import { SyntheticEvent, useState } from "react"
import { AvailableResearchList } from "../gen/entities"
import { GetResearch, ResearchMap } from "../gen/entities"
import { ResearchTier } from "../gen/researchTier"
import { Icon } from "../gen/svgIcons"
import { StackCapacity } from "../movement"
import { unlockedResearch } from "../research"
import { Research } from "../types"
import { ReadonlyResearchState } from "../factoryGameState"
import { entityIconLookupByKind, showUserError } from "../utils"
import "./SelectResearchPanel.scss"

export type SelectResearchPanelProps = {
  onConfirm: (evt: SyntheticEvent, recipe: string) => void
  researchState: ReadonlyResearchState
}

function researchIcons(research: Research) {
  return (
    <span>
      {research.DurationSeconds}🕓
      {research.Input.map(({ Entity }) => (
        <>
          <span>{research.ProductionRequiredForCompletion}</span>
          <span className={`${Entity} icon`} />
        </>
      ))}
    </span>
  )
}

const ResearchEntriesByTier = new Map<number, number>()
AvailableResearchList.forEach((research) => {
  ResearchEntriesByTier.set(
    ResearchTier(research.Id),
    (ResearchEntriesByTier.get(ResearchTier(research.Id)) || 0) + 1
  )
})

function getAllReserachPreReqs(researchId: string): Set<string> {
  if (!researchId) return new Set([])
  const r = GetResearch(researchId)
  const p = new Set<string>(r.Prereqs)
  r.Prereqs.forEach((rId) => {
    getAllReserachPreReqs(rId).forEach((r) => p.add(r))
  })

  return p
}

function getAllResearchDirectlyUnlockedBy(researchId: string): Set<string> {
  if (!researchId) return new Set([])
  return new Set(
    AvailableResearchList.filter((research) => research.Prereqs.has(researchId)).map(
      (research) => research.Id
    )
  )
}

export function SelectResearchPanel(props: SelectResearchPanelProps) {
  const { researchState, onConfirm } = props
  const [selectValue, setSelectValue] = useState<string | undefined>(researchState.CurrentResearchId)

  const iconLookup = entityIconLookupByKind("Lab")

  const selectedResearch = (selectValue !== undefined && ResearchMap.get(selectValue)) || undefined

  const unlockedResearchIds = new Set<string>(unlockedResearch(researchState)),
    completedResearchIds = new Set<string>(
      [...researchState.Progress.values()]
        .map((v) => (StackCapacity(v) === 0 ? v.Entity : ""))
        .filter((e) => e !== "")
    ),
    prereqOfSelectedIds = getAllReserachPreReqs(selectedResearch?.Id || ""),
    unlockedBySelectedIds = getAllResearchDirectlyUnlockedBy(selectedResearch?.Id || "")

  const researchByTiers: Research[][] = []
  AvailableResearchList.forEach((research) => {
    const researchTier = ResearchTier(research.Id)
    const researchList = researchByTiers[researchTier] || []
    researchList.push(research)
    if (researchByTiers.length < researchTier)
      researchByTiers.push(...new Array(researchTier - researchByTiers.length))
    researchByTiers[researchTier] = researchList
  })
  function preqLocation(r: Research, rt: Research[][]): number {
    if (r.Prereqs.size === 0) return Infinity
    const prereqId = [...r.Prereqs][0]
    //const prereqRes = ResearchMap.get(prereqId);
    const prereqLoc = rt[ResearchTier(prereqId)].findIndex((r) => r.Id === prereqId)
    return prereqLoc
  }
  return (
    <div className="select-reseach modal">
      <span className="material-icons close-icon clickable" onClick={(evt) => onConfirm(evt, "")}>
        close
      </span>
      <span className="title">Select Research</span>
      <div className={` select-research-label`}>Double-Click Icon to Research</div>
      <div>
        <ResearchInfoBox research={selectedResearch} completedResearchIds={completedResearchIds} />{" "}
      </div>
      <div className="select-research-scroller">
        <svg className="research-tree" height="1500" width="600">
          {researchByTiers.map((researchList, tierIdx) => {
            if (tierIdx > 0)
              //sort by  position of first prereq
              researchList.sort((a, b): number => {
                return preqLocation(a, researchByTiers) - preqLocation(b, researchByTiers)
              })

            return researchList.map((research, iconIdx) => {
              const isCompleted = completedResearchIds.has(research.Id),
                isUnlocked = unlockedResearchIds.has(research.Id),
                isPrereqOfSelected = prereqOfSelectedIds.has(research.Id),
                isUnlockedBySelected = unlockedBySelectedIds.has(research.Id)

              if (research.Row < 0) {
                return false
              }
              const x = iconIdx * 100
              const y = tierIdx * 100
              /* const colCount = countByTier.get(ResearchTier(research.Id)) || 0,
               *   tierOffset = numColsBeforeTier(ResearchTier(research.Id)),
               *   [x, y] = xyFromColAndOffset(colCount, tierOffset),
               */
              const iconName = iconLookup(research.Id),
                isSelected = selectValue === research.Id

              // countByTier.set(ResearchTier(research.Id), colCount + 1); */
              return (
                <g key={research.Id}>
                  {isSelected && (
                    <rect
                      stroke="#000000"
                      strokeWidth="2"
                      fill="#aaaaaa33"
                      x={x}
                      y={y}
                      width="64"
                      height="60"
                    />
                  )}
                  {isPrereqOfSelected && (
                    <rect
                      stroke="#ddbbbb"
                      strokeWidth="1"
                      fill="#bbaaaa"
                      x={x}
                      y={y}
                      width="64"
                      height="60"
                    />
                  )}
                  {isUnlockedBySelected && (
                    <rect stroke="#bac" strokeWidth="1" fill="#bac" x={x} y={y} width="64" height="60" />
                  )}
                  {isCompleted && (
                    <rect stroke="#aba" strokeWidth="1" fill="#aba" x={x} y={y} width="64" height="60" />
                  )}

                  {Icon(iconName)}
                  <use
                    href={`#${iconName}`}
                    opacity={isUnlocked ? 1 : isSelected ? 0.6 : 0.4}
                    width="64"
                    height="64"
                    x={x}
                    y={y}
                    onDoubleClick={(evt) =>
                      !isCompleted &&
                      ((isUnlocked && onConfirm(evt, research.Id)) ||
                        (!isUnlocked && showUserError("Research locked")))
                    }
                    onClick={() => !isCompleted && setSelectValue(research.Id)}
                  >
                    <title>{iconName}</title>
                  </use>
                  <foreignObject x={x} y={y + 50} width={80} height={80}>
                    <p className={"research-label"}>{research.Name}</p>
                  </foreignObject>
                </g>
              )
            })
          })}
        </svg>
      </div>
    </div>
  )
}

function ResearchInfoBox({
  research,
  completedResearchIds,
}: {
  research: Research | undefined
  completedResearchIds: Set<string>
}) {
  const unmetPrereqs = [...(research?.Prereqs || [])].filter((r) => !completedResearchIds.has(r))
  return (
    <div className="info-box">
      {research && (
        <>
          <div key={research.Id}>
            <div>
              <span>
                {research.Name} - Tier {ResearchTier(research.Id)}
              </span>
            </div>
            <div>
              <span>{researchIcons(research)}</span>
            </div>
            {unmetPrereqs.length > 0 && (
              <div>
                <b>
                  <span>Requires: </span>
                  <ul className={unmetPrereqs.length > 3 ? "double-wide" : ""}>
                    {unmetPrereqs.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </b>
              </div>
            )}
          </div>
          <div>
            {research.Unlocks.length > 0 && <span>Unlocks Items</span>}
            <ul className={research.Unlocks.length > 5 ? "double-wide" : ""}>
              {research.Unlocks.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div>
            {research.Effects.length > 0 && <span>Effects</span>}
            <ul>
              {research.Effects.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
