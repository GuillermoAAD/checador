import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import firebase from 'firebase'
//import firebaseui from 'firebaseui';
//import {config} from './helpers/firebaseConfig'


//
//import VueRouter from 'vue-router'
//Vue.use(VueRouter)
//


//const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAOa7ElCUCaAp1vEey-0Oc6NohD_U2RXDU",
    authDomain: "checador-26b9b.firebaseapp.com",
    projectId: "checador-26b9b",
    storageBucket: "checador-26b9b.appspot.com",
    messagingSenderId: "335589972493",
    appId: "1:335589972493:web:7cf20d225d1e1a18c61344",
    measurementId: "G-ELNCGZ7YVF"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// /firebase.analytics();

var db = firebase.firestore();
window.db = db;


Vue.config.productionTip = false

new Vue({
router,
store,
render: h => h(App)
}).$mount('#app')
