<template>
  <div>
    <h2 class="text-center text-3xl py-2 font-bold bg-blue-400 text-white">
      新增成員
    </h2>
  </div>
  <main>
    <!-- <button @click="addUser">產生邀請碼</button> -->
    <ul>
      <li
        v-for="user in GroupUsers"
        :key="user.userId"
        class="
          flex
          justify-between
          items-center
          my-2
          border-b border-gray-200
          py-2
        "
      >
        <span>{{ user.userName }}</span>
        <span>
          <button
            type="button"
            :disabled="user.admin"
            @click="removeGroupUser(user.userId)"
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
          >
            移除
          </button>
        </span>
      </li>
    </ul>
    <p>
      邀請碼:<br />
      <!-- <RouterLink
        :to="{
          name: 'invite',
          params: { ValidateCode: groupInfo.validateCode ? groupInfo.validateCode :'123' },
        }"
      > -->
      {{ `${InviteUrl}${groupInfo.groupId}/${groupInfo.validateCode}` }}
    </p>
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
  </main>
</template>

<script setup>
import axios from "axios";
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const route = useRoute();
const router = useRouter();
let groupId = ref();
let ValidateCode = ref("");
let groupInfo = ref({});

let GroupUsers = reactive([]); //群組所有人
let InviteUrl = ref(`${location.host}/invite/`);

// 取得群組所有使用者
const GetGroupUsers = async () => {
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
    console.log("users", res.data.users);
    // delete GroupUsers
    // let temp = [...res.data.users];
    // console.log(temp);
    // GroupUsers = res.data.users;
    // Object.assign(GroupUsers, JSON.parse(JSON.stringify([...res.data.users])));
    // GroupUsers = Object.assign(GroupUsers, []);
    // Object.assign(GroupUsers, null);
    // Object.assign(GroupUsers, JSON.parse(JSON.stringify(temp)));
    // GroupUsers = [1,2,3]

    Object.assign(GroupUsers, res.data.users);
    // GroupUsers = [1,2,3]
    // console.log(GroupUsers);
  }
};

// 取得群組資訊(驗證碼)
const GetGroupInfo = async () => {
  let res = await axios
    .get(`${process.env.API_URL}/api/Group/GetGroup/${groupId.value}`, {
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
    groupInfo.value = res.data.group;
  }
};

// 從群組中移除使用者
const removeGroupUser = async (userId) => {
  let res = await axios
    .post(
      `${process.env.API_URL}/api/Group/RemoveGroupUser`,
      {
        userId: userId,
        groupId: groupId.value,
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
    await GetGroupUsers();
  }
};

onMounted(async () => {
  groupId.value = route.params.groupId;
  await GetGroupInfo();
  await GetGroupUsers();
});
</script>

<style>
</style>