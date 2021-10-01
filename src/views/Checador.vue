<template>

<!--<div name="container" class="container">-->
<div name="container" id="container" class="hide">
  <h3 class="text-white text-center">Checador</h3>
  <!--LOGOUT-->
  <div class="">
    <button @click="logout" class="exit_btn btn btn-dark" type="button"><i aria-hidden="true">SALIR</i></button>
  </div>
  
  <div class="text-white">
    <p>
    Hola <span class="capitalize">{{usr_name}}</span>.
    </p>
    Seleccione:
    <input type="radio" id="llegada" value="llegada" v-model="picked" checked>
    <label for="llegada">Llegada</label>
    ó
    <input type="radio" id="salida" value="salida" v-model="picked">
    <label for="salida">Salida</label>
    <br>
    <textarea v-model="note" placeholder="Si desea, agregue una nota."></textarea>
    <br>
    
    <button @click="checkRecord" class="btn btn-success" type="button" id="BTNchecar">
      Checar registro
      <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
    </button>

    <!--
    <button @click="checkDevice" class="btn btn-success" type="button" id="BTNchecar">
      Checar dispositivo
      <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
    </button>
    -->

    <!--
    <button @click="checkRecord" class="btn btn-dark  text-success" type="button" id="BTNchecar">
      Checar registro
      <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
    </button>
    -->
  </div>
  
  <div id="div-table" class="container mt-3 hide">
    <div class="table-responsive">
      <table class="table table-striped table-dark text-white table-hover table-sm" >  
        <thead class="thead-dark">
          <tr>
            <th colspan="6">MIS REGISTROS</th>
          </tr>
        
          <tr>
            <th>Tipo</th>
            <th>Fecha/Hora</th>
            <th>Nota</th>
            <th>Latitud/Longitud</th>
            <th>Dispositivo</th>
            <th></th>
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
            <td>{{record.device}}</td>
            <td>
              <button @click="deleteRecord(record)" class="btn btn-link text-danger" type="button" id="BTNeliminar">
                <i class="far fa-trash-alt"></i>
              </button>
            </td>
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
  name: 'Checador',

  data() {
     return {
        note:null,
        picked:"llegada",
        authUser:null,
        usr_name:null,
        position:null,

        records:null,
        first_record:null,
     }
  },
  methods: {
    elementVisible(elementName, flag) {
      let element = document.getElementById(elementName);
      if (flag == true) {
       element.style.visibility = "visible";
      } else {
        element.style.visibility = "hidden";
      }
    },

    routesVisible(flag) {
      let divRoutes = document.getElementById("div-routes");
      if (flag == true) {
       divRoutes.style.visibility = "visible";
      } else {
        divRoutes.style.visibility = "hidden";
      }
    },

    tableVisible(flag) {
      let divTable = document.getElementById("div-table");
      if (flag == true) {
       divTable.style.visibility = "visible";
      } else {
        divTable.style.visibility = "hidden";
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

    checkRecord() {
      this.getCurrentPosition();
    },

    checkDevice() {
      // /let device1 = navigator.userAgent;
      //let device = navigator.platform;
      //console.log(device);
      //alert(device);
      //alert(device1);

      let device = "Unknown";
      const ua = {
          "Generic Linux": /Linux/i,
          "Android": /Android/i,
          "BlackBerry": /BlackBerry/i,
          "Bluebird": /EF500/i,
          "Chrome OS": /CrOS/i,
          "Datalogic": /DL-AXIS/i,
          "Honeywell": /CT50/i,
          "iPad": /iPad/i,
          "iPhone": /iPhone/i,
          "iPod": /iPod/i,
          "iOS": /iOS/i,
          "macOS": /Macintosh/i,
          "Windows": /IEMobile|Windows/i,
          "Zebra": /TC70|TC55/i,
      }
      Object.keys(ua).map(v => navigator.userAgent.match(ua[v]) && (device = v));
      alert(navigator.userAgent);
      
      return device;
    },

    getCurrentPosition() {
      //if (navigator.geolocation) {
        if ('geolocation' in navigator) {
        /* la geolocalización está disponible */
        //console.log("SE PUEDE GEOLOCALIZAR");
        let options = {
              enableHighAccuracy: true, // Alta precisión
              maximumAge: 0, // No queremos caché
              timeout: 5000 // Esperar solo 5 segundos
            }

        navigator.geolocation.getCurrentPosition(
          //myPosition = navigator.geolocation.getCurrentPosition(
            
          position => {

            this.saveRecord(this.authUser.uid, position);
            
            //console.log('Tu posición actual es:');
            //console.log('Latitud : ' + position.coords.latitude);
            //console.log('Longitud: ' + position.coords.longitude);
            //console.log('Más o menos ' + position.coords.accuracy + ' metros.'); 
          },

          function(msg){
            console.error( msg );
          },

          options
        );
      } else {
        /* la geolocalización NO está disponible */
        //console.log("NO SE PUDO GEOLOCALIZAR");
        alert("Geolocalizacion NO disponible.");
      }
    },

    /*
    checkLocation() {
      if ('geolocation' in navigator) {
        // la geolocalización está disponible 
        console.log("SE PUEDE GEOLOCALIZAR");
        navigator.geolocation.getCurrentPosition(
          //myPosition = navigator.geolocation.getCurrentPosition(
          position => {
            console.log('Tu posición actual es:');
            console.log('Latitud : ' + position.coords.latitude);
            //console.log('Longitud: ' + position.coords.longitude);
            //console.log('Más o menos ' + position.coords.accuracy + ' metros.'); 
          }
        );
      } else {
        // la geolocalización NO está disponible 
        console.log("NO SE PUDO GEOLOCALIZAR");
      }
    },
    */

    /*
    drawMap(position){
           var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var myOptions = {
              zoom: 15,
              center: latlng,
              mapTypeControl: false,
              navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions)
            var marker = new google.maps.Marker({
              position: latlng,
              map: map,
              title:"Estás aquí! (en un radio de "+position.coords.accuracy+" metros)"
            })
    },
    */
   generateSubCollectionDocID(id_user, collectionName, subcollectionName){
      let ref = db.collection(collectionName).doc(id_user).collection(subcollectionName).doc();
      let id_group = ref.id;
      return id_group;
    },

    saveRecord(id_user,position) {
      let id_record = this.generateSubCollectionDocID(id_user,"record","records");
      db.collection('record').doc(id_user).collection('records').doc(id_record).set ({
        
        id: id_record,
        timestampServer: firebase.firestore.FieldValue.serverTimestamp(),
        timestamp: Date.now(),
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        type: this.picked,
        note: this.note,
        device: this.checkDevice()
      });
      alert("Has checado tu " + this.picked + ". \n\n ^‿^");
      this.note = null;
      //this.picked = "llegada";
    },

    setPicked(firstRecord){
      //console.log("FR 0", firstRecord);
      if (firstRecord.type == 'llegada') {
        this.picked = 'salida';
      } else { 
        this.picked = 'llegada';
      }
    },

    getRecords(id_user) {
      this.getRecordsFB(id_user);
		},
    
    getRecordsFB(id_user) {
      const recordRef = db.collection('record').doc(id_user).collection('records');
      recordRef
      .orderBy('timestamp','desc')
      .onSnapshot((querySnapshot)=>{
        let allRecords = [];
        querySnapshot.forEach((doc1) => {
          //console.log(doc1.data());
          allRecords.push(doc1.data());
        });
        this.records = allRecords;

        if(this.records.length > 0) {
          this.first_record = this.records[0];
          this.setPicked(this.first_record);
        } else {
          this.picked = 'llegada';
        }
			});
		},

    deleteRecord(record) {
      let nota = record.note;
      if (nota === null) {
        nota = "";
      }

      let device = record.device;
      if (device === null) {
        device = "";
      }

      let deleteRec = confirm("Esta a punto de eliminar el registro con los siguientes datos:\n"
        + "\nTipo: " + record.type
        //HORA DISPOSITIVO
        //+ "\nFecha/Hora: " + new Date(record.timestamp).toLocaleString()
        //HORA SERVER
        + "\nFecha/Hora: " + record.timestampServer.toDate().toLocaleString()
        + "\nNota: " + nota
        + "\nLatitud: " + record.latitude
        + "\nLongitud: " + record.longitude
        + "\nDispositivo: " + device
        );

      if(deleteRec) {
        //borrar en firebase
        this.deleteRecordFB(this.authUser.uid, record.id);
      }
    },

    deleteRecordFB(id_user,id_record) {
      const recordRef = db.collection('record').doc(id_user).collection('records').doc(id_record);
      recordRef.delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            //console.error("Error removing document: ", error);
            alert(error);
        });
    },

  },

  created(){
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        setTimeout(()=>{
            this.elementVisible("container", true)
            this.elementVisible("div-table", true);
          },1000);
        this.elementVisible("div-routes", false);
        
        this.authUser = user;
        this.usr_name = user.displayName.toLowerCase();
        //Revisa si tengo guardado el usuario logeado en la BD
        this.checkUser();
        this.getRecords(this.authUser.uid);
        
      }else{
        this.elementVisible("container", false)
        this.elementVisible("div-routes", true);
        this.elementVisible("div-table", false);
        
        this.authUser=null;
      }
    })
  },
  
  beforeRouteEnter(to,from,next){
    next(vm=>{
      //Este listener es necesario para que detecte si el usuario no esta logeado
      // o se deslogeo y  regrese a la pagina de login
      firebase.auth().onAuthStateChanged(user=>{
        if(user){
          //next('/');
          //this.elementVisible("div-routes", false);
          
        }else{
          //let divContainer = document.getElementById("container");
          //divContainer.style.display = "none";
          //next('/login');//BUENO
          

          setTimeout(()=>{
            next('/login');
            //vm.$router.push('/login');
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
.container{
  max-width:1170px;
  margin:auto;
}
img{ max-width:100%;}

.exit_btn {  
  /*background-color: #563d7c;*/
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



</style>