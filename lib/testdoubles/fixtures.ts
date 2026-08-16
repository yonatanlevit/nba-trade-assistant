// Deterministic fixture league for Tier-1 testing (MOCK_BBALLGM=1).
// Small on purpose; aligned with the QA scenarios (Boston + Anthony Davis,
// Curry switch, "Smith" ambiguity, LeBron-as-free-agent, unknown player).

import type { Player, Team } from "../state";

export const FIXTURE_TEAMS: Team[] = [
  {
    id: 1,
    name: "Celtics",
    city: "Boston",
    abbreviation: "BOS",
    primaryColor: "#007A33",
    secondaryColor: "#BA9653",
    totalSalary: 195_000_000,
    capSpace: -30_000_000,
    isOverCap: true,
    isOverLuxuryTax: false,
    isOverFirstApron: false,
    isOverSecondApron: false,
  },
  {
    id: 2,
    name: "Wizards",
    city: "Washington",
    abbreviation: "WAS",
    primaryColor: "#002B5C",
    secondaryColor: "#E31837",
    totalSalary: 160_000_000,
    capSpace: 5_000_000,
    isOverCap: false,
    isOverLuxuryTax: false,
    isOverFirstApron: false,
    isOverSecondApron: false,
  },
  {
    id: 3,
    name: "Warriors",
    city: "Golden State",
    abbreviation: "GSW",
    primaryColor: "#1D428A",
    secondaryColor: "#FFC72C",
    totalSalary: 185_000_000,
    capSpace: -20_000_000,
    isOverCap: true,
    isOverLuxuryTax: false,
    isOverFirstApron: false,
    isOverSecondApron: false,
  },
  {
    id: 4,
    name: "Suns",
    city: "Phoenix",
    abbreviation: "PHX",
    primaryColor: "#1D1160",
    secondaryColor: "#E56020",
    totalSalary: 163_000_000,
    capSpace: 2_000_000,
    isOverCap: false,
    isOverLuxuryTax: false,
    isOverFirstApron: false,
    isOverSecondApron: false,
  },
];

function player(
  id: number,
  name: string,
  teamId: number,
  position: string,
  salary: number,
  signingStatus = "active",
): Player {
  const team = FIXTURE_TEAMS.find((t) => t.id === teamId);
  return {
    id,
    name,
    teamId,
    teamName: team?.name ?? "Lakers",
    teamAbbreviation: team?.abbreviation ?? "LAL",
    position,
    salary,
    signingStatus,
  };
}

export const FIXTURE_PLAYERS: Player[] = [
  // Boston Celtics — the demo user's roster
  player(101, "Jaylen Brown", 1, "SG", 48_000_000),
  player(102, "Derrick White", 1, "PG", 30_000_000),
  player(103, "Kristaps Porzingis", 1, "C", 24_000_000),
  player(104, "Sam Hauser", 1, "SF", 10_000_000),
  player(105, "Payton Pritchard", 1, "PG", 7_000_000),
  // Washington Wizards — home of the demo target
  player(201, "Anthony Davis", 2, "PF", 50_000_000),
  player(202, "Bilal Coulibaly", 2, "SF", 8_000_000),
  player(203, "Dru Smith", 2, "SG", 3_000_000),
  // Golden State Warriors — the change-target scenario
  player(301, "Stephen Curry", 3, "PG", 55_000_000),
  player(302, "Draymond Green", 3, "PF", 25_000_000),
  // Phoenix Suns — second "Smith" for the ambiguity scenario
  player(401, "Jalen Smith", 4, "C", 9_000_000),
  player(402, "Devin Booker", 4, "SG", 51_000_000),
  // Free agent (mirrors the real-data LeBron gotcha)
  player(501, "LeBron James", 99, "SF", 0, "free-agent"),
];
