<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Horaire des prochains tramways</h4>
          </md-card-header>
          <md-card-content>
            <transition name="component-fade" mode="out-in">
              <!-- Selection des métros -->
              <div v-if="tramShow == 1" :key="tramShow">
                <div class="md-layout md-gutter md-alignment-center-space-arround">
                  <div v-for="tram in tramways.result.tramways" class="stationMetro"
                       v-if="(tram.code != 11) && (tram.code != 4)">
                    <img  @click="tramClicked(tram.code)"
                          :src="'https://abel.am/metro/tram/ligne' + tram.code + '.svg'" class="logos">
                  </div>
                </div>
              </div>
              <!-- Selection des stations -->
              <div v-else-if="tramShow == 2" :key="tramShow">
                <h2>Stations de la ligne <b>{{tramCurrentLine}}</b></h2><br/>
                <!-- Affichage des alertes incidents -->
                <div v-if="tramTraffic.slug != 'normal'" :class="tramTraffic.slug == 'normal_trav' ? 'alert alert-warning' : 'alert alert-danger'" role="alert">{{ tramTraffic.message }}</div>
                <!-- Selection des arrêts -->
                <div class="md-layout md-gutter md-alignment-center selectStations">
                  <div v-for="station in tramStations">
                    <div class="alert alert-secondary stations"
                         role="alert"
                         @click="tramStationClicked(tramCurrentLine, station.slug, station.name)">
                      {{ station.name }}
                    </div>
                  </div>
                </div>
                <div class="center">
                  <md-button class="md-raised buttonReturn md-elevation-10" @click="tramShow = 1">⇠ Lignes de tramways</md-button>
                </div>
              </div>
              <div v-else-if="tramShow == 3" :key="tramShow">
                <h2>Ligne <b>{{ tramCurrentLine }}</b>, station <b>{{ tramCurrentStation }}</b></h2><br/>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-layout md-gutter">
                    <div class="md-layout-item">
                      <md-card>
                        <md-card-header data-background-color="green">
                          <h4 class="title">Direction <b>{{ tramSchedulesA[0].destination }}</b></h4>
                        </md-card-header>
                        <md-card-content>
                          <md-table>
                            <md-table-row v-for="tramScheduleA in tramSchedulesA">
                              <md-table-cell>Prochain tramway (<b>{{ tramScheduleA.message }}</b>)</md-table-cell>
                            </md-table-row>
                          </md-table>
                          <hr/>
                          <div class="center">
                            <md-button class="md-raised buttonReturn md-elevation-10" @click="tramShow = 1">⇠ Lignes de tramways</md-button>
                          </div>
                        </md-card-content>
                      </md-card>
                    </div>

                    <div class="md-layout-item">
                      <md-card>
                        <md-card-header data-background-color="green">
                          <h4 class="title">Direction <b>{{ tramSchedulesR[0].destination }}</b></h4>
                        </md-card-header>
                        <md-card-content>
                          <md-table>
                            <md-table-row v-for="tramScheduleR in tramSchedulesR">
                              <md-table-cell>Prochain tramway (<b>{{ tramScheduleR.message }}</b>)</md-table-cell>
                            </md-table-row>
                          </md-table>
                          <hr/>
                          <div class="center">
                            <md-button class="md-raised buttonReturn md-elevation-10" @click="tramShow = 2">⇠ Stations</md-button>
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
        tramways: [],
        tramShow: true,
        tramStations: [],
        tramCurrentLine: '',
        tramCurrentStation: '',
        tramSchedulesA: '',
        tramSchedulesR: '',
        tramTraffic: [],

      }
    },
    methods : {
      tramClicked (value) {
        this.tramShow = 2;
        this.tramCurrentLine = value;
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/stations/tramways/' + value).then(response => {this.tramStations = response.data.result.stations}, response => {
          console.log('Error callback')});
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/traffic/tramways/' + value).then(response => {this.tramTraffic = response.data.result}, response => {
          console.log('Error callback')})
        //callAPI('/stations/metros/' + value).result.stations
      },
      tramStationClicked (line, stationSlug, stationName) {
        this.tramShow = 3;
        this.tramCurrentStation = stationName;
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/schedules/tramways/' + line + '/' + stationSlug + '/A').then(response => {this.tramSchedulesA = response.data.result.schedules}, response => {
          console.log('Error callback')});
        this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/schedules/tramways/' + line + '/' + stationSlug + '/R').then(response => {this.tramSchedulesR = response.data.result.schedules}, response => {
          console.log('Error callback')})
      },
    },
    mounted () {
      this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/lines/tramways').then(response => {this.tramways = response.data}, response => {
        console.log('Error callback')
      })
    }
  }
</script>

<style>
</style>
