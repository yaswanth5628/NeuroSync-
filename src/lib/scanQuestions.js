// Adaptive questionnaire definitions for the guided skin-scan assessment.

export const BASE_QUESTIONS = [
  { id: "age", label: "What is your age?", type: "number", placeholder: "e.g. 32" },
  { id: "gender", label: "Gender", type: "select", options: ["Female", "Male", "Other", "Prefer not to say"], optional: true },
  { id: "body_location", label: "Where on your body is it located?", type: "select", options: ["Face", "Scalp", "Neck", "Chest", "Back", "Abdomen", "Arm", "Hand", "Leg", "Foot", "Genital area", "Other"] },
  { id: "duration", label: "How long have you had it?", type: "select", options: ["Less than 1 week", "1–4 weeks", "1–3 months", "3–6 months", "More than 6 months"] },
  { id: "pain", label: "Is it painful?", type: "select", options: ["No pain", "Mild", "Moderate", "Severe"] },
  { id: "itching", label: "Is it itchy?", type: "select", options: ["Not itchy", "Mild", "Moderate", "Severe"] },
  { id: "burning", label: "Does it burn or sting?", type: "yesno" },
  { id: "bleeding", label: "Is it bleeding or oozing blood?", type: "yesno" },
  { id: "growth_change", label: "Has it grown or changed in size?", type: "select", options: ["No", "Yes", "Not sure"] },
  { id: "discharge", label: "Is there any discharge (pus or fluid)?", type: "yesno" },
  { id: "previous_occurrence", label: "Have you had this before?", type: "yesno" },
  { id: "existing_skin_conditions", label: "Any existing skin conditions?", type: "text", placeholder: "e.g. eczema, psoriasis…" },
  { id: "current_medications", label: "Current medications?", type: "text", placeholder: "e.g. topical steroids…" },
  { id: "allergies", label: "Any known allergies?", type: "text", placeholder: "e.g. nickel, pollen…" },
  { id: "family_history", label: "Family history of skin disease?", type: "select", options: ["No", "Yes", "Not sure"] },
];

export const CATEGORY_OPTIONS = [
  { value: "acne", label: "Acne / Pimples" },
  { value: "mole", label: "Mole / Spot" },
  { value: "rash", label: "Rash / Irritation" },
  { value: "infection", label: "Infection / Wound" },
  { value: "other", label: "Not sure" },
];

export const DYNAMIC_QUESTIONS = {
  acne: [
    { id: "oily_skin", label: "Is your skin oily?", type: "yesno" },
    { id: "hormonal_changes", label: "Any recent hormonal changes?", type: "yesno" },
    { id: "stress", label: "Are you under significant stress?", type: "yesno" },
    { id: "previous_acne_treatment", label: "Tried acne treatments before?", type: "text", placeholder: "e.g. benzoyl peroxide…" },
  ],
  mole: [
    { id: "changed_recently", label: "Has the mole changed recently?", type: "select", options: ["No", "Yes", "Not sure"] },
    { id: "abcde_asymmetry", label: "Is it asymmetrical (one half differs)?", type: "yesno" },
    { id: "abcde_border", label: "Is the border irregular or jagged?", type: "yesno" },
    { id: "abcde_color", label: "Does it have varied colors?", type: "yesno" },
    { id: "abcde_diameter", label: "Is it larger than 6mm (pencil eraser)?", type: "yesno" },
    { id: "family_melanoma", label: "Family history of melanoma?", type: "yesno" },
  ],
  rash: [
    { id: "new_soap", label: "Used a new soap, detergent, or cosmetic?", type: "yesno" },
    { id: "new_medication", label: "Started a new medication?", type: "yesno" },
    { id: "recent_travel", label: "Any recent travel?", type: "yesno" },
    { id: "fever", label: "Do you have a fever?", type: "yesno" },
    { id: "allergy_exposure", label: "Known allergy exposure?", type: "yesno" },
  ],
  infection: [
    { id: "pus", label: "Is there pus?", type: "yesno" },
    { id: "warmth", label: "Is the area warm to the touch?", type: "yesno" },
    { id: "swelling", label: "Is there swelling?", type: "yesno" },
    { id: "fever", label: "Do you have a fever?", type: "yesno" },
  ],
  other: [],
};

export function getQuestionsForCategory(category) {
  return [...BASE_QUESTIONS, ...(DYNAMIC_QUESTIONS[category] || [])];
}