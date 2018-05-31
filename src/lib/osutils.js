var _os = require('os');

exports.platform = function(){
  return process.platform;
};

exports.cpuCount = function(){
  return _os.cpus().length;
};

exports.sysUptime = function(){
  //seconds
  return _os.uptime();
};

exports.processUptime = function(){
  //seconds
  return process.uptime();
};

// Memory: read directly into /proc/meminfo because _os.freemem() do not count cached as available
exports.freemem = function() {
    var fs          = require( 'fs' );
    var array       = fs.readFileSync( '/proc/meminfo' ).toString().split( "\n" );
    var free_memory = 0;
    for ( var idx in array ) {
        var line = array[ idx ];
        var elts = line.split( /\s+/ ); // looks like key   value  KB <= some value are without KB but we do not look at them
        var key  = elts[ 0 ];
        // Total memory of the system (physical): MemTotal
        // Free memory =
        //  * MemFree:
        //  * Buffers: (into files)
        //  * Cached: (file flushed but before the disks)
        //  * SReclaimable: (kernel slabs that can be release)
        if ( key === 'MemFree:' || key === 'Buffers:' || key === 'Cached:' || key === 'SReclaimable:' ) {
            free_memory += parseInt( elts[ 1 ] );  // Note: values are in KB
        }
    }
    return free_memory / 1024;  // into MB, to match totalmem
};


exports.totalmem = function(){
  return _os.totalmem() / ( 1024 * 1024 );
};

exports.freememPercentage = function(){
  return _os.freemem() / _os.totalmem();
};

exports.freeCommand = function(callback){
  // Only Linux
  require('child_process').exec('free -m', function(error, stdout, stderr) { // eslint-disable-line no-unused-vars
    var lines = stdout.split("\n");
    var str_mem_info = lines[1].replace( /[\s\n\r]+/g,' ');
    var mem_info = str_mem_info.split(' ');

    var total_mem    = parseFloat(mem_info[1]);
    var free_mem     = parseFloat(mem_info[3]);
    var buffers_mem  = parseFloat(mem_info[5]);
    var cached_mem   = parseFloat(mem_info[6]);

    var used_mem = total_mem - (free_mem + buffers_mem + cached_mem);

    callback(used_mem -2);
  });
};


// Hard Disk Drive
exports.harddrive = function(callback){
  require('child_process').exec('df -k', function(error, stdout, stderr) { // eslint-disable-line no-unused-vars
    var total = 0;
    var used = 0;
    var free = 0;

    var lines = stdout.split("\n");
    var str_disk_info = lines[1].replace( /[\s\n\r]+/g,' ');
    var disk_info = str_disk_info.split(' ');

    total = Math.ceil((disk_info[1] * 1024)/ Math.pow(1024,2));
    used = Math.ceil(disk_info[2] * 1024 / Math.pow(1024,2)) ;
    free = Math.ceil(disk_info[3] * 1024 / Math.pow(1024,2)) ;

    callback(total, free, used);
  });
};

exports.listHardDrive = function () {
  var lines = require('child_process').execSync('df -k').toString().split("\n");
  var disks = [];

  for (var i = 1; i < (lines.length - 1); i++) {
    var str_disk_info = lines[i].replace( /[\s\n\r]+/g,' ');
    var disk_info = str_disk_info.split(' ');

    if (-1 !== disk_info[0].indexOf('tmpfs')) {
      continue;
    }

    disks.push({
      name: disk_info[0],
      total: disk_info[1] * 1024,
      used: disk_info[2] * 1024,
      free: disk_info[3] * 1024,
      percent: disk_info[4],
      mountOn: disk_info[5]
    });
  }

  return disks;
};

