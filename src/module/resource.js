export class Resource {
  constructor(id, url, should_monitor, should_alert, threshold) {
    this.id = id;
    this.url = url;
    this.should_monitor = should_monitor;
    this.should_alert = should_alert;
    this.threshold = threshold;
  }
  checkURL() {
    return kintone.proxy(this.url, "GET", {}, {})
      .then(
        function (body, status, headers) {
          return body[1];
        }
      ).catch(function (error) {
        console.log(error)
      })
  }
  _fetch() {
    const body = {
      app: 1,
      //  TODO: クエリでもshould_monitorで絞り混みする
      // query: 'radio__should_monitor_ == "する"  limit 100',
      fields: [
        // TODO: Resourceクラスの定数にする
        "id",
        "string__url_",
        "radio__should_monitor_",
        "radio__should_alert_",
        "int__threshold_",
      ],
    };
    return kintone.api(kintone.api.url("/k/v1/records", true), "GET", body).then(
      function (response) {
        //  TODO コンストラクーでresponseの値を分解するように変更する
        console.log('fetch')
        return response["records"].map(
          (r) =>
          new Resource(
            r["id"]["value"],
            r["string__url_"]["value"],
            r["radio__should_monitor_"]["value"],
            r["radio__should_alert_"]["value"],
            r["int__threshold_"]["value"]
          )
        );
      }
    ).catch(function (error) {
      console.log(error);
    });
  }
}