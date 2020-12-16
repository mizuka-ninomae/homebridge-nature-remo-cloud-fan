
homubridge用 汎用ＦＡＮプラグイン （eneral purpose FAN plugin）

Homebridge：  https：//github.com/nfarina/homebridge

ＯＦＦ（0%） ⇔ ＬＯＷ（33%） ⇔ ＭＩＤＤＬＥ（66%） ⇔ ＨＩＧＨ（100%）

時計回り（CLOCKWISE） ⇔ 反時計回り（CLOCKWISE）

の設定が可能です。

config.json 記入例
```js

  "accessories": [{
    "accessory": "cmd-fan",
    "name": "シーリングファン",
    "high_cmd": "/home/pi/homebridge-cmd-fan_sh/high_cmd.sh",
    "middle_cmd": "/home/pi/homebridge-cmd-fan_sh/middle_cmd.sh",
    "low_cmd": "/home/pi/homebridge-cmd-fan_sh/low_cmd.sh",
    "off_cmd": "/home/pi/homebridge-cmd-fan_sh/off_cmd.sh",
    "clockwise_cmd": "/home/pi/homebridge-cmd-fan_sh/clockwise_cmd.sh",
    "c_clockwise_cmd": "/home/pi/homebridge-cmd-fan_sh/c_clockwise_cmd.sh"
  }]
```

ファイルの場所を指定出来ていれば /home/pi/homebridge-cmd-fan_sh/ でなくて構いません。
