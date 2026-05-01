export type CatalogGame = {
  title: string;
  thumbnail: string;
};

/** Steam capsule headers where listed on Steam; simple rendered tiles for exclusives. */
export function steamHeader(appId: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
}

export const GAME_CATALOG: CatalogGame[] = [
  { title: "Portal 2", thumbnail: steamHeader(620) },
  { title: "Half-Life 2", thumbnail: steamHeader(220) },
  { title: "Team Fortress 2", thumbnail: steamHeader(440) },
  { title: "Counter-Strike 2", thumbnail: steamHeader(730) },
  { title: "The Elder Scrolls V: Skyrim", thumbnail: steamHeader(72850) },
  { title: "Elden Ring", thumbnail: steamHeader(1245620) },
  { title: "Dark Souls III", thumbnail: steamHeader(374320) },
  { title: "The Witcher 3: Wild Hunt", thumbnail: steamHeader(292030) },
  { title: "Cyberpunk 2077", thumbnail: steamHeader(1091500) },
  { title: "Hades", thumbnail: steamHeader(1145360) },
  { title: "Hollow Knight", thumbnail: steamHeader(367520) },
  { title: "Super Meat Boy", thumbnail: steamHeader(40800) },
  { title: "Undertale", thumbnail: steamHeader(391540) },
  { title: "Stardew Valley", thumbnail: steamHeader(413150) },
  { title: "Terraria", thumbnail: steamHeader(105600) },
  { title: "God of War", thumbnail: steamHeader(1593500) },
  { title: "Persona 5 Royal", thumbnail: steamHeader(1687950) },
  { title: "Monster Hunter: World", thumbnail: steamHeader(582010) },
  { title: "Red Dead Redemption 2", thumbnail: steamHeader(1174180) },
  { title: "Grand Theft Auto V", thumbnail: steamHeader(271590) },
  { title: "Minecraft", thumbnail: "https://placehold.co/460x215/3d8526/ffffff?text=Minecraft" },
  {
    title: "The Legend of Zelda: Ocarina of Time",
    thumbnail:
      "https://placehold.co/460x215/1e3a5f/e8eef8?text=Zelda%3A+Ocarina+of+Time",
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    thumbnail:
      "https://placehold.co/460x215/2d6a4f/e9fff4?text=Zelda%3A+BOTW",
  },
  {
    title: "Super Mario Bros.",
    thumbnail:
      "https://placehold.co/460x215/c1121f/ffffff?text=Super+Mario+Bros.",
  },
  {
    title: "Super Mario Odyssey",
    thumbnail:
      "https://placehold.co/460x215/e63946/fcf8f2?text=Super+Mario+Odyssey",
  },
  {
    title: "Super Mario World",
    thumbnail:
      "https://placehold.co/460x215/f4d35e/1a1a1a?text=Super+Mario+World",
  },
  {
    title: "Animal Crossing: New Horizons",
    thumbnail:
      "https://placehold.co/460x215/8fd694/16361f?text=Animal+Crossing",
  },
  {
    title: "Pokémon Scarlet",
    thumbnail:
      "https://placehold.co/460x215/cc3355/fcf8f2?text=Pok%C3%A9mon+Scarlet",
  },
  {
    title: "Final Fantasy VII",
    thumbnail:
      "https://placehold.co/460x215/2c1169/eadef9?text=Final+Fantasy+VII",
  },
  {
    title: "Final Fantasy XIV Online",
    thumbnail: steamHeader(39210),
  },
  { title: "Balatro", thumbnail: steamHeader(2379780) },
  {
    title: "Metal Gear Solid 2: Sons of Liberty",
    thumbnail:
      "https://placehold.co/460x215/2f4538/eefcf5?text=MGS2",
  },
  {
    title: "Metal Gear Solid",
    thumbnail:
      "https://placehold.co/460x215/2f4538/eefcf5?text=Metal+Gear+Solid",
  },
  {
    title: "Resident Evil 4",
    thumbnail: steamHeader(2050650),
  },
  {
    title: "Halo: Combat Evolved",
    thumbnail:
      "https://placehold.co/460x215/2f6e52/e9fff6?text=Halo+Combat+Evolved",
  },
  {
    title: "Halo Infinite",
    thumbnail: steamHeader(1240440),
  },
  {
    title: "Mass Effect 2",
    thumbnail: steamHeader(24980),
  },
  {
    title: "BioShock",
    thumbnail: steamHeader(7670),
  },
  {
    title: "BioShock Infinite",
    thumbnail: steamHeader(8870),
  },
  {
    title: "Metroid Prime",
    thumbnail:
      "https://placehold.co/460x215/0f2847/a8d8ff?text=Metroid+Prime",
  },
  {
    title: "Castlevania: Symphony of the Night",
    thumbnail:
      "https://placehold.co/460x215/140826/e9ddff?text=Castlevania+SOTN",
  },
  {
    title: "Chrono Trigger",
    thumbnail:
      "https://placehold.co/460x215/3c1363/f8edff?text=Chrono+Trigger",
  },
  {
    title: "EarthBound",
    thumbnail:
      "https://placehold.co/460x215/f9ed69/3c2218?text=EarthBound",
  },
  {
    title: "Sonic the Hedgehog 2",
    thumbnail:
      "https://placehold.co/460x215/224fbc/fcf8f2?text=Sonic+the+Hedgehog+2",
  },
  {
    title: "Street Fighter II",
    thumbnail:
      "https://placehold.co/460x215/f26430/fcf8f2?text=Street+Fighter+II",
  },
  {
    title: "Pac-Man",
    thumbnail:
      "https://placehold.co/460x215/241734/ffbb38?text=Pac-Man",
  },
  {
    title: "Tetris",
    thumbnail:
      "https://placehold.co/460x215/012c62/e8f4ff?text=Tetris",
  },
].sort((a, b) => a.title.localeCompare(b.title));
