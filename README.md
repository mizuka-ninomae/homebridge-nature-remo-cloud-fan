
homubridge用 NatureRemo Cloud API特化型FAN制御プラグイン （NatureRemo Cloud API specialized FAN control plugin）

Homebridge：  https：//github.com/nfarina/homebridge

ＯＦＦ（0%） ⇔ ＬＯＷ（33%） ⇔ ＭＩＤＤＬＥ（66%） ⇔ ＨＩＧＨ（100%）

時計回り（CLOCKWISE） ⇔ 反時計回り（CLOCKWISE）

の設定が可能です。

汎用型バージョン
https://www.npmjs.com/package/homebridge-cmd-fan

config.json 記入例
```js

  "accessories": [
      {
          "accessory": "NatureRemoFan",
          "name": "シーリングファン",
          "access_token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "high_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "middle_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "low_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "off_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "clockwise_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "c_clockwise_signal_ID": "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
      },
      {
        ～
      }
  ]
```

* `accessory` → 固定値（Fixed value）
* `name` → お好みに（To your liking）
* `access_token` → 公式HPより取得（Obtained from the official website）
* `~signal_ID` → 公式HPより取得（Obtained from the official website）それぞれの場合のsignal IDを記入してください。（Enter the signal ID for each case）
* `language` → en（ENGLISH:[Default]）、jp（JAPANESE:ログの高中低、時計回り、反時計回りの表示が日本語になってメモが付く）

公式HP（official website）https://developer.nature.global/
access token発行ページ（access token issuing site）https://home.nature.global/

取得方法は「nature remo」「access token」「signal ID」「発行」等でGoogleで検索をかければ、手順がいくらでも出てくるので省略。

テスト環境（testing environment）

・Raspberry Pi3

・Nature Remo 1ST generation

・どれが商品名か分からないこの商品 https://item.rakuten.co.jp/low-ya/fc03-g1003-100/?s-id=ph_pc_itemname
