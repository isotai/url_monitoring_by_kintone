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

  _fetchByResourceIds(resource_ids) {
    return kintone
      .api(kintone.api.url("/k/v1/records", true), "GET", {
        app: 3,
        query: `int___resource_id_ in (${resource_ids})`,
        fields: ["int__counter_", "int___resource_id_", "id"],
      }).then(function (response) {
        return response["records"].map((r) => {
          if (r.length === 0) {
            throw new Error("record not defined");
          }
          return new MonitoringAlarm(
            r["id"]["value"],
            r["int___resource_id_"]["value"],
            r["int__counter_"]["value"],
          )
        });
      }).catch(function (error) {
        console.log(error)
      })
  }
  _incrementCounters(monitoring_alarms) {
    const records = _createRecordParams(monitoring_alarms)
    const body = {
      "app": "3",
      "records": records,
    }
    return kintone.api(
      kintone.api.url("/k/v1/records", true),
      "PUT",
      body
    ).catch((error) => {
      console.log(error)
    });
  }
  alert(resource) {
    if (resource.radio__should_alert_ == 'しない') {
      return
    };
    if (resource.threshold >= this.counter) {
      console.log('alert!')
      console.log('reset counter!')
    }
  }
}
const _createRecordParams = (monitoring_alarms) => {
  return monitoring_alarms.map((ma) => {
    const incremented_counter = (parseInt(ma.counter) + 1);
    return {
      "id": ma.id,
      'record': {
        "int__counter_": {
          "value": incremented_counter
        }
      },
    }
  })
};