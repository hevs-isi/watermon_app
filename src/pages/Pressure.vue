<template>
    <div class="pressure">
        <div class="h2">Mesures : {{sectorName}}</div>
        <button v-on:click="loadPressureData">Charger data</button>
        <StockChart :data="series_pressure"/>
        <button v-on:click="loadDebitData">Charger data</button>
        <StockChart :data="series_debit"/>
    </div>
</template>

<script>
    import Influx from 'influx'
    import moment from 'moment'
    import StockChart from '../components/StockChart.vue'
    const client = new Influx.InfluxDB('http://cesar:password@localhost:8086/Altis_DB');

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
            console.log("mounted");
            this.sensorText = this.sensorName;
            this.loadDebitData();
            this.loadPressureData();
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
                        return Object.assign({}, {
                            name: "Débit",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj.DistanceComputed
                            }))
                        });
                    });
                    //console.log(mutatedArray);
                    this.series_debit = mutatedArray;
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
                sensorText : "",
            }
        },
        watch :{
            sensorName (newValue){
                this.sensorText = newValue;
                this.loadDebitData();
                this.loadPressureData();
            }
        }



    }
</script>

<style scoped>

</style>
