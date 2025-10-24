export const csLewisQuotes = [
  "You can't go back and change the beginning, but you can start where you are and change the ending.",
  "You are never too old to set another goal or to dream a new dream.",
  "Integrity is doing the right thing, even when no one is watching.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "We are what we believe we are.",
  "There are far, far better things ahead than any we leave behind.",
  "Getting over a painful experience is much like crossing monkey bars. You have to let go at some point in order to move forward.",
  "Courage is not simply one of the virtues, but the form of every virtue at the testing point.",
  "True humility is not thinking less of yourself; it is thinking of yourself less.",
  "The task of the modern educator is not to cut down jungles, but to irrigate deserts.",
  "We can ignore reality, but we cannot ignore the consequences of ignoring reality.",
  "Failures, repeated failures, are finger posts on the road to achievement.",
  "Experience is a brutal teacher, but you learn. My God, do you learn.",
  "If you look for truth, you may find comfort in the end; if you look for comfort you will not get either comfort or truth.",
  "What you see and what you hear depends a great deal on where you are standing.",
  "The more we let God take us over, the more truly ourselves we become.",
  "Love is not affectionate feeling, but a steady wish for the loved person's ultimate good.",
  "Affection is responsible for nine-tenths of whatever solid and durable happiness there is in our lives.",
  "To love at all is to be vulnerable.",
  "Friendship is born at that moment when one person says to another: What! You too? I thought I was the only one."
];

export function getQuoteOfTheDay(): string {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return csLewisQuotes[dayOfYear % csLewisQuotes.length];
}
