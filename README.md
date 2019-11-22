**Linux command line bluetoothctl wrapper for nodejs**

powerful command line utulity bluetoothctl for discovery, connect,disconnect, scan, pair etc.. 
if you want to connect bluetooth speakers , mouse, keyboard etc.. you can use this module. 
you must install bluetoothctl . for raspberry pi 3 , it comes as default with raspbian.
example install process:  sudo apt-get install bluez blueman alsa-utils bluez-alsa

**Features:**

- checkBluetoothController() : checks if bluetooth controler exists or not

- getPairedDevices() : checks already paired devices. 

- getDevicesFromController() : checks already scanned devices.

- disconnect(macID) : disconnect from macID

- info(macID) : checks features of device with given macID

- pair(macID) : pairs with given macID
 
- confirmPassKey(bool) : confirms passkey while paring.

- scan(bool) : starts or stops scanning of bluetooth devices. while scan is set true, current audio playback might get crackling.. so stop scan after you found what you are searching.

- discoverable(bool) : sets your raspberry or linux device's bluetooth as discoverable.

- isScanning : checks if bluetoothctl is already scanning. returns true/false

- isBluetoothReady : checks if our bluetooth controller ready.returns true/false

- isBluetoothControlExists : checks if we have a bluetooth hardware or not. 

- devices : returns the scanned and found devices as array. example output at below..

- controllers : returns the found bluetooth hardware devices. 

**Events**
 
- Controller: event fires when bluetooth controller detected from system

- DeviceSignalLevel: event fires when a discoverable bluetooth device's signal level detected.

- Device: event fires when a new device found or a device sends its features
 
- PassKey: event fires when passkey confirmation is required to pair device. confirmPasskey(true) should be called in response to this event.

- ScaningEnded: when scanning has ended

- Connected: when device is connected

**Basic usage**
 
```javascript
 var bt = require("bluetoothctl");
 bt.Bluetooth()
 
 
 bt.on(bt.bluetoothEvents.Controller, function(controllers){
 console.log('Controllers:' + JSON.stringify(controllers,null,2))
 });
 
 
 bt.on(bt.bluetoothEvents.DeviceSignalLevel, function(devices,mac,signal){
     console.log('signal level of:' + mac + ' - ' + signal)
 
 });
 
 bt.on(bt.bluetoothEvents.Device, function (devices) {
     console.log('devices:' + JSON.stringify(devices,null,2))
 })
 
 bt.on(bt.bluetoothEvents.PassKey, function (passkey) {
     console.log('Confirm passkey:' + passkey)
     bt.confirmPassKey(true);
 })
 
 var hasBluetooth=bt.checkBluetoothController();
 console.log('system has bluetooth controller:' + hasBluetooth)
 
 if(hasBluetooth) {
     console.log('isBluetooth Ready:' + bt.isBluetoothReady)
     bt.scan(true)
     setTimeout(function(){
         console.log('stopping scan')
         bt.scan(false)
         bt.info('00:0C:8A:8C:D3:71')
     },20000)
 }
```

**Sample output of controller:**

```javascript
Controllers:[
  {
    "mac": "B8:27:EB:2E:66:7B",
    "name": "raspberrypi"
  }
]
```

 
**Sample output of devices:**

```javascript 
devices:[
  {
    "mac": "00:0C:8A:8C:D3:71",
    "name": "Bose Mini SoundLink",
    "signal": 0,
    "paired": "yes",
    "trusted": "yes",
    "icon": "audio-card",
    "class": "0x240428",
    "blocked": "no",
    "connected": "no",
    "trycount": 1
  }
]
```
