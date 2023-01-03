import { test, expect } from "vitest"
import { setup } from "./setup"

test('script with command arguements', async () => {
  const { runCli, cleanup } = await setup(`
    import { scripts, command } from 'scriptful'

    export default scripts({
      "start": command({
        run: "echo running the app on port $PORT",
        env: {
          PORT: "5000",
        },
      }, "Runs the Next.js development server"),
    })
  `)

  const runningStart = await runCli("scriptful start")

  expect(runningStart.stdout).toContain("running the app on port 5000")

  const runningHelp = await runCli("scriptful --help")

  expect(runningHelp.stdout).toContain("Runs the Next.js development server")

  await cleanup()

})