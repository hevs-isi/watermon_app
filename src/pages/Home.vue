<template>
    <div class="home">
        <b-container fluid class="mh-100">
            <b-row>
                <b-col lg="9">
                    <l-map
                            style="height: 850px;width: 100%"
                            :zoom="zoom"
                            :center="center"
                            @update:zoom="zoomUpdated"
                            @update:center="centerUpdated"
                            @update:bounds="boundsUpdated"
                            @click="printPosition"
                    >

                        <l-tile-layer :url="url"></l-tile-layer>
                        <!--<l-marker :lat-lng="marker"></l-marker>-->
                        <l-marker v-for="(sensor,index) in sensors" :lat-lng="sensor.position" :key="index + 10"
                                  @click="loadData(sensor.id)" :icon="sensor.icon" :visible="true">
                            <l-popup>
                                <div v-if="sensor.type===1">
                                    <h4>{{sensor.position_name}}</h4>
                                    <div>Pression : {{sensor.pressure}} bar</div>
                                    <div>Débit : {{sensor.debit}} m3h</div>
                                    <div>Niveau : {{sensor.level}} mm</div>
                                </div>
                                <div v-if="sensor.type===2">
                                    <h4>{{sensor.position_name}}</h4>
                                    <div>Humidité du sol : {{sensor.humidity*100}} %</div>
                                    <div>Température du sol : {{sensor.temp}} °C</div>
                                </div>
                            </l-popup>
                        </l-marker>
                        <l-marker v-for="(antenna,index) in antennas" :lat-lng="antenna.position" :key="index + 100"
                                  @click="lastSeenAntenna(antenna.eui, antenna.id)" :icon="antenna.icon"
                                  :visible="true">
                            <l-popup>
                                <h5>Antenne de {{antenna.position_name}}</h5>
                                <div>latitude: {{antenna.position[0]}}</div>
                                <div>longitude: {{antenna.position[1]}}</div>
                                <div>Vu il y a : {{antenna.lastSeen}} secondes</div>
                            </l-popup>
                        </l-marker>
                    </l-map>
                </b-col>
                <b-col lg="3">
                    <b-card>
                    <div class="lucida">
                        <h1>Status antennes</h1>
                        <pre>Prochain test dans {{seconds}} secondes...</pre>
                        <div class="">
                            <div v-for="(antenna, index) in antennas" :key="index+200">
                                <div v-if="antenna.isUp" >
                                <p class="text-left">> {{antenna.position_name}}</p>
                                <pre class="text-left">     <span style="color: green">OK</span> </pre>
                                </div>
                                <div v-else >
                                    <p class="text-left">
                                        > Status {{antenna.position_name}}
                                    </p>
                                    <pre class="text-left">     <span style="color: red">DOWN</span> depuis {{antenna.timestamp}}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>

