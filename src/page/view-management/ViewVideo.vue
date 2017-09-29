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
                <el-button type="primary" icon="search" @click="getVideo(condition.id)">查看</el-button>
              </el-col>
            </el-form>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12" v-for="(item, i) in list">
              <el-card class="video-card">
                <canvas class="video-canvas"></canvas>
                <div class="video-console-one">
                  <div class="btn-left btn-cloud">
                    <div class="back"></div>
                    <div class="icon el-icon-caret-left"></div>
                  </div>

                  <div class="btn-right btn-cloud">
                    <div class="back"></div>
                    <div class="icon el-icon-caret-right"></div>
                  </div>

                  <div class="btn-up btn-cloud">
                    <div class="back"></div>
                    <div class="icon el-icon-caret-top"></div>
                  </div>

                  <div class="btn-bottom btn-cloud">
                    <div class="back"></div>
                    <div class="icon el-icon-caret-bottom"></div>
                  </div>

                  <div class="btn-exit btn-cloud" @click="exit(item)">
                    <div class="back"></div>
                    <div class="icon el-icon-close"></div>
                  </div>

                  <div class="btn-bottom btn-full">
                    <div class="back"></div>
                    <div class="icon">全屏</div>
                  </div>
                </div>
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
          this.getVideo(item.id)
        }
      },
      getVideo (id) {
        let self = this
        request.push({
          path: 'permission/api/getVideo',
          type: 'get',
          data: {
            id: id
          },
          success: (data, headers, request) => {
            let object = {
              canvas: null,
              cxt: null,
              type: 0,
              socket: null
            }
            self.list.push(object)
            let img = new Image()
            let width = 0
            let height = 0
            let top = 0
            let left = 0
            img.onload = function () {
              if (object.canvas) {
                if (width !== object.canvas.offsetWidth) {
                  top = 0
                  left = 0
                  width = object.canvas.width = parseInt(object.canvas.offsetWidth) + 1
                  height = object.canvas.height = object.canvas.offsetWidth / data.resolution.w * data.resolution.h
                  if (window.innerWidth >= 1200) {
                    if (data.resolution.h / data.resolution.w < 0.565) {
                      width = object.canvas.width = parseInt(object.canvas.offsetWidth) + 1
                      const h = width * 0.5625 - 1
                      object.canvas.style.height = h + 'px'
                      object.canvas.height = h
                      if (h > height) {
                        top = (h - height) / 2
                      }
                    } else {
                      height = object.canvas.height = parseInt(object.canvas.offsetWidth) * 0.5625 + 1
                      width = object.canvas.height / data.resolution.h * data.resolution.w
                      if (object.canvas.width > width) {
                        left = (object.canvas.width - width) / 2
                      }
                    }
                  }
                }
                object.cxt.drawImage(img, left, top, width, height)
              }
            }
            object.socket = io(`ws://192.168.0.200:${data.port}`)
            object.socket.on('data', function (data) {
              img.src = 'data:image/jpeg;base64,' + data
            })
          },
          error: (XMLHttpRequest, textStatus, errorThrown) => {
            console.log(XMLHttpRequest.status)
          }
        })
      },
      exit (item) {
        for (let i in this.list) {
          if (item === this.list[i]) {
            item.socket.close()
            this.list.splice(i, 1)
          }
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
    background-color: #343434;
  }

  .video-card {
    margin-bottom: 10px;
    position: relative;
    overflow-x: hidden;
  }

  .video-console-one {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .video-console-one .btn-cloud {
    width: 38px;
    height: 38px;
    border-radius: 100%;
    overflow: hidden;
    position: absolute;
    background-color: transparent;
  }

  .video-console-one .btn-left {
    top: calc(50% - 19px);
    left: 10px;
  }

  .video-console-one .btn-right {
    top: calc(50% - 19px);
    left: calc(100% - 48px);
  }

  .video-console-one .btn-up {
    top: 10px;
    left: calc(50% - 19px);
  }

  .video-console-one .btn-bottom {
    top: calc(100% - 48px);
    left: calc(50% - 19px);
  }

  .video-console-one .back {
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    background-color: #3C3C3C;
    opacity: 0.3;
    float: left;
    border-radius: 100%;
    border: 1px solid #F9F9F9;
  }

  .video-console-one .icon {
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 38px;
    font-size: 18px;
    color: #fff;
    float: left;
    margin-top: -38px;
    position: relative;
  }

  .video-console-one .btn-bottom .icon {
    line-height: 42px;
  }

  .video-console-one .btn-full {
    height: 30px;
    width: 50px;
    border-radius: 6px;
    top: calc(100% - 40px);
    left: calc(100% - 60px);
    position: absolute;
    padding: 0px;
  }

  .video-console-one .btn-full .back {
    border-radius: 6px;
  }

  .video-console-one .btn-full .icon {
    font-size: 13px;
    margin-top: -30px;
    line-height: 30px;
  }

  .video-console-one:hover {
    opacity: 10;
  }

  .video-console-one .btn-exit {
    top: 10px;
    left: calc(100% - 48px);
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
