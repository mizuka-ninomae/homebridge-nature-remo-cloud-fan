var Service, Characteristic;
var exec = require("child_process").exec;

module.exports = function(homebridge){
  Service        = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-cmd-fan", "cmd-fan", FanAccessory);
}

function FanAccessory(log, config) {
  this.log             = log;
  this.high_cmd        = config["high_cmd"];
  this.middle_cmd      = config["middle_cmd"];
  this.low_cmd         = config["low_cmd"];
  this.off_cmd         = config["off_cmd"];
  this.name            = config["name"];
  this.state = {
    power: false,
    speed: 0,
  };
}

//------------------------------------------------------------------------------
FanAccessory.prototype.identify = function(callback) {
  this.log("Identify requested!");
  callback();
}

//------------------------------------------------------------------------------
FanAccessory.prototype.getServices = function() {

  var informationService = new Service.AccessoryInformation();
  var fanService         = new Service.Fan(this.name);

  informationService
    .setCharacteristic(Characteristic.Manufacturer, "fan Manufacturer")
    .setCharacteristic(Characteristic.Model, "fan Model")
    .setCharacteristic(Characteristic.SerialNumber, "fan Serial Number");

  fanService
    .getCharacteristic(Characteristic.On)
//    .on('get', this.getOn.bind(this))
    .on('set', this.setOn.bind(this))
  fanService
    .getCharacteristic(Characteristic.RotationSpeed)
    .setProps({
       minValue: 0,
       maxValue: 99,
       minStep:  33,
    })
//    .on('get', this.getSpeed.bind(this))
    .on('set', this.setSpeed.bind(this))
//  fanService
//    .getCharacteristic(Characteristic.RotationDirection)
//    .on('get', this.getDirection.bind(this))
//    .on('set', this.setDirection.bind(this));

  return [fanService];
}

//------------------------------------------------------------------------------
FanAccessory.prototype.setOn = function(value, callback) {
  if (this.state.power != value) {
    this.state.power = value;
    this.setFanState(this.state, callback);
  } 
  else {
    callback(null);
  }
}

//------------------------------------------------------------------------------
FanAccessory.prototype.setSpeed = function(value, callback) {
  if (this.state.speed != value) {
    this.state.speed = value;
    this.setFanState(this.state, callback);
  } 
  else {
    callback(null);
  }
}

//------------------------------------------------------------------------------
FanAccessory.prototype.setFanState = function(state, callback) {
  var cmd;
  if (state.power) {
    if      (state.speed =  99) {
      cmd = this.high_cmd;
      this.log('Power: ' + state.power + '  FANSpeed: HIGH(' + state.speed + ')');
    }
    else if (state.speed =  66) {
      cmd = this.middle_cmd;
      this.log('Power: ' + state.power + '  FANSpeed: MIDDLE(' + state.speed + ')');
    }
    else if (state.speed =  33) {
      cmd = this.middle_cmd;
      this.log('Power: ' + state.power + '  FANSpeed: LOW(' + state.speed + ')');
    }
  }
  else {
      cmd = this.off_cmd;
      this.log('Power: ' + state.power);
  }

  this.cmdRequest(cmd, function(error, stdout, stderr) {
    if (error) {
      this.log('Function Failed', error);
      callback(error);
    } 
    else {
      this.log('Function Succeeded!');
      callback();
      this.log(stdout);
    }
  }.bind(this));
}

//------------------------------------------------------------------------------
FanAccessory.prototype.cmdRequest = function(cmd, callback) {
  exec(cmd, function(error, stdout, stderr) {
	  callback(error, stdout, stderr)
  })
}
