## [1.8.0](https://github.com/LilaRest/prismary/compare/v1.7.1...v1.8.0) (2023-05-15)


### Features

* **client:** create minimal client prototype ([2295036](https://github.com/LilaRest/prismary/commit/22950360747700425efc276526f4e3b9d6b71fbd))
* **query:** write a mockup of the Query class based on previous works made in validator.ts ([e120825](https://github.com/LilaRest/prismary/commit/e120825dac30a5773c46537a1e45ebdf11980468))


### Others

* move client, model and query classes into their own files ([4ed5f57](https://github.com/LilaRest/prismary/commit/4ed5f57a0882a0d632158cde0e118bb9036d1ea0))

## [1.7.1](https://github.com/LilaRest/prismary/compare/v1.7.0...v1.7.1) (2023-05-14)


### Others

* **semantic-release:** install missing "conventional-changelog-conventionalcommits" package ([f16e2df](https://github.com/LilaRest/prismary/commit/f16e2df0d8e4a894156652ba67815aadcb758cea))


### Fixes

* fake fix ([f2e0e48](https://github.com/LilaRest/prismary/commit/f2e0e4837448dad703f3f4d915495d7ee3511403))

# [1.7.0](https://github.com/LilaRest/prismary/compare/v1.6.1...v1.7.0) (2023-05-14)


### Features

* add support for configuration file ([6e4a993](https://github.com/LilaRest/prismary/commit/6e4a99303cc2d8fff64aaa5dca49d018f0c3cf98))

## [1.6.1](https://github.com/LilaRest/prismary/compare/v1.6.0...v1.6.1) (2023-05-07)


### Bug Fixes

* generated placeholder files not properly deleted + fake index.ts raising TS overwrite error ([4834886](https://github.com/LilaRest/prismary/commit/48348863440fdc1dc9825b33f4626b437e4a2d9f))

# [1.6.0](https://github.com/LilaRest/prismary/compare/v1.5.0...v1.6.0) (2023-05-07)


### Bug Fixes

* fix unwanted .ts extension on client index file exports ([6967285](https://github.com/LilaRest/prismary/commit/696728520ea1ee09b4d5a764214284f577ac53af))


### Features

* a ton of updates about generated contents (zwc compiling, fake .generated folder, ...) ([113bfc8](https://github.com/LilaRest/prismary/commit/113bfc8952cde778eea3138f1ade3784be220ceb))
* generate client under node_modules/@prisma/client by default + update deps ([41b606a](https://github.com/LilaRest/prismary/commit/41b606ad39f598fdee4e99f3f457efa6b78dcb05))


### Performance Improvements

* improve client generation by 10x (2s to 200ms) ([62bc318](https://github.com/LilaRest/prismary/commit/62bc3181f1c258ede7e8e883830895ee626818a6))

# [1.5.0](https://github.com/LilaRest/prismary/compare/v1.4.0...v1.5.0) (2023-05-06)


### Features

* add models specs generator + refactor each generator in its own file ([58e9863](https://github.com/LilaRest/prismary/commit/58e9863273ee8df342366002c886d93ddd23dc12))
* entirely rewrite select/include clauses merging function + setup a minimal Prisma schema ([c5d42c2](https://github.com/LilaRest/prismary/commit/c5d42c2a92f5b6f140dd08927e6ac31893cfe331))

# [1.4.0](https://github.com/LilaRest/prismary/compare/v1.3.0...v1.4.0) (2023-05-04)


### Features

* improved version of mergeSelectOrIncludeClauses() + start writing tests for it ([40fcfd4](https://github.com/LilaRest/prismary/commit/40fcfd44cc45a2f79999b37b643c72a33a9c65b6))
* release first version of mergeSelectOrIncludeClauses function ([c395845](https://github.com/LilaRest/prismary/commit/c3958454d19be501d78ffa8ce532644454051b76))

# [1.3.0](https://github.com/LilaRest/prismary/compare/v1.2.0...v1.3.0) (2023-05-04)


### Features

* step commit, the new validator design is prototyped ([2358e83](https://github.com/LilaRest/prismary/commit/2358e83d2412802d73a25e3293a8001c726f95fe))

# [1.2.0](https://github.com/LilaRest/prismary/compare/v1.1.0...v1.2.0) (2023-04-26)


### Features

* start implementing file-based configs ([6d55201](https://github.com/LilaRest/prismary/commit/6d55201994cde9141da740fd41f34b7d551a133d))

# [1.1.0](https://github.com/LilaRest/prismary/compare/v1.0.0...v1.1.0) (2023-04-26)


### Features

* fake change to release new version ([cf53eda](https://github.com/LilaRest/prismary/commit/cf53eda2f1e3122f584eb2d97391ba56fd73e45a))

# 1.0.0 (2023-04-26)


### Features

* fix outdated lock file + release new version ([6193a20](https://github.com/LilaRest/prismary/commit/6193a207f118c3e0d6c51589d9a1aa4bf54c3faa))
* initial commit (Zod schema generation + partial tRPC procedure generation) ([db7be30](https://github.com/LilaRest/prismary/commit/db7be3099b784f6987cf3ce14de249541a744c18))
