<template>
  <div id="page-department-store" class="com-page">
    <div class="sm-pl-10">
      <el-row :gutter="10">
        <el-form>
          <el-col :xs="24" :sm="8" class="input-box">
            <el-input v-model="condition.name">
              <div slot="prepend" class="input-lable">名称</div>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="8" class="input-box">
            <el-input v-model="condition.id">
              <div slot="prepend" class="input-lable">ID</div>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="8" class="input-box">
            <el-input v-model="condition.area">
              <div slot="prepend" class="input-lable">地区</div>
            </el-input>
          </el-col>
        </el-form>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <a style="line-height: 36px">&nbsp;总数:{{tableData.length}}</a>
        <el-button type="primary" icon="search" style="float: right" @click="getData()">搜索</el-button>
        <!--<el-button type="primary" icon="plus" @click="goto('DemoAddData')" style="float: right">新增</el-button>-->
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column
            prop="id"
            label="ID"
            sortable
            width="220">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            sortable
            width="300">
          </el-table-column>
          <el-table-column
            prop="area"
            label="地区"
            sortable
            width="120">
          </el-table-column>
          <el-table-column
            prop="isonline"
            label="在线"
            sortable
            width="90">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="rtspUrl"-->
          <!--label="rstp地址">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="remark"
            label="备注">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="80">
            <template scope="scope">
              <el-button type="text" size="small" @click="goto('ViewVideo', {id: scope.row.id})">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {Button, Row, Col, Tree, Input, Table, TableColumn, FormItem, Form} from 'element-ui'
  import BrandSelect from '../../components/commonality/BrandSelect.vue'
  import store from './../../store/index'

  export default {
    name: 'departmentStore',
    // 当menu配置文件里面不存在当前页面时,面包稍会显示title
    title: '所有摄像头',
    components: {
      ElButton: Button,
      ElRow: Row,
      ElCol: Col,
      ElTree: Tree,
      ElInput: Input,
      ElTable: Table,
      ElTableColumn: TableColumn,
      ElFormItem: FormItem,
      ElForm: Form,
      BrandSelect
    },
    data () {
      return {
        // 搜索条件
        condition: {
          name: '',
          id: '',
          area: ''
        },
        // 表格数据
        tableData: []
      }
    },
    created () {
      if (store.state.allVideoInfoSelect.length > 0) {
        this.getData()
      } else {
        let number = 0
        let interval = setInterval(() => {
          number++
          if (store.state.allVideoInfoSelect.length > 0) {
            clearInterval(interval)
            this.getData()
          } else if (number > 120) {
            clearInterval(interval)
          }
        }, 50)
      }
    },
    methods: {
      // table删除当条数据按钮点击事件
      deleteDate (item) {
        console.log(item)
      },
      getData () {
        const list = []
        let videoList = store.state.allVideoInfoSelect
        const all = this.condition.name === '' && this.condition.id === '' && this.condition.area === ''
        for (let i in videoList) {
          if (all ||
            (this.condition.name.length > 0 && videoList[i].name.indexOf(this.condition.name) > -1) ||
            (this.condition.id.length > 0 && videoList[i].id.indexOf(this.condition.id) > -1) ||
            (this.condition.area.length > 0 && videoList[i].area.indexOf(this.condition.area) > -1)
          ) {
            list.push(videoList[i])
          }
        }
        this.tableData = list
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  @media screen and (min-width: 767px) {
    .el-tree {
      min-height: calc(100vh - 113px);
    }

    .sm-pl-10 {
      padding-left: 10px;
    }
  }

  @media screen and (max-width: 768px) {
  }

  .input-box {
    margin-bottom: 10px;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  .input-lable {
    width: 62px;
    text-align: center;
  }

</style>

<style>
  #page-department-store .form-lable .el-form-item__label {
    height: 36px;
    color: #97a8be;
    border: 1px solid #bfcbd9;
    border-radius: 4px 0px 0px 4px;
    border-right: 0px;
    text-align: center;
    padding-right: 0px;

  }

  #page-department-store .form-lable .el-select .el-input input {
    border-radius: 0px 4px 4px 0px;
  }
</style>
