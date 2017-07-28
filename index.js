/**
 * Created by serkan on 09/12/16.
 */
/**
 * Created by serkan on 29/08/16.
 */

exports = module.exports = {};
exports.Bluetooth = function () {
    //sudo usermod -G bluetooth -a pi
    //recommended sudo rpi-update
    //echo -e "connect FC:8F:90:21:12:0C \nquit" | bluetoothctl
    var self = this;

    var events = require('events');
    events.EventEmitter.call(self);
    self.__proto__ = events.EventEmitter.prototype;

    //use ptyw.js
    var pty = require('ptyw.js/lib/pty.js');

    var ransi = require('strip-ansi');

    var term = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 100,
        rows: 40,
        cwd: process.env.HOME,
        env: process.env
    });

    var bluetoothEvents = {
        Device: 'DeviceEvent',
        Controller: 'ControllerEvent',
        DeviceSignalLevel: 'DeviceSignalLevel',
        Connected: 'Connected',
        Paired: 'Paired',
        AlreadyScanning: 'AlreadyScanning',
        PassKey: 'PassKey'
    }
    var mydata = "";
    var devices = [];
    var controllers = [];
    var isBluetoothControlExists = false;
    var isBluetoothReady = false;
    var isScanning = false;
    var isConfirmingPassKey = false;

    Object.defineProperty(this, 'isBluetoothControlExists', {
        get: function () {
            return isBluetoothControlExists;
        },
        set: function (value) {
            isBluetoothControlExists = value;
        }
    });

    Object.defineProperty(this, 'isScanning', {
        get: function () {
            return isScanning;
        },
        set: function (value) {
            isScanning = value;
        }
    });
    Object.defineProperty(this, 'isConfirmingPassKey', {
        get: function () {
            return isConfirmingPassKey;
        },
        set: function (value) {
            isConfirmingPassKey = value;
        }
    });
    Object.defineProperty(this, 'isBluetoothReady', {
        get: function () {
            return isBluetoothReady;
        },
        set: function (value) {
            isBluetoothReady = value;
        }
    });
    Object.defineProperty(this, 'devices', {
        get: function () {
            return devices;
        },
        set: function (value) {
            devices = value;
        }
    });
    Object.defineProperty(this, 'controllers', {
        get: function () {
            return controllers;
        },
        set: function (value) {
            controllers = value;
        }
    });
    Object.defineProperty(this, 'bluetoothEvents', {
        get: function () {
            return bluetoothEvents;
        },
        set: function (value) {
            bluetoothEvents = value;
        }
    });

    Object.defineProperty(this, 'term', {
        get: function () {
            return term;
        },
        set: function (value) {
            term = value;
        }
    });

    function checkInfo(obj) {
        if (! obj.isConfirmingPassKey && obj.devices.length > 0) {
            for (i = 0; i < obj.devices.length; i++) {
                if (obj.devices[i].paired == '' && obj.devices[i].trycount < 4) {
                    obj.devices[i].trycount += 1;
                    obj.info(obj.devices[i].mac);
                    console.log('checking info of ' + obj.devices[i].mac)
                }
            }
        }
    }

    var os = require('os');
    if (os.platform() == 'linux') {
        term.write('type bluetoothctl\r');
    }


    term.on('data', function (data) {
        data = ransi(data).replace('[bluetooth]#', '');
        if (data.indexOf('bluetoothctl is ') !== -1 && data.indexOf('/usr/bin/bluetoothctl') !== -1) {
            isBluetoothControlExists = true
            isBluetoothReady=true;
            console.log('bluetooth controller exists')
            term.write('bluetoothctl\r');
            term.write('power on\r');
            term.write('agent on\r');
            setInterval(checkInfo, 5000, self)
        }
        //console.log("mydata:" + data)
        var regexdevice = /(\[[A-Z]{3,5}\])?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\s(?!RSSI)(?!Class)(?!Icon)(?!not available)(?!UUIDs:)(?!Connected)(?!Paired)(?![0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})(?!\s)(.+)/gm;
        var regexcontroller = /\[[A-Z]{3,5}\]?\s?Controller\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\s(?!Discovering)(.+) /gm;
        var regexsignal = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sRSSI:\s-(.+)/gm;
        var regexinfo = /Device ([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\r?\n?\t?Name: (.+)\r?\n?\t?Alias: (.+)\r?\n?\t?Class: (.+)\r?\n?\t?Icon: (.+)\r?\n?\t?Paired: (.+)\r?\n?\t?Trusted: (.+)\r?\n?\t?Blocked: (.+)\r?\n?\t?Connected: (.+)\r?\n?\t?/gmi;

        var regexconnected = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sConnected:\s([a-z]{2,3})/gm;
        var regexpaired = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sPaired:\s([a-z]{2,3})/gm;
        var regextrusted = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sTrusted:\s([a-z]{2,3})/gm;
        var regexblocked = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sBlocked:\s([a-z]{2,3})/gm;
	var regexpasskeyconfirmation = /\[agent\] Confirm passkey\s([0-9A-F]+)\s[^:]+:/gm;

        var regexscanon1 = 'Discovery started';
        var regexscanon2 = 'Failed to start discovery: org.bluez.Error.InProgress';
        var regexscanon3 = 'Discovering: yes';
        var regexscanoff1 = 'Discovery stopped'
        var regexscanoff2 = 'Discovering: no';

        checkDevice(regexdevice, data);
        checkinfo(data);
        checkSignal(regexsignal, data);
        checkController(regexcontroller, data);
        checkConnected(regexconnected, data);
        checkPaired(regexpaired, data);
        checkTrusted(regextrusted, data);
        checkBlocked(regexblocked, data);
        checkPasskeyConfirmation(regexpasskeyconfirmation, data);

        if (data.indexOf(regexscanoff1) !== -1 || data.indexOf(regexscanoff2) !== -1)isScanning = false;
        if (data.indexOf(regexscanon1) !== -1 || data.indexOf(regexscanon2) !== -1 || data.indexOf(regexscanon3) !== -1)isScanning = true;
    })


    function checkBlocked(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - yes or no
            if (devices.length > 0) {
                for (j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].blocked = m[2];
                        console.log(m[1] + " blocked " + m[2])
                        self.emit(bluetoothEvents.Device, devices)
                    }
                }
            }
        }
    }

    function checkPaired(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - yes or no
            if (devices.length > 0) {
                for (j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].paired = m[2];
                        console.log(m[1] + " paired " + m[2])
                        self.emit(bluetoothEvents.Device, devices)
                    }
                }
            }
        }
    }

    function checkPasskeyConfirmation(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - passkey
	    //console.log("Confirm passkey : " + m[1]);
            self.emit(bluetoothEvents.PassKey, m[1])
	    // confirmPasskey(true);

	    isConfirmingPassKey = true;
        }
    }

    function checkTrusted(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - yes or no
            if (devices.length > 0) {
                for (j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].trusted = m[2];
                        console.log(m[1] + " trusted " + m[2])
                        self.emit(bluetoothEvents.Device, devices)

                    }
                }
            }
        }
    }

    function checkConnected(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - yes or no
            if (devices.length > 0) {
                for (j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].connected = m[2];
                        console.log(m[1] + " connected " + m[2])
                        self.emit(bluetoothEvents.Device, devices)
                    }
                }
            }
        }
    }

    function checkinfo(data) {

        var regstr = /Device ([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\r?\n?\t?Name: (.+)\r?\n?\t?Alias: (.+)\r?\n?\t?Class: (.+)\r?\n?\t?Icon: (.+)\r?\n?\t?Paired: (.+)\r?\n?\t?Trusted: (.+)\r?\n?\t?Blocked: (.+)\r?\n?\t?Connected: (.+)\r?\n?\t?/gmi;

        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - device name
            //m[3] - alias
            //m[4] - Class
            //m[5] - Icon
            //m[6] - paired
            //m[7] - trusted
            //m[8] - blocked
            //m[9] - connected
            if (devices.length > 0) {
                for (j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].name = m[3]
                        devices[j].class = m[4]
                        devices[j].icon = m[5]
                        devices[j].paired = m[6]
                        devices[j].trusted = m[7]
                        devices[j].blocked = m[8]
                        devices[j].connected = m[9]
                        self.emit(bluetoothEvents.Device, devices)
                        //console.log ('info received:' + JSON.stringify(devices[j]))
                    }
                }
            }
        }
    }

    function checkSignal(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - signal Level
            if (devices.length > 0) {
                for (j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].signal = parseInt(m[2])
                        //console.log('signal level of:' + m[1] + ' is ' + m[2])
                        self.emit(bluetoothEvents.Device, devices)
                        self.emit(bluetoothEvents.DeviceSignalLevel, devices, m[1], m[2]);
                    }
                }
            }
        }
    }

    function checkController(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - controllername
            controllers = [];
            controllers.push({mac: m[1], name: m[2]});
            self.emit(bluetoothEvents.Controller, controllers);
            //console.log('controller found:' + m[1])
            term.write('power on\r');
            term.write('agent on\r');

        }
    }

    function checkDevice(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - [NEW] or [DEL] etc..
            //m[2] - macid
            //m[3] - devicename
            if (m[1] == "[DEL]") {
                //remove from list
                if (devices.length > 0) {
                    for (j = 0; j < devices.length; j++) {
                        if (devices[j].mac == m[2]) {
                            devices.splice(j, 1);
                            console.log('deleting device ' + m[2])
                        }
                    }
                }
            } else {
                var found = false;
                if (devices.length > 0) {
                    for (j = 0; j < devices.length; j++) {
                        if (devices[j].mac == m[2])found = true;
                        if (devices[j].mac == m[2] && m[1] == "[NEW]")found = false;
                    }
                }
                if (!found) {
                    console.log('adding device ' + m[2])
                    devices.push({
                        mac: m[2],
                        name: m[3],
                        signal: 0,
                        paired: '',
                        trusted: '',
                        icon: '',
                        class: '',
                        blocked: '',
                        connected: '',
                        trycount: 0
                    });
                }
            }
        }
        if ((regstr.exec(data)) !== null) self.emit(bluetoothEvents.Device, devices)

    }
}

