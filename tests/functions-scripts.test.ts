import { test, expect } from "vitest"
import { setup } from "./setup"

test('the scripts root level function', async () => {
  const { runCli, cleanup } = await setup(`
    import { scripts, parallel, command } from 'scriptful'

    export default scripts({
      "dev": parallel([
        "echo tsc --watch",
        command({
          run: "echo nodemon ./dist/index.js",
          delay: 100, // give typescript a second to compile (100ms for tests though)
        })
      ]),
    })
  `)

  const { stdout } = await runCli("scriptful dev")

  expect(stdout).toContain("tsc --watch")
  expect(stdout).toContain("nodemon ./dist/index.js")

  await cleanup()

})