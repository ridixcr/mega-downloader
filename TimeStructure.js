var TimeStructure = function()
{
    this.range = ["seconds ", "minutes ", "hours ", "days ", "weeks "];

    //Convert number of seconds to structure string E.g. 65 as input returns 1minutes 5seconds
    this.SecondsToStructuredString = function(time)
    {
        if(time < 1)
            return "0 second";

        if(time < 60)//Seconds
        {
            return Math.floor(time) + this.range[0];
        }
        else if((time/60) < 60)//Minutes
        {
            var min = Math.floor(time/60);
            var sec = Math.floor(time - (min*60));
            return min + this.range[1] + (sec > 0 ? sec + this.range[0] : "");
        }
        else if((time/(60*60)) >= 1 && (time/(60*60)) < 24)//Hours
        {
            var hr = Math.floor(time / (60*60));
            var min = time - (hr*(60*60));
            min = Math.floor(min / 60);
            var sec = Math.floor(time - ((hr*(60*60)) + (min*60)));
            return hr + this.range[2] + (min > 0 ? min + this.range[1] : "") + (sec > 0 ? Math.floor(sec) + this.range[0] : "");
        }
        else if((time/(60*60)) >= 24 && (time/(60*60*24)) < 7)//Days
        {
            var days = Math.floor(time / (60*60*24));
            var hr = time - (days * 60*60*24);
            hr = Math.floor(hr/(60*60));
            var min = time - ((days*60*60*24) + (hr*60*60));
            min = Math.floor(min/60);
            var sec = Math.floor(time - ((days*60*60*24) + (hr*60*60) + (min*60)));
            return days + this.range[3] + (hr > 0 ? hr + this.range[2] : "") + (min > 0 ? min + this.range[1] : "") + (sec > 0 ? sec + this.range[0] : "");
        }
        else //if((time / (60*60*24)) >= 7) //Weeks
        {
            var wks = Math.floor(time/(60*60*24*7));
            var days = time - (wks*(60*60*24*7));
            days = Math.floor(days / (60*60*24));
            var hr = time - ((wks*60*60*24*7) + (days*60*60*24)) ;
            hr = Math.floor(hr/(60*60));
            var min = time - (((wks*(60*60*24*7)) + (days*60*60*24) + (hr*60*60)));
            min = Math.floor(min/60);
            var sec = Math.floor(time - ((wks*(60*60*24*7)) + (days*60*60*24) + (hr*60*60) + (min*60)));
            return wks + this.range[4] + (days > 0 ? days + this.range[3] : "") + (hr > 0 ? hr + this.range[2] : "") + (min > 0 ? min + this.range[1] : "") + (sec > 0 ? sec + this.range[0] : "");
        }
    };
};
