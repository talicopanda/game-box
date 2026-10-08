export const questions = [
  {
    id: "sweater",
    wording: "Can Tales wear the green panda sweater for the rest of his life, unbothered?",
    gag: "runaway",
  },
  {
    id: "television",
    wording: "Can Tales claim 100% of the TV rights, and can Kris abstain from Say Yes to the Dress for the rest of her life?",
    gag: "elephant",
  },
  {
    id: "massage",
    wording: "Does Kris agree to give massages on request for the rest of her life?",
    gag: "terms",
  },
  {
    id: "dinner",
    wording: "Will Kris accept permanent responsibility for deciding what to eat, including not saying ‘I don’t know’ when asked?",
    gag: "drone",
  },
];

export function nextQuestionIndex(index) {
  return index + 1 < questions.length ? index + 1 : null;
}
