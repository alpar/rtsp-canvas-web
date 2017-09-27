<template>
  <el-cascader
    :options="list"
    @active-item-change="handleItemChange"
    :props="structure"
    @change="changeSelect"
    style="width: 100%"
    :placeholder="defaultVal"
    :clearable="true"
  ></el-cascader>
</template>

<script>
  import {Cascader} from 'element-ui'
  import api from './../../utils/api'

  export default {
    components: {
      ElCascader: Cascader
    },
    data () {
      return {
        list: [],
        structure: {
          label: 'name',
          children: 'cities',
          value: 'id'
        }
      }
    },
    props: {
      change: {
        type: Function,
        default: () => {
        }
      },
      defaultVal: {
        type: String,
        default: '请选择'
      }
    },
    created () {
      this.getData()
    },
    methods: {
      handleItemChange (val) {
        this.getData(val[val.length - 1])
      },
      getData (id) {
        let self = this
        api.commodity.commodityCategories.search({
          query: window.background === 'node' ? (id ? `parentId:${id}` : `-parentId:*`) : (id ? `parent.id:${id}` : `-parent.id:*`),
          page: 0,
          size: 30,
          success (data, request) {
            if (data.rows.length < 1) return
            for (let n = 0; n < data.rows.length; n++) {
              if (data.rows[n].leaf !== true) {
                data.rows[n].cities = []
              }
            }
            if (id) {
              pushData(id, self.list, data.rows)
            } else {
              self.list = data.rows
            }
          }
        })
        function pushData (id, cities, data) {
          for (let i = 0; i < cities.length; i++) {
            if (id === cities[i].id) {
              cities[i].cities = data
              return true
            } else {
              if (cities[i].cities) {
                if (pushData(id, cities[i].cities, data)) return
              }
            }
          }
        }
      },
      changeSelect (val) {
        let list = this.list
        let id = val[val.length - 1]
        function find (node) {
          if (node.id === id) return node
          if (node.cities) {
            for (let i = 0; i < node.cities.length; i++) {
              let re = find(node.cities[i])
              if (re) {
                return re
              }
            }
          }
          return false
        }
        this.change(id, find({id: null, cities: list}))
      }
    }
  }
</script>
