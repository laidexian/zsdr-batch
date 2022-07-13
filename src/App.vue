<template>
  <el-affix :offset="120" position="top">
    <el-popover placement="bottom" :width="300" v-model:visible="popoverVisible">
      <template #reference>
        <el-button plain @click="p">批量报名</el-button>
      </template>

      <template #default>
        <div class="block">
          <el-select v-model="selectedTemplateInfo" value-key="templateName" placeholder="请选择一个模板"
            @change="selectTemplate">
            <el-option v-for="item in templateInfos" :key="item.templateName" :label="item.templateName"
              :value="item" />
          </el-select>

          <el-button type="primary" @click="editTemplate">编辑</el-button>
        </div>

        <span class="demonstration">间隔</span>
        <el-slider size="small" show-stops :step="1" v-model="timeout" :max="10" />

        <div class="block">
          <span class="demonstration">数量</span>
          <el-input-number size="small" v-model="batchNum" :step="100" />
        </div>
        <el-progress :percentage="percentage"></el-progress>

        <el-divider />
        <el-button-group>
          <el-button :loading="loading" type="warning" @click="start">{{
              startText
          }}</el-button>
          <el-button type="danger" :disabled="!loading" @click="loading = false">停止</el-button>
        </el-button-group>
      </template>
    </el-popover>
  </el-affix>

  <el-dialog v-model="dialogVisible" title="模板信息编辑" width="50%" :before-close="handleClose">

    <el-table :data="templateInfos" style="width: 100%" table-layout="auto">
      <el-table-column prop="templateName" label="模板名称" />
      <el-table-column prop="price" label="合作价格" />
      <el-table-column prop="rate" label="合作佣金率" />
      <el-table-column prop="stock" label="供货库存" />
      <el-table-column prop="delivery_time_type" label="发货周期" />
      <el-table-column prop="contact_user" label="联系人" />
      <el-table-column prop="phone_num" label="手机号" />
      <el-table-column prop="wechat_id" label="微信号" />
      <el-table-column prop="remark" label="商品卖点" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="danger" size="small" @click.prevent="deleteRow(scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-form :model="templateForm" label-width="120px">
      <el-form-item label="消息模板名称">
        <el-input v-model="templateForm.templateName" />
      </el-form-item>
      <el-form-item label="合作价格">
        <el-input v-model="templateForm.price" />
      </el-form-item>

      <el-form-item label="合作佣金率">
        <el-input v-model="templateForm.rate" />
      </el-form-item>

      <el-form-item label="供货库存">
        <el-input v-model="templateForm.stock" />
      </el-form-item>

      <el-form-item label="发货周期">
        <el-select v-model="templateForm.delivery_time_type" default-first-option>
          <el-option v-for="item of 4" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="联系人">
        <el-input v-model="templateForm.contact_user" />
      </el-form-item>

      <el-form-item label="手机号">
        <el-input v-model="templateForm.phone_num" />
      </el-form-item>

      <el-form-item label="微信号">
        <el-input v-model="templateForm.wechat_id" />
      </el-form-item>

      <el-form-item label="商品卖点">
        <el-input type="textarea" v-model="templateForm.remark" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">新增模板</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="warning" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, Ref, ref } from "vue";

import {
  ElMessage,
  ElMessageBox,
  ElNotification
} from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/es/components/message-box/style/css'

import axios from "axios";
interface params {
  templateName: string;
  event_id: string;
  promotion_id: string;
  price: number;
  rate: number;
  support_custom_rate: number;
  stock: number;
  delivery_time_type: number;
  contact_user: string;
  phone_num: string;
  wechat_id: string;
  remark: string;
  institution_activity_id: number;
}

