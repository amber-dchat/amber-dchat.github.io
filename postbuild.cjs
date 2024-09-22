const { writeFileSync, readFileSync } = require('fs');

writeFileSync('./dist/404.html', readFileSync('./dist/index.html'));
