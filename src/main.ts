import { createApp } from "vue";
import App from "./App.vue";

createAppDiv();

let str = localStorage.getItem("templateInfos");
//模板信息

if (str) {
  let t = JSON.parse(str);
  window.templateInfos = t;
  console.log(templateInfos);
  
}else{
    window.templateInfos=[]
}





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
