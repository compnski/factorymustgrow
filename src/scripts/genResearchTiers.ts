import { ResearchMap } from "../gen/entities"

export function getResearchTiers() {
  const researchTiers = new Map<string, number>()

  ResearchMap.forEach((research) => {
    let maxPrereqTier = -1
    if (research.Prereqs.size === 0) {
      researchTiers.set(research.Id, 0)
      return
    }
    research.Prereqs.forEach((prereqName) => {
      const prereqTier = researchTiers.get(prereqName)
      if (prereqTier !== undefined) {
        maxPrereqTier = Math.max(prereqTier, maxPrereqTier)
        return
      }
    })
    if (maxPrereqTier >= 0) {
      researchTiers.set(research.Id, maxPrereqTier + 1)
    }
  })
  console.log(researchTiers)
  console.log(JSON.stringify([...researchTiers.entries()]))
}

getResearchTiers()
