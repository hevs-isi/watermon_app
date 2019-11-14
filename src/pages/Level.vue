<template>
    <div class="level">
        <button v-on:click="changeData">Charger data</button>
        <StockChart :data="series" :title="title"/>
    </div>
</template>

<script>
    import Influx from 'influx'
    import moment from 'moment'
    import StockChart from '../components/StockChart.vue'
    const client = new Influx.InfluxDB('https://ro:ro@watermon.ch/influx/Altis_DB');
    export default {
        props : [
            'title_text'
        ],
        name: 'level',
        components: {
            //chart: Chart,
            StockChart
        },
        mounted () {
            this.changeData();
        },
        methods : {
            changeData: function() {
                Promise.all([
                    client.query('SELECT "DistanceComputed" FROM "level-sensor-1" WHERE time>now()-365d'),
                ]).then(parsedRes => {
                    console.log(parsedRes);
                    const mutatedArray = parsedRes.map( arr => {
                        return Object.assign({}, {
                            name: "level-sensor-1",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj.DistanceComputed
                            }))
                        });
                    });
                    //console.log(mutatedArray);
                    this.series = mutatedArray;
                    this.title = "Niveau d'eau à" + this.title_text;
                    //console.log(this.series);
                }).catch(error => console.log(error))
            }
        },
        data () {
            return {
                series : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                title : "Niveau d'eau"
            }

        }

    }
</script>

<style scoped>

</style>
