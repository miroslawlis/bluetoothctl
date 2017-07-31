/**
 * Created by serkan on 09/12/16.
 */
var blue = require("./index");
blue.Bluetooth()

// blue.on(blue.bluetoothEvents.Connected, UISocket.bluetooth.Connected);


blue.on(blue.bluetoothEvents.Controller, function(controllers){
console.log('Controllers:' + JSON.stringify(controllers,null,2))

var hasBluetooth=blue.checkBluetoothController();
console.log('system has bluetooth controller:' + hasBluetooth)

    if(hasBluetooth) {
        console.log('isBluetooth Ready:' + blue.isBluetoothReady)
        blue.scan(true)
        console.log('isScanning:' + blue.isScanningy)
        setTimeout(function(){
            console.log('stopping scan')
            blue.scan(false)
            //blue.info('00:0C:8A:8C:D3:71')
            blue.info('5C:F3:70:74:1B:8D')
        },200000)
    }
});


blue.on(blue.bluetoothEvents.DeviceSignalLevel, function(devices,mac,signal){
    console.log('signal level of:' + mac + ' - ' + signal)

});

blue.on(blue.bluetoothEvents.Device, function (devices) {
    console.log('devices:' + JSON.stringify(devices,null,2))
})

var hasBluetooth=blue.checkBluetoothController();
console.log('system has bluetooth controller:' + hasBluetooth)

/*
if(hasBluetooth) {
    console.log('isBluetooth Ready:' + blue.isBluetoothReady)
    blue.scan(true)
    console.log('isScanning:' + blue.isScanningy)
    setTimeout(function(){
        console.log('stopping scan')
        blue.scan(false)
        //blue.info('00:0C:8A:8C:D3:71')
        blue.info('5C:F3:70:74:1B:8D')
    },200000)
}
*/


//blue.getPairedDevices();
//blue.getDevicesFromController()
//blue.disconnect(macID)
//blue.info(macID)
//blue.pair(macID)
//blue.scan(true)
//blue.discoverable(true)
//blue.isScanning
//blue.isBluetoothReady
//blue.isBluetoothControlExists
//blue.devices
//blue.controllers
