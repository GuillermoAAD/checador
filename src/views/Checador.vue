<template>

<!--<div class="container">-->
<div class="">
  <h3 class=" text-center">Checador</h3>
  <!--LOGOUT-->
  <div class="">
    <button @click="logout" class="exit_btn" type="button"><i aria-hidden="true">SALIR</i></button>
  </div>
  
  <div class="">
    <p>
    Hola <span class="name">{{usr_name}}</span>
    </p>
    
    <input type="radio" id="llegada" value="llegada" v-model="picked">
    <label for="llegada">Entrada</label>
    <br>
    <input type="radio" id="salida" value="salida" v-model="picked">
    <label for="salida">Salida</label>
    <br>
    <textarea v-model="note" placeholder="Si desea, agregue una nota."></textarea>
    <br>
    
    <label for="BTNchecar">Presione para guardar registro.</label><br>
    <button @click="checkRecord" class="" type="button" id="BTNchecar">
      <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
    </button>
    
  </div>
  <div id="mapcanvas" style="width:400px; height:400px"></div>
</div>
</template>

<script>
import firebase, { auth } from 'firebase'

export default {
  name: 'Checador',

  data() {
     return {
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

    getCurrentPosition() {
      //if (navigator.geolocation) {
        if ('geolocation' in navigator) {
        /* la geolocalización está disponible */
        console.log("SE PUEDE GEOLOCALIZAR");
        navigator.geolocation.getCurrentPosition(
          //myPosition = navigator.geolocation.getCurrentPosition(
          position => {

            this.saveRecord(this.authUser.uid,position);
            
            //console.log('Tu posición actual es:');
            //console.log('Latitud : ' + position.coords.latitude);
            //console.log('Longitud: ' + position.coords.longitude);
            //console.log('Más o menos ' + position.coords.accuracy + ' metros.'); 
          }
        );
      } else {
        /* la geolocalización NO está disponible */
        console.log("NO SE PUDO GEOLOCALIZAR");
      }
    },

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

    checkRecord() {
      this.getCurrentPosition();
    },

    saveRecord(id_user,position) {
      db.collection('record').doc(id_user).collection('records').doc().set ({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        type: this.picked,
        note: this.note,
      });
    },

    saveArrival(myPosition) {
      db.collection('e').add ({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        latitude: myPosition.coords.latitude,
        longitude: myPosition.coords.longitude,
        note: this.note,
      });
    },

    saveDeparture() {
      db.collection('arrivals').add ({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        latitude: myPosition.coords.latitude,
        longitude: myPosition.coords.longitude,
        note: this.note,
      });
    },
  },

  created(){
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        this.authUser = user;
        this.usr_name = user.displayName.toLowerCase();
        
        //Revisa si tengo guardado el usuario logeado en la BD
        this.checkUser();
      }else{
        //console.log("ESTE MENSAJE SE VE CUANDO SALE");
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
          next();
        }else{
          setTimeout(()=>{
            vm.$router.push('/login');
            // Cierra todas las conexiones abiertas
            location.reload();
          },500);
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

</style>