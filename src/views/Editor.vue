<template>
  <a-layout-content style="padding: 24px; background-color: #f5f5f7;">
    <div style="display:flex; justify-content: flex-end; margin-bottom: 16px;">
      <a-button type="primary" style="margin-right: 16px;">
        Add project
      </a-button>
      <a-button type="primary" style="margin-right: 16px;">
        Save
      </a-button>
      <a-button type="primary">
        Reset
      </a-button>
    </div>
    <a-row :gutter="16">
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
    </a-row>
  </a-layout-content>
</template>

<script>
import {Container, Draggable} from 'vue-smooth-dnd'

export default {
  name: "Editor",
  data: () => ({
    projects: [],

  }),
  methods: {
  }
}
</script>

<style scoped>

</style>
