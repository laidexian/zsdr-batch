import { createApp } from "vue";
import App from "./App.vue";
import {
  ElMessage,
  ElMessageBox,
  ElNotification
} from 'element-plus'

import 'element-plus/es/components/message/style/css'
createAppDiv();

let str = localStorage.getItem("templateInfos");
//模板信息






const app = createApp(App);
app.mount("#zsbatch");
function createAppDiv() {
  let app = document.createElement("div");
  app.id = "zsbatch";
  let ul = document.querySelector(
    "#portal > section > div > section > aside > div > ul"
  );
  ul?.appendChild(app);
}

//全局异常捕获
//系统错误捕获
const errorHandler = (error: any) => {
  ElMessage({
    message: error.message,
    type: "error",
  });
};

app.config.errorHandler = errorHandler;
