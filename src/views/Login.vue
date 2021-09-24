<template>

  <div class="home">
    
    <!--
      <h3>Please login with your google account to continue</h3>
    <button @click="login">Login with google</button>
    -->

    <div class="login">
    <form @submit.prevent="logInWithEmail">
      <label for="">
        <input type="text" v-model="email">
      </label>
      <label for="">
        <input type="password" v-model="password">
      </label>
      <input type="submit" value="Login">
    </form>
  </div>
    

    <!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->
    <!--
		<h1>Welcome to My Awesome App</h1>
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
		-->
  </div>
</template>

<script>
  import firebase from 'firebase';
  

  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },
    
    methods:{

      login(){
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth()
          .signInWithPopup(provider)
          .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;

          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...

          //Guardar los datos del usuario en la coleccion users

          this.$router.push('/');
          //this.$router.push('/').catch(()=>{});
          //if (this.$router.path != '/login') {
            //this.$router.push('/login')
          //}

        }).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });

      },
      logInWithEmail() {
        firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
          .then( () =>  {
            this.$router.replace('private')
          })
          .catch(function(error) {
            console.log(error.message)
          });
    }
    },
    mounted(){
		
    },

  }
</script>
