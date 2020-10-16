<template>
    <a-layout-content style="padding: 24px; background-color: beige;">
      <MonitorItem :stations="stationsData" />
    </a-layout-content>
</template>

<script>
/*import io from 'socket.io-client'*/
import { range } from 'lodash'
import MonitorItem from "@/components/MonitorItem";

export default {
  name: "Monitor",
  components: {MonitorItem},
  data: () => ({
    stationsData: range(3).map(n => ({
      stationName: `station${n}`,
      state: false,
      productId: 142325,
      data: range(20).map(nn => ({ dataName: `data${nn}`, dataValue: 0 }))
    }))
  }),
  /*mounted() {
  range(1, 4).map(n => ({ stationName: `station${n}`, stationIp: '399439290' }))
      .forEach((station, stationIndex) => {
        const { stationName, stationIp } = station

        const socket = io(station.stationIp)
        socket.on('data', function (data) {
          this.stationData[stationIndex] = data
        })
  })
  },*/
  beforeDestroy() {

  }
}
</script>

<style scoped>

</style>
