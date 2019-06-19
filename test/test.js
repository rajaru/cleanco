const clean = require('../index');
const fs = require('fs');
const path = require('path');

var companies = fs.readFileSync('./companies.csv', 'utf8').split('\n').map(x=>x.split(';'));
console.log('verifying ', companies.length, 'entries')
var start = (new Date()).getTime();
for(var i=0; i<1; i++)
    for(var comp of companies ){
        var clean2 = clean.clean2(comp[0], true, true, false, true);
        var cleaned  = clean.clean(comp[0]);
        if( cleaned != clean2 )
            console.log(comp[0], '::', clean2, '=>', cleaned);
    }
console.log('done: ', (new Date()).getTime()-start, 'ms')