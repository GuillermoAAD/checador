<template>

<!--<div name="container" class="container">-->
<div name="container" id="container" class="">
  <h3 class=" text-center">Checador (ADMIN)</h3>
  <!-- LOGOUT-->
  <div class="">
    <button @click="logout" class="exit_btn btn btn-dark" type="button"><i aria-hidden="true">SALIR</i></button>
  </div>
  
  <div class="">
    <!-- SALUDO -->
    <p>
    Hola <span class="capitalize">{{usr_name}}</span>
    </p>

    <!-- SELECT de usuarios -->
		<div class="">
      <div id="">
        <label for="selectUser">Seleccione a un usuario:</label>
        <br>
        <select v-model="selected" id="selectUser" @change="selectUser1" class="">
          <option value="unselected">
            Sin seleccionar
          </option>
          <option v-for="user in users" :key="user.id" v-bind:value="user">
						{{user.name}}
          </option>
        </select>
			</div>
		</div>

  </div>

  <!-- TABLA -->
  <div id="divtable" class="container mt-3 hide">
    <div class="table-responsive">
      <table class="table table-striped table-dark text-white table-hover" >  
        <tr>
          <th colspan="5">{{selected.name}}</th>
        </tr>
        <tr>
          <th>Tipo</th>
          <th>Fecha/Hora</th>
          <th>Latitud</th>
          <th>Longitud</th>
          <th>Nota</th>
        </tr>
        <tr v-for="record in records" :key="record.id">
          <td>{{record.type.toUpperCase()}}</td>
          <td>{{new Date(record.timestamp).toLocaleString()}}</td>
          <td>{{record.latitude}}</td>
          <td>{{record.longitude}}</td>
          <td>{{record.note}}</td>            
        </tr>
      </table>
    </div>
  </div>  
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
        selected:"unselected",

        //note:null,
        authUser:null,
        usr_name:null,
        //position:null,
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
        email: this.authUser.email,
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
              console.log("USUARIO:");
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
    

    selectUser1() {
      
      if(this.selected.id !== undefined) {
        this.getRecords(this.selected.id);
        this.tableVisible(true);
      } else {
        this.tableVisible(false);
      }

    },

    tableVisible(flag) {
      let divTable = document.getElementById("divtable");
      if (flag == true) {
       divTable.style.visibility = "visible";
      } else {
        divTable.style.visibility = "hidden";
      }

    },


    /*
    selectUser(id_user) {

      console.log("selectUser(): ", id_user);
      this.getRecords(id_user);
    },
    */
    
		getRecords(id_user) {
			console.log("getRecords(): ", id_user);
      const recordRef = db.collection('record').doc(id_user).collection('records');
      
      recordRef
      .orderBy('timestamp','desc')
      .get().then((querySnapshot) => {
        let allRecords = [];
        querySnapshot.forEach((doc1) => {
          console.log(doc1.data());
          allRecords.push(doc1.data());
        });

        this.records = allRecords;


        //if (doc.exists) {
          //console.log("Document data:", doc.data());
        //} else {
          // doc.data() will be undefined in this case
          //console.log("No such document!");
        //}
			}).catch((error) => {
        console.log("Error getting document:", error);
      });
      
		},

    getRecord2(id_user) {
			console.log("getRecord");	
			console.log(id_user);
			const recordRef = db.collection('record').doc(id_user).collection('records');
			recordRef.get().then((querySnapshot) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
          console.log("No such document!");
        }
				
				
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
.container1{
  max-width:1170px;
  margin:auto;
}
img{ max-width:100%;}

.exit_btn {  
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

.capitalize {
  text-transform: capitalize;
}

.hide{
  visibility: hidden;
}



body {
    background: #eee
}

/*
table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: 3px solid purple;
}
tr {
  border: 3px solid red;
}
th, td {
  border: 3px solid green;
}
*/


</style>