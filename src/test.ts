import { getAppPath, getSteamPath } from ".";

(async () => {
  console.log(await getSteamPath());
  console.log(await getAppPath(291550)); // Brawlhalla
})();