// Return process running current
exports.getProcesses = function(nProcess, callback){
    // if nprocess is undefined then is function
  if(typeof nProcess === 'function'){

    callback =nProcess;
    nProcess = 0;
  }

  var command = 'ps -eo pcpu,pmem,time,args | sort -k 1 -r | head -n'+10;
    //command = 'ps aux | head -n '+ 11
    //command = 'ps aux | head -n '+ (nProcess + 1)
  if (nProcess > 0)
    command = 'ps -eo pcpu,pmem,time,args | sort -k 1 -r | head -n'+(nProcess + 1);

  require('child_process').exec(command, function(error, stdout, stderr) { // eslint-disable-line no-unused-vars
    var lines = stdout.split("\n");
    lines.shift();
    lines.pop();

    var result = '';

    lines.forEach(function(_item){

      var _str = _item.replace( /[\s\n\r]+/g,' ');

      _str = _str.split(' ');

      result += _str[1]+" "+_str[2]+" "+_str[3]+" "+_str[4].substring((_str[4].length - 25))+"\n";  // process
    });

    callback(result);
  });
};

/*
* Returns All the load average usage for 1, 5 or 15 minutes.
*/
exports.allLoadavg = function(){
  var loads = _os.loadavg();

  return loads[0].toFixed(4)+','+loads[1].toFixed(4)+','+loads[2].toFixed(4);
};

/*
* Returns the load average usage for 1, 5 or 15 minutes.
*/
exports.loadavg = function(_time){
  if(_time === undefined || (_time !== 5 && _time !== 15) ) _time = 1;

  var loads = _os.loadavg();
  var v = 0;
  if(_time === 1) v = loads[0];
  if(_time === 5) v = loads[1];
  if(_time === 15) v = loads[2];

  return v;
};

exports.cpuFree = function(callback){
  getCPUUsage(callback, true);
};

exports.cpuUsage = function(callback){
  getCPUUsage(callback, false);
};

exports.listCPUs = function () {
  var list = getCPUsList();

  wait(300);

  var stats = getCPUsList();

  for (var i = 0; i < stats.length; i++) {
    var start = list[i];
    var end = stats[i];

    var idle 	= end.idle - start.idle;
    var total = end.total - start.total;

    list[i].percent = Math.round(100 - ~~(100 * idle / total), 2);
  }

  return list;
};

function wait(ms) {
  var start = new Date().getTime();
  var end = start;

  while(end < start + ms) {
    end = new Date().getTime();
  }
}

function getCPUsList() {
  var cpus = _os.cpus();
  var list = [];

  for (var cpu in cpus) {
    if (!cpus.hasOwnProperty(cpu)) {
      continue;
    }

    var user = cpus[cpu].times.user;
    var nice = cpus[cpu].times.nice;
    var sys = cpus[cpu].times.sys;
    var irq = cpus[cpu].times.irq;
    var idle = cpus[cpu].times.idle;
    var total = user + nice + sys + idle + irq;

    list.push({
      user: user,
      nice: nice,
      sys: sys,
      irq: irq,
      idle: idle,
      total: total,
      used: 1 - (idle / total)
    });
  }

  return list;
}

function getCPUUsage(callback, free){

  var stats1 = getCPUInfo();
  var startIdle = stats1.idle;
  var startTotal = stats1.total;

  setTimeout(function() {
    var stats2 = getCPUInfo();
    var endIdle = stats2.idle;
    var endTotal = stats2.total;

    var idle 	= endIdle - startIdle;
    var total 	= endTotal - startTotal;
    var perc	= idle / total;

    if(free === true)
      callback( perc );
    else
            callback( (1 - perc) );

  }, 1000 );
}

function getCPUInfo(){
  var cpus = _os.cpus();

  var user = 0;
  var nice = 0;
  var sys = 0;
  var idle = 0;
  var irq = 0;
  var total = 0;

  for(var cpu in cpus){
    if (!cpus.hasOwnProperty(cpu)) continue;
    user += cpus[cpu].times.user;
    nice += cpus[cpu].times.nice;
    sys += cpus[cpu].times.sys;
    irq += cpus[cpu].times.irq;
    idle += cpus[cpu].times.idle;
  }

  total = user + nice + sys + idle + irq;

  return {
    'idle': idle,
    'total': total
  };
}
