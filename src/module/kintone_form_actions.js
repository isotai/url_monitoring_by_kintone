export const createShow = () => {
  kintone.events.on("app.record.create.show", function (e) {
    window.alert("レコード追加画面を開きました");
    e = changeThresholdDisabled(e);
    return e;
  });
  kintone.events.on("app.record.create.change.radio__should_alert_", function (e) {
    e = changeThresholdDisabled(e);
    return e;
  });
  // アラート有効時のみしきい値の入力を有効にする
  const changeThresholdDisabled = (e) => {
    e.record["int__threshold_"].disabled =
      e.record["radio__alert_"].value == "する" ? false : true;
    return e;
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
      function (resp) {
      },
      function (resp) {
      }
    );
  });
};