</template>
<script>
    import {LMap, LTileLayer, LMarker, LPopup} from 'vue2-leaflet'
    import Influx from 'influx'
    import {Icon} from 'leaflet'
    import L from 'leaflet'
    import axios from 'axios'

    delete Icon.Default.prototype._getIconUrl;
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
                timer:null,
                timerIsRunning:false,
                seconds:0,
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoom: 13,
                center: [46.09019806912501, 7.204499244689942],
                bounds: null,
                markers: [
                    [46.096715752047594, 7.214045226573945],
                    [46.093561170654304, 7.212307155132295],
                ],

                sensors: [{
                    type: 1,
                    id: 1,
                    position_name: 'Ancienne STEP',
                    pressure: "-",
                    debit: "-",
                    level: "-",
                    position: [46.096717, 7.214058],
                    icon: this.deviceIcon()
                }, {
                    type: 1,
                    id: 2,
                    position_name: 'Le Tarpin',
                    pressure: "-",
                    debit: "-",
                    level: "none",
                    position: [46.093547, 7.212366],
                    icon: this.deviceIcon()
                }, {
                    type: 1,
                    id: 3,
                    position_name: 'Combaynon',
                    pressure: "-",
                    debit: "-",
                    level: "none",
                    position: [46.098088, 7.213919],
                    icon: this.deviceIcon()
                }, {
                    type: 1,
                    id: 4,
                    position_name: 'Réservoir Curala',
                    pressure: "-",
                    debit: "-",
                    level: "none",
                    position: [46.079062, 7.215399],
                    icon: this.deviceIcon()
                }, {
                    type: 2,
                    id: 5,
                    position_name: 'Terrain M. S',
                    temp: "- °C",
                    humidity: "- %",
                    position: [46.086570, 7.179780],
                    icon: this.deviceIcon()
                }],
                antennas: [{
                    type: 1,
                    id: 1,
                    position_name: 'STEP',
                    position: [46.08302000, 7.20260000],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe0f0c22',
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 2,
                    position_name: 'Ruinettes',
                    position: [46.09072000, 7.25180000],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe0f0c7b',
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 3,
                    position_name: 'Bruson',
                    position: [46.06059000, 7.19409000],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe106166',
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 4,
                    position_name: 'Curala',
                    position: [46.078594, 7.214584],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe0aaac6',
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 5,
                    position_name: 'HEVs',
                    position: [46.24046242, 7.35863492],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe110106',
                    lastSeen: "-",
                    timestamp: "",
                    isUp: false,
                }],
                response: "",
            }
        },
        created() {
            this.checkAntenna();
            this.startTimer();
        },
        mounted() {


        },
        //VERY VERY important !! Destroy the timer when the user change the page
        beforeDestroy() {
            clearInterval(this.timer);
        },
        methods: {
            startTimer(){
                if (!this.timerIsRunning){
                    this.timerIsRunning = true;
                    if (!this.timer){
                        console.log("Start timer...")
                        this.timer = setInterval(this.secondsCallback, 1000);
                    }
                }
            },
            secondsCallback(){
                if (this.seconds < 30){
                    console.log(this.seconds);
                    this.seconds ++;
                } else if (this.seconds === 30){
                    console.log("check antennas");
                    this.seconds = 0;
                    this.checkAntenna();
                }

            },
            zoomUpdated(zoom) {
                this.zoom = zoom;
            },
            centerUpdated(center) {
                this.center = center;
            },
            boundsUpdated(bounds) {
                this.bounds = bounds;
            },
            loadData(id) {
                switch (id) {
                    case 1:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v0"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[0].pressure = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v0"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[0].debit = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("DistanceComputed") FROM "level-sensor-1"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[0].level = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 2:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v4"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[1].pressure = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v4"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[1].debit = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 3:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v2"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[2].pressure = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v2"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[2].debit = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 4:
                        Promise.all([client.query('SELECT last("Distance") FROM "level-sensor-5"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[3].level = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 5:

                        Promise.all([client.query('SELECT last("Soil temperature") FROM "field-humidity-sensor-1"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[4].temp = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("Volumetric water content") FROM "field-humidity-sensor-1"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[4].humidity = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;

                }
            },
            printPosition(event) {
                console.log(event.latlng);
            },
            deviceIcon() {
                return L.icon({
                    iconUrl: require('../assets/gps.png'),
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-3, -76]
                })
            },
            antennaIconUp() {
                return L.icon({
                    iconUrl: require('../assets/antennaUp.png'),
                    iconSize: [64, 64],
                    iconAnchor: [32, 32],
                    popupAnchor: [32, 0]
                })
            },
            antennaIconDown() {
                return L.icon({
                    iconUrl: require('../assets/antennaDown.png'),
                    iconSize: [64, 64],
                    iconAnchor: [32, 32],
                    popupAnchor: [32, 0]
                })
            },
            lastSeenAntenna(eui, id) {
                axios('https://watermon.ch/nodered/gateway?eui=' + eui, {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    mode: 'origin', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then((response) => {
                    let now = new Date();
                    let current_datetime = new Date(response.data.timestamp);
                    let diffTime = (Math.abs(now - current_datetime) / 1000);

                    let formatedDate = Math.ceil(diffTime);
                    this.antennas[id - 1].lastSeen = formatedDate;

                }).catch((e) => {
                    console.log(e);
                });


            },
            checkAntenna() {
                //let axiosArray = [];
                for (let i = 0; i < this.antennas.length; i++) {
                    console.log("Check status of : " + this.antennas[i].eui);
                    axios('https://watermon.ch/nodered/gateway?eui=' + this.antennas[i].eui, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        mode: 'origin', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then((res) => {
                        let timestamp = new Date(res.data.timestamp);
                        this.antennas[i].timestamp = timestamp
                        let now = new Date();

                        if (this.secondBetweenDate(now, timestamp) < 60) {
                            this.antennas[i].icon = this.antennaIconUp();
                            this.antennas[i].isUp = true;
                        } else {
                            this.antennas[i].icon = this.antennaIconDown();
                            this.antennas[i].isUp = false;
                        }
                    });
                }
                /**axios.all(axiosArray)
                 .then(axios.spread((...responses)=> {
                        responses.forEach((res,index) => {
                            console.log(index);
                            let timestamp = new Date(res.data.timestamp);
                            let now = new Date();
                            if (this.secondBetweenDate(now,timestamp)< 60){
                                this.antennas[index].icon = this.antennaIconUp();
                            }else {
                                this.antennas[index].icon = this.antennaIconDown();
                            }
                        })
                    }))*/

            },
            secondBetweenDate(date1, date2) {
                return Math.ceil(Math.abs(date1 - date2) / 1000);
            }

        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import "../../node_modules/leaflet/dist/leaflet.css";

    .lucida h1 {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 24px;
        font-style: normal;
        font-variant: normal;
        font-weight: 700;
        line-height: 26.4px;
    }

    .lucida h3 {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 14px;
        font-style: normal;
        font-variant: normal;
        font-weight: 700;
        line-height: 15.4px;
    }

    .lucida p {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 11px;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 20px;
    }

    .lucida blockquote {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 17px;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 23px;
    }

    .lucida pre {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 11px;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 23px;
    }

    .console {
        background-color: #828ea0;
    }
</style>
