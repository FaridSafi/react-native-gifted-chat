## [Unreleased]

## [8.0.0] - 2018-04-09
### Added
- Add code frame showing the error location to JSON parsing errors.
- Add `code` property to `JsonError`.

### Changed
- Not specifying a default value for read operations now results in file reading and JSON parsing errors to be thrown instead of resulting in an empty object to be returned.
- Syntax errors are no longer wrapped inside a file read error.

## [7.0.0] - 2018-03-28
### Removed
- Remove deprecated method `updateAsync`: use `setAsync` instead.
- Remove lock file mechanism.
