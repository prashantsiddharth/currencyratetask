var fivebeans = require('fivebeans');
var client = new fivebeans.client('challenge.aftership.net', 11300);

module.exports = function(){
    function submitJobs(from, to, failed, callback) {
      console.log("going to submit job",from,to,failed);
        var job = {
          type: 'j_type',
          payload: {
            from: from,
            to: to,
            failed: failed
          }
        };
        console.log(callback);
        client.on('connect', function(){
          client.use('prashantsiddharth', function(err, name){
            client.put(0,0,60, JSON.stringify(['prashantsiddharth', job]), function(err, jobid){
              console.log(jobid);
              callback(null);
            })
          })
        }).on('error', function(err){
          console.log(err);
          callback(err,null);
        })
        .on('close', function(){
          console.log('...Closing the tube...');
        })
        .connect();
    }
    submitJobs();
    // return submitJobs;
};