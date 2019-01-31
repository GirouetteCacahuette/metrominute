<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Horaire des prochains RERS</h4>
            <!--<p class="category">Here is a subtitle for this table</p>-->
          </md-card-header>
          <md-card-content>
            <transition name="component-fade" mode="out-in">
              <!-- Selection des RERS -->
              <div v-if="rerShow == 1" :key="rerShow">
                <div class="md-layout md-gutter md-alignment-center-space-between">
                  <img src="~../assets/img/rer/ligneA.svg" class="logos" @click="rerClicked('A')">
                  <img src="~../assets/img/rer/ligneB.svg" class="logos" @click="rerClicked('B')">
                  <img src="~../assets/img/rer/ligneC.svg" class="logos" @click="rerClicked('C')">
                  <img src="~../assets/img/rer/ligneD.svg" class="logos" @click="rerClicked('D')">
                  <img src="~../assets/img/rer/ligneE.svg" class="logos" @click="rerClicked('E')">
                </div>
              </div>
              <!-- Selection des stations -->
              <div v-else-if="rerShow == 2" :key="rerShow">
                <h2>Stations de la ligne <b>{{ rerCurrentLine }}</b></h2><br/>
                <!-- Affichage des alertes incidents -->
                <div v-if="rerTrafic.slug != 'normal'" :class="rerTrafic.slug == 'normal_trav' ? 'alert alert-warning' : 'alert alert-danger'" role="alert">{{ rerTrafic.message }}</div>
                <!-- Selection des arrêts -->
                <div class="md-layout md-gutter md-alignment-center selectStations">
                  <div v-for="station in rerStations">
                    <div class="alert alert-secondary stations"
                         role="alert"
                         @click="rerStationClicked(rerCurrentLine, station.slug, station.name)">
                      {{ station.name }}
                    </div>
                  </div>
                </div>
                <div class="center">
                  <md-button class="md-raised buttonReturn md-elevation-10" @click="rerShow = 1">⇠ Lignes de RER</md-button>
                </div>
              </div>
              <div v-else-if="rerShow == 3" :key="rerShow">
                <h2>Ligne <b>{{rerCurrentLine}}</b>, station <b>{{rerCurrentStation}}</b></h2><br/>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-layout md-gutter">
                    <div class="md-layout-item">
                      <md-card>
                        <md-card-header data-background-color="green">
                          <h4 class="title">Direction <b>{{ rerSchedulesA[0].destination }}</b></h4>
                        </md-card-header>
                        <md-card-content>
                          <md-table>
                            <md-table-row v-for="rerScheduleA in rerSchedulesA">
                              <md-table-cell>Prochain RER (<b>{{ rerScheduleA.message }}</b>)</md-table-cell>
                            </md-table-row>
                          </md-table>
                          <hr/>
                          <div class="center">
                            <md-button class="md-raised buttonReturn md-elevation-10" @click="rerShow = 1">⇠ Lignes de RERS</md-button>
                          </div>
                        </md-card-content>
                      </md-card>
                    </div>
                    <div class="md-layout-item">
                      <md-card>
                        <md-card-header data-background-color="green">
                          <h4 class="title">Direction <b>{{ rerSchedulesR[0].destination }}</b></h4>
                        </md-card-header>
                        <md-card-content>
                          <md-table>
                            <md-table-row v-for="rerScheduleR in rerSchedulesR">
                              <md-table-cell>Prochain RER (<b>{{ rerScheduleR.message }}</b>)</md-table-cell>
                            </md-table-row>
                          </md-table>
                          <hr/>
                          <div class="center">
                            <md-button class="md-raised buttonReturn md-elevation-10" @click="rerShow = 2">⇠ Stations</md-button>
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
  export default {
    data () {
      return {
        rers: [],
        rerShow: true,
        rerStations: [],
        rerCurrentLine: '',
        rerCurrentStation: '',
        rerSchedulesA: '',
        rerSchedulesR: '',
        rerTrafic: []
      }
    },
    methods : {
      //callAPI(value) {this.$http.get('https://api-ratp.pierre-grimaud.fr/v3' + value).then(response => {return response.data})},
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
    },
    mounted () {
      this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/lines/rers').then(response => {this.rers = response.data}, response => {
        console.log('Error callback')
      })
    }
  }
</script>

<style>
</style>
