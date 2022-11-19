import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { parse } from "@node-steam/vdf";

import lib from "./util";

export type LibraryFolders = {
  libraryfolders: {
    [key: string]: {
      path: string;
      label: string;
      contentid: number;
      totalsize: number;
      update_clean_bytes_tally: number;
      time_last_update_corruption: number;
      apps: {
        [appid: string]: string;
      };
    };
  };
};

export type AppManifest = {
  library_path: string;
  AppState: {
    appid: number;
    Universe: number;
    name: string;
    StateFlags: number;
    installdir: string;
    LastUpdated: number;
    SizeOnDisk: number;
    StagingSize: number;
    buildid: number;
    LastOwner: number;
    UpdateResult: number;
    BytesToDownload: number;
    BytesDownloaded: number;
    BytesToStage: number;
    BytesStaged: number;
    TargetBuildID: number;
    AutoUpdateBehavior: number;
    AllowOtherDownloadsWhileRunning: number;
    ScheduledAutoUpdate: number;
    InstalledDepots: {
      [depot: string]: {
        manifest: number;
        size: number;
      };
    };
    InstallScripts: {
      [appid: string]: string;
    };
    UserConfig: { language: string };
    MountedConfig: { language: string };
  };
};

export type SteamPath = {
  path: string;
  libs: string[];
};

export type GamePath = {
  name: string;
  path: string;
};

/**
 * Parse libraryfolders.vdf and return contents.
 * If steamPath isn't provided it will attempt to find it.
 *
 * @param { string } [steamPath] *Optional* Steam installation path.
 * @return { Promise<LibraryFolders> } JSON object promise
 */
export async function getLibraryFolders(
  steamPath?: string
): Promise<LibraryFolders> {
  if (!steamPath) steamPath = await lib.getSteamPath();

  const steamApps = join(steamPath, "steamapps");
  const libraryfoldersPath = join(steamApps, "libraryfolders.vdf");

  if (!existsSync(libraryfoldersPath))
    throw new Error("Unable to find libraryfolders.vdf");

  const libfolders: LibraryFolders = parse(
    readFileSync(libraryfoldersPath, {
      encoding: "utf-8",
    })
  );

  if (!libfolders) throw new Error("Unable to parsse libraryfolders.vdf");

  return libfolders;
}

/**
 * Get Steam's installation path as well as any game library paths.
 *
 * @return { Promise<SteamPath> } Steam path and library paths promise
 */
export async function getSteamPath(): Promise<SteamPath> {
  const steamPath = await lib.getSteamPath();

  const libfolders = await getLibraryFolders(steamPath);

  const libs = Object.entries(libfolders.libraryfolders).map(
    ([_, { path }]) => path
  );

  return {
    path: steamPath,
    libs,
  };
}

/**
 * Get an app's manifest file.
 *
 * @param { number } appId game's appid
 * @return { Promise<AppManifest> } game's manifest data promise
 */
export async function getAppManifest(appId: number): Promise<AppManifest> {
  const libfolders = (await getLibraryFolders()).libraryfolders;

  const gameLib = Object.entries(libfolders)
    .filter(([_, { apps }]) => !!apps[appId])
    .map(([_, { path }]) => join(path, "steamapps"));

  const manifests = gameLib
    .map((path) => {
      const manifestPath = join(path, `appmanifest_${appId}.acf`);
      if (!existsSync(manifestPath)) return false;

      const manifest: AppManifest = parse(
        readFileSync(manifestPath, {
          encoding: "utf-8",
        })
      );

      if (!manifest) return false;

      manifest.library_path = path;
      return manifest;
    })
    .filter((v) => !!v) as AppManifest[];

  if (!manifests.length) throw new Error("Unable to find or parse appmanifest");

  // Typescript is unable to see that pop cannot return undefined here.
  return manifests.pop() as AppManifest;
}

/**
 * Get a Steam game's path from app id.
 *
 * @param { number } appId game's appid
 * @returns { Promise<GamePath> } game path promise
 */
export async function getAppPath(appId: number): Promise<GamePath> {
  const manifest = await getAppManifest(appId);

  return {
    name: manifest.AppState.name,
    path: join(manifest.library_path, "common", manifest.AppState.installdir),
  };
}
