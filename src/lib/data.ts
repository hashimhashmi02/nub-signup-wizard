/**
 * Sample campus dataset — drives the cascading State → City → College logic.
 * Replace with a real directory/API in production. Structured so a city owns
 * its colleges and a state owns its cities.
 */

export interface StateData {
  name: string;
  cities: CityData[];
}
export interface CityData {
  name: string;
  colleges: string[];
}

export const CAMPUS_DATA: StateData[] = [
  {
    name: "Delhi NCR",
    cities: [
      {
        name: "New Delhi",
        colleges: [
          "Delhi Technological University",
          "Hindu College, DU",
          "Sri Venkateswara College, DU",
          "Jamia Millia Islamia",
        ],
      },
      {
        name: "Gurugram",
        colleges: ["Ansal University", "GD Goenka University", "SGT University"],
      },
      {
        name: "Noida",
        colleges: [
          "Amity University",
          "Shiv Nadar University",
          "Bennett University",
        ],
      },
    ],
  },
  {
    name: "Maharashtra",
    cities: [
      {
        name: "Mumbai",
        colleges: [
          "IIT Bombay",
          "St. Xavier's College",
          "Narsee Monjee College",
          "VJTI",
        ],
      },
      {
        name: "Pune",
        colleges: [
          "College of Engineering, Pune",
          "Fergusson College",
          "Symbiosis International University",
        ],
      },
    ],
  },
  {
    name: "Karnataka",
    cities: [
      {
        name: "Bengaluru",
        colleges: [
          "IISc Bengaluru",
          "RV College of Engineering",
          "Christ University",
          "PES University",
        ],
      },
      {
        name: "Manipal",
        colleges: ["Manipal Institute of Technology", "Kasturba Medical College"],
      },
    ],
  },
  {
    name: "Tamil Nadu",
    cities: [
      {
        name: "Chennai",
        colleges: [
          "IIT Madras",
          "Anna University",
          "Loyola College",
          "SRM Institute of Science & Technology",
        ],
      },
      {
        name: "Vellore",
        colleges: ["VIT Vellore"],
      },
    ],
  },
  {
    name: "West Bengal",
    cities: [
      {
        name: "Kolkata",
        colleges: [
          "Jadavpur University",
          "Presidency University",
          "St. Xavier's College, Kolkata",
        ],
      },
    ],
  },
];

export const STATE_NAMES = CAMPUS_DATA.map((s) => s.name);

export function citiesForState(stateName: string): string[] {
  const s = CAMPUS_DATA.find((x) => x.name === stateName);
  return s ? s.cities.map((c) => c.name) : [];
}

export function collegesForCity(stateName: string, cityName: string): string[] {
  const s = CAMPUS_DATA.find((x) => x.name === stateName);
  const c = s?.cities.find((x) => x.name === cityName);
  return c ? c.colleges : [];
}

export const PRONOUN_OPTIONS = [
  "she/her",
  "he/him",
  "they/them",
  "prefer to self-describe",
  "prefer not to say",
] as const;
