<template>
  <!-- <button type="button" @click="logout">登出</button> -->
  <!-- <RouterLink :to="{ name: 'addGroup' }">新增群組</RouterLink> -->

  <!-- <div>
    <input type="text" v-model="GroupName" />
    <button type="button" @click="AddGroup">新增群組</button>
  </div> -->

  <div>
    <h2 class="text-center text-3xl py-2 font-bold bg-blue-400 text-white">
      我的群組
    </h2>
  </div>

  <div class="px-2">
    <article class="grid grid-cols-2">
      <RouterLink
        :to="{ name: 'home', params: { groupId: group.groupId } }"
        v-for="group in GroupList"
        :key="group.id"
        class="relative rounded-xl overflow-hidden m-3"
        :style="[
          group.groupBanner
            ? {
                backgroundImage: `url(
                ${API_URL}/groupImages/${group.groupBanner}
              )`,
              }
            : {
                background: '#e1e1e1',
              },
          {
            height: '200px',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          },
        ]"
      >
        <!-- , -->
        <!-- {{ group.groupName }} --
      <RouterLink :to="{ name: 'home', params: { groupId: group.groupId } }"
        >查看</RouterLink
      > -->

        <div class="bg-black bg-opacity-70 absolute bottom-0 left-0 w-full p-2">
          <div class="text-xl text-white">
            {{ group.groupName }}
          </div>
        </div>
      </RouterLink>
    </article>
    <button
      type="button"
      class="
        inline-block
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
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
      @click="logout"
    >
      登出
    </button>
  </div>
  <div class="absolute bottom-20 right-20">
    <RouterLink
      :to="{ name: 'addGroup' }"
      class="bg-white rounded-full h-16 w-16 fixed shadow-xl hover:bg-gray-50"
    >
      <span
        class="
          text-blue-500 text-6xl
          font-bold
          absolute
          left-1/2
          top-1/2
          transform
          -translate-x-1/2 -translate-y-1/2
        "
        >+</span
      >
    </RouterLink>
  </div>
</template>

<script setup>
import jwt_decode from "jwt-decode";
import axios from "axios";
import { reactive, ref, onMounted, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const router = useRouter();
const API_URL = ref(process.env.API_URL);
let GroupList = reactive([]);
let userId = ref();
let GroupName = ref();

const GetGroups = async () => {
  let res = await axios
    .get(`${process.env.API_URL}/api/Group/Group/${userId.value}`, {
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
    Object.assign(GroupList, JSON.parse(JSON.stringify([...res.data.groups])));
  }
};

const AddGroup = async () => {
  console.log("userId", userId.value, typeof userId.value);
  console.log("GroupName", GroupName.value, typeof GroupName.value);
  let res = await axios
    .post(
      `${process.env.API_URL}/api/group/Group`,
      {
        userId: userId.value,
        GroupName: GroupName.value,
      },
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
    GetGroups();
  }
};

const logout = () => {
  cookies.remove("token");
  router.push({ path: "/login" });
};

onMounted(async () => {
  let token = cookies.get("token");
  let jwtObj = jwt_decode(token);
  console.log("jwtObj", jwtObj, jwtObj.UserId);
  userId.value = jwtObj.UserId;
  await GetGroups(userId.value);
});
</script>

<style>
</style>