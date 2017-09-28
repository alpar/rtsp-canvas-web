<template>
  <div id="page-department-store" class="com-page">
    <!--<my-component></my-component>-->
    <el-row>
      <el-col
        :xs="24"
        :sm="10"
        :md="9"
        :lg="6"
      >
        <el-tree
          :data="allVideoInfo"
          :props="treeStructure"
          :accordion="true"
          @node-click="clickTree"
          style="height: calc(100vh - 110px);overflow-y: auto;margin-bottom: 12px;"
        ></el-tree>
      </el-col>
      <el-col :xs="24" :sm="14" :md="15" :lg="18">
        <div class="sm-pl-10">
          <el-row :gutter="10">
            <el-form>
              <el-col :xs="24" :sm="16" class="input-box">
                <el-select
                  class="max-w"
                  v-model="condition.id"
                  :multiple="false"
                  filterable
                  remote
                  placeholder="请输入需要搜索的监控名"
                  :multiple-limit="30"
                  :remote-method="search">
                  <el-option
                    v-for="item in selectVideoList"
                    :key="item.id"
                    :label="item.showName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :xs="24" :sm="8" class="input-box">
                <el-button type="primary" icon="search">查看</el-button>
              </el-col>
            </el-form>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12" v-for="(item, i) in list">
              <el-card class="video-card">
                <canvas class="video-canvas"></canvas>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {Button, Row, Col, Tree, Input, Table, TableColumn, FormItem, Form, Option, Select, Card} from 'element-ui'
  import request from './../../utils/request'
  import store from './../../store/index'
  //  import Hls from 'hls'
  import io from 'socket.io-client'

  export default {
    name: 'departmentStore',
    // 当menu配置文件里面不存在当前页面时,面包稍会显示title
    title: '监控查看',
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
      ElOption: Option,
      ElSelect: Select,
      ElCard: Card
    },
    computed: {
      allVideoInfo () {
        // 从vuex获取用户信息
        return store.state.allVideoInfo
      }
    },
    data () {
      return {
        // 搜索条件
        condition: {
          id: '',
          name: ''
        },
        selectVideoList: [],
        treeStructure: {
          label: 'name',
          children: 'node',
          last: 'last'
        },
        list: []
      }
    },
    created () {
      this.o = {
        lock: false,
        hls: null,
        video: null
      }
      /*
      request.push({
        path: path,
        type: 'get',
        data: data,
        success: (data, headers, request) => {

        }
      })
      */
      /*
      this.o.video = document.getElementById('video')
      this.o.hls = new Hls()
      this.o.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.o.video.play()
      })
      */
    },
    methods: {
      // table删除当条数据按钮点击事件
      deleteDate (item) {
        console.log(item)
      },
      search (query) {
        if (this.o.lock === true) {
          return
        }
        let list = []
        let videoList = store.state.allVideoInfoSelect
        for (let i in videoList) {
          if (videoList[i].showName.indexOf(query) > -1) {
            list.push(videoList[i])
          }
          if (list.length >= 30) {
            break
          }
        }
        this.selectVideoList = list
      },
      clickTree (item) {
        let self = this
        if (item.last === true) {
          let videoList = store.state.allVideoInfoSelect
          for (let i in videoList) {
            if (videoList[i].id === item.id) {
              this.o.lock = true
              this.selectVideoList = [{...videoList[i]}]
              setTimeout(() => {
                this.o.lock = false
              }, 50)
              break
            }
          }
          this.condition.id = item.id

          request.push({
            path: 'permission/api/getVideo',
            type: 'get',
            data: {
              id: item.id
            },
            success: (data, headers, request) => {
              let object = {
                canvas: null,
                cxt: null,
                type: 0
              }
              self.list.push(object)
              let img = new Image()
              let width = 0
              let height = 0
              img.onload = function () {
                if (object.canvas) {
                  if (width !== object.canvas.offsetWidth) {
                    width = object.canvas.width = object.canvas.offsetWidth
                    height = object.canvas.height = object.canvas.offsetWidth / data.resolution.w * data.resolution.h
                  }
                  object.cxt.drawImage(img, 0, 0, width, height)
                }
              }
              let socket = io(`ws://192.168.0.200:${data.port}`)
              socket.on('data', function (data) {
                img.src = 'data:image/jpeg;base64,' + data
              })
            },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
              console.log(XMLHttpRequest.status)
            }
          })
        }
      }
    },
    watch: {
      list () {
        console.log(22)
        this.list.forEach(item => {
          item.canvas = null
          item.cxt = null
        })
        this.$nextTick(() => {
          this.list.forEach((item, i) => {
            item.canvas = document.getElementsByClassName('video-canvas')[i]
            item.cxt = item.canvas.getContext('2d')
          })
        })
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

  #video {
    float: left;
  }

  canvas {
    width: 100%;
    float: left;
  }

  .video-card {
    margin-bottom: 10px;
    position: relative;
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

  #page-department-store .el-card__body {
    padding: 0px;
  }


</style>
