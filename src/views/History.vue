<template>
  <a-layout-content style="padding: 24px; background-color: #f5f5f7;">
    <div class="flex" style="margin-bottom: 24px;">
      <div style="margin-right: 8px;" v-if="projects.length > 0">
        <div class="field-label">project</div>
        <a-select :default-value="currentProject" @change="projectChange">
          <template v-for="(project, projectIndex) in projects">
            <a-select-option :value="project.projectName" :key="projectIndex">
              {{ project.projectName }}
            </a-select-option>
          </template>
        </a-select>
      </div>

      <template v-if="projects[currentProjectIndex].stations.length > 0">
        <div style="margin-right: 8px;">
          <div class="field-label">
            station
          </div>
          <a-select :default-value="projects[currentProjectIndex].stations[0].stationName" @change="stationChange">
            <template v-for="(station, stationIndex) in projects[currentProjectIndex].stations">
              <a-select-option :value="station.stationName" :key="stationIndex">
                {{ station.stationName }}
              </a-select-option>
            </template>
          </a-select>
        </div>
      </template>

      <div>
        <div class="field-label">
          search day
        </div>
        <a-range-picker :value="period" @change="daySearch" />
      </div>
    </div>

    <a-table :columns="columns" :data-source="dataSource" :scroll="{ x: 'calc(700px + 50%)' }" bordered/>
  </a-layout-content>
</template>

<script>
import {upperFirst} from 'lodash'
import moment from 'moment'
import axios from 'axios'
import {getDB} from '../database'


export default {
  name: "History",
  data: () => ({
    projects: [],
    option: 0,
    loading: true,
    currentProject: '',
    search: '',
    columns: [],
    dataSource: [],
    pageCount: null,
    pageNumber: 1,
    period: [],
    dateString: [],
    stationUrl: ''
  }),
  computed: {
    currentProjectIndex() {
      return this.projects.indexOf(this.projects.find(p => p.projectName === this.currentProject))
    }
  },
  mounted() {
    this.projects = getDB('projects')
    this.currentProject = this.projects[0].projectName
    this.dataSource.projectName = this.currentProject

    const {stationUrl} = this.projects[0]?.stations[0]
    this.stationUrl = stationUrl
    this.getPlcData(stationUrl)
  },
  methods: {
    getPlcData(stationUrl) {
      axios.get(`http://${stationUrl}/plcData`).then((res) => {
        const {plcData} = res.data
        this.columns = [
          ...plcData[0].data.map(d => ({
            title: upperFirst(d.dataName),
            dataIndex: d.dataName,
            key: d.dataName
          })),
          {
            title: 'createdAt',
            dataIndex: 'createdAt',
            key: 'createdAt'
          }
        ]

        this.dataSource = plcData.map(pd => {
          const dataS = {
            createdAt: moment(pd.createdAt).format('YYYY-MM-DD h:mm:ss a')
          }

          pd.data.forEach(d => {
            dataS[d.dataName] = d.dataValue
          })

          return dataS
        })
      })
    },
    projectChange(projectName) {
      this.currentProject = projectName
    },
    stationChange(stationName) {
      const { stationUrl } = this.projects[this.currentProjectIndex].stations.find(station => station.stationName === stationName)
      this.getPlcData(stationUrl)
    },
    daySearch(date, dateString) {
      this.period = date
      this.dateString = dateString
      if (date) {
        this.getPlcData(this.stationUrl)
        this.dataSource = this.dataSource.filter(data => {
          return date[0].unix() <= moment(data.createdAt).unix() && date[1].add(1, 'days').unix() > moment(data.createdAt).unix()
        })
      } else {
        this.getPlcData(this.stationUrl)
      }
    }
  }
}</script>

<style scoped>

</style>
