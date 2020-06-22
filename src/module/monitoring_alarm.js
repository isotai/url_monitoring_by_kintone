export class MonitoringAlarm {
  constructor() {
  };

  _createAram(resource_id) {
    const params = {
      app: 3, // url_monitoring_alarm
      record: {
        int___resource_id_: {
          value: resource_id,
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
      function (resp) { },
      function (resp) { }
    );
  }
};

//  TODO 一括更新するよう変更する
// export const incrementCounter = (resource, result) => {
//   const body = {
//     app: 3,
//     int___resource_id_: resource.id,
//     fields: ["radio__should_alert_"],
//   };
//   return kintone
//     .api(kintone.api.url("/k/v1/records", true), "GET", {
//       app: 3,
//       fields: ["int__counter_"],
//       fields: ["int___resource_id_"],
//       fields: ["id"],
//     })
//     .then(function (response) {
//       const incremented_counter = response.int__counter_ + 1;
//       console.log(response);
//       return kintone.api(
//         kintone.api.url("/k/v1/record", true),
//         "PUT",
//         {
//           app: 3, // url_monitoring_alarm
//           id: response.id,
//           int___resource_id_: response.int___resource_id_,
//           record: {
//             int__counter_: {
//               value: incremented_counter,
//             },
//           },
//         },
//         function (resp) {},
//         function (resp) {}
//       );
//     })
//     .catch(function (resp) {
//       console.log(resp);
//     });
// };
//
