<template>

<!--<div name="container" class="container">-->
<div name="container" id="container" class="hide">
  <h3 class="text-white text-center">Checador (ADMIN)</h3>
  <!-- LOGOUT-->
  <div class="">
    <button @click="logout" class="exit_btn btn btn-dark" type="button"><i aria-hidden="true">SALIR</i></button>
  </div>
  
  <div class="text-white">
    <!-- SALUDO -->
    <p>
    Hola <span class="capitalize">{{usr_name}}</span>.
    </p>

    <!-- SELECT de usuarios -->
		<div class="">
      <div id="">
        <label for="selectUser">Seleccione a un usuario:</label>
        <br>
        <select v-model="selected" id="selectUser" @change="selectUser" class="">
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
  <div id="div-table" class="container mt-3 hide">
    <div class="table-responsive">
      <table class="table table-striped table-dark text-white table-hover table-sm" >  
        <thead class="thead-dark">
          <tr>
            <th colspan="4">{{selected.name}}</th>
          </tr>

          <tr>
            <th>Tipo</th>
            <th>Fecha/Hora</th>
            <th>Nota</th>
            <th>Latitud/Longitud</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{record.type.toUpperCase()}}</td>
            <td>
              <!--HORA DISPOSITIVO-->
              <!--{{new Date(record.timestamp).toLocaleString()}}<br>-->
              <!--HORA SERVER-->
              {{record.timestampServer.toDate().toLocaleString()}}
            </td>
            <td>{{record.note}}</td>    
            <td>{{record.latitude}}, {{record.longitude}}</td>           
          </tr>

          <tr id="tr-no-records">
            <td id="th-no-records" colspan="4">Registros no encontrados.</td>
          </tr>
        </tbody>
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
    /*
    routesVisible(flag) {
      let divRoutes = document.getElementById("div-routes");
      if (flag == true) {
       divRoutes.style.visibility = "visible";
      } else {
        divRoutes.style.visibility = "hidden";
      }
    },
    */

    elementVisible(elementName, flag) {
      let element = document.getElementById(elementName);
      if (flag == true) {
       element.style.visibility = "visible";
      } else {
        element.style.visibility = "hidden";
      }
    },

    rowTableVisible(elementName, flag) {
      let element = document.getElementById(elementName);
      if (flag == true) {
       element.style.visibility = "table-row";
      } else {
        element.style.visibility = "none";
      }
    },

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
              //console.log("USUARIO:");
							//console.log(doc.data());
            });
            this.users=allUsers;
          });
        } else {
          // User is signed out
          // ...
        }
      });
    },

    selectUser() {
      if(this.selected.id !== undefined) {
        this.getRecords(this.selected.id);
        //this.tableVisible(true);
        this.elementVisible("div-table", true)
      } else {
        //this.tableVisible(false);
        this.elementVisible("div-table", false)
      }
    },

    /*
    tableVisible(flag) {
      let divTable = document.getElementById("div-table");
      if (flag == true) {
       divTable.style.visibility = "visible";
      } else {
        divTable.style.visibility = "hidden";
      }
    },
    */
    
		getRecords(id_user) {
			//console.log("getRecords(): ", id_user);
      const recordRef = db.collection('record').doc(id_user).collection('records');
      
      recordRef
      .orderBy('timestamp','desc')
      .get().then((querySnapshot) => {
        let allRecords = [];
        querySnapshot.forEach((doc1) => {
          // /console.log(doc1.data());
          allRecords.push(doc1.data());
        });
        this.records = allRecords;
        //console.log("length",this.records.length);

        if (this.records.length > 0) {
          this.elementVisible("tr-no-records", false);
          this.elementVisible("td-no-records", false);
        } else {
          this.elementVisible("tr-no-records", true);
          this.elementVisible("td-no-records", true);
        }
			}).catch((error) => {
        console.log("Error getting document:", error);
      });
		},
  },

  created(){
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        
        this.elementVisible("container", true);
        //this.routesVisible(false);
        this.elementVisible("div-routes", false);
        this.authUser = user;
        this.usr_name = user.displayName.toLowerCase();
        
        //Revisa si tengo guardado el usuario logeado en la BD
        this.checkUser();
				//this.getRecord(user.uid);
				
      }else{
        //this.routesVisible(true);
        this.elementVisible("container", false)
        this.elementVisible("div-routes", false)
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
          
          //this.elementVisible("container", true)

        }else{
          //let divContainer = document.getElementById("container");
          //divContainer.style.display = "none";
          //this.elementVisible("container", false)

          //next('/loginAdmin');BUENO

          setTimeout(()=>{
            next('/loginAdmin');
            // Cierra todas las conexiones abiertas
            location.reload();
          },100);
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