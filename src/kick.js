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


kintone.events.on('app.record.index.show', function (event) {
  new Resource()._fetchAllShouldMonitor()
    .then((resources) => {
      resources.forEach((resource) => {
        resource.checkURL()
          .then((status) => {
            const result = status == "200" ? "ok" : "ng";
            return new MonitoringResult()._save(resource, status, result);
          }).then(function () {
            const alarm = new MonitoringAlarm()._fetchByResourceId(resource.id)
            console.log(`alarm: ${alarm}`)
            return alarm
          }).then(function (monitoring_alarm) {
            if (monitoring_alarm === null || monitoring_alarm === undefined) {
              throw new Error("record not defined");
            }
            monitoring_alarm.incrementCounter();
            if (resource.radio__should_alert_ == 'する') {
              monitoring_alarm.alert(resource)
            }
          }).catch(function (error) {
            console.log(error)
          })
      });
    })
  return event;
});
// TODO: レコードは一括登録したいが、L17_fetchのpromiseに対してthenすると、
// checkURLよりも先に実行されてしまうので修正する