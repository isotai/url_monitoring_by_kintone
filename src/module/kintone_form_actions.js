import {
  Resource
} from "./resource";
import {
  MonitoringResult
} from "./monitoring_result";
import {
  MonitoringAlarm
} from "./monitoring_alarm";

export const createShow = () => {
  kintone.events.on("app.record.create.show", function (e) {
    window.alert("レコード追加画面を開きました");

    // TODO: レコードは一括登録したいが、L17_fetchのpromiseに対してthenすると、
    // checkURLよりも先に実行されてしまうので修正する
    new Resource()._fetchAllShouldMonitor()
      .then((resources) => {
        resources.forEach((resource) => {
          resource.checkURL()
            .then((status) => {
              const result = status == "200" ? "ok" : "ng";
              return new MonitoringResult()._save(resource, status, result);
            }).then(function () {
              const alarm = new MonitoringAlarm()._fetchByResourceId(resource.id)
              console.log(`alarm: ${alarm}`)
              return alarm
            }).then(function (monitoring_alarm) {
              if (monitoring_alarm === null || monitoring_alarm === undefined) {
                throw new Error("record not defined");
              }
              monitoring_alarm.incrementCounter();
            }).catch(function (error) {
              console.log(error)
            })
        });
      })
    e = changeThresholdDisabled(e);
    return e;
  });
  kintone.events.on("app.record.create.change.radio__should_alert_", function (
    e
  ) {
    e = changeThresholdDisabled(e);
    return e;
  });
  // アラート有効時のみしきい値の入力を有効にする
  const changeThresholdDisabled = (e) => {
    e.record["int__threshold_"].disabled =
      e.record["radio__should_alert_"].value == "する" ? false : true;
    return e;
  };
};

export const createAfterSave = () => {
  kintone.events.on("app.record.create.submit.success", function (e) {
    new MonitoringAlarm()._createAram(e.recordId);
  });
};