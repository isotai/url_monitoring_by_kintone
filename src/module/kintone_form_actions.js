import { fetchResources } from "./resorce_check";
export const createShow = () => {
  kintone.events.on("app.record.create.show", function (e) {
    window.alert("レコード追加画面を開きました");

    fetchResources().then((resources) => {
      resources.map((r) => {
        r.checkURL().then((status) => {
          const result = status == "200" ? "ok" : "ng";
          // 一括で保存するように変更する
          saveCheckResult(r.id, status, result);
        });
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

  const saveCheckResult = (id, status, result) => {
    const params = {
      app: 2, // url_monitoring_result
      record: {
        int__resource_id_: { value: id },
        string__response_status_: { value: status },
        radio__result_: { value: result },
      },
    };
    console.log(params);
    kintone.api(
      kintone.api.url("/k/v1/record", true),
      "POST",
      params,
      function (resp) {},
      function (resp) {}
    );
  };
};

export const createAfterSave = () => {
  kintone.events.on("app.record.create.submit.success", function (e) {
    const recordId = e.recordId;
    const params = {
      app: 3, // url_monitoring_alarm
      record: {
        int___resource_id_: { value: recordId },
        int__counter_: { value: 0 },
        int__alert_history_: { value: 0 },
      },
    };
    kintone.api(
      kintone.api.url("/k/v1/record", true),
      "POST",
      params,
      function (resp) {},
      function (resp) {}
    );
  });
};
