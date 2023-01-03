import { test, expect } from "vitest"
import { setup } from "./setup"

test('a boring scripts with only one script', async () => {
  const { runCli, cleanup } = await setup(`
    import { scripts } from 'scriptful'

    export default scripts({
      "dev": "echo starting development environment",
    })
  `)

  const { stdout } = await runCli("scriptful dev")

  expect(stdout).toContain("starting development environment")

  await cleanup()

})