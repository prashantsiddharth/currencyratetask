var fivebeans = require('fivebeans');

var client = new fivebeans.client('challenge.aftership.net', 11300);

var job1 = {
  type: 'j_type',
  payload: {
    from: 'HKD',
    to: 'USD'
  }
};

client
  .on('connect', function(){
    client.use('my_tube', function(err, name){
      client.put(0,0,60, JSON.stringify(['my_tube', job1]), function(err, jobid){
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