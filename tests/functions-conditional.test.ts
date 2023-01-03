import { test, expect } from "vitest"
import { setup } from "./setup"

test('conditional function (true)', async () => {
  const { runCli, cleanup } = await setup(`
    import { conditional, scripts } from 'scriptful'

    export default scripts({
      "dev": conditional({
        run: "echo only run in development",
        condition: true,
      })
    })
  `)

  const { stdout } = await runCli("scriptful dev")

  expect(stdout).toContain("only run in development")

  await cleanup()

})

test('conditional function (false)', async () => {
  const { runCli, cleanup } = await setup(`
    import { conditional, scripts } from 'scriptful'

    export default scripts({
      "dev": conditional({
        run: "echo only run in development",
        condition: false,
      })
    })
  `)

  const { stdout } = await runCli("scriptful dev")

  expect(stdout).not.toContain("only run in development")

  await cleanup()

})