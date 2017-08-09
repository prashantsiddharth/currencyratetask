var request = require('request');
module.exports = function()
{
    function EmitKeysHandler()
    {
        this.type = 'j_type';
    }
 
    EmitKeysHandler.prototype.work = function(payload, callback)
    {
        console.log(payload);
        var theUrl = 'http://www.xe.com/currencyconverter/convert/?Amount=1&From='+payload.from+'&To='+payload.to;
        opts = {
            url : theUrl
        };
        request.get(opts, function (error, response, body) {
            var s = JSON.stringify(body);
            var index1 = s.indexOf('1 '+payload.from+' = ');
            var index2 = (s.substr(index1)).indexOf(' ' + payload.to);
            var rate = s.substr(index1+8,index2-8);
            var ind = rate.indexOf('.');
            var rate_final = rate.substr(0,ind+3);
            request.post({
                url:'https://arcane-wave-87777.herokuapp.com/api/CurrencyRates',
                //url : 'http://localhost:3000/api/CurrencyRates',
                form:{ 
                    'from':payload.from,
                    'to' : payload.to,
                    'last_updated':Date.now(),
                    'rate':rate_final
                }
            }, function(error, response, body){
                console.log("error :",error);
                console.log("body :",body);
                //console.log("response: ",response);
            });
        });
        callback('success');
    }
 
    var handler = new EmitKeysHandler();
    return handler;
};