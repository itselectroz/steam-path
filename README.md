# steam-path
[![Version](https://img.shields.io/npm/v/steam-path.svg?style=flat-square)](https://www.npmjs.com/package/steam-path)
[![Downloads](https://img.shields.io/npm/dt/steam-path.svg?style=flat-square)](https://www.npmjs.com/package/steam-path)
[![License](https://img.shields.io/github/license/steam-path.svg?style=flat-square)](https://www.npmjs.com/package/steam-path)

**steam-path** is a module for locating the installation path of Steam and Steam apps.

## Installation

You can install **steam-path** through the command line using `npm` or `yarn`.

```console
npm install steam-path
```

## Usage

```javascript
import {
  getAppPath,
  getSteamPath,
  getLibraryFolders,
  getAppManifest,
} from "steam-path";

// or

import * as SteamPath from "steam-path";
```

## Documentation

### `SteamPath.getAppPath(appId: number): Promise<AppPath>`

> Get a Steam app's path from app id

```javascript
const BRAWLHALLA_APPID = 291550;

const path = await SteamPath.getAppPath(BRAWLHALLA_APPID);

> {
  name: "Brawlhalla",
  path: "/Users/<user>/Library/Application Support/Steam/steamapps/common/Brawlhalla"
};
```

### `SteamPath.getSteamPath(): Promise<SteamPath>`

> Get Steam's installation path as well as any app library paths

```javascript
const path = await SteamPath.getSteamPath();

> {
  path: "/Users/<user>/Library/Application Support/Steam/",
  libs: [
    "/Users/<user>/Library/Application Support/Steam/steamapps/",
    "/Volumes/Drive01/SteamLibrary/"
  ]
};
```

### `getLibraryFolders(steamPath?: string): Promise<LibraryFolders>`

> Parse libraryfolders.vdf and return contents.
> If steamPath isn't provided it will attempt to find it.

```javascript
const libary = await SteamPath.getLibraryFolders();

> {
  libraryfolders: {
    '0': {
      path: '<path>/Steam',
      label: '',
      contentid: 0123456789123456789,
      totalsize: 0,
      update_clean_bytes_tally: 01234567891,
      time_last_update_corruption: 0,
      apps: {
        "291550": "897667634"
      }
    },
    '1': {
      path: '/Volumes/Drive01/SteamLibrary',
      label: '',
      contentid: 0123456789123456789,
      totalsize: 0,
      update_clean_bytes_tally: 01234567891,
      time_last_update_corruption: 0,
      apps: {
        "570": "47537797371"
      }
    },
  }
}
```

### `getAppManifest(appId: number): Promise<AppManifest>`

> Get an app's manifest file.

```javascript
const TROVE_APPID = 304050;

const manifest = await SteamPath.getAppManifest(TROVE_APPID);

> {
  AppState: {
    appid: 304050,
    Universe: 1,
    name: 'Trove',
    StateFlags: 4,
    installdir: 'Trove',
    LastUpdated: 1654701681,
    SizeOnDisk: 1621558789,
    StagingSize: 0,
    buildid: 8642809,
    LastOwner: 123456789,
    UpdateResult: 2,
    BytesToDownload: 934495216,
    BytesDownloaded: 934495216,
    BytesToStage: 1621558789,
    BytesStaged: 1621558789,
    TargetBuildID: 8642809,
    AutoUpdateBehavior: 0,
    AllowOtherDownloadsWhileRunning: 0,
    ScheduledAutoUpdate: 0,
    InstalledDepots: {
      '304052': { manifest: 8702402695142410000, size: 1505721654 },
      '845241': { manifest: 3390199620801870300, size: 115837135 }
    },
    InstallScripts: { '304052': 'installscript.vdf' },
    UserConfig: { language: 'english' },
    MountedConfig: { language: 'english' }
  },
  library_path: '/<path>/Steam/steamapps'
}
```

## Contributing

Interested in contributing to **steam-path**?

Contributions are welcome, and are accepted via pull requests. Please [review these guidelines](contributing.md) before submitting any pull requests.

### Help

**Installing dependencies:**

```console
npm install
```

**Compile:**

```console
npm run build
```

## Tests

Due to its nature this project does not have any automated testing.

Any scripts used to user test functionality can be found in `src/test.ts`.

## License

All code in this repository is licensed under [MIT](LICENSE).
