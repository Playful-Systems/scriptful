import { test, expect } from "vitest"
import { setup } from "./setup"

test('shorthand string command', async () => {
  const { runCli, cleanup } = await setup(`
    import { scripts } from 'scriptful'

    export default scripts({
      "dev": "echo very simple, clean and easy",
    })
  `)

  const { stdout } = await runCli("scriptful dev")

  expect(stdout).toContain("very simple, clean and easy")

  await cleanup()

})

test('shorthand function command', async () => {
  const { runCli, cleanup } = await setup(`
    import { scripts } from 'scriptful'

    export default scripts({
      "dev": () => console.log("echo very simple, clean and easy"),
    })
  `)

  const { stdout } = await runCli("scriptful dev")

  expect(stdout).toContain("very simple, clean and easy")

  await cleanup()

})

test('full command using function', async () => {
  const { runCli, cleanup, writeFile } = await setup(`
    import { scripts, command } from 'scriptful'

    export default scripts({
      "dev": command({
        run: () => console.log(\`echo very simple, clean and easy \${process.env.PORT} \${process.env.DATABASE_URL}\`),
        env: {
          PORT: "5000",
        },
        envFile: ".env",
        delay: 100,
      }),
    })
  `)

  await writeFile(".env", "DATABASE_URL=postgres://localhost:5432/mydb")

  const { stdout } = await runCli("scriptful dev")

  expect(stdout).toContain("very simple, clean and easy 5000 postgres://localhost:5432/mydb")

  await cleanup()

})