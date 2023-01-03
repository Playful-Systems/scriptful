import { test, expect } from "vitest"
import { setup } from "./setup"

test('script with command arguements', async () => {
  const { runCli, cleanup, writeFile } = await setup(`
    import { scripts, parallel, sequential, variants, command } from 'scriptful'

    export default scripts({
      "build": variants({
        "prod": sequential([
          "echo prisma generate",
          "echo next build",
          parallel([
            "echo next lint",
            "echo next test",
          ]),
          parallel([
            command({
              run: "echo prisma migrate deploy $DATABASE_URL",
              envFile: ".env.production",
            }),
            "echo firebase deploy",
          ])
        ], "Build, Test and Deploy the website"),
      })
    })
  `)

  writeFile(".env.production", "DATABASE_URL=postgres://localhost:5432/mydb")

  const runningProd = await runCli("scriptful build:prod")

  expect(runningProd.stdout).toContain("prisma generate")
  expect(runningProd.stdout).toContain("next build")
  expect(runningProd.stdout).toContain("next lint")
  expect(runningProd.stdout).toContain("next test")
  expect(runningProd.stdout).toContain("prisma migrate deploy postgres://localhost:5432/mydb")
  expect(runningProd.stdout).toContain("firebase deploy")

  console.log(runningProd)

  const runningHelp = await runCli("scriptful --help")

  expect(runningHelp.stdout).toContain("Build, Test and Deploy the website")

  console.log(runningHelp)

  const runningGenerate = await runCli("scriptful --generate")

  expect(runningGenerate.stdout).toContain(`"build:prod": "scriptful build:prod"`)

  console.log(runningGenerate)


  await cleanup()

})