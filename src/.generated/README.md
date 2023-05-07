Built versions of this directory's files will be overwritten on `npx prisma generate` run.
It is so only available in source environnement where it aims to mimic the generated contents folder (`.generated/`).

This allows:

- developing parts of the lib that rely on dynamically generated contents without leading to TS throwing errors,
- running tests on source files directly.

_Example_: Accessing dynamically generated models specifications:

```ts
import { modelsSpecs } from "../.generated";
```

### Usage

Run `pnpm build` and `npx prisma generate` to make generated contents available from sources
