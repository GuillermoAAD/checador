<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">
        <!--<img class="logo" src="https://www.perspective.com.mx/assets/img/logo.png">-->
        <img class="logo" src="./assets/logo.png">
        
      </router-link>
      <div id="div-routes">
        <router-link to="/login">Iniciar Sesión</router-link> |
        <router-link to="/signup">Registrarme</router-link>
        <!--<router-link to="/loginAdmin">ADMIN</router-link>-->
      </div>

    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.logo {
  height: 100px;
}

body {
  /*background-color: #ffffff;*/
  background: linear-gradient(to top, #32383e,#1a1d1f 50%);
  background-attachment:fixed;
}
</style>
