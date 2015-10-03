var util    = require('util'),
    events  = require('events')
    _       = require('underscore');

// ---------------------------------------------
// Constructor
// ---------------------------------------------
function Stopwatch() {
    if(false === (this instanceof Stopwatch)) {
        return new Stopwatch();
    }

    this.hour = 3600000;
    this.minute = 60000;
    this.second = 1000;
    this.time = this.hour;
    this.interval = undefined;

    events.EventEmitter.call(this);

    // Use Underscore to bind all of our methods
    // to the proper context
    _.bindAll(this, 'start', 'stop', 'reset', 'onTick', 'formatTime', 'getTime');
};

// ---------------------------------------------
// Inherit from EventEmitter
// ---------------------------------------------
util.inherits(Stopwatch, events.EventEmitter);

// ---------------------------------------------
// Methods
// ---------------------------------------------
Stopwatch.prototype.start = function() {
    if (this.interval) {
        return;
    }

    console.log('Starting Stopwatch!');
    // note the use of _.bindAll in the constructor
    // with bindAll we can pass one of our methods to
    // setInterval and have it called with the proper 'this' value
    this.interval = setInterval(this.onTick, this.second);
    this.emit('start:stopwatch');
};

Stopwatch.prototype.stop = function() {
    console.log('Stopping Stopwatch!');
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.emit('stop:stopwatch');
    }
};

Stopwatch.prototype.reset = function() {
    console.log('Resetting Stopwatch!');
    this.time = this.hour;
    this.emit('reset:stopwatch', this.formatTime(this.time));
};

Stopwatch.prototype.onTick = function() {
    this.time -= this.second;

    var formattedTime = this.formatTime(this.time);
    this.emit('tick:stopwatch', formattedTime);
    
    if (this.time === 0) {
        this.stop();
    }
};

Stopwatch.prototype.formatTime = function(time) {
    var remainder = time,
        numHours,
        numMinutes,
        numSeconds,
        output = "";

    numHours = String(parseInt(remainder / this.hour, 10));
    remainder -= this.hour * numHours;
    
    numMinutes = String(parseInt(remainder / this.minute, 10));
    remainder -= this.minute * numMinutes;
    
    numSeconds = String(parseInt(remainder / this.second, 10));
    
    output = _.map([numHours, numMinutes, numSeconds], function(str) {
        if (str.length === 1) {
            str = "0" + str;
        }
        return str;
    }).join(":");

    return output;
};

Stopwatch.prototype.getTime = function() {
    return this.formatTime(this.time);
};

// ---------------------------------------------
// Export
// ---------------------------------------------
module.exports = Stopwatch;
