/*
  Represents the gym information that is used in the gymInfo component.
  This is used to populate the dropdowns in the gymInfo component.
*/
export const gymFrequencys = [
  { id: 1, type: "First timer!" },
  { id: 2, type: "Once a week, or less." },
  { id: 3, type: "Three times a week" },
  { id: 4, type: "Twice a week" },
  { id: 5, type: "Between four and six times a week." },
  { id: 6, type: "I practically live at the gym!" },
];

export interface GymFrequencyObject {
  id: number;
  type: string;
}

/*
  Represents the gym information that is used in the gymInfo component.
  This is used to populate the dropdowns in the gymInfo component.
*/
export const gymTypes = [
  { id: 1, type: "Crossfit" },
  { id: 2, type: "Bodybuilding" },
  { id: 3, type: "Powerlifting" },
  { id: 4, type: "Strongman" },
  { id: 5, type: "Olympic lifting" },
  { id: 6, type: "Calisthenics" },
  { id: 7, type: "Other" },
];

export interface GymTypeObject {
  id: number;
  type: string;
}