const express = require('express');
const path = require('path');
const app = express();


app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.listen(process.env.PORT || 4000, function(){
    console.log('Running on 4000')
});