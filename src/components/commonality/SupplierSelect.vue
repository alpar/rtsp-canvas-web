<template>
  <el-select
    v-model="initVal"
    filterable
    remote
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="changeSelect"
    :clearable="true"
    style="width: 100%;height: 100%"
  >
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
  import {Select, Option} from 'element-ui'
  import api from './../../utils/api'
  export default {
    components: {
      ElSelect: Select,
      ElOption: Option
    },
    data () {
      return {
        list: [],
        loading: false,
        initVal: '',
        currentItem: {}
      }
    },
    props: {
      change: {
        type: Function,
        default: () => {}
      },
      defaultVal: {
        type: String,
        default: ''
      }
    },
    watch: {
      defaultVal (val) {
        if (this.currentItem.name !== val) {
          this.initVal = val
        }
      }
    },
    created () {
      this.initVal = this.defaultVal
    },
    methods: {
      remoteMethod (query) {
        let self = this
        if (query !== '') {
          this.loading = true
          api.supplier.supplierBaseInfoes.search({
            query: `name:"${query}"`,
            page: 0,
            size: 10,
            success (data) {
              self.loading = false
              self.list = data.rows
            },
            error () {
              self.loading = false
            }
          })
        } else {
          this.list = []
        }
      },
      changeSelect (val) {
        let item
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id === val) {
            item = this.list[i]
            break
          }
        }
        if (item === undefined) {
          return
        }
        this.currentItem = item
        this.change(val, item)
      }
    }
  }
</script>
