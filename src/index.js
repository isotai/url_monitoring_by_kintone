import {
  createShow,
  createAfterSave
} from "./module/kintone_form_actions";
createShow();
createAfterSave();

kintone.events.on('app.record.edit.submit.success', function (event) {
  window.alert("更新");
  return event;
});