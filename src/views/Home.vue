<script setup>
import { FormatDateTime } from "@/Fun.js";
import axios from "axios";
import { reactive, ref, onMounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const router = useRouter();
const route = useRoute();

let groupInfo = ref({});
let ExpendData = reactive([]);
let groupId = ref();

async function GetExpendData() {
  // console.log("cookies.get('token')", cookies.get("token"));
  let res = await axios
    .get(`${process.env.API_URL}/api/Expend/Expends/${groupId.value}`, {
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    })
    .catch(function (error) {
      if (error.response == 401) {
        alert("會員驗證錯誤");
        cookies.remove("token");
        router.push({ path: "/login" });
      } else {
        cookies.remove("token");
        router.push({ path: "/login" });
      }
    });
  // console.log(res);
  if (res.data.success) {
    console.log("res.data.expends", res.data.expends);
    Object.assign(ExpendData, res.data.expends);
  } else {
    cookies.remove("token");
    router.push({ path: "/login" });
  }
}

const RemoveExpend = async (ExpendId) => {
  let res = await axios
    .post(
      `${process.env.API_URL}/api/Expend/DeleteExpend/${ExpendId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      }
    )
    .catch(function (error) {
      if (error.response == 401) {
        alert("會員驗證錯誤");
        cookies.remove("token");
        router.push({ path: "/login" });
      } else {
        cookies.remove("token");
        router.push({ path: "/login" });
      }
    });
  console.log(res);
  if (res.data.success) {
    location.reload();
    // GetExpendData();
  }
};

// 取得群組資訊(驗證碼)
const GetGroupInfo = async () => {
  console.log('GetGroupInfo');
  let res = await axios
    .get(`${process.env.API_URL}/api/Group/GetGroup/${groupId.value}`, {
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    })
    .catch(function (error) {
      if (error.response.status == 401) {
        alert("會員驗證錯誤");
      }

      cookies.remove("token");
      router.push({ path: "/login" });
    });
  console.log(res);
  if (res.data.success) {
    groupInfo.value = res.data.group;
  } 
};

onMounted(async() => {
  groupId.value = route.params.groupId;
  await GetGroupInfo();
  await GetExpendData();
});
</script>

<template>
  <main>
    <div>
      <h2 class="text-center text-3xl py-2 font-bold bg-blue-400 text-white">
        群組動態
      </h2>
      <p class="p-1 text-lg bg-gray-200 mb-3">
        {{ groupInfo.groupAnnouncement }}
      </p>
    </div>
    <div class="my-2 p-1 grid grid-cols-2 md:grid-cols-5 gap-2">
      <RouterLink
        :to="{ name: 'grouplist' }"
        class="
          block
          text-center
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
      <RouterLink
        :to="{ name: 'checkout' }"
        class="
          block
          text-center
          p-1
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
        >結算</RouterLink
      >
      <RouterLink
        :to="{ name: 'addExpend' }"
        class="
          block
          text-center
          p-1
          bg-blue-600
          text-white
          font-medium
          leading-snug
          uppercase
          rounded
          shadow-md
          hover:bg-blue-700 hover:shadow-lg
          focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-blue-800 active:shadow-lg
          transition
          duration-150
          ease-in-out
          w-full
          text-xl
        "
        >新增花費</RouterLink
      >
      <RouterLink
        :to="{ name: 'addUser' }"
        class="
          block
          text-center
          p-1
          bg-green-500
          text-white
          font-medium
          leading-snug
          uppercase
          rounded
          shadow-md
          hover:bg-green-600 hover:shadow-lg
          focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-green-700 active:shadow-lg
          transition
          duration-150
          ease-in-out
          w-full
          text-xl
        "
        >新增團員</RouterLink
      >
      <RouterLink
        :to="{ name: 'editGroup' }"
        class="
          block
          text-center
          p-1
          bg-orange-500
          text-white
          font-medium
          leading-snug
          uppercase
          rounded
          shadow-md
          hover:bg-orange-600 hover:shadow-lg
          focus:bg-orange-600 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-orange-700 active:shadow-lg
          transition
          duration-150
          ease-in-out
          w-full
          text-xl
        "
        >編輯群組</RouterLink
      >
    </div>
    <div>
      <article
        class="border border-gray-100 rounded-xl shadow-xl p-3 m-2"
        v-for="item in ExpendData"
        :key="item.expendId"
      >
        <p class="text-2xl font-bold">{{ item.itemName }}</p>
        <p class="text-right text-red-500 font-bold text-xl">
          NT${{ item.totalAmount }}
        </p>
        <p class="text-right" v-if="item.remark">({{ item.remark }})</p>
        <p class="text-right">
          {{ FormatDateTime(item.createdDate) }}
        </p>
        <div class="grid grid-cols-2 gap-2">
          <RouterLink
            class="
              block
              my-1
              text-center
              p-1
              bg-blue-400
              text-white
              font-medium
              leading-snug
              uppercase
              rounded
              shadow-md
              hover:bg-blue-500 hover:shadow-lg
              focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0
              active:bg-blue-600 active:shadow-lg
              transition
              duration-150
              ease-in-out
              w-full
              text-xl
            "
            :to="{ name: 'details', params: { expendId: item.expendId } }"
            >詳情</RouterLink
          >
          <button
            type="button"
            @click="RemoveExpend(item.expendId)"
            class="
              block
              my-1
              text-center
              p-1
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
            刪除
          </button>
        </div>
      </article>
    </div>
  </main>
</template>
