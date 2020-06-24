import {
  Resource
} from "./module/resource";
import {
  MonitoringResult
}
from "./module/monitoring_result";
import {
  MonitoringAlarm
}
from "./module/monitoring_alarm";

// TODO: レコードは一括登録するようにリファクタする
// checkURLsメソッドを作って、引数にresourceの配列を渡す。返り値で結果とidの配列を返す。
kintone.events.on('app.record.index.show', function (event) {
  new Resource()._fetchAllShouldMonitor()
    .then((resources) => {
      resources.forEach((resource) => {
        let result
        resource.checkURL()
          .then((status) => {
            result = status == "200" ? "ok" : "ng";
            let monitoring_result = new MonitoringResult()._save(resource, status, result);
            if (result == 'ok') {
              // エラーで抜けるの気持ち悪い... 一括でレコード処理するように変更すれば成功したレコードは事前に抜いておけるはず。
              throw new Error('suspend flow')
            }
            return monitoring_result
          }).then(function () {
            return new MonitoringAlarm()._fetchByResourceId(resource.id)
          }).then(function (monitoring_alarm) {
            if (monitoring_alarm === null || monitoring_alarm === undefined) {
              throw new Error("record not defined!!");
            }
            monitoring_alarm.incrementCounter();
            if (resource.radio__should_alert_ == 'する') {
              // monitoring_alarm.alert(resource)
            }
          }).catch(function (error) {
            console.log(error)
          })
      });
    })
  return event;
});