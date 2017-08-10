var request = require('request');
var fivebeans = require('fivebeans');
var client = new fivebeans.client('challenge.aftership.net', 11300);

module.exports = function()
{
    function EmitKeysHandler()
    {
        this.type = 'j_type';
    }

    function putBackIntoQueue(payload, delay){
        var flag = 0;
        var job = {
            type: 'j_type',
            payload: payload
        };
        client.on('connect', function(){
          client.use('prashantsiddharth', function(err, name){
            if(flag==0){
                client.put(0,delay,60, JSON.stringify(['prashantsiddharth', job]), function(err, jobid){
                  console.log(jobid);
                })
                flag = 1;
            }
          })
        }).on('error', function(err){
          console.log(err);
        }).on('close', function(){
          console.log('...Closing the tube...');
        })
        .connect();
    }
 
    EmitKeysHandler.prototype.work = function(payload, callback)
    {   console.log(payload);
        var theUrl = 'http://www.xe.com/currencyconverter/convert/?Amount=1&From='+payload.from+'&To='+payload.to;
        opts = {
            url : theUrl
        };
        request.get(opts, function (error, response, body) { 
            var s = JSON.stringify(body);
            var index1 = s.indexOf('1 '+payload.from+' = ');
            var index2 = (s.substr(index1+8)).indexOf(' ' + payload.to);
            var rate = s.substr(index1+8,index2);
            var ind = rate.indexOf('.');
            var rate_final = rate.substr(0,ind+3);
            var url = 'https://arcane-wave-87777.herokuapp.com/api/CurrencyRates';
            request.get({url:url+'?filter={%22where%22:{%22from%22:%22'+payload.from+'%22,%22to%22:%22'+payload.to+'%22}}'},function(error,response,body){
                var body = JSON.parse(body);
                if(body.length==0){
                    request.post({
                        url:url,
                        form:{ 
                            'from':payload.from,
                            'to' : payload.to,
                            'last_updated':Date.now(),
                            'rate':rate_final
                        }
                    }, function(error, response, body){
                       if((error==null || error==undefined) && (body.error==null || body.error==undefined)) {
                            console.log("Posted in mongodb with resonse : ",body);
                            //put into tube again with 60 seconds delay
                            putBackIntoQueue(payload,60);
                       }
                       else{
                           console.log("Failed currency conversion");
                           payload.failed = payload.failed + 1;
                           if(payload.failed < 3){
                              console.log("Will try again after 3 seconds");
                              putBackIntoQueue(payload,3);
                           }
                           else {
                              console.log("burrying the job as it got failed thrice");
                           }
                       }
                    });
                }
                else {
                    request.put({
                        url:url,
                        form:{
                            'from':body[0].from,
                            'to':body[0].to,
                            'last_updated':Date.now(),
                            'rate':rate_final,
                            'id':body[0].id
                        }
                    },function(error,response,body){
                       if((error==null || error==undefined) && (body.error==null || body.error==undefined)) {
                            console.log("Updated in mongodb with resonse : ",body);
                            //put into tube again with 60 seconds delay
                            putBackIntoQueue(payload,60);
                       }
                       else{
                           console.log("Failed currency conversion");
                           payload.failed = payload.failed + 1;
                           if(payload.failed < 3){
                              console.log("Will try again after 3 seconds");
                              //put into tube again with delay of 3 seconds
                              putBackIntoQueue(payload,3);
                           }
                           else {
                              console.log("burrying the job as it got failed thrice");
                           }
                       }
                    });
                }
            });
            
        });
        callback('success');
    }
 
    var handler = new EmitKeysHandler();
    return handler;
};