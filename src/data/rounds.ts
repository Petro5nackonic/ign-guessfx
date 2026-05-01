import { archiveOrgFile } from "../utils/archiveOrg";
import { steamHeader } from "./gameCatalog";

export type RoundSnippet = {
  description: string;
  audioSrc: string;
};

export type GameRound = {
  acceptableAnswers: string[];
  displayAnswer: string;
  thumbnail: string;
  snippets: RoundSnippet[];
};

const portal = (path: string) => archiveOrgFile("Portal2OST", path);
const zeldaOot = (filename: string) =>
  archiveOrgFile("the-legend-of-zelda-ocarina-of-time-ost-complete", filename);
const smb = (filename: string) =>
  archiveOrgFile("super-mario-bros-ost-sfx", filename);
const re4 = (path: string) =>
  archiveOrgFile("biohazard-4-soundtrack-book", path);
const haloCe = (path: string) =>
  archiveOrgFile(
    "halo-combat-evolved-martin-odonnell-michael-salvatori",
    path,
  );
const stardew = (path: string) => archiveOrgFile("stardew-valley-ost", path);
const mgs2 = (path: string) =>
  archiveOrgFile(
    "metal-gear-solid-2-sons-of-liberty-original-soundtrack",
    path,
  );
const balatro = (path: string) =>
  archiveOrgFile("balatro-ost_202603", path);
const witcher3 = (path: string) =>
  archiveOrgFile("the-witcher-3-wild-hunt-ost", path);
const eldenRing = (path: string) =>
  archiveOrgFile(
    "shoi-miyazawa-yuka-kitamura-yoshimi-kudo-tai-tomisawa-elden-ring-original-game-soundtrack",
    path,
  );
const minecraft = (path: string) =>
  archiveOrgFile("minecraft-volume-alpha", path);

/** Witcher 3 IA filenames use NBSP (U+00A0) between some words — URLs must match exactly. */
const WITCH_SILVER_MONSTERS = "1-10 Silver\u00a0For\u00a0Monsters....mp3";
const WITCH_STEEL_HUMANS = "1-19 ...Steel\u00a0For\u00a0Humans.mp3";

/**
 * Clip choices prioritize **sound‑effects / gameplay‑moment audio** (UI pings, alarms, footsteps,
 * mines ambience, robot VO, etc.) over full orchestral themes where IA mirrors allow it.
 */
