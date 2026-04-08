/**
 * Gender-aware text helper
 * Returns male or female version based on player gender
 */
export const gText = (male: string, female: string, gender: "male" | "female" | null): string => {
  return gender === "female" ? female : male;
};
