#!/usr/bin/env node
import('../dist/index.js').then(({ default: main }) => {
  main();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