export const ALL_GAME_ROUNDS: GameRound[] = [
  {
    displayAnswer: "Portal 2",
    acceptableAnswers: [
      "Portal 2",
      "Portal II",
      "portal two",
      "portal 2",
    ],
    thumbnail: steamHeader(620),
    snippets: [
      {
        description: "GLaDOS VO glitch — diagnostic chatter sting",
        audioSrc: portal(
          "Portal2-OST-Volume-1/Portal2-05-Technical_Difficulties.mp3",
        ),
      },
      {
        description: "Space‑sphere shout — slap‑stick payoff bark",
        audioSrc: portal("Portal2-OST-Volume-3/Portal2-14-Spaaaaace.mp3"),
      },
      {
        description: "Turret chorus line — robotic chirps",
        audioSrc: portal(
          "Portal2-OST-Volume-2/Portal2-07-Turret_Redemption_Line.mp3",
        ),
      },
      {
        description: "Frankenturret scrap shuffle — servo stumble bed",
        audioSrc: portal("Portal2-OST-Volume-3/Portal2-03-FrankenTurrets.mp3"),
      },
      {
        description: "Triple‑laser puzzle pulse — test‑chamber hazard groove",
        audioSrc: portal(
          "Portal2-OST-Volume-1/Portal2-22-Triple_Laser_Phase.mp3",
        ),
      },
    ],
  },
  {
    displayAnswer: "The Legend of Zelda: Ocarina of Time",
    acceptableAnswers: [
      "The Legend of Zelda: Ocarina of Time",
      "Legend of Zelda Ocarina of Time",
      "Zelda Ocarina of Time",
      "Ocarina of Time",
      "OOT",
      "oot",
      "LoZ Ocarina of Time",
      "zelda oot",
    ],
    thumbnail:
      "https://placehold.co/460x215/1e3a5f/e8eef8?text=Zelda%3A+Ocarina+of+Time",
    snippets: [
      {
        description: "Chest opens — dungeon loot sting",
        audioSrc: zeldaOot("1-07 Open Treasure Box.mp3"),
      },
      {
        description: "Pickup ping — tiny item grab blip",
        audioSrc: zeldaOot("1-09 Small Item Catch.mp3"),
      },
      {
        description: "Heart container earned — life‑up fanfare",
        audioSrc: zeldaOot("1-15 Heart Container Get.mp3"),
      },
      {
        description: "Spiritual stone obtained — plot‑token jingle",
        audioSrc: zeldaOot("1-17 Spiritual Stone Get.mp3"),
      },
      {
        description: "Temple door opens — sacred hinge cue",
        audioSrc: zeldaOot("1-45 Open Door of Temple of Time.mp3"),
      },
    ],
  },
  {
    displayAnswer: "Super Mario Bros.",
    acceptableAnswers: [
      "Super Mario Bros.",
      "Super Mario Bros",
      "SMB",
      "smb",
      "original Mario",
      "NES Mario",
      "first Mario game",
      "Super Mario Brothers",
      "mario bros",
    ],
    thumbnail:
      "https://placehold.co/460x215/c1121f/ffffff?text=Super+Mario+Bros.",
    snippets: [
      {
        description: "Chip SFX sting — classic NES waveform burst",
        audioSrc: smb("(03-41) Super Mario Bros. 1,2,VS.mp3"),
      },
      {
        description: "Stage percussion hit — jump / stomp palette",
        audioSrc: smb("(09-41) Super Mario Bros. 1,2,VS.mp3"),
      },
      {
        description: "Noise‑channel chirp — hazard feedback blip",
        audioSrc: smb("(17-41) Super Mario Bros. 1,2,VS.mp3"),
      },
      {
        description: "Underworld sting — dungeon percussion cue",
        audioSrc: smb("(26-41) Super Mario Bros. 1,2,VS.mp3"),
      },
      {
        description: "Goal / fanfare sting — victory waveform tail",
        audioSrc: smb("(35-41) Super Mario Bros. 1,2,VS.mp3"),
      },
    ],
  },
  {
    displayAnswer: "Resident Evil 4",
    acceptableAnswers: [
      "Resident Evil 4",
      "Resident Evil IV",
      "RE4",
      "re4",
      "Biohazard 4",
      "biohazard 4",
    ],
    thumbnail: steamHeader(2050650),
    snippets: [
      {
        description: "Game Over sting — harsh UI‑fail stab",
        audioSrc: re4("Disc 01/1-15 - Game Over.mp3"),
      },
      {
        description: "Siege weapon slap — catapult percussion hit",
        audioSrc: re4("Disc 01/1-16 - Catapult.mp3"),
      },
      {
        description: "Gallery practice pings — gun‑range rhythm bed",
        audioSrc: re4("Disc 01/1-20 - Target Practice.mp3"),
      },
      {
        description: "Bug swarm skitter — insect encounter scrape",
        audioSrc: re4("Disc 01/1-21 - Novistadors.mp3"),
      },
      {
        description: "Typewriter save motif — ink ribbon cadence",
        audioSrc: re4("Disc 01/1-32 - Save Theme.mp3"),
      },
    ],
  },
  {
    displayAnswer: "Halo: Combat Evolved",
    acceptableAnswers: [
      "Halo: Combat Evolved",
      "Halo Combat Evolved",
      "Halo CE",
      "halo ce",
      "Halo 1",
      "halo 1",
      "Combat Evolved",
    ],
    thumbnail:
      "https://placehold.co/460x215/2f6e52/e9fff6?text=Halo+Combat+Evolved",
    snippets: [
      {
        description: "Ambient Wonder — minimalist halo pulse bed",
        audioSrc: haloCe("07. Martin O'Donnell - Ambient Wonder.mp3"),
      },
      {
        description: "Trace Amounts — sparse probe‑tone motif",
        audioSrc: haloCe("09. Martin O'Donnell - Trace Amounts.mp3"),
      },
      {
        description: "Woodland footfall bed — patrol ambience",
        audioSrc: haloCe("06. Martin O'Donnell - A Walk in the Woods.mp3"),
      },
      {
        description: "Alien Corridors — Covenant hull creep drones",
        audioSrc: haloCe("15. Martin O'Donnell - Alien Corridors.mp3"),
      },
      {
        description: "Devils… Monsters… — sting + metallic scrape hits",
        audioSrc: haloCe("13. Martin O'Donnell - Devils... Monsters....mp3"),
      },
    ],
  },
  {
    displayAnswer: "Stardew Valley",
    acceptableAnswers: [
      "Stardew Valley",
      "stardew valley",
      "Stardew",
    ],
    thumbnail: steamHeader(413150),
    snippets: [
      {
        description: "Mine crystal bells — sparkly ore ambience",
        audioSrc: stardew("60 Mines (Crystal Bells).mp3"),
      },
      {
        description: "Mine icicles — chilly drip percussion",
        audioSrc: stardew("63 Mines (Icicles).mp3"),
      },
      {
        description: "Mine danger sting — escalation klaxon bed",
        audioSrc: stardew("69 Mines (Danger!).mp3"),
      },
      {
        description: "Country shop bell ambience — storefront rustle",
        audioSrc: stardew("32 Country Shop.mp3"),
      },
      {
        description: "Crane game loop — arcade cabinet chirps",
        audioSrc: stardew("82-Crane Game.mp3"),
      },
    ],
  },
  {
    displayAnswer: "Metal Gear Solid 2: Sons of Liberty",
    acceptableAnswers: [
      "Metal Gear Solid 2: Sons of Liberty",
      "Metal Gear Solid 2",
      "Metal Gear Solid Sons of Liberty",
      "MGS2",
      "mgs2",
      "Metal Gear Solid",
      "metal gear solid",
    ],
    thumbnail:
      "https://placehold.co/460x215/2f4538/eefcf5?text=Metal+Gear+Solid+2",
    snippets: [
      {
        description: "METAL GEAR! — alarm shout sting",
        audioSrc: mgs2("05. Metal Gear!.mp3"),
      },
      {
        description: "Olga duel grit — close‑quarters scrape rhythm",
        audioSrc: mgs2("04. Olga Gurlukovich.mp3"),
      },
      {
        description: "Revolver cadence — pistol‑spin motif hits",
        audioSrc: mgs2("06. Revolver Ocelot.mp3"),
      },
      {
        description: "Big Shell exterior wind — rigging percussion bed",
        audioSrc: mgs2("09. Big Shell.mp3"),
      },
      {
        description: "Russian soldiers cue — chopper rotor chatter intro",
        audioSrc: mgs2("03. Russian Soldiers from Kasatka.mp3"),
      },
    ],
  },
  {
    displayAnswer: "Balatro",
    acceptableAnswers: ["Balatro", "balatro"],
    thumbnail: steamHeader(2379780),
    snippets: [
      {
        description: "Shop UI groove — register‑belt synth chatter",
        audioSrc: balatro("004 - Shop Theme.mp3"),
      },
      {
        description: "Tarot pack sting — cosmic card‑flip shimmer",
        audioSrc: balatro("002 - Tarot Pack Theme.mp3"),
      },
      {
        description: "Planet pack orbit — arcade warp chirps",
        audioSrc: balatro("003 - Planet Pack Theme.mp3"),
      },
      {
        description: "Boss blind tension — escalating chip noise wall",
        audioSrc: balatro("005 - Boss Blind Theme.mp3"),
      },
      {
        description: "Main table pulse — neon poker‑felt heartbeat",
        audioSrc: balatro("001 - Main Theme.mp3"),
      },
    ],
  },
  {
    displayAnswer: "The Witcher 3: Wild Hunt",
    acceptableAnswers: [
      "The Witcher 3: Wild Hunt",
      "The Witcher 3",
      "Witcher 3",
      "witcher 3",
      "TW3",
      "Wild Hunt",
    ],
    thumbnail: steamHeader(292030),
    snippets: [
      {
        description: "Silver for monsters — hunt opener sting",
        audioSrc: witcher3(WITCH_SILVER_MONSTERS),
      },
      {
        description: "Steel for humans — duel heartbeat refrain",
        audioSrc: witcher3(WITCH_STEEL_HUMANS),
      },
      {
        description: "Igni burst — flame sign surge",
        audioSrc: witcher3("2-17 Igni.mp3"),
      },
      {
        description: "Widowmaker skirmish — tight combat pulses",
        audioSrc: witcher3("1-15 Widowmaker.mp3"),
      },
      {
        description: "Nemesis chase — pounding pursuit rhythm",
        audioSrc: witcher3("2-08 Nemesis.mp3"),
      },
    ],
  },
  {
    displayAnswer: "Elden Ring",
    acceptableAnswers: [
      "Elden Ring",
      "elden ring",
      "ELDEN RING",
    ],
    thumbnail: steamHeader(1245620),
    snippets: [
      {
        description: "Character creation bed — muted forge ambience",
        audioSrc: eldenRing("1-03 Character Creation.mp3"),
      },
      {
        description: "Cave drip loop — dripping stone echoes",
        audioSrc: eldenRing("1-05 Caves.mp3"),
      },
      {
        description: "Tunnel scrape shuffle — shaft ambience grains",
        audioSrc: eldenRing("1-06 Tunnels.mp3"),
      },
      {
        description: "Roundtable hub murmur — hearths + parchment rustle",
        audioSrc: eldenRing("1-08 Roundtable Hold.mp3"),
      },
      {
        description: "Underground rivers — low rushing water drones",
        audioSrc: eldenRing("1-10 Great Underground Rivers.mp3"),
      },
    ],
  },
  {
    displayAnswer: "Minecraft",
    acceptableAnswers: ["Minecraft", "minecraft", "MC"],
    thumbnail: "https://placehold.co/460x215/3d8526/ffffff?text=Minecraft",
    snippets: [
      {
        description: "Door thunk cadence — wood slap resonance",
        audioSrc: minecraft("02 - C418 - Door.mp3"),
      },
      {
        description: "Death sting — crunchy hurt knockback cue",
        audioSrc: minecraft("04 - C418 - Death.mp3"),
      },
      {
        description: "Music Disc 13 — cave ambience grains",
        audioSrc: minecraft("16 - C418 - Thirteen.mp3"),
      },
      {
        description: "Excuse fragment — glitchy startup chirp",
        audioSrc: minecraft("17 - C418 - Excuse.mp3"),
      },
      {
        description: "Dog yap samples — playful bark chops",
        audioSrc: minecraft("20 - C418 - Dog.mp3"),
      },
    ],
  },
];

export const ROUNDS_PER_SESSION = 3;

function shuffleCopy<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Random classics each run — no repeats within the session (until the pool is exhausted). */
export function pickSessionRounds(count = ROUNDS_PER_SESSION): GameRound[] {
  const capped = Math.min(count, ALL_GAME_ROUNDS.length);
  return shuffleCopy(ALL_GAME_ROUNDS).slice(0, capped);
}
