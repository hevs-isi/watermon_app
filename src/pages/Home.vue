<template>
    <div class="home">
        <h1>Capteurs</h1>
        <l-map
                class="m-auto"
                style="height: 750px; width: 1400px"
                :zoom="zoom"
                :center="center"
                @update:zoom="zoomUpdated"
                @update:center="centerUpdated"
                @update:bounds="boundsUpdated"
                @click="printPosition"
                >

            <l-tile-layer :url="url"></l-tile-layer>
            <!--<l-marker :lat-lng="marker"></l-marker>-->
            <l-marker v-for="(sensor,index) in sensors" :lat-lng="sensor.position" :key="index">
                <l-popup>
                    <div v-if="sensor.type===1">
                        <h4>{{sensor.position_name}}</h4>
                        <div>Pression : {{sensor.pressure}} bar     </div>
                        <div>Débit : {{sensor.debit}} m3h     </div>
                        <div>Niveau : {{sensor.level}} mm     </div>
                        <button v-on:click="loadData(sensor.id)">Charger data</button>
                    </div>
                    <div v-if="sensor.type===2">
                        <h4>{{sensor.position_name}}</h4>
                        <div>Humidité du sol : {{sensor.humidity*100}} %  </div>
                        <div>Température du sol : {{sensor.temp}} °C   </div>
                        <button v-on:click="loadData(sensor.id)">Charger data</button>
                    </div>
                </l-popup>
            </l-marker>
        </l-map>
    </div>

</template>
<script>
    import {LMap, LTileLayer, LMarker, LPopup} from 'vue2-leaflet'
    import { Icon } from 'leaflet'
    delete Icon.Default.prototype._getIconUrl;
    import Influx from 'influx'
    const client = new Influx.InfluxDB({
        database: 'Altis_DB',
        host: 'influx.watermon.ch',
        port: '443',
        protocol: 'https',
        username: 'ro',
        password: 'ro'
    });

    Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    });
    export default {
        name: 'home',
        components: {
            LMap, LTileLayer, LMarker, LPopup

        },
        data() {
            return {
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoom: 14,
                center: [46.09019806912501, 7.204499244689942],
                bounds: null,
                markers: [
                    [46.096715752047594, 7.214045226573945],
                    [46.093561170654304,7.212307155132295],
                ],

                sensors: [{
                    type: 1,
                    id:1,
                    position_name: 'Ancienne STEP',
                    pressure:"-",
                    debit:"-",
                    level:"-",
                    position: [46.096717, 7.214058]
                },{
                    type:1,
                    id:2,
                    position_name: 'Le Tarpin',
                    pressure:"-",
                    debit:"-",
                    level:"none",
                    position: [46.093547, 7.212366]
                },{
                    type:1,
                    id:3,
                    position_name: 'Combaynon',
                    pressure:"-",
                    debit:"-",
                    level:"none",
                    position: [46.098088, 7.213919]
                },{
                    type:2,
                    id:4,
                    position_name: 'Terrain M. S',
                    temp:"- °C",
                    humidity:"- %",
                    position: [46.086570, 7.179780]
                }]
            }
        },
        methods: {
            zoomUpdated (zoom) {
                this.zoom = zoom;
            },
            centerUpdated (center) {
                this.center = center;
            },
            boundsUpdated (bounds) {
                this.bounds = bounds;
            },
            loadData(id){
                switch (id) {
                    case 1:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v0"'),])
                            .then(parsedRes => {console.log(parsedRes);this.sensors[0].pressure = parsedRes[0][0].last.toFixed(2);}).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v0"'),])
                            .then(parsedRes => {console.log(parsedRes);this.sensors[0].debit = parsedRes[0][0].last.toFixed(2);}).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("DistanceComputed") FROM "level-sensor-1"'),])
                            .then(parsedRes => {console.log(parsedRes);this.sensors[0].level = parsedRes[0][0].last.toFixed(2);}).catch(error => console.log(error));
                        break;
                    case 2:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v4"'),])
                            .then(parsedRes => {console.log(parsedRes);this.sensors[1].pressure = parsedRes[0][0].last.toFixed(2);}).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v4"'),])
                            .then(parsedRes => {console.log(parsedRes);this.sensors[1].debit = parsedRes[0][0].last.toFixed(2);}).catch(error => console.log(error));
                        break;
                    case 3:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v2"'),])
                            .then(parsedRes => {console.log(parsedRes);this.sensors[2].pressure = parsedRes[0][0].last.toFixed(2);}).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v2"'),])
                            .then(parsedRes => {console.log(parsedRes);this.sensors[2].debit = parsedRes[0][0].last.toFixed(2);}).catch(error => console.log(error));
                        break;
                    case 4:

                        Promise.all([client.query('SELECT last("Soil temperature") FROM "field-humidity-sensor-1"'),])
                            .then(parsedRes => {console.log(parsedRes);this.sensors[3].temp = parsedRes[0][0].last.toFixed(2);}).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("Volumetric water content") FROM "field-humidity-sensor-1"'),])
                            .then(parsedRes => {console.log(parsedRes);this.sensors[3].humidity = parsedRes[0][0].last.toFixed(2);}).catch(error => console.log(error));
                        break;

                }
            },
            printPosition(event){
                console.log(event.latlng);
            }
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import "../../node_modules/leaflet/dist/leaflet.css";
</style>
