<template>

<!--<div name="container" class="container">-->
<div name="container" id="container" class="">
  <h3 class=" text-center">Checador (ADMIN)</h3>
  <!--LOGOUT-->
  <div class="">
    <button @click="logout" class="exit_btn" type="button"><i aria-hidden="true">SALIR</i></button>
  </div>
  
  <div class="">
    <p>
    Hola <span class="name">{{usr_name}}</span>
		
    </p>

		 <div class="">
        <div id="">
          <div  v-for="user in users" :key="user.id">
            <h5>
							<a @click="getRecord(user.id)">
								{{user.id}}
							{{user.name}}
							</a>
							<div  v-for="record in records" :key="record.id">
								xd
							</div>
            </h5>
          </div>
					<div  v-for="record in records" :key="record.id">
								xd
							</div>

				</div>
			</div>

    
		
  </div>
  <div id="mapcanvas" style="width:400px; height:400px"></div>
</div>
</template>

<script>
//require("../firebase.js");
//import firebase, { auth } from 'firebase'
import firebase from 'firebase'; 

// /const db = firebase.firestore();

export default {
  name: 'ChecadorAdmin',

  data() {
     return {
        users:null,
				records:null,


        note:null,
        picked:null,
        authUser:null,
        usr_name:null,
        position:null,
     }
  },
  methods: {

    logout(){
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    },

    /// USUARIOS
    checkUser(){
      //REvisa y agrega el usuario logeado a la BD
      var docRef =  db.collection("users").doc(this.authUser.uid);
      docRef.get().then((doc) => {
        if (!doc.exists) {
          this.saveUser();
        }
      }).catch((error) => {
        //el usuario ya está en la base de datos.
      });
    },

    saveUser(){
      db.collection("users").doc(this.authUser.uid).set({
        id: this.authUser.uid,
        name: this.authUser.displayName,
        registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    },

    getUsers(){
      //console.log("getUsers");
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          //Recupera todos los usuarios excepto el actual
          db.collection('users')
          //.where("idUser", "!=", uid)
          .orderBy('name')
          .get().then((querySnapshot) => {
            var allUsers=[];
            querySnapshot.forEach((doc) => {
              allUsers.push(doc.data());
							console.log(doc.data());
            });
            this.users=allUsers;
          });
        } else {
          // User is signed out
          // ...
        }
      });
    },
 
		getRecord3(id_user) {
			console.log("HOLO");
		},

    getRecord(id_user) {
			console.log("getRecord");	
			console.log(id_user);
			const recordRef = db.collection('record').doc(id_user).collection('records');
			recordRef
			.get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					console.log(doc.data());
				});
				
			});

			/*
			this.records = null;		
      db.collection('record').doc(id_user).collection('records')
			.orderBy('timestamp','desc')
			.get().then((querySnapshot) => {
				var allRecords=[];
				querySnapshot.forEach((doc) => {
          allRecords.push(doc.data());
					console.log(doc.data());
        });
        this.records=allRecords;
			
			*/
    },
  },

  created(){
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        this.authUser = user;
        this.usr_name = user.displayName.toLowerCase();
        
        //Revisa si tengo guardado el usuario logeado en la BD
        this.checkUser();
				//this.getRecord(user.uid);
				
      }else{
        //console.log("ESTE MENSAJE SE VE CUANDO SALE");
        this.authUser=null;
      }
    })
		this.getUsers();
  },
  
  beforeRouteEnter(to,from,next){
    next(vm=>{
      //Este listener es necesario para que detecte si el usuario no esta logeado
      // o se deslogeo y  regrese a la pagina de login
      firebase.auth().onAuthStateChanged(user=>{
        if(user){
          //next('/');
          //let divContainer = document.getElementById("container");
          //divContainer.style.display = "inline";

        }else{
          //let divContainer = document.getElementById("container");
          //divContainer.style.display = "none";

          next('/loginAdmin');

          //setTimeout(()=>{
            //vm.$router.push('/login');
            // Cierra todas las conexiones abiertas
            //location.reload();
          //},100);
        }
      })
    })
  }

}

</script>


<style scoped="">
.container{
  max-width:1170px;
  margin:auto;
}
img{ max-width:100%;}

.exit_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 7%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 77px;
}

.name {
  text-transform: capitalize;
}

.hide{
  display: none;
}

</style>