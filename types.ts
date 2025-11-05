export interface Option {
  id: string;
  label: string;
  value: string;
}

export interface ModificationOptions {
  timeOfDay: string;
  season: string;
  tourists: string;
  format: string;
  perspective: string;
  removeText: boolean;
  customPrompt: string;
}