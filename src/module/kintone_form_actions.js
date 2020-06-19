export const kintone_form_show_events = () => {
  // アラート有効時のみしきい値の入力を有効にする
  kintone.events.on("app.record.create.show", function (event) {
    window.alert("レコード追加画面を開きました");
    event = changeThresholdDisabled(event);
    return event;
  });
  kintone.events.on("app.record.create.change.radio__alert_", function (event) {
    event = changeThresholdDisabled(event);
    return event;
  });
  const changeThresholdDisabled = (event) => {
    event.record["int__threshold_"].disabled =
      event.record["radio__alert_"].value == "する" ? false : true;
    return event;
  };
};
