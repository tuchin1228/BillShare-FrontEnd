<script setup>
import axios from "axios";
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import jwt_decode from "jwt-decode";
import { FormatDateTime } from "@/Fun.js";

const { cookies } = useCookies();
const router = useRouter();
const route = useRoute();
let userId = ref();

let groupId = ref();
let ExpendData = reactive([]);
let ExpendDetailData = reactive([]);
let receiveData = reactive([]); //群組有付錢的人
let GroupUsers = reactive([]); //群組所有人

async function GetExpendData() {
  let res = await axios
    .get(
      `${process.env.API_URL}/api/Expend/AllExpendDetails/${groupId.value}`,
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
    Object.assign(ExpendData, res.data.expends);
    Object.assign(ExpendDetailData, res.data.expendDetail);
  }
}

async function GetGroupUsers() {
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
  }
}

async function GetReceiveData() {
  let res = await axios
    .get(
      `${process.env.API_URL}/api/checkout/GetCheckoutReceive/${groupId.value}`,
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
    Object.assign(
      receiveData,
      JSON.parse(JSON.stringify([...res.data.receiveData]))
    );
  }
}

const CalcUsersPrice = () => {
  GroupUsers.forEach((user) => {
    let payArray = [];
    ExpendData.forEach((expend) => {
      let shareData = ExpendDetailData.filter(
        (data) =>
          data.type == 1 &&
          data.userId == user.userId &&
          data.expendId == expend.expendId
      );
      let payData = ExpendDetailData.filter(
        (data) =>
          data.type == 0 &&
          data.userId == user.userId &&
          data.expendId == expend.expendId
      );
      let sharePrice = shareData.length > 0 ? shareData[0].price : 0; //這個會員在這個商品應該分攤多少
      let payPrice = payData.length > 0 ? payData[0].price : 0; //這個會員在這個商品付了多少錢
      if (sharePrice - payPrice > 0) {
        let payusers = ExpendDetailData.filter(
          (data) =>
            data.type == 0 &&
            data.expendId == expend.expendId &&
            data.userId !== user.userId
        );

        // 假如這個人欠錢比付錢還多，不用被撈
        for (let i = 0; i < payusers.length; i++) {
          let removePayuser = ExpendDetailData.filter(
            (item) =>
              item.userId == payusers[i].userId &&
              item.type == 1 &&
              item.expendId == expend.expendId &&
              item.price > payusers[i].price
          );
          if (removePayuser.length > 0) {
            payusers.splice(i, 1);
            i--;
          }
        }

        let tempArrear = sharePrice - payPrice; //積欠總額
        payusers.forEach((payuser) => {
          console.log(
            user.userName,
            payuser.userName,
            tempArrear,
            payuser.price
          );
          if (tempArrear >= payuser.price) {
            //欠的錢超過應該要還的錢
            let checkuser = payArray.filter(
              (data) => data.user.userId == payuser.userId
            );
            if (checkuser && checkuser.length > 0) {
              checkuser[0].price += payuser.price;
            } else {
              payArray.push({
                user: payuser,
                price: tempArrear,
              });
            }
            tempArrear = tempArrear - payuser.price;
          } else {
            let checkuser = payArray.filter(
              (data) => data.user.userId == payuser.userId
            );
            if (checkuser && checkuser.length > 0) {
              checkuser[0].price += tempArrear;
            } else {
              payArray.push({
                user: payuser,
                price: tempArrear,
              });
            }
          }
        });
      }
    });
    user.checkout = payArray;
  });
};

const ArrearArray = computed(() => {
  let list = GroupUsers.filter(
    (user) => user.checkout && user.checkout.length > 0
  );
  list.forEach((listdata) => {
    listdata.checkout.forEach((check) => {
      receiveData.forEach((data) => {
        if (
          listdata.userId == data.sendUserId &&
          check.user.userId == data.receiveUserId
        ) {
          check.price -= data.amount;
        }
      });
    });
  });
  return list;
});

const GetReceiveUser = (sendUserId, reactiveUserId) => {
  let send = GroupUsers.filter((user) => user.userId == sendUserId);
  let receive = GroupUsers.filter((user) => user.userId == reactiveUserId);
  if (send && receive) {
    return `<span class="text-blue-600 font-bold">${send[0].userName}</span> 給 <span class="text-blue-600 font-bold">${receive[0].userName}</span>`;
  }
};

