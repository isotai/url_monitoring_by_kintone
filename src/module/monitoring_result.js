export class MonitoringResult {
  constructor(id, resource_id, response_status, result) {
    this.id = id
    this.resource_id = resource_id
    this.response_status = response_status
    this.result = result
  }
  _save(results) {
    const records = _createRecordParams(results)
    const params = {
      "app": "2",
      "records": records,
    }

    return kintone.api(
      kintone.api.url("/k/v1/records", true),
      "POST",
      params
    ).catch((error) => {
      console.log(error)
    });
  }
  _fetchByIds(ids) {
    const body = {
      app: 2,
      //  TODO: クエリでもshould_monitorで絞り混みする
      'query': `id in (${ids})`,
      'fields': [
        // TODO: Resourceクラスの定数にする
        "id",
        "int__resource_id_",
        "string__response_status_",
        "radio__result_",
      ],
    };
    return kintone.api(kintone.api.url("/k/v1/records", true), "GET", body).then(
      function (response) {
        //  TODO コンストラクーでresponseの値を分解するように変更する
        return response["records"].map(
          (r) =>
          new MonitoringResult(
            r["id"]["value"],
            r["int__resource_id_"]["value"],
            r["string__response_status_"]["value"],
            r["radio__result_"]["value"],
          )
        );
      }
    ).catch(function (error) {
      console.log(error);
    });
  }
}

const _createRecordParams = (results) => {
  return results.map((result) => {
    return {
      "int__resource_id_": {
        "value": result['id']
      },
      "string__response_status_": {
        "value": result['status']
      },
      "radio__result_": {
        "value": result['checked_result']
      }
    }
  })
};