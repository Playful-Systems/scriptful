# Scriptful
Create better package.json scripts

## Why?
I love the simplicity of package.json scripts, they are easy to understand and easy to use. But they are limited, they can only run one command at a time, and they can't be reused. This is where Scriptful comes in, it allows you to write your scripts in typescript, and gives you the ability to run multiple commands at once, and reuse them. It also gives you the ability to run scripts in parallel or sequentially, and even conditionally. 

## Setup

### Install the package with one of these
```zsh
npm i -D scriptful
```
```zsh
yarn add -D scriptful
```
```zsh
pnpm add -D scriptful
```
```zsh
bun add -d scriptful
```

### create a `scripts.ts` file in the root of your project
```ts
import { scripts } from 'scriptful'

export default scripts({
  // your scripts here
})
```

## Usage

### Define a standard script
Yes I know this is boring but we got to start somewhere
```ts
import { scripts } from 'scriptful'

export default scripts({
  "dev": "next dev",
})
```
Here we just define that calling `scriptful start` will run `next dev`

### Define a script with arguments
```ts
import { scripts, command } from 'scriptful'

export default scripts({
  "start": command({
    run: "next dev",
    env: {
      PORT: "5000",
    },
  }, "Runs the Next.js development server"),
})
```
Using the `command` function we get a couple more options, check out the reference below to see what else you can do. Notice the second argument is a description, this will be used in the help menu (`scriptful --help`).

### Something a little wild
Now lets imagine a build and deployment process, we want to build the database schema, migrate the database, build the website, run the linting and the tests, and lastly deploy it. This can all be done with one command, and your a wizard at your shell and don't want another dependency. But what about everyone else on your team, are they going to understand the `&&` and `;` and how they work? No, they are not. So lets make a script for them.
```ts
import { scripts, parallel, sequential, variants, command } from 'scriptful'

export default scripts({
  "build": variants({
    "prod": sequential([
      "prisma generate",
      "next build",
      parallel([
        "next lint",
        "next test",
      ]),
      parallel([
        command({
          run: "prisma migrate deploy",
          envFile: ".env.production",
        }),
        "firebase deploy",
      ])
    ], "Build, Test and Deploy the website"),
  })
})
```
Now with a simple `yarn scriptful build:prod` we kick the whole process off.

## Functions

### Scripts
This is your root level function, default export this for the cli to find it. In here you pass an object of key value pairs, where the key is the name of the script and the value is the script itself.

```ts
import { scripts, parallel, command } from 'scriptful'

export default scripts({
  "dev": parallel([
    "tsc --watch",
    command({
      run: "nodemon ./dist/index.js",
      delay: 1000, // give typescript a second to compile
    })
  ]),
})
```

### Command
This is the your atom if you will, the lowest level we can go. With two options of defining, a shorthand version for simplicity and a full version with all the bells and whistles. The shorthand version is just a string, function or async function. This will be run as is, with no extra options. The full version is an object with the following options.

```ts
type CommandOptions = {
  run: BaseAction // pass in your command as a string, function or async function
  env?: Record<string, string> // environment variables to set
  envFile?: string // tell it to read in an environment file
  delay?: number // delay in ms before running
  cwd?: string // the directory to run the command in
  hideLogs?: boolean // hide or show the logs
}
```

#### Shorthand string command
```ts
import { scripts } from 'scriptful'

export default scripts({
  "dev": "echo very simple, clean and easy",
})
```

#### Shorthand function command
```ts
import { scripts } from 'scriptful'

const myCommand = async () => {
  // - start a server
  // - open a database connection
  // - read from the file system
  // - fetch from an api
  // its a free world, whatever you feel like doing is free game
}

export default scripts({
  "dev": myCommand,
})
```

#### Full command
```ts
import { scripts, command } from 'scriptful'

export default scripts({
  "dev": command({
    run: "echo many more options",
    env: {
      PORT: "5000",
    },
    envFile: ".env",
    delay: 1000,
    cwd: "./frontend",
    hideLogs: false,
  }, "Runs the Node.js development server"),
})
```

