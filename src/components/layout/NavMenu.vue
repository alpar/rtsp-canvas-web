<template>
  <div class="nav-menu">
    <el-menu :router="false">
      <menu-node :data="menuData" :menuMax="menuMax"></menu-node>
    </el-menu>
  </div>
</template>
<script>
  import { Submenu, MenuItemGroup, MenuItem, Menu } from 'element-ui'
  import MenuNode from './NavMenuNode.vue'
  import menuData from './../../utils/menu'

  export default {
    name: 'nav-menu',
    data () {
      return {
        isOpen: false,
        menuData
      }
    },
    props: {
      menuMax: {
        Type: Boolean,
        default: true
      }
    },
    components: {
      ElMenu: Menu,
      ElSubmenu: Submenu,
      ElMenuItemGroup: MenuItemGroup,
      ElMenuItem: MenuItem,
      MenuNode
    }
  }
</script>
