<template>
    <div class="info">
        <b-jumbotron>
            <template v-slot:header>Watermon</template>

            <template v-slot:lead>
                <p>Le projet de monitoring de l'irrigation par la</p>
                <a href="https://www.hevs.ch/fr/" target="_blank">
                    <img class="ml-3" src="https://www.hevs.ch/img/logo-hes-so-valais-2019.png" height="100em" >
                </a>
                <p class="m-3"> en partenariat avec</p>
                <a href="https://www.altis.swiss/" target="_blank">
                    <img class="pl-4" src="../assets/logo_altis.png" height="100em">
                </a>
            </template>

            <hr class="my-4">
            <b-carousel
                    id="carousel-fade"
                    style="text-shadow: 0 0 2px #000"
                    fade
                    indicators
                    class="w-75 m-auto"
            >
                <b-carousel-slide
                        img-src="../assets/photos/photo1.jpg"
                />
                <b-carousel-slide
                        img-src="../assets/photos/photo2.jpg"
                />
                <b-carousel-slide
                        img-src="../assets/photos/photo3.jpg"
                />
            </b-carousel>
        </b-jumbotron>
    </div>
</template>

<script>
    export default {
        name: "Info",
        components: {},
        data(){
            return {

            }
        }
    }
</script>

<style scoped>

</style>
