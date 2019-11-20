<template>
    <div class="humidity">

        <b-row align-v="center" class="text-center">
            <b-col sm="2">
                <div class="mb-4" style="font-size: 130%">Humidité du terrain</div>
                <img src="../assets/svg/humidity.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>
            <b-col sm>
                <StockChart :data="series_humidity"/>
            </b-col>
            <b-col sm="2">
                <div class="" style="font-size: 130%">Humidité</div>
                <div class="" style="font-size: 200%">{{lastHumidityValue*100}} %</div>
            </b-col>
        </b-row>

        <b-row align-v="center" class="text-center">
            <b-col>
                <div class="mb-4" style="font-size: 130%">Température du terrain</div>
                <img src="../assets/svg/temperature.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>
            <b-col cols="8">
                <StockChart :data="series_temperature"/>
            </b-col>
            <b-col>
                <div class="" style="font-size: 130%">Température</div>
                <div class="" style="font-size: 200%">{{lastTemperatureValue}} °C</div>
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
    const client = new Influx.InfluxDB({
        database: 'Altis_DB',
        host: 'influx.watermon.ch',
        port: '443',
        protocol: 'https',
        username: 'ro',
        password: 'ro'
    });

    export default {
        props : [
            'title_text'
        ],
        name: 'humidity',
        components: {
            //chart: Chart,
            StockChart,
        },
        mounted () {
            NProgress.start();
            this.loadHumidityData();
            this.loadTemperatureData();
            this.loadBatteryData();
        },
        methods : {
            loadHumidityData: function() {
                Promise.all([
                    client.query('SELECT "Volumetric water content" FROM "field-humidity-sensor-1" WHERE time>\'2019-09-05T18:00:00Z\''),
                ]).then(parsedRes => {
                    console.log(parsedRes);
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastHumidityValue = arr[arr.length-1]['Volumetric water content'].toFixed(2);
                        return Object.assign({}, {
                            name: "Volumetric water content",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['Volumetric water content']
                            }))
                        });
                    });
                    //console.log(mutatedArray);
                    this.series_humidity = mutatedArray;
                    NProgress.done();
                    //console.log(this.series);
                }).catch(error => console.log(error))
            },
            loadTemperatureData: function() {
                Promise.all([
                    client.query('SELECT "Soil temperature" FROM "field-humidity-sensor-1" WHERE time>\'2019-09-05T18:00:00Z\''),
                ]).then(parsedRes => {
                    console.log(parsedRes);
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastTemperatureValue = arr[arr.length-1]['Soil temperature'].toFixed(2);
                        return Object.assign({}, {
                            name: "Température du sol",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['Soil temperature']
                            }))
                        });
                    });
                    //console.log(mutatedArray);
                    this.series_temperature = mutatedArray;
                    //console.log(this.series);
                }).catch(error => console.log(error))
            },
            loadBatteryData: function() {
                Promise.all([
                    client.query('SELECT "Battery voltage" FROM "field-humidity-sensor-1" WHERE time>\'2019-09-05T18:00:00Z\''),
                ]).then(parsedRes => {

                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['Battery voltage'].toFixed(2);
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
                series_humidity : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                series_temperature : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                series_battery : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                lastHumidityValue:"",
                lastTemperatureValue:"",
                lastBatteryValue:"",

            }

        }

    }
</script>

<style scoped>

</style>
