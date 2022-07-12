<template>
  <el-affix :offset="120" position="top">
    <el-popover placement="bottom" :width="300" trigger="hover">
      <template #reference>
        <el-button plain>批量报名</el-button>
      </template>

      <template #default>
        <div class="block">
          <el-input v-model="myInfoName" placeholder="Please input" />
          <el-button type="primary" @click="selectTemplate">编辑</el-button>
        </div>

        <span class="demonstration">间隔</span>
        <el-slider size="small" show-stops :step="1" v-model="timeout" :max="10" />

        <div class="block">
          <span class="demonstration">数量</span>
          <el-input-number size="small" v-model="batchNum" :step="100" />
        </div>
        <el-divider />
        <el-progress :percentage="50">
          <el-button :loading="loading" type="danger" round @click="start">{{
              startText
          }}</el-button>
        </el-progress>
      </template>
    </el-popover>
  </el-affix>

  <el-dialog v-model="dialogVisible" title="模板信息编辑" width="30%" :before-close="handleClose">
    <el-form :model="form" label-width="120px">
      <el-form-item label="选择模板">
        <el-select v-model="selectedTemplate" filterable allow-create default-first-option :reserve-keyword="false"
          placeholder="请选择一个模板">
          <el-option v-for="item in myInfos" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="合作价格">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="合作佣金率">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="供货库存">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="联系人">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="手机号">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="微信号">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="商品卖点">
        <el-input type="textarea" v-model="form.name" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">新增模板</el-button>
        <el-button>删除模板</el-button>
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
import { computed, reactive, ref } from "vue";
import axios from 'axios'
interface params {
  event_id: string
  promotion_id: string
  price: number
  rate: number
  support_custom_rate: number
  stock: number
  delivery_time_type: number
  contact_user: string
  phone_num: string
  wechat_id: string
  remark: string
  institution_activity_id: number

}

interface templateInfo {
  price: number
  rate: number
  support_custom_rate: number
  stock: number
  delivery_time_type: number
  contact_user: string
  phone_num: string
  wechat_id: string
  remark: string
  institution_activity_id: number
}



function signup(data: params, timeout: number) {
  return axios({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    url: 'https://buyin.jinritemai.com/api/bidding/event/promotion/apply', method: "post", data,
    //转换为请求体
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'));
        return ret
      }
    ],
  })


}



const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
let selectedTemplate = reactive<templateInfo>({
  price: 12300,
  rate: 31,
  support_custom_rate: 0,
  stock: 123,
  delivery_time_type: 1,
  contact_user: '1aa',
  phone_num: '15311111111',
  wechat_id: '',
  remark: '123123',
  institution_activity_id: 429143,
});

//模板信息
let myInfos = [
  {
    label: "HTML",
    value: "value",
  },
];

let myInfoName = ref("name");

let timeout = ref(1);
let batchNum = ref(100);


let loading = ref(false)
let startText = computed(() => loading ? '启动' : '运行中')

const dialogVisible = ref(false);

function getCurrentEventId() {
  let match = document.URL.match(/event_id=\d+/)
  if (match)
    return match[0].replace('event_id=', '')
  else throw Error('查询evenid出错')
}

async function getPromotionIds(num: number): Promise<string[]> {
  let res = await axios.get(`https://buyin.jinritemai.com/api/bidding/event/promotion?page=1&pageSize=${num}&event_id=${getCurrentEventId()}`)
  if (res.data.msg === 'success') {

    return res.data.data.map((item: any) => item.promotion_id)
  }
  else {
    return await getPromotionIds(num)
  }
}

const start = async () => {
  let tempData: params
  let ids = await getPromotionIds(batchNum.value)
  for (let promotion_id of ids) {
    tempData = {
      event_id: getCurrentEventId(),
      promotion_id,
      ...selectedTemplate
    }

    let { data } = await signup(tempData)
    if (data.msg === 'success') {
      ElNotification({
        title: '报名成功！',
        message: promotion_id + '报名成功！',
        type: 'success',
      })
    } else {
      ElNotification({
        title: '报名失败！',
        message: data.msg,
        type: 'error',
      })
    }


  }


};

const selectTemplate = () => {
  dialogVisible.value = true;
};

const onSubmit = () => {
  console.log(selectedTemplate);
  console.log(myInfos);
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
