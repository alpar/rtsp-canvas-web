<template>
  <div>
    <el-form class="form-dialog" label-width="120px">
      <el-row>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="紧急度：">
            <el-tag type="danger" close-transition>一级</el-tag>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="货号：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="国际条码：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="商品名称：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="简称：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="热度：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="型号：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="规格：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="分类：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="品牌：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="供应商名：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="供应商简称：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="供应商编号：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="来货周期：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="最小来货量：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="库存量：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="安全水位：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="保质期：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="需求量：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="产地：">
            一段测试文本
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="厂商：">
            一段测试文本
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import {Form, FormItem, Row, Col, Input, Tag} from 'element-ui'
  export default {
    components: {
      ElForm: Form,
      ElFormItem: FormItem,
      ElRow: Row,
      ElCol: Col,
      ElInput: Input,
      ElTag: Tag
    },
    data () {
      return {}
    },
    props: {
      detailInfo: {
        type: Object,
        default: {}
      }
    },
    created () {
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

