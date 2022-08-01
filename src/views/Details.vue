<script setup>
import { FormatDateTime } from "@/Fun.js";
import axios from "axios";
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const route = useRoute();
const router = useRouter();

let ExpendData = reactive({});
let ExpendDetailData = reactive([]);
let groupId = ref();

async function GetExpendData() {
  let expendId = route.params.expendId;
  let res = await axios
    .get(
      `${process.env.API_URL}/api/Expend/ExpendDetails/${groupId.value}/${expendId}`,
      {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      }
    )
    .catch(function (error) {
      if (error.response.status == 401) {
        alert("會員驗證錯誤");
        cookies.remove("token");
        router.push({ path: "/login" });
      }
    });
  console.log(res);
  if (res.data.success) {
    Object.assign(ExpendData, res.data.expend);
    Object.assign(ExpendDetailData, res.data.expendDetail);
  }
}

onMounted(() => {
  groupId.value = route.params.groupId;
  GetExpendData();
});

const PayMan = computed(() => {
  return ExpendDetailData.filter((item) => item.type == 0);
});

const SplitMan = computed(() => {
  return ExpendDetailData.filter((item) => item.type == 1);
});
</script>

<template>
  <div>
    <h2 class="text-center text-3xl py-2 font-bold bg-blue-400 text-white">
      花費詳情
    </h2>
  </div>

  <p class="text-2xl font-bold">{{ FormatDateTime(ExpendData.createdDate) }}</p>
  <div class="flex justify-between items-center my-2">
    <h2 class="text-2xl font-bold">
      {{ ExpendData.itemName }}
    </h2>
    <h2 class="text-2xl font-bold text-red-500">
      NT${{ ExpendData.totalAmount }}
    </h2>
  </div>
  <hr />
  <ul class="my-2">
    <li
      v-for="item in PayMan"
      :key="item.Id"
      class="text-xl flex justify-between items-center my-1"
    >
      <span>{{ item.userName }} 付了</span>
      <span>NT$ {{ item.price }}</span>
    </li>
  </ul>

  <hr />

  <ul class="my-2">
    <li
      v-for="item in SplitMan"
      :key="item.Id"
      class="text-xl flex justify-between items-center my-1"
    >
      <span>{{ item.userName }} 應該分攤</span>
      <span>NT$ {{ item.price }}</span>
    </li>
  </ul>
  <RouterLink
    :to="{ name: 'home' }"
    class="
      block
      text-center
      my-2
      p-1
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
</template>
