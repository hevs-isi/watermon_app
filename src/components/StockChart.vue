<template>
    <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
</template>

<script>
    export default {
        props : [
            'data',
            'title'
        ],
        data () {
            return {
                stockOptions: {
                    rangeSelector: {
                        selected: 'all',
                        buttons: [{
                            type: 'hour',
                            count: 6,
                            text: '6h',
                        }, {
                            type: 'hour',
                            count: 24,
                            text: '24h'
                        }, {
                            type: 'day',
                            count: 7,
                            text: '7d'
                        }, {
                            type: 'month',
                            count: 1,
                            text: '1m'
                        }, {
                            type: 'month',
                            count: 3,
                            text: '3m'
                        }, {
                            type: 'all',
                            text: 'All'
                        }]
                    },
                    title: {
                        text: this.title
                    },
                    series: this.data
                }
            }
        },
        watch: {
            data (newValue) {
                this.stockOptions.series = newValue
            },
            title(newValue) {
                this.stockOptions.title = newValue
            }

        }
    }
</script>
<style scoped>
    .stock {
        width: 70%;
        margin: 0 auto
    }
</style>
