#!/usr/bin/env node

const fetch = require('node-fetch');

if (process.argv.length !== 3) {
  throw new Error(`Usage: ${process.argv[1]} «count»`);
}

const countString = process.argv[2];
const count = countString|0;
if (`${count}` !== countString) {
  throw new Error(`Unable to parse “${countString}” as number.`);
}

(async () => {
  for (let i = 0; i < count; i++) {
    const result = await fetch('https://www.drawnames.com/SEO/DoDemoDraw', {
      body: '',
      method: 'POST',
    });
    const o = await result.json();
    const draw = o.draw;
    if (!draw) {
      throw new Error(`Unexpected JSON format: `, o);
    }
    const encounteredKeys = new Set();
    let cycleCount = 0;
    for (let key of Object.keys(draw)) {
      if (encounteredKeys.has(key)) {
        continue;
      }
      cycleCount++;
      while (!encounteredKeys.has(key)) {
        if (!Object.hasOwnProperty.call(draw, key)) {
          throw new Error(`Unable to find key “${key}”`);
        }
        encounteredKeys.add(key);
        const nextKey = draw[key];
        const nextKeyType = typeof nextKey;
        if (nextKeyType !== 'string') {
          throw new Error(`Key “${key}” is type ${nextKeyType} when expecting string.`);
        }
        key = nextKey;
      }
    }
    if (cycleCount !== 1) {
      console.log(`Found cycle count of ${cycleCount}: `, draw);
    }
  }
})();
