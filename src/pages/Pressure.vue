<template>
    <div class="pressure">
        <div class="h2">Mesures : {{sectorName}}</div>

        <b-row align-v="center" class="text-center">
            <b-col sm="2">
                <div class="mb-4" style="font-size: 130%">Pression d'eau</div>
                <img src="../assets/svg/meter.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>
            <b-col sm>
                <StockChart :data="series_pressure"/>
            </b-col>
            <b-col sm="2">
                <div class="" style="font-size: 130%">Pression d'eau</div>
                <div class="" style="font-size: 200%">{{lastPressureValue}} bar</div>
            </b-col>
        </b-row>

        <b-row align-v="center" class="text-center">
            <b-col>
                <div class="mb-4" style="font-size: 130%">Débit d'eau</div>
                <img src="../assets/svg/watermeter.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>
            <b-col cols="8">
                <StockChart :data="series_debit"/>
            </b-col>
            <b-col>
                <div class="" style="font-size: 130%">Débit d'eau</div>
                <div class="" style="font-size: 200%">{{lastDebitValue}} m3h</div>
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
                <div class="" style="font-size: 200%">{{lastBatteryValue/1000}} V</div>
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
        host: 'influx.dev.watermon.ch',
        port: '443',
        protocol: 'https',
        username: 'ro',
        password: 'aeC4hohu'
    });

    export default {
        props : [
            'sectorName',
            'sensorName'
        ],
        name: 'pressure',
        components: {
            //chart: Chart,
            StockChart
        },
        mounted (){
            NProgress.start();
            console.log("start mount");
            this.sensorText = this.sensorName;
            if (this.sensorText === undefined){
                console.log("sensortext is undefiend");
                console.log(this.sectorName);
                if (this.sectorName.localeCompare('Ancienne STEP')===0){
                    this.sensorText = 'measure-v0'
                }
                if (this.sectorName.localeCompare('Combaynon')===0){
                    this.sensorText = 'measure-v2'
                }
                if (this.sectorName.localeCompare('Le Tarpin')===0){
                    this.sensorText = 'measure-v4'
                }
            }
            console.log(this.sensorText);
            this.loadPressureData();
            this.loadDebitData();
            this.loadBatteryData();

        },
        methods : {
            loadPressureData: function() {

                let query_str = 'SELECT "value_bar" FROM ';
                query_str += "\""+ this.sensorText+ "\"";
                query_str += ' WHERE time >= now()-365d fill(null)';
                console.log(query_str);
                Promise.all([
                    client.query(query_str),
                ]).then(parsedRes => {
                    console.log(parsedRes);
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastPressureValue = arr[arr.length-1]['value_bar'].toFixed(2);
                        return Object.assign({}, {
                            name: "Pression",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj.value_bar
                            }))

                        });

                    });

                    console.log(mutatedArray);
                    this.series_pressure = mutatedArray;
                    console.log(this.series);

                }).catch(error => console.log(error))
            },

            loadDebitData: function() {
                let query_str = 'SELECT "value_m3h" FROM ';
                query_str += "\""+ this.sensorText+ "\"";
                query_str += ' WHERE time >= now()-365d fill(null)';
                Promise.all([
                    client.query(query_str),
                ]).then(parsedRes => {
                    console.log(parsedRes);
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastDebitValue = arr[arr.length-1]['value_m3h'].toFixed(2);
                        return Object.assign({}, {
                            name: "Débit",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj.value_m3h
                            }))
                        });
                    });
                    //console.log(mutatedArray);
                    this.series_debit = mutatedArray;
                    NProgress.done();
                    //console.log(this.series);
                }).catch(error => console.log(error))
            },
            loadBatteryData: function() {
                let query_str = 'SELECT "value_vBat" FROM ';
                query_str += "\""+ this.sensorText+ "\"";
                query_str += ' WHERE time >= now()-365d fill(null)';
                Promise.all([
                    client.query(query_str),
                ]).then(parsedRes => {
                    NProgress.set(0.65);
                    console.log(parsedRes);
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['value_vBat'].toFixed(2);
                        return Object.assign({}, {
                            name: "Niveau de batterie",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj.value_vBat
                            }))
                        });
                    });
                    //console.log(mutatedArray);
                    this.series_battery = mutatedArray;
                    //console.log(this.series);
                }).catch(error => console.log(error))

            }
        },
        data () {
            return {
                series_pressure : [{
                    name: "Pression",
                    turboThreshold:60000,
                    data: [],

                }],
                series_debit : [{
                    name: "Débit",
                    turboThreshold:60000,
                    data: [],

                }],
                series_battery : [{
                    name: "Batterie",
                    turboThreshold:60000,
                    data: [],

                }],
                sensorText : "",
                lastPressureValue:"",
                lastDebitValue:"",
                lastBatteryValue:""
            }
        },
        watch :{
            sensorName (newValue){
                this.sensorText = newValue;
                this.loadPressureData();
                this.loadDebitData();
                this.loadBatteryData();
            },

        }



    }
</script>

<style scoped>

</style>
