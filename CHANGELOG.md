## Changelog
### v0.5.0
This is an emergency release that adapts react-tiles to the modern times in a very harsh way. We should think about a good refactoring if the project grasp some attention from developers.

* Makes it work with react 16 ( no more mixins and old stuff from react 13 :D )
* Don't use context anymore, but data attributes in parent elements. Support for new react context api must wait.
* Refactors the way the builder work.

### v0.4.1 Fixes queries sometimes not being appended to the tile layout.
### v0.4.0 Refactored the queryBuilder and the urlParser. Adds test structure.
### v0.3.5 Links can now be used outside a tile.
### v0.3.4 Normalized TileLink and QueryBuilder parameters to be the same.
### v0.3.1 Links can now handle routes with a fragment gently.
