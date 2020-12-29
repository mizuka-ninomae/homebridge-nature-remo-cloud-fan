let Service, Characteristic;
let exec         = require("child_process").exec;

module.exports = function(homebridge){
  Service        = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-nature-remo-cloud-fan", "NatureRemoFan", FanAccessory);
}

function FanAccessory(log, config) {
  this.log                     = log;
  this.name                    = config["name"];
  this.access_tokens           = config["access_tokens"];
  this.high_signal_ID          = config["high_signal_ID"];
  this.middle_signal_ID        = config["middle_signal_ID"];
  this.low_signal_ID           = config["low_signal_ID"];
  this.off_signal_ID           = config["off_signal_ID"];
  this.Use_Counter_Clockwise   = config["Use_Counter_Clockwise"] || false;
  if (this.Use_Counter_Clockwise) {
    this.clockwise_signal_ID   = config["clockwise_signal_ID"];
    this.c_clockwise_signal_ID = config["c_clockwise_signal_ID"];
  }
  this.language                = config["language"] || "en";
  this.state = {
    power: false,
    speed: 0,
  };

  this.informationService      = new Service.AccessoryInformation();
  this.fanService              = new Service.Fan(this.name);

  this.informationService
  .setCharacteristic(Characteristic.Manufacturer, "NatureRemo-FAN Manufacturer")
  .setCharacteristic(Characteristic.Model, "NatureRemo-FAN Model")
  .setCharacteristic(Characteristic.SerialNumber, "NatureRemo-FAN Serial Number");

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
    if      (this.language == 'en') {
      this.log(' <<<< [Power Button: ' + value + ']');
    }
    else if (this.language == 'jp') {
      this.log(' <<<< [電源ボタン: ' + value + ']');
    }
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
      if      (this.language == 'en') {
        this.log(' <<<< [Power: ' + state.power + ']  [FANSpeed: LOW(' + state.speed + '%)]');
      }
      else if (this.language == 'jp') {
        this.log(' <<<< [電源: ' + state.power + ']  [スピード: 低(' + state.speed + '%)]');
      }
    }
    else if (state.speed == 66) {
      signal_ID = this.middle_signal_ID;
      if      (this.language == 'en') {
        this.log(' <<<< [Power: ' + state.power + ']  [FANSpeed: MIDDLE(' + state.speed + '%)]');
      }
      else if (this.language == 'jp') {
        this.log(' <<<< [電源: ' + state.power + ']  [スピード: 中(' + state.speed + '%)]');
      }
    }
    else if (state.speed == 99) {
      signal_ID = this.high_signal_ID;
      if      (this.language == 'en') {
        this.log(' <<<< [Power: ' + state.power + ']  [FANSpeed: HIGH(' + state.speed + '%)]');
      }
      else if (this.language == 'jp') {
        this.log(' <<<< [電源: ' + state.power + ']  [スピード: 高(' + state.speed + '%)]');
      }
    }
  }
  else {
      signal_ID = this.off_signal_ID;
      this.log('Power: ' + state.power);
  }

  this.cmdRequest(signal_ID, function(error, stdout, stderr) {
    if (error) {
      this.log('Function Failed', error);
      callback(error);
    }
    else {
      callback();
    }
  }.bind(this));
}

//------------------------------------------------------------------------------
FanAccessory.prototype.setFanState2 = function(state, callback) {
  let signal_ID;
  if (state.direction == 0) {
    signal_ID = this.clockwise_signal_ID;
    if      (this.language == 'en') {
      this.log(' <<<< [Direction: CLOCKWISE]');
    }
    else if (this.language == 'jp') {
      this.log(' <<<< [回転方向: 時計回り（冬用上向き）]');
    }
  }
  else {
    signal_ID = this.c_clockwise_signal_ID;
    if      (this.language == 'en') {
      this.log(' <<<< [Direction: COUNTER CLOCKWISE]');
    }
    else if (this.language == 'jp') {
      this.log(' <<<< [回転方向: 反時計回り（夏用下向き）]');
    }
  }

  this.cmdRequest(signal_ID, function(error, stdout, stderr) {
    if (error) {
      this.log('Function Failed', error);
      callback(error);
    }
    else {
      callback();
    }
  }.bind(this));
}

//------------------------------------------------------------------------------
FanAccessory.prototype.cmdRequest = function(signal_ID, callback) {
  let url       = ' "https://api.nature.global/1/signals/' + signal_ID + '/send"';
  let param_1   = 'curl -X POST';
  let param_2   = ' -H "accept":"application/json"';
  let param_3   = ' -k --header "Authorization":"Bearer';
  let param_4   = ' ' + this.access_tokens + '"';
  let param_all = param_1 + url + param_2 + param_3 + param_4;

  exec(param_all, function(error, stdout, stderr) {
	  callback(error, stdout, stderr)
  })
}
