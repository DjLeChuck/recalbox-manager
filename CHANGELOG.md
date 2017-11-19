# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [2.1.0] - 2017-11-19
### Added
- Access to the manager can be secured with a login / password (#49)

### Fixed
- z-index of sticky alerts (#59)
- Save on configuration page (#61)
- Close menu on link selection (#52)

## [2.0.2] - 2017-05-27
### Changed
- Only display available actions of ES buttons (restart and start or stop)
- Huge rewrite of all components to split them into Container & Presentational and simplify forms handling

## [2.0.1] - 2017-04-23
### Added
- Argentina (AR) translation
- Catalan (CA) translation
- Polish (PL) translation
- Portugese (PT) translation
- Russian (RU) translation
- Simplified Chinese (CN) translation
- Traditional Chinese (ZH) translation
- Ukranian (UK) translation

### Changed
- Update existing languages files

### Fixed
- Exit compile script on errors
- Add shim for Object.entries
- Fixed Travis config file

## [2.0.0] - 2017-03-19
### Added
- First "production ready" release of the manager. Included by default with
recalbox 4.1.

[Unreleased]: https://github.com/DjLeChuck/recalbox-manager/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/DjLeChuck/recalbox-manager/compare/v2.0.2...v2.1.0
[2.0.2]: https://github.com/DjLeChuck/recalbox-manager/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/DjLeChuck/recalbox-manager/compare/v2.0.0...v2.0.1
