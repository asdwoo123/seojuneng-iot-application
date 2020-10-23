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
      <Container @drop="projectDrop">
        <Draggable style="cursor: pointer; margin-bottom: 16px;" v-for="(project, projectIndex) in projects" :key="projectIndex">
              <a-card :body-style="{padding: '10px'}">
                <div class="flex between center-h" style="padding-bottom: 20px;">
                  <InputContenteditable v-model="project.projectName"/>
                  <a-button-group>
                    <a-button @click="addStation(projectIndex)">
                      Add station
                    </a-button>
                    <a-button @click="removeProject(projectIndex)">
                      Delete
                    </a-button>
                  </a-button-group>
                </div>
                <Container @drop="stationDrop(projectIndex, $event)">
                  <Draggable v-for="(station, stationIndex) in project.stations" :key="stationIndex"
                             style="cursor: pointer; margin-bottom: 8px;">
                    <div class="flex between center-v" style="box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); padding: 5px;">
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
    <!--여기서 부터 모달창-->
    <a-modal :visible="stationVisible" @cancel="stationModalClose" @ok="saveStation">
      <div class="input-wrapper" style="margin-top: 20px;">
        <div style="margin-right: 8px;">
            <div class="field-label">name</div>
          <a-input v-model="station.stationName"/>
        </div>
        <div>
          <div class="field-label">url</div>
          <a-input v-model="station.stationUrl"/>
        </div>
      </div>

      <div class="input-wrapper">
        <div>
          <div class="field-label">password</div>
          <dis class="flex">
            <a-input-password style="margin-right: 8px;" v-model="password"/>
            <a-button @click="connectStation">connect</a-button>
          </dis>
        </div>
      </div>

      <template v-if="connectSuccess">
        <div class="input-wrapper">
          <div>
            <div class="field-label">change password</div>
          <a-input-password v-model="changePwd"/>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <a-select :default-value="plcInfo.protocol">
            <template v-for="protoc in plcInfo.protocolList">
              <a-select-option :key="protoc" :value="protoc">
                {{ protoc }}
              </a-select-option>
            </template>
          </a-select>
          <a-button type="primary" @click="addData">Add data</a-button>
        </div>

        <div class="input-wrapper">
          <div style="margin-right: 8px;">
            <div class="field-label">plc url</div>
            <a-input style="margin-right: 8px;" v-model="plcInfo[plcInfo.protocol].url"/>
          </div>
          <div>
            <div class="field-label">product id</div>
            <a-input v-model="plcInfo[plcInfo.protocol].productId"/>
          </div>
        </div>

        <div class="flex" :key="si" style="margin-bottom: 8px; align-items: flex-end;" v-for="(s, si) in plcInfo[plcInfo.protocol].data">
          <div style="margin-right: 8px;" :key="key" v-for="[key] in Object.entries(s)">
            <div class="field-label">{{ key }}</div>
            <a-input style="margin-bottom: 8px;" v-model="s[key]"/>
          </div>
          <a-button style="margin-bottom: 8px;" type="danger" icon="delete" @click="removeData(si)" />
        </div>
      </template>
    </a-modal>
  </a-layout-content>
</template>

<script>
import {Container, Draggable} from 'vue-smooth-dnd'
import InputContenteditable from 'vue-input-contenteditable'
import axios from 'axios'
import {cloneDeep} from 'lodash'
import {getDB, setDB} from '@/database'

export default {
  name: "Editor",
  components: {
    Container,
    Draggable,
    InputContenteditable
  },
  data: () => ({
    projects: getDB('projects'),
    password: '',
    changePwd: '',
    station: {
      stationName: '',
      stationUrl: ''
    },
    connectSuccess: false,
    plcInfo: {},
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
      setDB('projects', this.projects)
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
      this.searchLoading = true

      axios.post('http://' + this.station.stationUrl + '/getPlcInfo', {
        password: this.password
      }).then(res => {
        this.plcInfo = cloneDeep(res.data.plcInfo)

        this.searchLoading = false

        if (res.data.result) {
          this.connectSuccess = true
        }
      }).catch(() => this.searchLoading = false)
    },
    async saveStation() {
      this.projects[this.projectIndex].stations[this.stationIndex] = this.station
      if (this.connectSuccess) {
        const res = await axios.post('http://' + this.station.stationUrl + '/setPlcInfo', {
          password: this.password
        })
        const {result} = res.data
        if (result) this.stationVisible = false
      } else {
        this.stationVisible = false
      }
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
      this.plcUrl = null
      this.protocolList = []
      this.protocol = ''
      this.stationInfo = []
      this.station = cloneDeep(this.projects[projectIndex].stations[stationIndex])
      this.stationVisible = true
    },
    stationModalClose() {
      this.stationVisible = false
      this.connectSuccess = false
    },
    addData() {
      let plcData
      switch (this.plcInfo.protocol) {
        case 'OPCUA':
          plcData = {
            dataName: '',
            nodeId: ''
          }
          return
      }

      if (plcData) {
        this.plcInfo[this.plcInfo.protocol].data.push(plcData)
        this.$forceUpdate()
      }
    },
    removeData(dataIndex) {
      this.plcInfo[this.plcInfo.protocol].data.splice(dataIndex, 1)
      this.$forceUpdate()
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

.fade-enter, .fade-leave-to
{
  opacity: 0;
}


</style>
