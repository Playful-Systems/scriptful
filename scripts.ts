import { scripts } from './src/index';


export default scripts({
  "build": "tsc",
  "dev": "tsc -w",
  "release": "bumpp"
})