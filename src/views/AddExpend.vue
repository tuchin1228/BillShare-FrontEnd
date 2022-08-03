<script setup>
import axios from "axios";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { reactive, ref, onMounted, computed } from "vue";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const route = useRoute();
const router = useRouter();

let groupId = ref();
const ExpendDate = ref();
let ExpenData = reactive({
  expendDate: "",
  itemName: "",
  remark: "",
  totalAmount: "",
});
let GroupUsers = reactive([]); //群組所有人
let PayUsers = reactive([]); //付錢的人
let ShareUsers = reactive([]); //分攤的人

const GetUsers = async () => {
  let res = await axios
    .get(`${process.env.API_URL}/api/user/GetGroupUsers/${groupId.value}`, {
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    })
    .catch(function (error) {
      if (error.response.status == 401) {
        alert("會員驗證錯誤");
        cookies.remove("token");
        router.push({ path: "/login" });
      }
    });
  console.log(res);
  if (res.data.success) {
    Object.assign(GroupUsers, JSON.parse(JSON.stringify([...res.data.users])));
    Object.assign(PayUsers, JSON.parse(JSON.stringify([...res.data.users])));
    Object.assign(ShareUsers, JSON.parse(JSON.stringify([...res.data.users])));
  }
};
const testcomp = computed(() => {
  return 0;
});