#### Full command using function
```ts
import { scripts, command } from 'scriptful'

export default scripts({
  "fetch": command({
    run: async () => {
      const response = await fetch("https://example.com")
      const data = await response.json()
      console.log(data)
    },
    env: {
      PORT: "5000",
    },
    envFile: ".env",
    delay: 1000,
    cwd: "./frontend",
    hideLogs: false,
  }, "Runs the Node.js development server"),
})
```

### Conditional
Since we are in the land of code, we get the fun ability to make decisions. This is done with the `conditional` function. It takes two arguments, the first is a boolean, the second is a command. If the boolean is true, the command will run, if false it will not.

```ts
import { conditional, scripts } from 'scriptful'

export default scripts({
  "dev": conditional({
    run: "echo only run in development",
    condition: process.env.NODE_ENV === "development",
  })
})
```

### Lifecycle
Sometimes we need to do something over the lifecycle of say a development environment, we need to setup something, and tear down something afterwards. For example a database. The Lifecycle command lets you do just that.

```ts
import { command, lifecycle, scripts, sequential } from 'scriptful'

export default scripts({
  "dev": lifecycle({
    start: sequential([
      "supabase start",
      command({
        run: "prisma db push",
        envFile: ".env.development"
      })
    ]),
    run: "next dev -H 0.0.0.0",
    stop: "supabase stop"
  }, "Start up the local development environment"),
})
```

Note: stop gets run under two conditions, when the process is killed, and when the `run` process is finished.

### Optional
when building a long sequential flow, some steps you might not want to run all the time. For example, if you are deploying to firebase, you might not want to run the tests. The optional command lets you do just that. The user will be asked yes or no if they want to run the command. If they say yes, it will run, if no, it will skip.

```ts
import { command, optional, scripts, sequential } from 'scriptful'

export default scripts({
  "deploy": sequential([
    "next build",
    optional("next lint", "Lint the codebase"),
    optional("next test", "Run the unit tests"),
    command({
      run: "firebase deploy",
      envFile: ".env.production",
    })
  ], "Build, Test and Deploy the website"),
})
```

It is highly recommended you define a description for the optional command, otherwise the user will have no idea what the command is. The description is the second argument.

### Parallel
Sometimes we want to run multiple commands at the same time. This is where the parallel command comes in. It takes an array of commands and runs them all at the same time.

```ts
import { parallel, scripts } from 'scriptful'

export default scripts({
  "dev": parallel([
    "docker-compose up",
    "nodemon -e graphql --exec graphql-codegen",
    "tsc --noEmit --watch",
    "next dev"
  ]),
})
```

### Repeat
If you want to run a function multiple times in a row, here you go.

```ts
import { repeat, scripts } from 'scriptful'

export default scripts({
  "dev": repeat({ run: "echo hello", times: 5 }),
})
```

### Sequential
To run multiple commands in a row, use the sequential command. It takes an array of commands and runs them in order.

```ts
import { scripts, sequential } from 'scriptful'

export default scripts({
  "build": sequential([
    "docker-compose up -d",
    "graphql-codegen",
    "tsc --noEmit",
    "next build"
  ]),
})
```


### Variants
say you want a "build:debug", "build:local" and "build:prod", use variants function to create them. It takes an object with the variants as keys and the commands as values.

```ts
import { lifecycle, optional, scripts, sequential, variants } from 'scriptful'

export default scripts({
  "build": variants({
    "debug": sequential([
      "tsc --noEmit",
      "vitest",
      "next dev"
    ]),
    "local": lifecycle({
      start: sequential([
        "docker-compose up -d",
        "prisma generate",
        "prisma db push",
      ]),
      run: sequential([
        "next build",
        "next start"
      ]),
      stop: "docker-compose down"
    }),
    "prod": sequential([
      "prisma generate",
      "prisma migrate deploy",
      "next build",
      "next-sitemap",
      optional("firebase deploy")
    ]),
  }),
})
```