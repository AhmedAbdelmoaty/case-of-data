import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";
import mansourImg from "@/assets/characters/mansour.png";
import heshamImg from "@/assets/characters/hesham.png";
import nouraImg from "@/assets/characters/noura.png";
import karimImg from "@/assets/characters/karim.png";
import detectiveImg from "@/assets/characters/detective.png";
import prismBuildingImg from "@/assets/scenes/prism-building-exterior.webp";
import prismHallwayImg from "@/assets/scenes/prism-hallway.webp";
import prismKnockMaleImg from "@/assets/scenes/prism-knock-male.webp";
import prismKnockFemaleImg from "@/assets/scenes/prism-knock-female.webp";
import mansourWelcomeMaleImg from "@/assets/scenes/mansour-office-welcome-male.webp";
import mansourWelcomeFemaleImg from "@/assets/scenes/mansour-office-welcome-female.webp";
import mansourSeatedMaleImg from "@/assets/scenes/mansour-office-seated-male.webp";
import mansourSeatedFemaleImg from "@/assets/scenes/mansour-office-seated-female.webp";
import cityDriveLuxuryMaleImg from "@/assets/scenes/city-drive-luxury-male.webp";
import cityDriveLuxuryFemaleImg from "@/assets/scenes/city-drive-luxury-female.webp";
import velaroStreetImg from "@/assets/scenes/velaro-street.webp";
import velaroStorefrontImg from "@/assets/scenes/velaro-storefront.webp";
import velaroEnteringMaleImg from "@/assets/scenes/velaro-entering-male.webp";
import velaroEnteringFemaleImg from "@/assets/scenes/velaro-entering-female.webp";
import velaroInteriorWideImg from "@/assets/scenes/velaro-interior-wide.webp";
import hishamGreetingMaleImg from "@/assets/scenes/hisham-greeting-male.webp";
import hishamGreetingFemaleImg from "@/assets/scenes/hisham-greeting-female.webp";
import hishamOfficeSeatedMaleImg from "@/assets/scenes/hisham-office-seated-male.webp";
import hishamOfficeSeatedFemaleImg from "@/assets/scenes/hisham-office-seated-female.webp";
import hishamHandingReportMaleImg from "@/assets/scenes/hisham-handing-report-male.webp";
import hishamHandingReportFemaleImg from "@/assets/scenes/hisham-handing-report-female.webp";
import velaroCheckoutBusyImg from "@/assets/scenes/velaro-checkout-busy.webp";
import velaroWomensSectionImg from "@/assets/scenes/velaro-womens-section.webp";
import velaroMensSectionImg from "@/assets/scenes/velaro-mens-section.webp";
import analystReflectingMaleImg from "@/assets/scenes/analyst-reflecting-male.webp";
import analystReflectingFemaleImg from "@/assets/scenes/analyst-reflecting-female.webp";
import framingBoardDeskImg from "@/assets/scenes/framing-board-desk.webp";
import analystLaptopMaleImg from "@/assets/photos/analyst-laptop-evening-male.webp";
import analystLaptopFemaleImg from "@/assets/photos/analyst-laptop-evening-female.webp";
import mansourReadingImg from "@/assets/photos/mansour-reading-email.webp";
import mansourPhoneImg from "@/assets/photos/mansour-picking-phone.webp";
import analystRelaxingMaleImg from "@/assets/photos/analyst-relaxing-male.webp";
import analystRelaxingFemaleImg from "@/assets/photos/analyst-relaxing-female.webp";
import mansourAvatarImg from "@/assets/photos/mansour-avatar-circle.webp";
import { MANSOUR_INTRO_DIALOGUES, HISHAM_GREETING } from "@/data/pf-case";
import {
  MANSOUR_CALL_MEDIUM,
  MANSOUR_CALL_STRONG,
  MANSOUR_CALL_WEAK,
} from "@/lib/pf-case/mansour-call-scripts";
import { applyGenderToLine } from "@/lib/voiceover/genderedDialogue";
import { ALL_ANALYST_VOICEOVER } from "@/lib/voiceover/analystVoiceMap";
import { ALL_HESHAM_VOICEOVER } from "@/lib/voiceover/heshamVoiceMap";

export type GameScreenId =
  | "company-briefing"
  | "travel"
  | "velaro-street"
  | "arrival"
  | "inquiry"
  | "reflection"
  | "framing"
  | "email-send"
  | "mansour-receives"
  | "incoming-call"
  | "phone-call"
  | "result"
  | "replay-briefing";

type Gender = "male" | "female";
type Outcome = "strong" | "medium" | "weak" | null;

export interface GameAssets {
  images: string[];
  audio: string[];
}

const SCENE_AUDIO = {
  hallway: "/sounds/ambience_office_hallway_footsteps.mp3",
  door: "/sounds/interaction_office_door_knock.mp3",
  car: "/sounds/ambience_car_driving_traffic.mp3",
  street: "/sounds/ambience_storefront_street.mp3",
  store: "/sounds/ambience_store_interior_light.mp3",
  writing: "/sounds/interaction_report_writing_paper.mp3",
  keyboard: "/sounds/interaction_keyboard_typing.mp3",
  ringtone: "/sounds/interaction_phone_ringtone.mp3",
};

const unique = (assets: GameAssets): GameAssets => ({
  images: [...new Set(assets.images.filter(Boolean))],
  audio: [...new Set(assets.audio.filter(Boolean))],
});

const lineAudio = (
  lines: Array<{ text: unknown; audioSrc?: string }>,
  gender: Gender,
) =>
  lines
    .map((line) => applyGenderToLine(line as { text: never; audioSrc?: string }, gender).audioSrc)
    .filter((src): src is string => Boolean(src));

