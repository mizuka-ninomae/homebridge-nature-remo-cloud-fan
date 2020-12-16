
homubridge用 汎用ＦＡＮプラグイン （eneral purpose FAN plugin）

Homebridge：  https：//github.com/nfarina/homebridge

ＯＦＦ（0%） ⇔ ＬＯＷ（33%） ⇔ ＭＩＤＤＬＥ（66%） ⇔ ＨＩＧＨ（100%）

時計回り（CLOCKWISE） ⇔ 反時計回り（CLOCKWISE）

の設定が可能です。

### 3. Create the config.json file
```shell
$ vim ~/.homebridge/config.json
```

```js
{
  "bridge": {
    "name": "Homebridge",
    "username": "CC:22:3D:E3:CE:30",
    "port": 51826,
    "pin": "031-45-154"
  },
  "description": "Nature Remo Control",
  "accessories": [{
    "accessory": "remo",
    "name": "Blu-ray",
    "host": "192.168.X.X",
    "timeout": 2000,
    "interval": 100,
    "retryInterval": 500,
    "retry": 4,
    "command": {
      "power": {
        "format": "us",
        "freq": 39,
        "data": [2360, 634, 1145, 651, 561, ....]
      },
      "home": {
        "format": "us",
        "freq": 39,
        "data": [2374, 635, 560, 638, 1143, ....]
      },
      "back": {
        "format": "us",
        "freq": 39,
        "data": [2338, 652, 1162, 636, 1147, ....]
      }
    },
    "on": ["home", { "delay": 1000, "command": "back" }],
    "off": ["home", { "command": "power" }]
  }]
}
```
