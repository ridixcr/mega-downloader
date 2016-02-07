var SizeStructure = function()
{
    this.SizeRange = ["Bytes", "KB", "MB", "GB", "TB"];
    this.SpeedRange = ["B/s", "KB/s", "MB/s", "GB/s", "TB/s"];

    //Returns number of bytes as structure string E.g. 1076 as input returns 1.05KB
    this.BytesToStructuredString = function(bytes)
    {
        if(bytes < 1)
            return "0 Byte";
        var i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + this.SizeRange[i];
    };

    //Returns number of bytes/sec as structure string E.g. 1076 as input returns 1.05KB/s
    this.SpeedToStructuredString = function(speed)
    {
        if(speed < 1)
            return "0 B/s";
        var i = Math.floor(Math.log(speed) / Math.log(1024));
        return (speed / Math.pow(1024, i)).toFixed(2) + this.SpeedRange[i];
    };
}
