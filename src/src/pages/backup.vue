<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Horaire des prochains métros</h4>
            <!--<p class="category">Here is a subtitle for this table</p>-->
          </md-card-header>
          <md-card-content>
            <transition name="component-fade" mode="out-in">




              <!-- Selection des métros -->
              <div v-if="metroShow == 1" :key="metroShow">
                <div class="md-layout md-gutter md-alignment-center-space-arround">
                  <div v-for="metro in metros.result.metros">
                    <img v-if="(metro.code != 'Fun') && (metro.code != 'Orv')"
                         @click="metroClicked(metro.code)"
                         :src="'https://abel.am/metro/metro/ligne' + metro.code + '.svg'" class="logos">
                  </div>
                </div>
              </div>


              <!-- Selection des stations -->
              <div v-else-if="metroShow == 2" :key="metroShow">
                <h2>Stations de la ligne <b>{{metroCurrentLine}}</b></h2><br/>
                <!-- Affichage des alertes incidents -->
                <div v-if="metroTrafic.slug != 'normal'" :class="metroTrafic.slug == 'normal_trav' ? 'alert alert-warning' : 'alert alert-danger'" role="alert">{{ metroTrafic.message }}</div>
                <!-- Selection des arrêts -->
                <div class="md-layout md-gutter md-alignment-center selectStations">
                  <div v-for="station in metroStations">
                    <div class="alert alert-secondary stations"
                         role="alert"
                         @click="metroStationClicked(metroCurrentLine, station.slug, station.name)">
                      {{ station.name }}
                    </div>
                  </div>
                </div>
                <div class="center">
                  <md-button class="md-raised buttonReturn md-elevation-10" @click="metroShow = 1">⇠ Retour à la sélection des lignes de métros</md-button>
                </div>
              </div>








              <div v-else-if="metroShow == 3" :key="metroShow">
                <h2>Ligne <b>{{metroCurrentLine}}</b>, station <b>{{metroCurrentStation}}</b></h2><br/>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-layout md-gutter">
                    <div class="md-layout-item">
                      <md-card>
                        <md-card-header data-background-color="green">
                          <h4 class="title">Direction <b>{{ metroSchedulesA[0].destination }}</b></h4>
                        </md-card-header>
                        <md-card-content>
                          <md-table>
                            <md-table-row v-for="metroScheduleA in metroSchedulesA">
                              <md-table-cell>Temps d'attente avant le prochain métro (<b>{{ metroScheduleA.message }}</b>)</md-table-cell>
                            </md-table-row>
                          </md-table>
                          <hr/>
                          <div class="center">
                            <md-button class="md-raised buttonReturn md-elevation-10" @click="metroShow = 1">⇠ Retour à la sélection des lignes de métros</md-button>
                          </div>
                        </md-card-content>
                      </md-card>
                    </div>

                    <div class="md-layout-item">
                      <md-card>
                        <md-card-header data-background-color="green">
                          <h4 class="title">Direction <b>{{ metroSchedulesR[0].destination }}</b></h4>
                        </md-card-header>
                        <md-card-content>
                          <md-table>
                            <md-table-row v-for="metroScheduleR in metroSchedulesR">
                              <md-table-cell>Temps d'attente avant le prochain métro (<b>{{ metroScheduleR.message }}</b>)</md-table-cell>
                            </md-table-row>
                          </md-table>
                          <hr/>
                          <div class="center">
                            <md-button class="md-raised buttonReturn md-elevation-10" @click="metroShow = 2">⇠ Sélection des station</md-button>
                          </div>
                        </md-card-content>
                      </md-card>
                    </div>
                  </div>
                </div>
              </div>


            </transition>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    SimpleTable,
    OrderedTable
  } from '@/components'

  export default {
    components: {
      OrderedTable,
      SimpleTable
    },
    data () {
      return {
        metros: [],
        metroShow: true,
        metroStations: [],
        metroCurrentLine: '',
        metroCurrentStation: '',
        metroSchedulesA: '',
        metroSchedulesR: '',
        rers: [],
        rerShow: true,
        rerStations: [],
        rerCurrentLine: '',
        rerCurrentStation: '',
        rerSchedulesA: '',
        rerSchedulesR: '',
        tramways: [],
        metroTrafic: [],
        rerTrafic: []
      }
    },
    methods : {
      //callAPI(value) {this.$http.get('https://api-ratp.pierre-grimaud.fr/v3' + value).then(response => {return response.data})},
      metroClicked (value) {
        this.metroShow = 2
        this.metroCurrentLine = value
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/stations/metros/' + value).then(response => {this.metroStations = response.data.result.stations}, response => {
          console.log('Error callback')})
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/traffic/metros/' + value).then(response => {this.metroTrafic = response.data.result}, response => {
          console.log('Error callback')})
        //callAPI('/stations/metros/' + value).result.stations
      },
      metroStationClicked (line, stationSlug, stationName) {
        this.metroShow = 3
        this.metroCurrentStation = stationName
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/schedules/metros/' + line + '/' + stationSlug + '/A').then(response => {this.metroSchedulesA = response.data.result.schedules}, response => {
          console.log('Error callback')})
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/schedules/metros/' + line + '/' + stationSlug + '/R').then(response => {this.metroSchedulesR = response.data.result.schedules}, response => {
          console.log('Error callback')})
      },
      rerClicked (value) {
        console.log(value)
        this.rerShow = 2
        this.rerCurrentLine = value
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/stations/rers/' + value).then(response => {this.rerStations = response.data.result.stations}, response => {
          console.log('Error callback')})
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/traffic/rers/' + value).then(response => {this.rerTrafic = response.data.result}, response => {
          console.log('Error callback')})
        //callAPI('/stations/metros/' + value).result.stations
      },
      rerStationClicked (line, stationSlug, stationName) {
        this.rerShow = 3
        this.rerCurrentStation = stationName
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/schedules/rers/' + line + '/' + stationSlug + '/A').then(response => {this.rerSchedulesA = response.data.result.schedules}, response => {
          console.log('Error callback')})
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/schedules/rers/' + line + '/' + stationSlug + '/R').then(response => {this.rerSchedulesR = response.data.result.schedules}, response => {
          console.log('Error callback')})
      },
      numberToLetter (value) {
        switch (value) {
          case 1: return 'A'
          case 2: return 'B'
          case 3: return 'C'
          case 4: return 'D'
          case 5: return 'E'
        }
      }
    },
    mounted () {
      this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/lines/metros').then(response => {this.metros = response.data}, response => {
        console.log('Error callback')
      })
      this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/lines/rers').then(response => {this.rers = response.data}, response => {
        console.log('Error callback')
      })
      this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/lines/tramways').then(response => {this.tramways = response.data}, response => {
        console.log('Error callback')
      })
    }
  }
</script>

<style>
  .logos {
    width:200px !important;
    padding: 60px;
  }

  .selectStations {
    padding: 0 2% 0 2%;
    margin-bottom: 50px;
  }

  .stations {
    font-size: 20px;
    margin: 10px;
  }

  .buttonReturn {
    background-color: green !important;
  }

  .center {
    text-align: center;
  }

  .slide-fade-enter-active {
    transition: all .3s ease-in;
  }
  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

  .slide-fade-leave, .slide-fade-enter-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(-100px);
    opacity: 0;
  }

  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active avant la 2.1.8 */ {
    opacity: 0;
  }

</style>
