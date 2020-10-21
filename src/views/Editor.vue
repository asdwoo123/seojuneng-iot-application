<template>
  <a-layout-content style="padding: 24px; background-color: #f5f5f7;">
    <a-button-group style="float: right; margin-bottom: 24px;">
      <a-button type="primary" @click="addProject">
        Add project
      </a-button>
      <a-button type="primary" @click="resetProjects">
        Reset
      </a-button>
      <a-button type="primary" @click="saveProjects">
        Save
      </a-button>
    </a-button-group>
    <div style="clear: both;"/>
    <div>
      <Container @drop="projectDrop($event)">
        <Draggable v-for="(project, projectIndex) in projects" :key="projectIndex"
                   style="cursor: pointer; margin-bottom: 16px;">
          <a-card :title="project.projectName" :body-style="{padding: '10px'}">
            <a-button-group slot="extra">
              <a-button @click="addStation(projectIndex)">
                Add station
              </a-button>
              <a-button @click="removeProject(projectIndex)">
                Delete
              </a-button>
            </a-button-group>
            <Container @drop="stationDrop(projectIndex, $event)">
              <Draggable v-for="(station, stationIndex) in project.stations" :key="stationIndex"
                         style="cursor: pointer; margin-bottom: 8px;">
                <div class="flex between center-v" style="border: 1px solid black;">
                  <span>{{ station.stationName }}</span>
                  <a-button-group>
                    <a-button @click="stationModalOpen(projectIndex, stationIndex)">
                      Detail
                    </a-button>
                    <a-button @click="removeStation(projectIndex, stationIndex)">
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
    <a-modal :visible="stationVisible" @cancel="stationModalClose">
      <div class="input-wrapper" style="margin-top: 20px;">
        <a-input addon-before="name" v-model="station.stationName"/>
      </div>
      <div class="input-wrapper">
        <a-input-search addon-before="url" v-model="station.stationUrl" @search="connectStation">
          <a-button slot="enterButton" :loading="searchLoading">connect</a-button>
        </a-input-search>
      </div>

      <div class="input-wrapper">
        <a-button>Modify</a-button>
        <a-select :default-value="protocolList[0]">
          <template v-for="protocol in protocolList">
            <a-select-option :key="protocol" :value="protocol">
              {{ protocol }}
            </a-select-option>
          </template>
        </a-select>
      </div>

      <div class="input-wrapper">
        <div class="flex" :key="si" v-for="(s, si) in stationData">
          sdasd
<!--          <template v-for="[key, value] in Object.entries(s)">
&lt;!&ndash;            <v-input :addon-before="key" :key="key" v-if="typeof value === 'string'" v-model="s[key]" />&ndash;&gt;
            {{ key }}
          </template>-->
        </div>
      </div>
    </a-modal>
  </a-layout-content>
</template>

<script>
import {Container, Draggable} from 'vue-smooth-dnd'
import axios from 'axios'
import {cloneDeep, range} from 'lodash'
import {getDB, setDB} from '@/database'

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
      stationUrl: ''
    },
    stationData: [
      {
        dataName: 'data1',
        nodeId: 'nodeId1'
      }
    ],
    changeAuth: false,
    protocolList: [
      'OPCUA'
    ],
    projectIndex: 0,
    stationIndex: 0,
    stationVisible: false,
    searchLoading: false
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
    addStation(projectIndex) {
      this.projects[projectIndex].stations.push({
        stationName: 'Untitled',
        stationUrl: ''
      })
    },
    saveProjects() {
      /*setDB('projects', this.projects)*/
      this.$toast.center('Save project')
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
      console.log('loading...')
      this.searchLoading = true

      setTimeout(() => {
        this.searchLoading = false
        this.connectSuccess = true
      }, 2000)
      /*axios.get('/stationInfo')
          .then(res => {
            const {stationInfo} = res.data
            this.stationInfo = stationInfo
          })*/
    },
    stationDrop(projectIndex, e) {
      const {removedIndex, addedIndex} = e
      const [removed] = this.projects[projectIndex].stations.splice(removedIndex, 1)
      this.projects[projectIndex].stations.splice(addedIndex, 0, removed)
      this.$forceUpdate()
    },
    removeStation(projectIndex, stationIndex) {
      this.projects[projectIndex].stations.splice(stationIndex, 1)
      this.$forceUpdate()
    },
    stationModalOpen(projectIndex, stationIndex) {
      this.projectIndex = projectIndex
      this.stationIndex = stationIndex
      this.stationData = []
      this.station = cloneDeep(this.projects[projectIndex].stations[stationIndex])
      this.stationVisible = true
    },
    stationModalClose() {
      this.stationVisible = false
    }
  }
}
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>
