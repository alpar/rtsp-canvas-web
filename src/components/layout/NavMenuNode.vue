<template>
  <div class="nav-menu-node">
    <template v-for="(node, key) in data">
      <!--存在子节点-->
      <el-submenu :index="node.index" v-if="node.children && node.show !== false && node.parent !== false">
        <template slot="title">
          <i :class="node.icon" v-if="node.icon"></i>
          {{node.name}}
        </template>
        <nav-menu-node :data="node.children" v-show="menuMax"></nav-menu-node>
      </el-submenu>
      <!--不存在子节点-->
      <el-menu-item :index="node.index" v-if="node.show !== false && (!node.children || node.parent === false)" @click="goto(node.index, node.query)">
        <i :class="node.icon" v-if="node.icon"></i>
        <font v-show="menuMax">{{node.name}}</font>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
  import { Submenu, MenuItemGroup, MenuItem, Menu } from 'element-ui'

  export default {
    name: 'nav-menu-node',
    data () {
      return {
        isOpen: false
      }
    },
    props: {
      data: {
        Type: Array,
        default: function () {
          return []
        }
      },
      menuMax: {
        Type: Boolean,
        default: true
      }
    },
    components: {
      ElMenu: Menu,
      ElSubmenu: Submenu,
      ElMenuItemGroup: MenuItemGroup,
      ElMenuItem: MenuItem
    }
  }
</script>