const callAudio = (gender: Gender) => [
  ...lineAudio(MANSOUR_CALL_STRONG, gender),
  ...lineAudio(MANSOUR_CALL_MEDIUM, gender),
  ...lineAudio(MANSOUR_CALL_WEAK, gender),
];

const callImages = (gender: Gender, outcome: Outcome) => {
  const tier = outcome || "medium";
  const mansour =
    tier === "strong"
      ? [
          new URL("../assets/scenes/mansour-call-strong-a.webp", import.meta.url).href,
          new URL("../assets/scenes/mansour-call-strong-b.webp", import.meta.url).href,
        ]
      : tier === "weak"
        ? [
            new URL("../assets/scenes/mansour-call-weak-a.webp", import.meta.url).href,
            new URL("../assets/scenes/mansour-call-weak-b.webp", import.meta.url).href,
          ]
        : [
            new URL("../assets/scenes/mansour-call-medium-a.webp", import.meta.url).href,
            new URL("../assets/scenes/mansour-call-medium-b.webp", import.meta.url).href,
          ];
  const analyst =
    tier === "weak"
      ? gender === "female"
        ? new URL("../assets/photos/analyst-on-phone-female-weak.webp", import.meta.url).href
        : new URL("../assets/photos/analyst-on-phone-male-weak.webp", import.meta.url).href
      : gender === "female"
        ? new URL("../assets/photos/analyst-on-phone-female.webp", import.meta.url).href
        : new URL("../assets/photos/analyst-on-phone-male.webp", import.meta.url).href;
  return [...mansour, analyst];
};

export const getScreenAssets = (
  screen: GameScreenId,
  gender: Gender,
  outcome: Outcome,
): GameAssets => {
  const gendered = <T,>(male: T, female: T) => (gender === "female" ? female : male);

  switch (screen) {
    case "company-briefing":
    case "replay-briefing":
      return unique({
        images: [
          prismBuildingImg,
          prismHallwayImg,
          gendered(prismKnockMaleImg, prismKnockFemaleImg),
          gendered(mansourWelcomeMaleImg, mansourWelcomeFemaleImg),
          gendered(mansourSeatedMaleImg, mansourSeatedFemaleImg),
          gendered(analystImg, saraImg),
          mansourImg,
        ],
        audio: [SCENE_AUDIO.hallway, SCENE_AUDIO.door, ...lineAudio(MANSOUR_INTRO_DIALOGUES, gender)],
      });
    case "travel":
      return unique({
        images: [gendered(cityDriveLuxuryMaleImg, cityDriveLuxuryFemaleImg)],
        audio: [SCENE_AUDIO.car],
      });
    case "velaro-street":
      return unique({ images: [velaroStreetImg], audio: [SCENE_AUDIO.street] });
    case "arrival":
      return unique({
        images: [
          velaroStorefrontImg,
          gendered(velaroEnteringMaleImg, velaroEnteringFemaleImg),
          velaroInteriorWideImg,
          gendered(hishamGreetingMaleImg, hishamGreetingFemaleImg),
          gendered(hishamOfficeSeatedMaleImg, hishamOfficeSeatedFemaleImg),
          gendered(analystImg, saraImg),
          heshamImg,
        ],
        audio: [SCENE_AUDIO.street, SCENE_AUDIO.store, ...lineAudio(HISHAM_GREETING, gender)],
      });
    case "inquiry":
      return unique({
        images: [
          velaroInteriorWideImg,
          velaroCheckoutBusyImg,
          velaroWomensSectionImg,
          velaroMensSectionImg,
          gendered(hishamGreetingMaleImg, hishamGreetingFemaleImg),
          gendered(hishamOfficeSeatedMaleImg, hishamOfficeSeatedFemaleImg),
          gendered(hishamHandingReportMaleImg, hishamHandingReportFemaleImg),
          gendered(analystImg, saraImg),
          heshamImg,
        ],
        audio: [SCENE_AUDIO.store, ...ALL_ANALYST_VOICEOVER, ...ALL_HESHAM_VOICEOVER],
      });
    case "reflection":
      return unique({
        images: [gendered(analystReflectingMaleImg, analystReflectingFemaleImg)],
        audio: [SCENE_AUDIO.writing],
      });
    case "framing":
      return unique({ images: [framingBoardDeskImg], audio: [SCENE_AUDIO.writing] });
    case "email-send":
      return unique({
        images: [gendered(analystLaptopMaleImg, analystLaptopFemaleImg)],
        audio: [SCENE_AUDIO.keyboard],
      });
    case "mansour-receives":
      return unique({ images: [mansourReadingImg, mansourPhoneImg], audio: [] });
    case "incoming-call":
      return unique({
        images: [gendered(analystRelaxingMaleImg, analystRelaxingFemaleImg), mansourAvatarImg],
        audio: [SCENE_AUDIO.ringtone],
      });
    case "phone-call":
      return unique({
        images: callImages(gender, outcome),
        audio: [SCENE_AUDIO.ringtone, ...callAudio(gender)],
      });
    case "result":
      return unique({ images: [], audio: [] });
    default:
      return unique({ images: [], audio: [] });
  }
};

export const getWarmupAssets = (gender: Gender): GameAssets =>
  unique({
    images: [
      prismBuildingImg,
      prismHallwayImg,
      gender === "female" ? prismKnockFemaleImg : prismKnockMaleImg,
      gender === "female" ? mansourSeatedFemaleImg : mansourSeatedMaleImg,
      gender === "female" ? saraImg : analystImg,
      mansourImg,
    ],
    audio: [
      SCENE_AUDIO.hallway,
      SCENE_AUDIO.door,
      ...lineAudio(MANSOUR_INTRO_DIALOGUES.slice(0, 2), gender),
    ],
  });
