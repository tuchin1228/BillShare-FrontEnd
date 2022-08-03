<template>
  <!-- <main>
    <h2>註冊</h2>
    <label for="">帳號：<input type="text" v-model="account" /></label>
    <label for="">密碼：<input type="text" v-model="password" /></label>
    <label for="">使用者名稱：<input type="text" v-model="UserName" /></label>

    <button type="button" @click="Register">註冊</button>
    <div>
      <RouterLink :to="{ name: 'login' }">前往登入</RouterLink>
    </div>
  </main> -->
  <form class="">
    <div class="mb-6">
      <label for="" class="text-xl font-bold my-2 block">帳號：</label>
      <input
        v-model="account"
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
        placeholder="輸入帳號"
      />
    </div>

    <!-- Password input -->
    <div class="mb-6">
      <label for="" class="text-xl font-bold my-2 block">密碼：</label>
      <input
        v-model="password"
        type="password"
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
        placeholder="輸入密碼"
      />
    </div>

    <div class="mb-6">
      <label for="" class="text-xl font-bold my-2 block">使用者名稱：</label>
      <input
        v-model="UserName"
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
        placeholder="輸入帳號"
      />
    </div>

    <button
      type="button"
      class="
        inline-block
        my-2
        px-7
        py-3
        bg-blue-600
        text-white
        font-medium
        text-xl
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
      "
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
      @click="Register"
    >
      確認註冊
    </button>

    <RouterLink
      :to="{ name: 'login' }"
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
        text-center
      "
      >回登入</RouterLink
    >
  </form>
</template>

<script setup>
import { useCookies } from "vue3-cookies";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { cookies } = useCookies();
const account = ref("");
const password = ref("");
const UserName = ref("");

const Register = async () => {
  console.log(account, password, UserName);
  let res = await axios
    .post(
      `${process.env.API_URL}/api/User/RegisterUser`,
      {
        UserId: account.value,
        Password: password.value,
        UserName: UserName.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch(function (error) {
      if (error.response.status == 400) {
        alert("參數錯誤");
        cookies.remove("token");
      }
    });
  console.log(res);
  if (res.data.success) {
    Login();
    //   cookies.set("token", res.data.token);
    //   router.push({ name: "grouplist" });
  }
};

const Login = async () => {
  // console.log(UserId.value);
  let res = await axios
    .post(
      `${process.env.API_URL}/api/Login/Login`,
      {
        UserId: account.value,
        Password: password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch(function (error) {
      if (error.response.status == 400) {
        alert("參數錯誤");
        cookies.remove("token");
      }
    });
  console.log(res);
  if (res.data.success) {
    cookies.set("token", res.data.token);
    router.push({ name: "grouplist" });
  }
};
</script>

<style>
</style>