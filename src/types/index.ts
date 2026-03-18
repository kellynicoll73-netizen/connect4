// ─── Attribute scores ────────────────────────────────────────────────────────

export interface NeighbourhoodAttributes {
  walkability:       number // 0–10
  transitScore:      number // 0–10
  cyclingScore:      number // 0–10
  outdoorsAccess:    number // 0–10
  culturalDiversity: number // 0–10
  safetyPerception:  number // 0–10
  socialEnergy:      number // 0–10
  fitnessAccess:     number // 0–10
  quietness:         number // 0–10
}

// ─── Listing ─────────────────────────────────────────────────────────────────

export type ScamFlag = 'belowMedian' | 'immediateAvailability' | 'utilitiesIncluded'

export interface ListingObject {
  headline:     string
  price:        number                   // monthly rent in CAD
  bedroomCount: 1 | 2 | 3
  bodyText:     string
  photos:       [string, string, string] // exactly 3 URLs
  postedAt:     string                   // display string e.g. "2 hours ago"
  scamFlags:    ScamFlag[]
}

// ─── Community quote ──────────────────────────────────────────────────────────

export interface CommunityQuote {
  text:        string
  attribution: string
}

// ─── Neighbourhood ────────────────────────────────────────────────────────────

export interface Neighbourhood {
  id:                     string
  name:                   string
  district:               string
  tagline:                string
  heroImage:              string
  personalityDescription: string
  analogousComparisons:   Record<string, string> // must include "default" key
  communityQuote:         CommunityQuote | string | null
  attributes:             NeighbourhoodAttributes
  medianRent: {
    oneBed:   number
    twoBed:   number
    threeBed: number
  }
  vacancyRate: number
  listings: {
    oneBed:   ListingObject
    twoBed:   ListingObject
    threeBed: ListingObject
  }
}

// ─── Session state union types ────────────────────────────────────────────────

export type ReasonForMoving =
  | 'work'
  | 'school'
  | 'family'
  | 'chose-vancouver'
  | 'figuring-it-out'
  | 'other'

export type Timeline =
  | 'under-4-weeks'
  | '1-2-months'
  | '3-months-plus'
  | 'flexible'
  | 'other'

export type Household =
  | 'just-me'
  | 'me-and-pet'
  | 'me-and-partner'
  | 'me-and-children'
  | 'other'

export type Bedrooms = 1 | 2 | 3

export type Budget =
  | 'under-1800'
  | '1800-2500'
  | '2500-3500'
  | 'over-3500'
  | 'not-sure'
  | 'other'

export type Transport =
  | 'transit'
  | 'walking'
  | 'cycling'
  | 'car'
  | 'other'

export type FreeDay =
  | 'cafe-walking'
  | 'outdoors-active'
  | 'farmers-market'
  | 'sleeping-in'
  | 'cultural-browse'
  | 'other'

export type NeighbourhoodEnergy =
  | 'alive-buzzy'
  | 'quiet-grounded'
  | 'scene-community'
  | 'space-air'
  | 'edges-emerging'
  | 'other'

export type OutdoorsAccess =
  | 'essential'
  | 'important'
  | 'nice-to-have'
  | 'not-a-factor'
  | 'other'

export type CulturalCommunity =
  | 'yes'
  | 'somewhat'
  | 'not-a-priority'

export type ComfortPriority =
  | 'personal-safety'
  | 'family'
  | 'community-feel'
  | 'quiet-decompress'
  | 'diversity-inclusion'
  | 'grit-character'
  | 'grit'
  | 'other'

export type CardVersion = 'A' | 'B' | 'C'

// ─── Session state ────────────────────────────────────────────────────────────

export interface SessionState {
  // Phase 1 — Practicalities
  reasonForMoving:          ReasonForMoving | null
  reasonForMovingOther:     string | null
  workLocation:             string | null
  schoolLocation:           string | null
  timeline:                 Timeline | null
  timelineOther:            string | null
  household:                Household | null
  householdOther:           string | null
  bedrooms:                 Bedrooms | null
  budget:                   Budget | null
  budgetOther:              string | null
  transport:                Transport | null
  transportOther:           string | null
  // Phase 2 — Lifestyle
  freeDay:                  FreeDay | null
  freeDayOther:             string | null
  neighbourhoodEnergy:      NeighbourhoodEnergy | null
  neighbourhoodEnergyOther: string | null
  outdoorsAccess:           OutdoorsAccess | null
  outdoorsAccessOther:      string | null
  culturalCommunity:        CulturalCommunity | null
  culturalCommunityText:    string | null
  comfortPriority:          ComfortPriority | null
  comfortPriorityOther:     string | null
  // Phase 3 — Where you're from
  currentCity:              string | null
  currentNeighbourhood:     string | null
  currentDescription:       string | null
  // Phase 4 — Your favourite place
  favouriteNeighbourhood:   string | null
  favouriteCity:            string | null
  favouriteCountry:         string | null
  favouriteDescription:     string | null
  // Output
  matchedNeighbourhoodId:   string | null
  cardVersion:              CardVersion
}
