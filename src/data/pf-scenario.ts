// Legacy stub kept only for type compatibility — no longer used by gameplay.
export interface InquiryOption {
  id: string;
  text: string;
  tier: "strong" | "medium" | "weak";
  points: number;
  response: string;
  explanation: string;
}

export const INQUIRY_ROUNDS: { id: number; title: string; options: InquiryOption[] }[] = [];
export const FRAMING_OPTIONS: { id: string; text: string; isCorrect: boolean; explanation: string }[] = [];
export const FRAMING_POINTS = 10;