function signup(params: params) {
  let data = {
    event_id: params.event_id,
    promotion_id: params.promotion_id,
    price: Math.round(Number(params.price) * 100),
    rate: Number(params.rate),
    support_custom_rate: 0,
    stock: Number(params.stock),
    delivery_time_type: Number(params.delivery_time_type),
    contact_user: params.contact_user,
    phone_num: params.phone_num,
    wechat_id: params.wechat_id,
    remark: params.remark,
    institution_activity_id: params.institution_activity_id
  };
  return axios({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    url: "https://buyin.jinritemai.com/api/bidding/event/promotion/apply",
    method: "post",
    data,
    //转换为请求体
    transformRequest: [
      function (data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.lastIndexOf("&"));
        return ret;
      },
    ],
  });
}



//模板信息
let templateInfos: Ref<any[]> = ref([])
freshTemplateInfos()


let selectedTemplateInfo = ref({});
let str = localStorage.getItem('selectedTemplateInfo')
selectedTemplateInfo.value = JSON.parse(str as string)
let templateForm: any = reactive({})

let timeout = ref(1);
let batchNum = ref(100);

let percentage = ref(1);

let loading = ref(false);
let startText = computed(() => (loading.value ? "运行中..." : "启动"));

const dialogVisible = ref(false);
const popoverVisible = ref(false);


function getCurrentEventId() {
  let match = document.URL.match(/event_id=\d+/);
  if (match) return match[0].replace("event_id=", "");
  else throw Error("查询evenid出错");
}

async function getPromotions(num: number): Promise<any[]> {
  let res = await axios.get(
    `https://buyin.jinritemai.com/api/bidding/event/promotion?page=1&pageSize=${num}&event_id=${getCurrentEventId()}`
  );
  if (res.data.msg === "success") {
    return res.data.data.map((item: any) => {
      return {
        promotion_id: item.promotion_id,
        institution_activity_id: item.institution_activity_id,
      };
    });
  } else {
    return await getPromotions(num);
  }
}
const deleteRow = (index: number) => {
  templateInfos.value.splice(index, 1)
  saveTemplateInfos()
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}
const start = async () => {
  loading.value = !loading.value;
  if (loading.value) {
    let tempData: any;
    let promotions = await getPromotions(batchNum.value);

    let index = 0;
    for (let promotion of promotions) {
      //插入断点
      if (!loading.value) {
        ElMessage({
          message: "手动停止",
          type: "warning",
        });
        return;
      }

      percentage.value = Math.round((index++ / promotions.length) * 100);
      tempData = {
        event_id: getCurrentEventId(),
        promotion_id: promotion.promotion_id,
        institution_activity_id: promotion.institution_activity_id,
        ...selectedTemplateInfo.value,
      };

      let { data } = await signup(tempData);
      if (data.msg === "success") {
        ElNotification({
          title: "报名成功！",
          message: promotion.promotion_id + "报名成功！",
          type: "success",
        });
      } else {
        ElNotification({
          title: "报名失败！",
          message: data.msg,
          type: "error",
        });
      }
    }
  }
};

const editTemplate = () => {
  dialogVisible.value = true;
};
function freshTemplateInfos() {
  let str = localStorage.getItem('templateInfos')
  if (str) {
    let temp = JSON.parse(str)
    templateInfos.value = temp
  } else {
    templateInfos.value = []
  }
}
function saveTemplateInfos() {
  localStorage.setItem("templateInfos", JSON.stringify(templateInfos.value));
}
const p = () => {
  popoverVisible.value = !popoverVisible.value;
};
const onSubmit = () => {
  console.log(templateForm);

  if (!templateForm || !templateForm.templateName || !templateForm.templateName.trim()) throw Error("模板名字不能为空");

  templateInfos.value.push(templateForm);

  console.log(templateInfos);

  saveTemplateInfos()
  ElMessage({
    message: "新增成功",
    type: "success",
  });
};




const selectTemplate = (val: any) => {
  selectedTemplateInfo.value = val;
  localStorage.setItem('selectedTemplateInfo', JSON.stringify(val))
};

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("可能还有未保存的数据，您确定要关闭吗？", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.block {
  display: flex;
  align-items: center;
}

.demonstration {
  font-size: 14px;
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
</style>
