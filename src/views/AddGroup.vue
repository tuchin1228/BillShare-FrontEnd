<template>
  <!-- <main>
    <form action="">
      <div>
        <label for="">群組名稱</label>
        <input type="text" v-model="GroupName" />
      </div>
      <div>
        <label for="">群組公告</label>
        <input type="text" v-model="GroupAnnouncement" />
      </div>
      <div>
        <label for="">群組封面</label>
        <input type="text" v-model="GroupBanner" />
      </div>
      <button type="button" @click="AddGroup">送出</button>
    </form>
  </main> -->
  <div>
    <h2 class="text-center text-3xl py-2 font-bold bg-blue-400 text-white">
      新增群組
    </h2>
  </div>
  <form class="mx-auto">
    <div class="mb-6">
      <label for="" class="text-xl font-bold my-2 block">群組名稱</label>
      <input
        v-model="GroupName"
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
        placeholder="輸入群組名稱"
      />
    </div>
    <div class="mb-6">
      <label for="" class="text-xl font-bold my-2 block">群組公告</label>
      <input
        v-model="GroupAnnouncement"
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
        placeholder="輸入群組公告"
      />
    </div>
    <div class="mb-6">
      <label for="" class="text-xl font-bold my-2 block">群組封面</label>
      <input
        @change="setBannerData"
        type="file"
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
        placeholder="輸入帳號"
      />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <RouterLink
        :to="{ name: 'grouplist' }"
        class="
          inline-block
          text-center
          my-2
          px-7
          py-3
          bg-gray-400
          text-white
          font-medium
          text-xl
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
        "
        >回上頁</RouterLink
      >
      <button
        type="button"
        class="
          inline-block
          my-2
          px-7
          py-3
          bg-red-400
          text-white
          font-medium
          text-xl
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
        "
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        @click="AddGroup"
      >
        送出
      </button>
    </div>
  </form>
</template>

<script setup>
import jwt_decode from "jwt-decode";
import axios from "axios";
import { reactive, ref, onMounted, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const router = useRouter();

let userId = ref();
let GroupName = ref();
let GroupAnnouncement = ref();
let GroupBanner = ref();
let BannerData = ref();

const setBannerData = (e) => {
  if (e.target.files) {
    BannerData.value = e.target.files[0];
  }
  console.log("BannerData.value", BannerData.value);
};

const AddGroup = async () => {
  console.log("userId", userId.value, typeof userId.value);
  console.log("GroupName", GroupName.value, typeof GroupName.value);

  let formfile = new FormData();
  formfile.append('userId',userId.value)
  formfile.append('GroupName',GroupName.value)
  formfile.append('GroupAnnouncement',GroupAnnouncement.value)
  formfile.append('formFile',BannerData.value)
  let res = await axios
    .post(
      `${process.env.API_URL}/api/group/Group`,formfile
      // {
      //   userId: userId.value,
      //   GroupName: GroupName.value,
      //   GroupAnnouncement: GroupAnnouncement.value,
      //   formFile: BannerData.value,
      // }
      ,
      {
        headers: {
          // "Content-Type": "application/json",
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
    alert("群組新增成功");
    router.push({ path: "/GroupList" });
  }
};

onMounted(async () => {
  let token = cookies.get("token");
  let jwtObj = jwt_decode(token);
  console.log("jwtObj", jwtObj, jwtObj.UserId);
  userId.value = jwtObj.UserId;
});
</script>

<style>
</style>