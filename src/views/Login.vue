<template>
  <!-- <main>
    <h2 class="text-red-500 text-4xl">登入</h2>
    <label for="">帳號：<input type="text" v-model="UserId" /></label>
    <label for="">密碼：<input type="text" v-model="Password" /></label>
    <button type="button" @click="Login">登入</button>
    <div>
      <RouterLink :to="{ name: 'register' }">前往註冊</RouterLink>
    </div>
  </main> -->
  <form class="mx-auto">
    <!-- Email input -->
    <div class="mb-6">
      <label for="" class="text-xl font-bold my-2 block">帳號：</label>
      <input
        v-model="UserId"
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
        v-model="Password"
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

    <!-- <div class="flex justify-between items-center mb-6">
      
      <a
        href="#!"
        class="
          text-blue-600
          hover:text-blue-700
          focus:text-blue-700
          active:text-blue-800
          duration-200
          transition
          ease-in-out
        "
        >Forgot password?</a
      >
    </div> -->

    <!-- Submit button -->
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
      @click="Login"
    >
      登入
    </button>
    <RouterLink
      :to="{ name: 'register' }"
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
      >註冊</RouterLink
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
const UserId = ref("");
const Password = ref("");

const Login = async () => {
  console.log(UserId.value);
  let res = await axios
    .post(
      `${process.env.API_URL}/api/Login/Login`,
      {
        UserId: UserId.value,
        Password: Password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch(function (error) {
      if (error.response.status == 400) {
        alert("登入失敗");
        cookies.remove("token");
      }
    });
  console.log(res);
  if (res.data.success) {
    cookies.set("token", res.data.token);
    router.push({ name: "grouplist" });
  }
};

onMounted(() => {});
</script>

<style>
</style>