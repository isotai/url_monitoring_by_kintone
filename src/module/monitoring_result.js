export class MonitoringResult {
  constructor() {}
  _save(resource, status, result) {
    // const records = _createRecordParams(check_result);
    const param = _createRecordParams(resource, status, result)
    const params = {
      "app": "2",
      "record": param,
    }
    return kintone.api(
      kintone.api.url("/k/v1/record", true),
      "POST",
      params,
      function (resp) {},
      function (resp) {}
    );
  }
}

const _createRecordParams = (resource, status, result) => {
  const param = {
    int__resource_id_: {
      value: resource.id
    },
    string__response_status_: {
      value: status
    },
    radio__result_: {
      value: result
    }
  }
  // check_result.map(result => ({
  //   int__resource_id_: {
  //     value: result['id'],
  //   },
  //   string__response_status_: {
  //     value: result['status'],
  //   },
  //   radio__result_: {
  //     value: result['result'],
  //   },
  // }))
  return param
};