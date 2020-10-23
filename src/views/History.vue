<template>
  <a-layout-content style="padding: 24px; background-color: #f5f5f7;">
    <div class="flex">
      <template v-if="projects.length > 0">
        <a-select :default-value="currentProject">
          {{ projects[0].projectName }}
        </a-select>
      </template>
    </div>
  </a-layout-content>
</template>

<script>
import {upperFirst} from 'lodash'
import axios from 'axios'
import {range} from 'lodash'
import {getDB} from '../database'


export default {
  name: "History",
  data: () => ({
    projects: [],
    option: 0,
    loading: true,
    currentProject: '',
    search: '',
    dataSource: {},
    pageCount: null,
    pageNumber: 1
  }),
  mounted() {
    this.projects = getDB('projects')
    this.currentProject = this.projects[0].projectName
    this.dataSource.projectName = this.currentProject
    this.projects[0].stations.forEach(station => {
    /*this.dataSource[station.stationName] = */
      axios.get(`http://${station.stationUrl}/plcData`).then((res) => {
        const { plcData } = res.data
        console.log(plcData)
      })
    })
  },
  methods: {
    optionChange() {

    }
  }
}
</script>

<style scoped>

</style>
