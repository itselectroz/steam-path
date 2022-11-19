# steam-path

**steam-path** is a module for locating the installation path of Steam and Steam games.

This module is still a WIP:

- [ ] MacOS
  - [x] getSteamPath
  - [ ] getGamePath
- [ ] Windows
  - [ ] getSteamPath
  - [ ] getGamePath
- [ ] Linux
  - [ ] getSteamPath
  - [ ] getGamePath

## Installation

You can install **steam-path** through the command line using `npm` or `yarn`.

```console
npm install steam-path
```

## Usage

```javascript
import { getGamePath, getSteamPath } from "steam-path";

// or

import * as SteamPath from "steam-path";
```

## Documentation

### `SteamPath.getGamePath(appId: number): GamePath`

> Get a Steam game's path from app id

```javascript
const BRAWLHALLA_APPID = 291550;

const path = SteamPath.getGamePath(BRAWLHALLA_APPID);

> {
  name: "Brawlhalla",
  path: "/Users/<user>/Library/Application Support/Steam/steamapps/common/Brawlhalla"
};
```

### `SteamPath.getSteamPath(): SteamPath`

> Get Steam's installation path as well as any game library paths

```javascript
const path = SteamPath.getSteamPath();

> {
  path: "/Users/<user>/Library/Application Support/Steam/",
  libs: [
    "/Users/<user>/Library/Application Support/Steam/steamapps/",
    "/Volumes/Drive01/SteamLibrary/"
  ]
};
```

### `getLibraryFolders(steamPath?: string): LibraryFolders`

> Parse libraryfolders.vdf and return contents.
> If steamPath isn't provided it will attempt to find it.

```javascript
const libary = SteamPath.getLibraryFolders();

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
