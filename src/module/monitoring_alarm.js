export class MonitoringAlarm {
  constructor(id, resource_id, counter) {
    this.id = id,
      this.resource_id = resource_id,
      this.counter = counter
  };
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

  _fetchByResourceId(resource_id) {
    return kintone
      .api(kintone.api.url("/k/v1/records", true), "GET", {
        app: 3,
        query: `int___resource_id_ = ${resource_id}`,
        fields: ["int__counter_", "int___resource_id_", "id"],
      }).then(function (response) {
        response = response['records'][0]
        if (response === null || response === undefined) {
          throw new Error("record not defined");
        }
        return new MonitoringAlarm(
          response["id"]["value"],
          response["int___resource_id_"]["value"],
          response["int__counter_"]["value"],
        )
      }).catch(function (error) {
        console.log(error)
      })
  }
  incrementCounter() {
    let incremented_counter = (parseInt(this.counter) + 1);
    return kintone.api(
      kintone.api.url("/k/v1/record", true),
      "PUT", {
        app: 3, // url_monitoring_alarm
        id: this.id,
        int___resource_id_: this.resource_id,
        record: {
          int__counter_: {
            value: incremented_counter,
          },
        },
      },
      function (resp) {},
      function (resp) {}
    )
  }
}