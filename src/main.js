import { Letter } from './letter.js'

const letter = new Letter()

letter.get().then(response => console.log(JSON.stringify(response, null, 4)))
