<template>
    <div id="testMap">
        <l-map :zoom="zoom" :center="center" style="height: 800px; width: 1600px">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker v-for="contact in contacts" :key="contact" :lat-lng="contact.address.position" @click="hello(contact)" :icon="contact.icon"></l-marker>
        </l-map>
    </div>
</template>

<script>
    import {LMap, LTileLayer, LMarker} from 'vue2-leaflet'
    import L from 'leaflet'

    export default {
        name: "testMap",
        components: {
            LMarker,
            LTileLayer,
            LMap,
        },
        mounted() {

        },
        data() {
            return {
                zoom: 13,
                center: [47.413220, -1.219482],
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

                selectedIcon: L.icon({
                    iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-red.png',
                    shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png',
                    iconSize:     [38, 95],
                    shadowSize:   [50, 64],
                    iconAnchor:   [22, 94],
                    shadowAnchor: [4, 62],
                    popupAnchor:  [-3, -76]
                }),
                contacts: [{
                    name: 'Contact1',
                    address: {
                        complete_address: '...',
                        position: [47.413220, -1.219482]
                    },
                    phone_number: '+49.....',
                    email: 'me@here.com',
                    icon: this.defaultIcon()
                },{
                    name: 'Contact2',
                    address: {
                        complete_address: '...',
                        position: [47.443220, -1.219482]
                    },
                    phone_number: '+49.....',
                    email: 'me@here.com',
                    icon: this.defaultIcon()
                }]
            }
        },

        methods: {
            hello(contact) {
                contact.icon = this.selectedIcon;
                console.log(contact.name);
            },
            defaultIcon(){
                return L.icon({
                    iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
                    shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png',
                    iconSize:     [38, 95],
                    shadowSize:   [50, 64],
                    iconAnchor:   [22, 94],
                    shadowAnchor: [4, 62],
                    popupAnchor:  [-3, -76]
                })
            },

        },
    }

</script>

<style scoped>

</style>
