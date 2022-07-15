import { createApp } from "vue";
import App from "./App.vue";
import { ElMessage } from "element-plus";

import "element-plus/es/components/message/style/css";


(window as any).darenUrl = 'https://buyin.jinritemai.com/api/bidding/event?page=1&pageSize=20&order_by=1&status=1&category_version=1&msToken=ulhgUzwH3R1wJaie7J9BHhX5INootp8m-YWoyEQ8TnJyN0_qveghn_eByH3HjRnR62f9ET6OVhSsdKBNV3t3VIaCPIYc9ly526maRZoUt-y2ZYBZ-t3SJn6cqw-omSWY67YR&X-Bogus=DFSzswVOjfbANGA/SIICbsUClL9V&_signature=_02B4Z6wo00001b6BMqQAAIDAlQtpYVDKhBm-gTYAAA1yGuVBeimhpG.X93g7.ckUpYw5gklyF2p2OkqmjogrO4UIiwnfPDZyeX35smZ9y-iKbXX9Kk2Ah-3QHOm-E-ye6nwB6OLPM-XFmX-Q41'

  ; (function () {
    let originOpen = XMLHttpRequest.prototype.open;
    let originSend = XMLHttpRequest.prototype.send;

    // 重写open
    XMLHttpRequest.prototype.open = function () {
      // this.addEventListener('loadend', function(){ });
      // this.addEventListener('readystatechange', function (obj) { });

      this.addEventListener('load', function (obj: any) {
        var url = obj.target.responseURL; // obj.target -> this
        if (url.match('order_by')) {

          (window as any).darenUrl = url
        }

      });

      originOpen.apply(this, arguments as any);
    };

    // 重写send
    XMLHttpRequest.prototype.send = function () {
      //console.log('send', arguments);
      originSend.apply(this, arguments as any);
    };
  })();






(function () {
  GM_registerMenuCommand("招商助手开启", () => {

    createAppDiv();

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

    console.log('招商助手启动成功');
    ElMessage({
      message: '招商助手启动成功',
      type: "success",
    });
  })
})()



