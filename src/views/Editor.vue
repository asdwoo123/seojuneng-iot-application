<template>
  <a-layout-content style="padding: 24px; background-color: #f5f5f7;">
    <a-button-group style="float: right; margin-bottom: 24px;">
      <a-button type="primary">
        Add project
      </a-button>
      <a-button type="primary">
        Reset
      </a-button>
      <a-button type="primary">
        Save
      </a-button>
    </a-button-group>
    <div style="clear: both;"/>
    <div>
      <Container @drop="projectDrop($event)">
        <Draggable v-for="(project, projectIndex) in projects" :key="projectIndex"
                   style="cursor: pointer; margin-bottom: 16px;">
          <a-card :title="project.projectName">
            <Container @drop="projectDrop(projectIndex, $event)">
              <Draggable v-for="(station, stationIndex) in project.stations" :key="stationIndex"
                         style="cursor: pointer; margin-bottom: 8px;">
                <div class="flex between">
                  <span>{{ station.stationName }}</span>
                  <a-button-group>
                    <a-button>
                      Detail
                    </a-button>
                    <a-button>
                      Delete
                    </a-button>
                  </a-button-group>
                </div>
              </Draggable>
            </Container>
          </a-card>
        </Draggable>
      </Container>
    </div>
    <!--<a-row :gutter="16">
            <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(project, index) in projects">
              <a-card style="margin-bottom: 16px;" :title="project.projectName">
                <div slot="extra">
                  <div class="flex">
                    <a-button size="small" style="margin-right: 8px; margin-bottom: 8px;">
                      Add station
                    </a-button>
                    <a-button size="small">
                      Remove project
                    </a-button>
                  </div>
                </div>
              </a-card>
            </a-col>
    </a-row>-->
  </a-layout-content>
</template>

<script>
import {Container, Draggable} from 'vue-smooth-dnd'
import axios from 'axios'
import { getDB } from '@/database'

export default {
  name: "Editor",
  components: {
    Container,
    Draggable
  },
  data: () => ({
    projects: getDB('projects'),
    station: {
      stationName: '',
      stationUrl: '',
      stationInfo: []
    },
    productIndex: 0,
    stationIndex: 0
  }),
  methods: {
    addProject() {
      this.projects = [
        ...this.projects, {
          projectName: 'Untitled',
          stations: []
        }
      ]
    },
    removeProject(projectIndex) {
      this.projects.splice(projectIndex, 1)
      this.$forceUpdate()
    },
    resetProjects() {
      this.projects = getDB('projects')
    },
    projectDrop(e) {
      const {removedIndex, addedIndex} = e
      const [removed] = this.projects.splice(removedIndex, 1)
      this.projects.splice(addedIndex, 0, removed)
      this.$forceUpdate()
    },
    connectStation() {
      axios.get('/stationInfo')
      .then(res => {
        const { stationInfo } = res.data
        this.station.stationInfo = stationInfo
      })
    },
    stationDrop(projectIndex, e) {
      const {removedIndex, addedIndex} = e
      const [removed] = this.projects[projectIndex].stations.splice(removedIndex, 1)
      this.projects[projectIndex].stations.splice(addedIndex, 0, removed)
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>

</style>
