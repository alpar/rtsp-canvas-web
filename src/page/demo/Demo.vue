<template>
  <div id="page-department-store" class="com-page">
    <!--<my-component></my-component>-->
    <el-row>
      <el-col :xs="24" :sm="5">
        <el-tree
          :props="treeStructure"
          @node-click="handleNodeClick"
          :load="getNodeTree"
          lazy
        ></el-tree>
      </el-col>
      <el-col :xs="24" :sm="19">
        <div class="sm-pl-10">
          <el-row :gutter="10">
            <el-form>
              <el-col :xs="24" :sm="8" class="input-box">
                <el-input placeholder="大类/中类/小类/细类" v-model="condition.name">
                  <div slot="prepend" class="input-lable">商品类别</div>
                </el-input>
              </el-col>
              <el-col :xs="24" :sm="8" class="input-box">
                <el-input placeholder="请输入货号或条码" v-model="condition.name">
                  <div slot="prepend" class="input-lable">货号/条码</div>
                </el-input>
              </el-col>
              <el-col :xs="24" :sm="8" class="input-box">
                <el-input placeholder="请输入商品名称" v-model="condition.name">
                  <div slot="prepend" class="input-lable">商品名称</div>
                </el-input>
              </el-col>
              <el-col :xs="24" :sm="8" class="input-box">
                <el-form-item label="品牌" label-width="83px" class="form-lable">
                  <brand-select></brand-select>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-button type="primary" icon="search">搜索</el-button>
            <el-button type="primary" icon="plus" @click="goto('DemoAddData')" style="float: right">新增</el-button>
          </el-row>
          <el-row>
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              :default-sort="{prop: 'date', order: 'descending'}"
            >
              <el-table-column
                prop="date"
                label="日期"
                sortable
                width="180">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                sortable
                width="180">
              </el-table-column>
              <el-table-column
                prop="address"
                label="地址">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="140">
                <template scope="scope">
                  <el-button type="text" size="small" @click="goto('DemoAddData', {id: scope.row.id})">查看</el-button>
                  <el-button type="text" size="small" @click="goto('DemoAddData', {id: scope.row.id})">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteDate(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Button, Row, Col, Tree, Input, Table, TableColumn, FormItem, Form } from 'element-ui'
  import BrandSelect from '../../components/commonality/BrandSelect.vue'

  export default {
    name: 'departmentStore',
    // 当menu配置文件里面不存在当前页面时,面包稍会显示title
    title: '演示页面',
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
          name: ''
        },
        treeStructure: {
          label: 'name',
          children: 'children',
          last: 'last'
        },
        // 表格数据
        tableData: [{
          id: '1001',
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: '1002',
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: '1003',
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: '1004',
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    created () {
    },
    methods: {
      // 树被点击
      handleNodeClick (data) {
        console.log(data)
      },
      // table删除当条数据按钮点击事件
      deleteDate (item) {
        console.log(item)
      },
      getNodeTree (node, resolve) {
        setTimeout(() => {
          resolve([{
            name: '二级 3-2',
            last: false
          }])
        }, 500)
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
