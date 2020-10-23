<template>
  <a-layout-content style="padding: 24px; background-color: beige;">
    <a-button-group v-if="projects.length > 1" style="margin-bottom: 12px;">
      <a-button :type="(currentProject === project.projectName) ? 'primary' : null"
                v-for="(project, projectIndex) in projects" :key="projectIndex"
                @click="this.currentProject = project.projectName">
        {{ project.projectName }}
      </a-button>
    </a-button-group>
    <template v-for="(project, projectIndex) in projects">
      <MonitorItem :key="projectIndex" :stations="stations[projectIndex]" v-if="currentProject === project.projectName" />
    </template>
  </a-layout-content>
</template>

<script>
import io from 'socket.io-client'
import {getDB} from '@/database'
import MonitorItem from "@/components/MonitorItem";

export default {
  name: "Monitor",
  components: {
    MonitorItem
  },
  data: () => ({
    projects: [],
    currentProject: '',
    stations: []
  }),
  mounted() {
    this.projects = getDB('projects')
    this.currentProject = this.projects[0].projectName
    this.stations = this.projects.map(project => {
      const stations = project.stations
      return stations.map(station => ({
        stationName: station.stationName,
        state: false,
        data: []
      }))
    })

    this.projects.forEach((project, projectIndex) => {
      project.stations.forEach((station, stationIndex) => {
        const { stationUrl } = station

        const socket = io('http://' + stationUrl, {
          path: '/socket.io'
        })

        socket.on('connect', () => {
          this.stations[projectIndex][stationIndex].state = true
          this.$forceUpdate()
        })

        socket.on('disconnect', () => {
          this.stations[projectIndex][stationIndex].state = false
          this.$forceUpdate()
        })

        socket.on('data', (data) => {
          this.stations[projectIndex][stationIndex].data = data
          this.$forceUpdate()
        })
      })
    })
  },
  beforeDestroy() {

  }
}
</script>

<style scoped>

</style>
