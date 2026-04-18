// ============================================================================
// Case Schema — Problem Framing Game
// Reference: .lovable/plan.md (Section 2)
// ============================================================================

export type QuestionCategory =
  | "golden"
  | "misleading-deep"
  | "premature-solution"
  | "neutral-context"
  | "frame-challenge";

export type CharacterMood =
  | "neutral"
  | "confused"
  | "annoyed"
  | "thoughtful"
  | "open";

export type EvidenceWeight =
  | "critical"
  | "supporting"
  | "contextual"
  | "distracting";

export type FramingTier =
  | "gold"
  | "silver"
  | "bronze"
  | "trap-baseline-ignored"
  | "trap-jumped-to-solution"
  | "trap-internal-cause"
  | "incoherent";

export type FramingComponentKind = "symptom" | "root-cause" | "recommendation";

export type FramingComponentQuality = "correct" | "partial" | "wrong";

// ----------------------------------------------------------------------------
// Question
// ----------------------------------------------------------------------------
export interface Question {
  id: string;
  text: string;                    // No quality hints in text
  category: QuestionCategory;      // Internal only — never shown in UI
  reveals: string[];               // Evidence IDs revealed by asking
  characterResponse: string;
  characterMood: CharacterMood;
  trustImpact: number;             // -2 to +1
}

// ----------------------------------------------------------------------------
// Evidence
// ----------------------------------------------------------------------------
export interface Evidence {
  id: string;
  text: string;
  weight: EvidenceWeight;
  pointsTo: string[];              // Framing component IDs it supports
  contradicts: string[];           // Framing component IDs it contradicts
}

// ----------------------------------------------------------------------------
// Framing Components & Combinations
// ----------------------------------------------------------------------------
export interface FramingComponent {
  id: string;
  text: string;
  kind: FramingComponentKind;
  quality: FramingComponentQuality;
}

export interface FramingCombo {
  symptomId: string;
  rootCauseId: string;
  recommendationId: string;
  tier: FramingTier;
  feedback: string;
  requiresEvidence: string[];      // Evidence IDs required for this tier
}

// ----------------------------------------------------------------------------
// Trust Mechanics
// ----------------------------------------------------------------------------
export interface TrustTrigger {
  category: QuestionCategory;
  delta: number;
}

export interface TrustMechanics {
  initial: number;
  min: number;
  max: number;
  triggers: TrustTrigger[];
}

// ----------------------------------------------------------------------------
// Evaluation
// ----------------------------------------------------------------------------
export type EvaluationAxisId =
  | "frame-challenge"
  | "evidence-discovery"
  | "question-economy"
  | "framing-synthesis"
  | "trust-management";

export interface EvaluationAxis {
  id: EvaluationAxisId;
  label: string;
  description: string;
  weight: number;                  // 0..1 — sums to 1.0 across axes
}

export type PerformanceTier =
  | "master-framer"
  | "solid-analyst"
  | "promising"
  | "missed-the-frame"
  | "failed";

// ----------------------------------------------------------------------------
// Truth (the hidden reality of the case)
// ----------------------------------------------------------------------------
export interface CaseTruth {
  surfaceSymptom: string;
  presentedRequest: string;
  misleadingInterpretation: string;
  hiddenReality: string;
  correctFraming: string;
  keyLesson: string;
}

// ----------------------------------------------------------------------------
// The Case
// ----------------------------------------------------------------------------
export interface Case {
  id: string;
  title: string;
  industryDomain: string;

  truth: CaseTruth;

  briefingContext: string;

  questionBank: Question[];        // 20
  questionBudget: number;          // 7

  evidencePool: Evidence[];

  framingComponents: {
    symptoms: FramingComponent[];
    rootCauses: FramingComponent[];
    recommendations: FramingComponent[];
  };
  validFramingCombinations: FramingCombo[];

  trustMechanics: TrustMechanics;

  evaluationAxes: EvaluationAxis[];

  // Critical evidence required to "solve" the case
  criticalEvidenceIds: string[];
}
