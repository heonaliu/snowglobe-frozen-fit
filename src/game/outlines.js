// list of outline shapes the players has to fit into. 
export const outlines = [
  { id: "1",   name: "Pattern 1",   src: "/outlines/pattern1.png" },
  { id: "2",      name: "Pattern 2", src: "/outlines/pattern2.png" },
  { id: "3",     name: "Pattern 3",     src: "/outlines/pattern3.png" },
  { id: "4", name: "Pattern 4", src: "/outlines/pattern4.png" },
    { id: "5",      name: "Pattern 5", src: "/outlines/pattern5.png" },
  { id: "6",     name: "Pattern 6",     src: "/outlines/pattern6.png" },
  { id: "7",     name: "Pattern 7",     src: "/outlines/pattern7.png" },
];

export function pickRandomOutline(previous) {
  const options = outlines.filter((o) => o.id !== previous?.id);
  return options[Math.floor(Math.random() * options.length)];
}

//picks a random outline for you