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
      const results = new Resource()._checkURLs(resources)
      return Promise.all(results)
    }).then((resp) => {
      resp.map((r) => {
        r['checked_result'] = r['status'] == "200" ? "ok" : "ng";
      })
      return new MonitoringResult()._save(resp)
    }).then((resp) => {
      return new MonitoringResult()._fetchByIds(resp['ids'])
    }).then((resp) => {
      const resource_ids = resp.filter(r => r.result === 'ng').map(r => {
        return r.resource_id
      })
      return new MonitoringAlarm()._fetchByResourceIds(resource_ids)
    }).then((resp) => {
      // resourceのalarm flgを確認する
      return new MonitoringAlarm()._incrementCounters(resp);
    }).then((resp) => {
      // アラート
    })
  return event;
});