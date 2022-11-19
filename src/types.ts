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
