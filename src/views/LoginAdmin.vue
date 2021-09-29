<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">

        <div class="card text-white bg-dark">
          <div class="card-header">Iniciar Sesión (ADMIN)</div>
          <div class="card-body">
            <form action="#" @submit.prevent="logInEmail">
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
                    autofocus
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
                    v-model="password"
                  />
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-info">Iniciar Sesión</button>
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
        href="#" @click="logInGoogle">
          <img src="https://img.icons8.com/color/16/000000/google-logo.png"> 
          Iniciar sesión con Google
        </a> 
      </div>
    </div>
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

      logInGoogle(){
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

          this.$router.push('/checadorAdmin');
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
          alert(errorCode + '\n' + errorMessage);
        });

      },
      
      logInEmail() {
        firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then( (userCredential) => {
          // Signed in
          var user = userCredential.user;
          // ...
          
          this.$router.replace('/checadorAdmin');
          
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          //console.log(error.message)
          //console.log(error.code);
          alert(errorCode + '\n' + errorMessage);
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
          next('/checadorAdmin');
        }else{
          // /let divContainer = document.getElementById("container");
          // /divContainer.style.display = "inline";
          
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