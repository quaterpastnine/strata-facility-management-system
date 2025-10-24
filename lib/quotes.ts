export const rumiQuotes = [
  "Out beyond ideas of wrongdoing and rightdoing, there is a field. I'll meet you there.",
  "The wound is the place where the Light enters you.",
  "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.",
  "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
  "Stop acting so small. You are the universe in ecstatic motion.",
  "Raise your words, not voice. It is rain that grows flowers, not thunder.",
  "The quieter you become, the more you are able to hear.",
  "Don't grieve. Anything you lose comes round in another form.",
  "Let silence take you to the core of life.",
  "Everything in the universe is within you. Ask all from yourself.",
  "Set your life on fire. Seek those who fan your flames.",
  "What you seek is seeking you.",
  "Be like a tree and let the dead leaves drop.",
  "Patience is not sitting and waiting, it is foreseeing.",
  "Dance, when you're broken open. Dance, if you've torn the bandage off.",
  "Your heart knows the way. Run in that direction.",
  "Be grateful for whoever comes, because each has been sent as a guide.",
  "Forget safety. Live where you fear to live.",
  "These pains you feel are messengers. Listen to them.",
  "Goodbyes are only for those who love with their eyes. Because for those who love with heart and soul there is no such thing as separation."
];

export function getQuoteOfTheDay(): string {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return rumiQuotes[dayOfYear % rumiQuotes.length];
}
