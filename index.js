let Service, Characteristic;
let request    = require('request');

module.exports = function(homebridge){
  Service        = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-nature-remo-cloud-fan", "NatureRemoFan", FanAccessory);
}

function FanAccessory(log, config) {
  this.log                   = log;
  this.name                  = config["name"];
  this.access_tokens         = config["access_tokens"];
  this.high_signal_ID        = config["high_signal_ID"];
  this.middle_signal_ID      = config["middle_signal_ID"];
  this.low_signal_ID         = config["low_signal_ID"];
  this.off_signal_ID         = config["off_signal_ID"];
  this.clockwise_signal_ID   = config["clockwise_signal_ID"];
  this.c_clockwise_signal_ID = config["c_clockwise_signal_ID"];
  this.Use_Counter_Clockwise = config["Use_Counter_Clockwise"] || false;
  this.state = {
    power: false,
    speed: 0,
  };

  this.informationService = new Service.AccessoryInformation();
  this.fanService         = new Service.Fan(this.name);

  this.informationService
  .setCharacteristic(Characteristic.Manufacturer, "fan Manufacturer")
  .setCharacteristic(Characteristic.Model, "fan Model")
  .setCharacteristic(Characteristic.SerialNumber, "fan Serial Number");

  this.fanService
  .getCharacteristic(Characteristic.On)
  .on('set', this.setOn.bind(this))

  this.fanService
  .getCharacteristic(Characteristic.RotationSpeed)
  .setProps({
     minValue: 0,
     maxValue: 99,
     minStep:  33,
  })
  .on('set', this.setSpeed.bind(this))

  if (this.Use_Counter_Clockwise) {
    this.fanService
    .getCharacteristic(Characteristic.RotationDirection)
    .on('set', this.setDirection.bind(this));
  }
}

//------------------------------------------------------------------------------
FanAccessory.prototype.getServices = function() {
  return [this.informationService, this.fanService];
}

//------------------------------------------------------------------------------
FanAccessory.prototype.setOn = function(value, callback) {
  if (this.state.power != value) {
    this.log('Power Button: ' + value);
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
    if (value == 0) {
      this.state.power = false;
    }
    else {
      this.state.power = true;
    }
    this.state.speed = value;
    this.setFanState(this.state, callback);
  }
  else {
    callback(null);
  }
}

//------------------------------------------------------------------------------
FanAccessory.prototype.setDirection = function(value, callback) {
  if (this.state.direction != value) {
    this.state.direction = value;
    this.setFanState2(this.state, callback);
  }
  else {
    callback(null);
  }
}
//------------------------------------------------------------------------------
FanAccessory.prototype.setFanState = function(state, callback) {
  let signal_ID;
  if (state.power) {
    if      (state.speed == 33) {
      signal_ID = this.middle_signal_ID;
      this.log('Power: ' + state.power + '  FANSpeed: LOW(' + state.speed + ')');
    }
    else if (state.speed == 66) {
      signal_ID = this.middle_signal_ID;
      this.log('Power: ' + state.power + '  FANSpeed: MIDDLE(' + state.speed + ')');
    }
    else if (state.speed == 99) {
      signal_ID = this.high_signal_ID;
      this.log('Power: ' + state.power + '  FANSpeed: HIGH(' + state.speed + ')');
    }
  }
  else {
      signal_ID = this.off_signal_ID;
      this.log('Power: ' + state.power);
  }

  this.httpRequest(signal_ID, function(error, stdout, stderr) {
    if (error) {
      this.log('Function Failed', error);
      callback(error);
    }
    else {
      this.log('Function Succeeded!');
      callback();
    }
  }.bind(this));
}

//------------------------------------------------------------------------------
FanAccessory.prototype.setFanState2 = function(state, callback) {
  let signal_ID;
  if (state.direction == 0) {
      signal_ID = this.clockwise_signal_ID;
      this.log('Direction: CLOCKWISE!');
  }
  else {
      signal_ID = this.c_clockwise_signal_ID;
      this.log('Direction: COUNTER CLOCKWISE!');
  }

  this.httpRequest(signal_ID, function(error, stdout, stderr) {
    if (error) {
      this.log('Function Failed', error);
      callback(error);
    }
    else {
      this.log('Function Succeeded!');
      callback();
    }
  }.bind(this));
}

//------------------------------------------------------------------------------
FanAccessory.prototype.httpRequest = function(signal_ID, callback) {
  request(
    {
      url: 'https://api.nature.global/1/signals/' + signal_ID + '/send',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + this.access_tokens
      },
      json: true
    }
  )
}
