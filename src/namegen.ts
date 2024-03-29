const adjectives = [
  "alert",
  "alive",
  "amused",
  "angry",
  "annoyed",
  "annoying",
  "anxious",
  "arrogant",
  "ashamed",
  "average",
  "awful",
  "bad",
  "beautiful",
  "better",
  "bewildered",
  "bloody",
  "blushing",
  "bored",
  "brainy",
  "brave",
  "breakable",
  "bright",
  "busy",
  "calm",
  "careful",
  "cautious",
  "charming",
  "cheerful",
  "clean",
  "clear",
  "clever",
  "cloudy",
  "clumsy",
  "colorful",
  "concerned",
  "confused",
  "crazy",
  "creepy",
  "crowded",
  "cruel",
  "curious",
  "cute",
  "dangerous",
  "dark",
  "defeated",
  "defiant",
  "distinct",
  "disturbed",
  "dizzy",
  "doubtful",
  "drab",
  "dull",
]

const animals = [
  "koi",
  "kid",
  "mink",
  "cod",
  "minx",
  "grue",
  "skink",
  "manx",
  "nit",
  "mare",
  "foal",
  "pug",
  "tern",
  "kite",
  "kit",
  "shoat",
  "steed",
  "roo",
  "swan",
  "hen",
  "leech",
  "swift",
  "grub",
  "roc",
  "mite",
  "lamb",
  "fowl",
  "snipe",
  "colt",
  "louse",
  "olm",
  "croc",
  "cub",
  "skunk",
  "fawn",
  "goat",
  "ray",
  "flea",
  "mule",
  "swine",
  "sow",
  "shad",
  "roach",
  "gar",
  "hake",
  "trout",
  "finch",
  "shrike",
  "grunt",
  "perch",
  "grebe",
  "auk",
  "rook",
  "loon",
  "stork",
  "crane",
  "goose",
  "gnu",
  "sloth",
  "dhole",
  "yak",
  "shrew",
  "calf",
  "doe",
  "buck",
  "carp",
  "jay",
  "bass",
  "shark",
  "deer",
  "stag",
  "wren",
  "eft",
  "mouse",
  "vole",
  "mole",
  "duck",
  "hog",
  "asp",
  "fly",
  "boar",
  "stoat",
  "lynx",
  "gnat",
  "moth",
  "rat",
  "bat",
  "newt",
  "toad",
  "moose",
  "elk",
  "clam",
  "chub",
  "sheep",
  "wasp",
  "crow",
  "ant",
  "cow",
  "chick",
  "pup",
  "bird",
  "bull",
  "gull",
  "fox",
  "frog",
  "seal",
  "dove",
  "eel",
  "lark",
  "ox",
  "whale",
  "crab",
  "fish",
  "wolf",
  "snail",
  "snake",
  "ram",
  "owl",
  "pig",
  "hawk",
  "hare",
  "bug",
  "squid",
  "horse",
  "ape",
  "bee",
  "bear",
  "cat",
  "dog",
]

function randomElement<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function randomName(): string {
  return `${randomElement(adjectives)} ${randomElement(animals)}`
}

export function reallyRandomName(): string {
  return `${randomElement(adjectives)} ${randomElement(adjectives)} ${randomElement(animals)}`
}