const SubmitExpend = async () => {
  if (!ExpenData.itemName) {
    alert("品項為必填");
    return null;
  } else if (!ExpenData.totalAmount) {
    alert("總價為必填");
    return null;
  } else if (PayRemainPrice.value != 0) {
    console.log("付款金額錯誤", PayRemainPrice.value);
    alert("付款金額錯誤", PayRemainPrice);
    return null;
  } else if (ShareRemainPrice.value != 0) {
    console.log("分攤金額錯誤", ShareRemainPrice.value);
    alert("分攤金額錯誤", ShareRemainPrice);
    return null;
  }

  PayUsers = PayUsers.filter((user) => user.price > 0); //沒付錢不用傳
  PayUsers.forEach((user) => (user.type = 0));
  ShareUsers = ShareUsers.filter((user) => user.share !== false); //沒分攤不用傳
  ShareUsers.forEach((user) => (user.type = 1));
  console.log(PayUsers, ShareUsers);
  let obj = {
    itemName: ExpenData.itemName,
    totalAmount: ExpenData.totalAmount,
    remark: ExpenData.remark,
    GroupId: groupId.value,
    CreatedDate: new Date(ExpendDate.value),
    expendDetail: [...PayUsers, ...ShareUsers],
  };

  // console.log("new Date(ExpendDate.value)", new Date(ExpendDate.value));
  let res = await axios.post(`${process.env.API_URL}/api/Expend/Expend`, obj, {
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
  console.log(res);
  if (res.data.success) {
    router.push({ name: "home", params: { groupId: groupId.value } });
  }
};

const PayRemainPrice = computed(() => {
  return (
    ExpenData.totalAmount -
    PayUsers.reduce((pre, cur) => {
      return pre + (cur.price ? cur.price : 0);
    }, 0)
  );
});

const ShareRemainPrice = computed(() => {
  return (
    ExpenData.totalAmount -
    ShareUsers.reduce((pre, cur) => {
      return pre + (cur.price && cur.share ? cur.price : 0);
    }, 0)
  );
});

onMounted(() => {
  groupId.value = route.params.groupId;
  let date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  ExpendDate.value = date.toJSON().slice(0, 16);
  GetUsers();
});
</script>

<template>
  <div>
    <h2 class="text-center text-3xl py-2 font-bold bg-blue-400 text-white">
      新增花費
    </h2>
  </div>
  <main  class="px-2">
    <form class="">
      <div class="mb-6">
        <label for="" class="text-xl font-bold my-2 block">日期</label>
        <input
          v-model="ExpendDate"
          type="datetime-local"
          class="
            form-control
            block
            w-full
            px-4
            py-2
            text-xl
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700
            focus:bg-white
            focus:border-blue-600
            focus:outline-none
          "
          placeholder="輸入群組名稱"
        />
      </div>
      <div class="mb-6">
        <label for="" class="text-xl font-bold my-2 block">品項</label>
        <input
          v-model="ExpenData.itemName"
          type="text"
          class="
            form-control
            block
            w-full
            px-4
            py-2
            text-xl
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700
            focus:bg-white
            focus:border-blue-600
            focus:outline-none
          "
          placeholder="輸入品項"
        />
      </div>
      <div class="mb-6">
        <label for="" class="text-xl font-bold my-2 block">總價</label>
        <input
          v-model="ExpenData.totalAmount"
          type="number"
          class="
            form-control
            block
            w-full
            px-4
            py-2
            text-xl
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700
            focus:bg-white
            focus:border-blue-600
            focus:outline-none
          "
          placeholder="輸入總價"
        />
      </div>
      <div class="mb-6">
        <label for="" class="text-xl font-bold my-2 block">備註</label>
        <input
          v-model="ExpenData.remark"
          type="text"
          class="
            form-control
            block
            w-full
            px-4
            py-2
            text-xl
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700
            focus:bg-white
            focus:border-blue-600
            focus:outline-none
          "
          placeholder="備註"
        />
      </div>
    </form>
    <!-- <p>
      日期: <input v-model="ExpendDate" type="datetime-local" name="" id="" />
    </p> -->
    <!-- <p>品項: <input type="text" v-model="ExpenData.itemName" /></p> -->
    <!-- <p>總價: <input type="text" v-model="ExpenData.totalAmount" /></p> -->
    <!-- <p>備註: <textarea type="text" v-model="ExpenData.remark" /></p> -->
    <article class="border border-gray-100 rounded-xl shadow-lg p-3 my-2">
      <p class="text-xl font-bold">付錢的人：(剩餘{{ PayRemainPrice }})</p>
      <ul>
        <li v-for="user in PayUsers" :key="user.userId" class="my-2">
          <span class="text-lg text-blue-600 font-bold"
            >{{ user.userName }}
          </span>
          <span
            >　付了
            <input
              type="number"
              v-model="user.price"
              :disabled="!ExpenData.totalAmount"
              class="
                form-control
                block
                w-full
                px-4
                py-2
                text-xl
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700
                focus:bg-white
                focus:border-blue-600
                focus:outline-none
                disabled:bg-gray-200
              "
          /></span>
        </li>
      </ul>
    </article>
    <article class="border border-gray-100 rounded-xl shadow-lg p-3 my-2">
      <p class="text-xl font-bold">要分攤的人:(剩餘{{ ShareRemainPrice }})</p>
      <ul>
        <li v-for="user in ShareUsers" :key="user.userId" class="my-2">
          <label :for="user.userId"
            ><input type="checkbox" :id="user.userId" v-model="user.share" />
            <span class="text-lg text-blue-600 font-bold mx-1"
              >{{ user.userName }}
            </span>
            <input
              type="number"
              v-model="user.price"
              :disabled="!ExpenData.totalAmount"
              class="
                form-control
                block
                w-full
                px-4
                py-2
                text-xl
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700
                focus:bg-white
                focus:border-blue-600
                focus:outline-none
                disabled:bg-gray-200
              "
          /></label>
        </li>
      </ul>
    </article>
    <div class="grid grid-cols-2 gap-2 my-5">
      <RouterLink
        :to="{ name: 'home' }"
        class="
          block
          text-center
          p-2
          bg-gray-400
          text-white
          font-medium
          leading-snug
          uppercase
          rounded
          shadow-md
          hover:bg-gray-500 hover:shadow-lg
          focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-gray-600 active:shadow-lg
          transition
          duration-150
          ease-in-out
          w-full
          text-xl
        "
        >回上頁</RouterLink
      >
      <button
        type="button"
        @click="SubmitExpend"
        class="
          block
          text-center
          p-2
          bg-red-400
          text-white
          font-medium
          leading-snug
          uppercase
          rounded
          shadow-md
          hover:bg-red-500 hover:shadow-lg
          focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-red-600 active:shadow-lg
          transition
          duration-150
          ease-in-out
          w-full
          text-xl
        "
      >
        送出
      </button>
    </div>
  </main>
</template>
