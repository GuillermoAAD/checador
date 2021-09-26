import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import { auth } from './firebase'


//require("./firebase.js");
import firebase from 'firebase'//FUNCIONA
//const firebase = require("firebase");//PROBANDO
// Required for side-effects
require("firebase/firestore");//FUNCIONA
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
  //FUNCIONA
// Initialize Firebase
firebase.initializeApp(firebaseConfig);//FUNCIONA
//const app = firebase.initializeApp(firebaseConfig)//PROBANDO
// /firebase.analytics();

var db = firebase.firestore();//FUNCIONA
window.db = db;//FUNCIONA
//export default app


Vue.config.productionTip = false

new Vue({
router,
store,
render: h => h(App)
}).$mount('#app')
