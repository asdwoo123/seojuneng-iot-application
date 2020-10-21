<template>
  <a-layout-content style="padding: 24px; background-color: #f5f5f7;">
    <div v-if="projects.length > 0">
      <a-select :default-value="projects[0]">

      </a-select>
    </div>
  </a-layout-content>
</template>

<script>
import {upperFirst} from 'lodash'
import axios from 'axios'
import { range } from 'lodash'
import { getDB } from '../database'


const stationNames = ['station1', 'station2', 'station3']

export default {
  name: "History",
  data: () => ({
    stationNames,
    projects: getDB('projects'),
    option: 0,
    loading: true,
    search: '',
    columns: [],
    dataSource: [],
    pageCount: null,
    pageNumber: 1
  }),
  methods: {
    optionChange() {

    }
  }
}
</script>

<style scoped>

</style>
