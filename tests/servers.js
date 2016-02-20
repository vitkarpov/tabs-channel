const fs = require('fs');
const path = require('path');
const express = require('express');

[3000, 3001, 3002].forEach((port) => {
    const app = express();
    app.use(express.static(path.join(__dirname, 'pages')));
    app.listen(port);
});

console.log('servers run');
