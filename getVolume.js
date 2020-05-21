console.log('https://github.com/hobbyquaker/lgtv2');
console.log('https://github.com/ecgouvea/awesome-smart-tv');

//-----------------------------------------------------------------------------
// Declarations
//-----------------------------------------------------------------------------
var express = require('express');
var lgtv = require("lgtv2")({
    url: 'ws://192.168.0.10:3000'
});

//-----------------------------------------------------------------------------
// LG TV
//-----------------------------------------------------------------------------
lgtv.on('error', function (err) {
    console.log(err);
});

lgtv.on('connect', function () {
    console.log('connected');
    
    lgtv.subscribe('ssap://audio/getVolume', function (err, res) {
        if (res.changed.indexOf('volume') !== -1) console.log('volume changed', res.volume);
        if (res.changed.indexOf('muted') !== -1) console.log('mute changed', res.muted);
        
        displayMessage('Dudu, o volume passou para nível ' + res.volume);
    });
    
    displayMessage('Hello, Dudu!');
    console.log('message send');
});

function displayMessage(msg) {
    lgtv.request('ssap://system.notifications/createToast', {message: msg});
}

//-----------------------------------------------------------------------------
// Express
//-----------------------------------------------------------------------------
const app = express();
const PORT = 5000;

app.get('/',(req,res)=>{
    res.send({message: 'Welcome to the backend'})
 })
 
app.get('/volumeUp',(req,res)=>{
    lgtv.request('ssap://audio/volumeUp', (arg1) => {
        console.log('this: ' + arg1);
    });
    res.send({message: 'volumeUp'})
})
 
app.get('/volumeDown',(req,res)=>{
    lgtv.request('ssap://audio/volumeDown', (arg1) => {
        console.log('this: ' + arg1);
    });
    res.send({message: 'volumeDown'})
})

app.get('/send', (req,res)=>{
    displayMessage(req.query.msg);
    res.send(req.query.msg);
})

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));

console.log('end');
