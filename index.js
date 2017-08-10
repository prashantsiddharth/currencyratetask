var fivebeans = require('fivebeans');
const readline = require('readline');

var client = new fivebeans.client('challenge.aftership.net', 11300);

function submitJob(from,to,failed){
  var job = {
    type : 'j_type',
    payload: {
      from: from,
      to: to,
      failed: failed
    }
  };

  client.on('connect', function(){
    client.use('prashantsiddharth', function(err, name){
      client.put(0,0,60, JSON.stringify(['prashantsiddharth', job]), function(err, jobid){
        console.log(jobid);
      })
    })
  }).on('error', function(err){
    console.log(err);
  })
  .on('close', function(){
    console.log('...Closing the tube...');
  })
  .connect();
}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var fromCurrency = '';
var toCurrency = '';
rl.question('Enter a valid from ', (fromCurrency) => {
  rl.question('Enter a valid to ', (toCurrency) => {
    submitJob(fromCurrency,toCurrency,0);
    rl.close();
  }); 
});



// submitJob('USD','XOF',0);
// submitJob('EUR','INR',0);
// submitJob('INR','EUR',0);
// submitJob('USD','EUR',0);
// submitJob('AUD','GBP',0);
// submitJob('AUD','INR',0);
// submitJob('INR','GBP',0);
// submitJob('GBP','USD',0);
// submitJob('USD','GBP',0);

