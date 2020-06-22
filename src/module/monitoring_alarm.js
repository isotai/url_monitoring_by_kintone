export const createAram = (id) => {
  const params = {
    app: 3, // url_monitoring_alarm
    record: {
      int___resource_id_: {
        value: id,
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
};
