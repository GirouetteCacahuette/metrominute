<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Horaire des prochains métros</h4>
          </md-card-header>
          <md-card-content>
            <transition name="component-fade" mode="out-in">
              <!-- Selection des métros -->
              <div v-if="metroShow == 1" :key="metroShow">
                <div class="md-layout md-gutter md-alignment-center-space-arround">
                  <div v-for="metro in metros.result.metros" class="stationMetro"
                       v-if="(metro.code != 'Fun') && (metro.code != 'Orv')">
                    <img @click="metroClicked(metro.code)"
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
                  <md-button class="md-raised buttonReturn md-elevation-10" @click="metroShow = 1">⇠ Lignes de métros</md-button>
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
                              <md-table-cell>Prochain métro (<b>{{ metroScheduleA.message }}</b>)</md-table-cell>
                            </md-table-row>
                          </md-table>
                          <hr/>
                          <div class="center">
                            <md-button class="md-raised buttonReturn md-elevation-10" @click="metroShow = 1">⇠ Lignes de métros</md-button>
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
                              <md-table-cell>Prochain métro (<b>{{ metroScheduleR.message }}</b>)</md-table-cell>
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
  export default {
    data () {
      return {
        metros: [],
        metroShow: true,
        metroStations: [],
        metroCurrentLine: '',
        metroCurrentStation: '',
        metroSchedulesA: '',
        metroSchedulesR: '',
        metroTrafic: [],
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
      }
    },
    mounted () {
      this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/lines/metros').then(response => {this.metros = response.data}, response => {
        console.log('Error callback')
      })
    }
  }
</script>

<style>
</style>
