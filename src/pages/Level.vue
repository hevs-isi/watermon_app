<template>
    <div class="level">

        <b-row align-v="center" class="text-center">
            <b-col sm="2">
                <div class="mb-4" style="font-size: 130%">Niveau d'eau</div>
                <img src="../assets/svg/flood.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>
            <b-col sm>
                    <StockChart :data="series_level"/>
            </b-col>
            <b-col sm="2">
                <div class="" style="font-size: 130%">Niveau d'eau</div>
                <div class="" style="font-size: 200%">{{lastLevelValue}} mm</div>
            </b-col>
        </b-row>

        <b-row align-v="center" class="text-center">
            <b-col>
                <div class="mb-4" style="font-size: 130%">Niveau de batterie</div>
                <img src="../assets/svg/battery.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>
            <b-col cols="8">
                <StockChart :data="series_battery"/>
            </b-col>
            <b-col>
                <div class="" style="font-size: 130%">Niveau de batterie</div>
                <div class="" style="font-size: 200%">{{lastBatteryValue}} V</div>
            </b-col>
        </b-row>
    </div>

</template>

<script>
    import Influx from 'influx'
    import moment from 'moment'
    import NProgress from 'nprogress'
    import StockChart from '../components/StockChart.vue'
    import credInflux from "../constants/influx";
    const client = new Influx.InfluxDB({
        database: credInflux.database,
        host: credInflux.host,
        port: credInflux.port,
        protocol: credInflux.protocol,
        username: credInflux.username,
        password: credInflux.password
    });

    export default {
        props : [
            'title_text'
        ],
        name: 'level',
        components: {
            //chart: Chart,
            StockChart,
        },
        mounted () {
            NProgress.start();
            this.loadLevelData();
            this.loadBatteryData();
        },
        methods : {
            loadLevelData: function() {
                Promise.all([
                    client.query('SELECT "DistanceComputed" FROM "level-sensor-1" WHERE time>now()-365d'),
                ]).then(parsedRes => {
                    console.log(parsedRes);
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastLevelValue = arr[arr.length-1]['DistanceComputed'];
                        return Object.assign({}, {
                            name: "Distance",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj.DistanceComputed
                            }))
                        });
                    });
                    //console.log(mutatedArray);
                    this.series_level = mutatedArray;
                    NProgress.done();
                    //console.log(this.series);
                }).catch(error => console.log(error))
            },
            loadBatteryData: function() {
                Promise.all([
                    client.query('SELECT "Battery voltage" FROM "level-sensor-1" WHERE time>now()-365d'),
                ]).then(parsedRes => {

                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['Battery voltage'];
                        return Object.assign({}, {
                            name: "Niveau de batterie",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['Battery voltage']
                            }))
                        });
                    });
                    console.log(mutatedArray);
                    this.series_battery = mutatedArray;
                    //console.log(this.series_battery);
                }).catch(error => console.log(error))
            }
        },
        data () {
            return {
                series_level : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                series_battery : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                lastLevelValue:"",
                lastBatteryValue:""
            }

        }

    }
</script>

<style scoped>

</style>
