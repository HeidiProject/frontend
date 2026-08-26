# Frontend testing

Use Node 18 to match the frontend Docker image. On the current development
machine the Homebrew installation is keg-only, so prefix commands with its
binary directory:

```bash
PATH=/opt/homebrew/opt/node@18/bin:$PATH npm ci
PATH=/opt/homebrew/opt/node@18/bin:$PATH npm run test:unit -- --run
PATH=/opt/homebrew/opt/node@18/bin:$PATH npm run build
```

`node_modules` is installed in this repository and is ignored by Git.

The unit tests mock HTTP requests. They must not connect to HEIDI, MXDB, FFCS
or MongoDB Atlas. `heidi-test` shares production data and is not an
automated-test target.
