import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import "firebase/firestore";

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: "AIzaSyAHfY-cRHxjRcw8oJXAetxKwAr0komAGWs",
  authDomain: "vue-calendar-8b5d1.firebaseapp.com",
  databaseURL: "https://vue-calendar-8b5d1.firebaseio.com",
  projectId: "vue-calendar-8b5d1",
  storageBucket: "vue-calendar-8b5d1.appspot.com",
  messagingSenderId: "1044271775662",
  appId: "1:1044271775662:web:236b1e0d2c12e53050123f"
});

export const db = firebase.firestore();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
