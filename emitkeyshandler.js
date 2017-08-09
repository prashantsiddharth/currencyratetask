module.exports = function()
{
    function EmitKeysHandler()
    {
        this.type = 'j_type';
    }
 
    EmitKeysHandler.prototype.work = function(payload, callback)
    {
        // var keys = Object.keys(payload);
        // for (var i = 0; i < keys.length; i++)
        //     console.log(keys[i]);
        console.log(payload);
        callback('success');
    }
 
    var handler = new EmitKeysHandler();
    return handler;
};