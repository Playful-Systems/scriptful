import { scripts } from 'trouble-maker';


export default scripts({
  "build": "tsc",
  "dev": "tsc -w",
  "release": "bumpp"
})