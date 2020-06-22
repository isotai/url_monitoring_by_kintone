import { fetchResources } from "./resorce_check";
import { MonitoringResult } from "./monitoring_result";
import { MonitoringAlarm } from "./monitoring_alarm";

export const createShow = () => {
  kintone.events.on("app.record.create.show", function (e) {
    window.alert("レコード追加画面を開きました");

    fetchResources().then((resources) => {
      resources.map((r) => {
        if (r.should_monitor == "する") {
          r.checkURL().then((status) => {
            const result = status == "200" ? "ok" : "ng";
            // TODO: 一括で保存するように変更する
            new MonitoringResult()._saveCheckResult(r, status, result);
            // incrementCounter(r, result);
          });
        }
      });
    });

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
