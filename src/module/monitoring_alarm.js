export class MonitoringAlarm {
  constructor() {}

  _createAram(resource_id) {
    const params = {
      app: 3, // url_monitoring_alarm
      record: {
        int___resource_id_: {
          value: resource_id,
        },
        int__counter_: {
          value: 0,
        },
        int__alert_history_: {
          value: 0,
        },
      },
    };
    kintone.api(
      kintone.api.url("/k/v1/record", true),
      "POST",
      params,
      function (resp) {},
      function (resp) {}
    );
  }
  // TODO:インスタンス作ってから呼ぶようにして、レコード更新許可メソッド通ってから更新するように変更する
  _incrementCounter(resource) {
    const body = {
      app: 3,
      int___resource_id_: resource.id,
      fields: ["radio__should_alert_"],
    };
    return kintone
      .api(kintone.api.url("/k/v1/records", true), "GET", {
        app: 3,
        query: `int___resource_id_ = ${resource.id}`,
        fields: ["int__counter_", "int___resource_id_", "id"],
      })
      .then(function (r) {
        const response = r["records"][0];
        console.log(r);
        if (response === null || response === undefined) {
          return;
        }
        let incremented_counter = (parseInt(response["int__counter_"].value) + 1);
        return kintone.api(
          kintone.api.url("/k/v1/record", true),
          "PUT",
          {
            app: 3, // url_monitoring_alarm
            id: response["id"].value,
            int___resource_id_: response["int___resource_id_"].value,
            record: {
              int__counter_: {
                value: incremented_counter,
              },
            },
          },
          function (resp) {},
          function (resp) {}
        );
      })
      .catch(function (resp) {
        console.log(resp);
      });
  }
}
