import { CharacterValues } from "@/types";

export function generateURL(formValues: CharacterValues) {
  const blob = new Blob([JSON.stringify(formValues)], { type: 'application/json' });
  return URL.createObjectURL(blob);
}