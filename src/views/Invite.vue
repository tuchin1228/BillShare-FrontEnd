<template>
  <!-- <p>Invite</p> -->
  <div>
    <h2 class="text-center text-3xl py-2 font-bold bg-blue-400 text-white">
      群組邀請
    </h2>
  </div>
  <div class="px-2">
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
    <div class="mb-6">
      <label for="" class="text-xl font-bold my-2 block">密碼：</label>
      <input
        v-model="password"
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
        placeholder="輸入密碼"
      />
    </div>
    <div class="mb-6" v-if="ModeSwitch == 'register'">
      <label for="" class="text-xl font-bold my-2 block">會員名稱：</label>
      <input
        v-model="userName"
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
        placeholder="輸入會員名稱"
      />
    </div>
    <div class="grid grid-cols-2 gap-2">
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
        v-if="ModeSwitch == 'login'"
        @click="updateMode"
      >
        去註冊
      </button>
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
        v-if="ModeSwitch == 'login'"
        @click="LoginInvite"
      >
        登入
      </button>

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
        v-if="ModeSwitch == 'register'"
        @click="updateMode"
      >
        去登入
      </button>
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
        v-if="ModeSwitch == 'register'"
        @click="Register"
      >
        註冊
      </button>
    </div>
  </div>
  <!-- <button type="button" v-if="ModeSwitch == 'login'" @click="LoginInvite">
    登入
  </button>
  <button type="button" v-if="ModeSwitch == 'register'" @click="Register">
    確認註冊
  </button> -->
</template>

<script setup>
import axios from "axios";
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
const route = useRoute();
const router = useRouter();
const { cookies } = useCookies();
let ModeSwitch = ref("login");
let account = ref("");
let password = ref();
let userName = ref();

// const AddToGroup = async () => {
//   await CheckUser();
// };

const updateMode = () => {
  if (ModeSwitch.value == "login") {
    ModeSwitch.value = "register";
  } else {
    ModeSwitch.value = "login";
  }
};

const Register = async () => {
  let RegisterRes = await axios
    .post(`${process.env.API_URL}/api/user/RegisterUser`, {
      UserId: account.value,
      Password: password.value,
      UserName: userName.value,
    })
    .catch(function (error) {
      if (error.response.status == 400) {
        alert("參數錯誤");
        cookies.remove("token");
      }
    });
  console.log(RegisterRes);

  if (RegisterRes.data.success) {
    let AddGroupUserRes = await AddGroupUsers();

    if (AddGroupUserRes) {
      //新會員加入成功直接登入轉址
      await Login();
    }
  }
};

const LoginInvite = async () => {
  let AddGroupUserRes = await AddGroupUsers();
  if (AddGroupUserRes) {
    //新會員加入成功直接登入轉址
    await Login();
  }
};

// const CheckUser = async () => {
//   let res = await axios
//     .post(`${process.env.API_URL}/api/user/CheckUser`, userId.value, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//     .catch(function (error) {
//       if (error.response.status == 401) {
//         alert("會員驗證錯誤");
//         cookies.remove("token");
//         router.push({ path: "/login" });
//       }
//     });
//   console.log(res);
//   if (res.data.success) {
//     //已是會員
//     console.log({
//       validateCode: route.params.ValidateCode,
//       userId: userId.value,
//       groupId: Number(route.params.GroupId),
//     });
//     let obj = {
//       validateCode: route.params.ValidateCode,
//       userId: userId.value,
//       groupId: Number(route.params.GroupId),
//     };
//     let AddGroupUserRes = await AddGroupUsers(obj);
//     if (AddGroupUserRes) {
//       await Login();
//     }
//   } else {
//     //還不是會員
//     let RegisterRes = await axios
//       .post(`${process.env.API_URL}/api/user/RegisterUser`, {
//         userId: userId.value,
//         userName: userName.value,
//       })
//       .catch(function (error) {
//         if (error.response.status == 401) {
//           alert("會員驗證錯誤");
//           cookies.remove("token");
//           router.push({ path: "/login" });
//         }
//       });
//     console.log(RegisterRes);
//     if (RegisterRes.data.success) {
//       let obj = {
//         validateCode: route.params.ValidateCode,
//         userId: userId.value,
//         groupId: Number(route.params.GroupId),
//       };
//       let AddGroupUserRes = await AddGroupUsers(obj);

//       if (AddGroupUserRes) {
//         //新會員加入成功直接登入轉址
//         await Login();
//       }
//     }
//   }
// };

const AddGroupUsers = async () => {
  let AddGroupUserRes = await axios
    .post(
      `${process.env.API_URL}/api/user/AddGroupUsers`,
      {
        validateCode: route.params.ValidateCode,
        userId: account.value,
        groupId: Number(route.params.GroupId),
        password: password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch(function (error) {
      console.log(error);
      if (error.response.status == 400) {
        alert("會員驗證錯誤");
        cookies.remove("token");
      }
    });
  console.log(AddGroupUserRes);
  return AddGroupUserRes;
};

const Login = async () => {
  let LoginRes = await axios.post(
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
  );
  console.log(LoginRes);
  if (LoginRes.data.success) {
    cookies.set("token", LoginRes.data.token);
    router.push({ name: "grouplist" });
  }
};
</script>

<style>
</style>