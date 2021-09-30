<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card text-white bg-dark">
          <div class="card-header">Registrarme</div>
          <div class="card-body">
            <form action="#" @submit.prevent="signUp">
              <div class="form-group row">
                <label for="name" class="col-md-4 col-form-label text-md-right">Nombre</label>

                <div class="col-md-6">
                  <input
                    id="name"
                    type="name"
                    class="form-control"
                    name="name"
                    value
                    required
                    autofocus
                    v-model="name"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>

                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    value
                    required
                    v-model="email"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Contraseña</label>

                <div class="col-md-6">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    minlength="6"
                    v-model="password"
                  />
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-info">Registrarme</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>


    <!--
    <div class="or-container">
      <div class="line-separator"></div>
      <div class="or-label">o</div>
      <div class="line-separator"></div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <a class="btn btn-lg btn-google btn-block btn-outline" 
        href="#" @click="signUpGoogle">
          <img src="https://img.icons8.com/color/16/000000/google-logo.png"> 
          Iniciar con Google
        </a> 
      </div>
    </div>
    -->

  </div>
</template>

<script>
  import firebase from 'firebase'; 
  //require('../utils/errorCodesAuth.js'); 
  var errorCodesAuth = require('../utils/errorCodesAuth.js');


  export default {
    data() {
      return {
        name: null,
        email: null,
        password: null
      }
    },
    
    methods:{
      signUpGoogle(){
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
          alert(errorCode + '\n' + errorMessage);
          // ...
        });

      },

      signUp() {
        firebase.auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          // Registrado
          //PARA MANDAR CORREO??
          /*
          if(user && user.emailVerified === false){
            user.sendEmailVerification().then(function(){
              console.log("email verification sent to user");
            });
          }
          */

          firebase.auth().currentUser.sendEmailVerification()
          .then(() => {
          // Email verification sent!
          // ...
          });
          
          var user = userCredential.user;

          //Se agrega el nombre de usuario
          user.updateProfile({ 
            displayName: this.name
          });


          // ...
          console.log(user.displayName);
          this.$router.replace('/');
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          //console.log(error.message)
          //console.log(error.code);
          //console.log(errorCodesAuth.getError(error.code));
          //alert(errorCodesAuth.getError(error.code));
          alert(errorCode + '\n' + errorMessage);
          // ..
        });
      },

    },

    mounted(){
    },

    beforeRouteEnter(to,from,next){
    next(vm=>{
      //Este listener es necesario para que detecte si el usuario no esta logeado
      // o se deslogeo y  regrese a la pagina de login
      firebase.auth().onAuthStateChanged(user=>{
        if(user){
          //setTimeout(()=>{
            //vm.$router.push('/');
            // Cierra todas las conexiones abiertas
            //location.reload();
          //},500);
          //next('/login');
          //let divContainer = document.getElementById("container");
          // /divContainer.style.display = "none";
          //this.$router.replace('/');
          next('/');
          location.reload();
        }else{
          //let divContainer = document.getElementById("container");
          //divContainer.style.display = "inline";
          
          //next('/');
        }
      })
    })
  }

  }
</script>



<style scoped="">

.hide{
  display: none;
}

.or-container {
    align-items: center;
    color: #ccc;
    display: flex;
    margin: 25px 0
}

.line-separator {
    background-color: #ccc;
    flex-grow: 5;
    height: 1px
}

.or-label {
    flex-grow: 1;
    margin: 0 15px;
    text-align: center
}

a:hover{
  background: rgb(236, 236, 236);
}

</style>