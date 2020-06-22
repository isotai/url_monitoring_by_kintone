export class MonitoringResult {
  constructor() {}

  _saveCheckResult(resources, status, result) {
    const params = {
      app: 2, // url_monitoring_result
      record: {
        int__resource_id_: {
          value: resources.id,
        },
        string__response_status_: {
          value: status,
        },
        radio__result_: {
          value: result,
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
}
