<template>
    <div>
        <b-navbar toggleable="lg" type="light" id="navbar">

                <b-navbar-brand>
                        <img class="" src="https://www.hevs.ch/img/logo-hes-so-valais-2019.png" height="50%" >
                </b-navbar-brand>
            <b-container>
                <b-navbar-brand href="/#/">Watermon</b-navbar-brand>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">Mesures de niveau</template>
                            <b-dropdown-item to="/level">Ancienne STEP</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">Mesures de pression et de débit</template>
                            <b-dropdown-item :to="{ name: 'pressure', params: {sensorName: 'measure-v2', sectorName: 'Combaynon' } }">Combaynon</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'pressure', params: {sensorName: 'measure-v0', sectorName: 'Ancienne STEP'  } }">Ancienne STEP</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'pressure', params: {sensorName: 'measure-v4', sectorName: 'Le Tarpin'  } }">Le Tarpin</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">Mesures d'humidité</template>
                            <b-dropdown-item :to="{ name: 'humidity', params: {id: 32 } }">Terrain M. S Vollège</b-dropdown-item>
                        </b-nav-item-dropdown>

                    </b-navbar-nav>
                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">User</template>
                                <b-dropdown-item >Login</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>
<script>
    export default {
        data() {
            return {
            }
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #navbar {
        background-color: bisque;
    }
</style>