const ReturnPay = async (sendUser, receiveUser, price) => {
  let res = await axios
    .post(
      `${process.env.API_URL}/api/checkout/Checkout`,
      {
        SendUserId: sendUser,
        ReceiveUserId: receiveUser,
        amount: price,
        GroupId: groupId.value,
        // CreatedDate
      },
      {
        headers: {
          "Content-Type": "application/json",
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
    await GetReceiveData();
    await CalcUsersPrice();
  }
};

const DeleteCheckout = async (CheckoutId) => {
  let res = await axios
    .post(
      `${process.env.API_URL}/api/checkout/DeleteCheckout/${CheckoutId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
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
  if(res.data.success){
    location.reload()
  }
};

onMounted(async () => {
  groupId.value = route.params.groupId;

  let token = cookies.get("token");
  let jwtObj = jwt_decode(token);
  console.log("jwtObj", jwtObj, jwtObj.UserId);
  userId.value = jwtObj.UserId;
  await GetGroupUsers();
  await GetExpendData();
  await CalcUsersPrice();
  await GetReceiveData();
});
</script>


<template>
  <main>
    <!-- <RouterLink :to="{ name: 'home' }">回上頁</RouterLink> -->
    <div>
      <h2 class="text-center text-3xl py-2 font-bold bg-blue-400 text-white">
        結算
      </h2>
    </div>

    <article class="border border-gray-100 rounded-xl shadow-lg p-3 my-2">
      <p class="text-xl font-bold">欠款合計</p>
      <div v-for="item in ArrearArray" :key="item.userId" class="py-1 my-1">
        <div v-for="(user, index) in item.checkout" :key="index">
          <p
            class="
              text-xl
              flex
              justify-between
              items-center
              my-1
              border-b border-gray-200
              py-2
            "
            v-if="user.price > 0"
          >
            <span>
              <span class="text-blue-600 font-bold">{{ item.userName }}</span>
              欠
              <span class="text-blue-600 font-bold">{{
                user.user.userName
              }}</span>
            </span>
            <span class=""
              ><span class="text-red-600 font-bold block text-right"
                >{{ user.price }}元</span
              >
              <button
                v-if="userId == user.user.userId"
                @click="ReturnPay(item.userId, user.user.userId, user.price)"
                type="button"
                class="
                  text-center
                  p-1
                  bg-red-400
                  text-white
                  leading-snug
                  uppercase
                  rounded
                  font-bold
                  shadow-md
                  hover:bg-red-500 hover:shadow-lg
                  focus:bg-red-500
                  focus:shadow-lg
                  focus:outline-none
                  focus:ring-0
                  active:bg-red-600 active:shadow-lg
                  transition
                  duration-150
                  ease-in-out
                  w-full
                  text-lg
                "
              >
                已還款
              </button>
            </span>
          </p>
        </div>
      </div>
    </article>
    <article class="border border-gray-100 rounded-xl shadow-lg p-3 my-2">
      <p class="text-xl font-bold">還款紀錄</p>
      <ul>
        <li
          v-for="item in receiveData"
          :key="item.id"
          class="
            text-xl
            flex
            justify-between
            items-center
            my-1
            border-b border-gray-200
            py-2
          "
        >
          <div>
            <span
              v-html="GetReceiveUser(item.sendUserId, item.receiveUserId)"
            ></span
            ><br />
            <span class="text-gray-400 text-lg">{{
              FormatDateTime(item.createdDate)
            }}</span>
          </div>
          <span>
            <span class="text-red-600 font-bold block text-center"
              >{{ item.amount }}元</span
            >
            <button
              type="button"
              @click="DeleteCheckout(item.id)"
              v-if="userId == item.sendUserId"
              class="
                block
                text-center
                p-1
                bg-red-400
                text-white
                leading-snug
                uppercase
                rounded
                font-bold
                shadow-md
                hover:bg-red-500 hover:shadow-lg
                focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-red-600 active:shadow-lg
                transition
                duration-150
                ease-in-out
                w-full
                text-lg
              "
            >
              刪除還款
            </button>
          </span>
          <!-- {{item.sendUserId}} 還 {{item.receiveUserId}} {{item.amount}}元 -->
        </li>
      </ul>
    </article>

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


<style>
</style>