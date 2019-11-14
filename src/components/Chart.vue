<template>
    <div class="chartElem">
        <div>
            <highcharts :options="chartOptions" :updateArgs="updateArgs"></highcharts>
        </div>
    </div>
</template>

<script>
    export default {
        props : [
            'data'
        ],
        data () {
            return {
                title: '',
                chartType: 'Spline',
                seriesColor: '#6fcd98',
                colorInputIsSupported: null,
                animationDuration: 1000,
                updateArgs: [true, true, {duration: 1000}],
                chartOptions: {
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: 'Sin chart'
                    },
                    series: this.data,

                }
            }
        },
        watch: {
            data (newValue) {
                this.chartOptions.series = newValue
            },

        }


    }
</script>

<style scoped>
    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
    }
    #colorPicker {
        border: 0;
        padding: 0;
        margin: 0;
        width: 30px;
        height: 30px;
    }
    .numberInput {
        width: 30px;
    }
</style>