<template>
  <div>
    history
  </div>
</template>

<script>
/*import {upperFirst} from 'lodash'
import axios from 'axios'
import { range } from 'lodash'
import DataTable from "@/components/DataTable";*/

const stationNames = ['station1', 'station2', 'station3']

export default {
  name: "History",
  /*components: { DataTable },*/
  data: () => ({
    stationNames,
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
