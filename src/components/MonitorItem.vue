<template>
  <a-row type="flex" :gutter="16">
    <a-col :xs="24" :sm="12" :md="8" :lg="6" :key="station.stationName" v-for="station in stations" style="padding-bottom: 16px;">
      <a-card :title="station.stationName">
        <div slot="extra" :class="(station.state) ? 'led-green' : 'led-red'" />
        <p :key="i" v-for="(v, i) in station.data" class="flex between" style="padding-bottom: 8px;">
          <span class="key-box">{{ v.dataName }}</span>
          <span class="val-box">{{ v.dataValue }}</span>
        </p>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: "MonitorItem",
  props: ['stations']
}
</script>

<style scoped>
.key-box {
  font-weight: 600;
}

.val-box {
  font-weight: 400;
  color: #000000;
}
</style>