//region exports

exports.agent = function (start) {
    this.term.write('agent ' + (start ? 'on' : 'off') + '\r');
}

exports.power = function (start) {
    this.term.write('power ' + (start ? 'on' : 'off') + '\r');
}

exports.scan = function (startScan) {
    this.term.write('scan ' + (startScan ? 'on' : 'off') + '\r');
}
exports.pairable = function (canpairable) {
    this.term.write('pairable ' + (canpairable ? 'on' : 'off') + '\r');
}
exports.discoverable = function (candiscoverable) {
    this.term.write('discoverable ' + (candiscoverable ? 'on' : 'off') + '\r');
}


exports.pair = function (macID) {
    this.term.write('pair ' + macID + '\r');
}
exports.confirmPassKey = function (confirm) {
    this.isConfirmingPassKey = false;
    this.term.write(confirm ? 'yes\r' : 'no\r');
}

exports.trust = function (macID) {
    this.term.write('trust ' + macID + '\r');
}

exports.untrust = function (macID) {
    this.term.write('untrust ' + macID + '\r');
}


exports.block = function (macID) {
    this.term.write('block ' + macID + '\r');
}
exports.unblock = function (macID) {
    this.term.write('unblock ' + macID + '\r');
}


exports.connect = function (macID) {
    this.term.write('connect ' + macID + '\r');
}

exports.disconnect = function (macID) {
    this.term.write('disconnect ' + macID + '\r');
}

exports.remove = function (macID) {
    this.term.write('remove ' + macID + '\r');
}

exports.info = function (macID) {
    this.term.write('info ' + macID + '\r');
}


exports.getPairedDevices = function () {
    this.devices = [];
    this.term.write('paired-devices\r');
}

exports.getDevicesFromController = function () {
    this.devices = [];
    this.term.write('devices\r');
}

exports.checkBluetoothController=function(){
    try{
        var execSync = require("child_process").execSync;
        return !!execSync("type bluetoothctl", {encoding: "utf8"});
    }
    catch(e){
        return false;
    }
}

//endregion