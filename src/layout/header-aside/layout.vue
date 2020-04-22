<template>
    <div
            class="d2-layout-header-aside-group"
            :style="styleLayoutMainGroup"
            :class="{grayMode: grayActive}">
        <!-- 半透明遮罩 -->
        <div class="d2-layout-header-aside-mask"></div>
        <!-- 主体内容 -->
        <div class="d2-layout-header-aside-content" flex="dir:top">
            <!-- 顶栏 -->
            <div
                    class="d2-theme-header"
                    :style="{
          opacity: this.searchActive ? 0.5 : 1
        }"
                    flex-box="0"
                    flex>
                <router-link to="/index" class="logo-group"
                             :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}" flex-box="0">
                    <img v-if="asideCollapse"
                         :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`">
                    <img v-else :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`">
                </router-link>
                <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
<!--                                        <d2-icon name="bars"/>-->
                    <svg v-if="!$store.state.d2admin.menu.asideCollapse" viewBox="64 64 896 896" focusable="false" class="svg" data-icon="menu-fold" width="1em"
                         height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 000 13.8z"></path>
                    </svg>
                    <svg v-if="$store.state.d2admin.menu.asideCollapse" viewBox="64 64 896 896" focusable="false" class="svg" data-icon="menu-unfold" width="1em"
                         height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 000-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0014.4 7z"></path>
                    </svg>
                </div>
                <d2-menu-header flex-box="1"/>
                <!-- 顶栏右侧 -->
                <div class="d2-header-right" flex-box="0">
                    <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
                    <d2-header-search @click="handleSearchClick"/>
                    <d2-header-log/>
                    <d2-header-fullscreen/>
                    <d2-header-theme/>
                    <d2-header-size/>
                    <d2-header-locales/>
                    <d2-header-color/>
                    <d2-header-user/>
                </div>
            </div>
            <!-- 下面 主体 -->
            <div class="d2-theme-container" flex-box="1" flex>
                <!-- 主体 侧边栏 -->
                <div
                        flex-box="0"
                        ref="aside"
                        class="d2-theme-container-aside"
                        :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: this.searchActive ? 0.5 : 1
          }">
                    <d2-menu-side/>
                </div>
                <!-- 主体 -->
                <div class="d2-theme-container-main" flex-box="1" flex>
                    <!-- 搜索 -->
                    <transition name="fade-scale">
                        <div v-if="searchActive" class="d2-theme-container-main-layer" flex>
                            <d2-panel-search
                                    ref="panelSearch"
                                    @close="searchPanelClose"/>
                        </div>
                    </transition>
                    <!-- 内容 -->
                    <transition name="fade-scale">
                        <div v-if="!searchActive" class="d2-theme-container-main-layer" flex="dir:top">
                            <!-- tab -->
                            <div class="d2-theme-container-main-header" flex-box="0">
                                <d2-tabs/>
                            </div>
                            <!-- 页面 -->
                            <div class="d2-theme-container-main-body" flex-box="1">
                                <transition :name="transitionActive ? 'fade-transverse' : ''">
                                    <keep-alive :include="keepAlive">
                                        <router-view/>
                                    </keep-alive>
                                </transition>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import d2MenuSide from './components/menu-side'
import d2MenuHeader from './components/menu-header'
import d2Tabs from './components/tabs'
import d2HeaderFullscreen from './components/header-fullscreen'
import d2HeaderLocales from './components/header-locales'
import d2HeaderSearch from './components/header-search'
import d2HeaderSize from './components/header-size'
import d2HeaderTheme from './components/header-theme'
import d2HeaderUser from './components/header-user'
import d2HeaderLog from './components/header-log'
import d2HeaderColor from './components/header-color'
import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'

export default {
  name: 'd2-layout-header-aside',
  mixins: [
    mixinSearch
  ],
  components: {
    d2MenuSide,
    d2MenuHeader,
    d2Tabs,
    d2HeaderFullscreen,
    d2HeaderLocales,
    d2HeaderSearch,
    d2HeaderSize,
    d2HeaderTheme,
    d2HeaderUser,
    d2HeaderLog,
    d2HeaderColor
  },
  data () {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px'
    }
  },
  computed: {
    ...mapState('d2admin', {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse
    }),
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
       * @description 最外层容器的背景图片样式
       */
    styleLayoutMainGroup () {
      return {
        ...this.themeActiveSetting.backgroundImage ? {
          backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
        } : {}
      }
    }
  },
  methods: {
    ...mapActions('d2admin/menu', [
      'asideCollapseToggle'
    ]),
    /**
       * 接收点击切换侧边栏的按钮
       */
    handleToggleAside () {
      this.asideCollapseToggle()
    }
  }
}
</script>

<style lang="scss">
    // 注册主题
    @import '~@/assets/style/theme/register.scss';
  .svg {
    height: 18px;
    width: 18px;
  }
</style>
