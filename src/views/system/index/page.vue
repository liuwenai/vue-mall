<template>
  <!-- <div class="qzg"> -->
  <d2-container ref="container" type="card">
    <!-- <div class="index-container-maxs"> -->
    <el-row class="grid-content-max">
      <el-col :span="24">
        <el-row class="grid-header-row">
          <!-- <el-col :span="4" class="grid-header">
            <div class="grid-header-click-flow">
              <div class="bg-purple">待办业务</div>
              <div @click="onOpenFlow(item)" class="flow" v-for="(item,index) in flows" :key="index">
                {{item.fmc}} &nbsp; &nbsp; &nbsp; {{item.sl}}
                </div>
            </div>
          </el-col>-->
          <el-col :span="5" class="grid-header">
            <div class="grid-header-click" @click="onOpenRoute('/muser')">
              <div class="bg-purple grid-header-top">用户总人数</div>
              <div class="bg-purple grid-header-center">{{infor.zrs}}</div>
            </div>
          </el-col>
          <el-col :span="5" class="grid-header">
            <div class="grid-header-click" >
              <div class="bg-purple grid-header-top">已发货</div>
              <div class="bg-purple grid-header-center">{{infor.zcs}}</div>
            </div>
          </el-col>
          <el-col :span="5" class="grid-header">
            <div class="grid-header-click" >
              <div class="bg-purple grid-header-top">待发货</div>
              <div class="bg-purple grid-header-center">{{infor.zjdq}}</div>
            </div>
          </el-col>
          <el-col :span="5" class="grid-header">
            <div class="grid-header-click">
              <div class="bg-purple grid-header-top">待评价</div>
              <div class="bg-purple grid-header-center">{{infor.go}}</div>
            </div>
          </el-col>
          <!-- <el-col :span="4" class="grid-header">
            <div class="grid-header-click" >
              <div class="bg-purple grid-header-top">待</div>
              <div class="bg-purple grid-header-center">{{infor.back}}</div>
            </div>
          </el-col> -->
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row class="grid-content-row">
      <el-col :span="24">
        <el-table :data="flows" highlight-current-row border show-summary>
          <!-- <el-table-column type="selection" header-align="center" align="center"></el-table-column> -->
          <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
          <el-table-column
            v-if="false"
            min-width="100px"
            sortable="custom"
            prop="id"
            label="流程编号"
            align="center"
          >
            <template slot-scope="scope">
              <el-link @click="openPay(scope.row)">{{scope.row.id}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100px"
            sortable="custom"
            prop="fmc"
            label="流程名称"
            align="center"
          ></el-table-column>
          <el-table-column min-width="90px" sortable="custom" prop="sl" label="待审批" align="center">
            <template slot-scope="scope">
              <el-link @click="openFlow(scope.row)">{{scope.row.sl}}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 按年汇总人数 -->
    <el-row>
      <el-col :span="24" class="grid-bottom-row">
        <ve-histogram :data="dateChart"></ve-histogram>
      </el-col>
    </el-row>
    <!-- 国家数据 -->
    <el-row>
      <el-col>
        <ve-map :data="countryChart" :extend="chartExtend" :settings="chartSettings" ></ve-map>
      </el-col>
    </el-row>
    <!-- 单位数据 -->
    <el-row>
      <el-col :span="24" class="grid-bottom-row">
        <ve-line :data="departmentChart"></ve-line>
      </el-col>
    </el-row>

    <!-- </div> -->
  </d2-container>
  <!-- </div> -->
</template>

<script>
// import { reportyear, reportmonth, list } from "../../api/vbot/dashboard.js";

import VeLine from 'v-charts/lib/line.common'
import VeMap from 'v-charts/lib/map.common'
import VeHistogram from 'v-charts/lib/histogram.common'
// import VeWordcloud from 'v-charts/lib/wordcloud.common'
// import mapOrigin from "@/assets/charts/list/_data/china";
import mapOrigin from '@/assets/charts/list/_data/world'
// import { mapState, mapMutations } from 'vuex'
// import dayjs from 'dayjs'
// import { flcspjllist } from '@api/flow/flcspjl'
// import { dashboard,country,department,date } from '@api/dashboard/index'
// dayjs.locale('zh-cn')
export default {
  components: {
    VeLine,
    VeMap,
    VeHistogram
  },
  computed: {
    // ...mapState("d2admin/menu", ["header", "aside"])
  },
  data () {
    return {
      flows: [], // 流程数据
      infor: {},
      fdjzt: 0,
      chartSettings: {
        mapOrigin,
        position: 'world',
        // dimension: "位置",
        metrics: ['国外'],
        // selectData: false,         //是否高亮显示数据对应位置
        selectedMode: 'single',
        // aspectScale:1           //地图的长宽比 默认为0.75
        // roam: 'scale',           //是否开启鼠标缩放和平移漫游
        label: {
          // 是否显示地图上的文本标签
          show: false
        }
        // dataType: {
        //   面积: "KMB"
        // }
      },
      chartExtend: {
        series: {
          nameMap: {
            Afghanistan: '阿富汗',
            Angola: '安哥拉',
            Albania: '阿尔巴尼亚',
            'United Arab Emirates': '阿联酋',
            Argentina: '阿根廷',
            Armenia: '亚美尼亚',
            'French Southern and Antarctic Lands': '法属南半球和南极领地',
            Australia: '澳大利亚',
            Austria: '奥地利',
            Azerbaijan: '阿塞拜疆',
            Burundi: '布隆迪',
            Belgium: '比利时',
            Benin: '贝宁',
            'Burkina Faso': '布基纳法索',
            Bangladesh: '孟加拉国',
            Bulgaria: '保加利亚',
            'The Bahamas': '巴哈马',
            'Bosnia and Herzegovina': '波斯尼亚和黑塞哥维那',
            Belarus: '白俄罗斯',
            Belize: '伯利兹',
            Bermuda: '百慕大',
            Bolivia: '玻利维亚',
            Brazil: '巴西',
            Brunei: '文莱',
            Bhutan: '不丹',
            Botswana: '博茨瓦纳',
            'Central African Republic': '中非共和国',
            Canada: '加拿大',
            Switzerland: '瑞士',
            Chile: '智利',
            China: '中国',
            'Ivory Coast': '象牙海岸',
            Cameroon: '喀麦隆',
            'Democratic Republic of the Congo': '刚果民主共和国',
            'Republic of the Congo': '刚果共和国',
            Colombia: '哥伦比亚',
            'Costa Rica': '哥斯达黎加',
            Cuba: '古巴',
            'Northern Cyprus': '北塞浦路斯',
            Cyprus: '塞浦路斯',
            'Czech Republic': '捷克共和国',
            Germany: '德国',
            Djibouti: '吉布提',
            Denmark: '丹麦',
            'Dominican Republic': '多明尼加共和国',
            Algeria: '阿尔及利亚',
            Ecuador: '厄瓜多尔',
            Egypt: '埃及',
            Eritrea: '厄立特里亚',
            Spain: '西班牙',
            Estonia: '爱沙尼亚',
            Ethiopia: '埃塞俄比亚',
            Finland: '芬兰',
            Fiji: '斐',
            'Falkland Islands': '福克兰群岛',
            France: '法国',
            Gabon: '加蓬',
            'United Kingdom': '英国',
            Georgia: '格鲁吉亚',
            Ghana: '加纳',
            Guinea: '几内亚',
            Gambia: '冈比亚',
            'Guinea Bissau': '几内亚比绍',
            'Equatorial Guinea': '赤道几内亚',
            Greece: '希腊',
            Greenland: '格陵兰',
            Guatemala: '危地马拉',
            'French Guiana': '法属圭亚那',
            Guyana: '圭亚那',
            Honduras: '洪都拉斯',
            Croatia: '克罗地亚',
            Haiti: '海地',
            Hungary: '匈牙利',
            Indonesia: '印尼',
            India: '印度',
            Ireland: '爱尔兰',
            Iran: '伊朗',
            Iraq: '伊拉克',
            Iceland: '冰岛',
            Israel: '以色列',
            Italy: '意大利',
            Jamaica: '牙买加',
            Jordan: '约旦',
            Japan: '日本',
            Kazakhstan: '哈萨克斯坦',
            Kenya: '肯尼亚',
            Kyrgyzstan: '吉尔吉斯斯坦',
            Cambodia: '柬埔寨',
            'South Korea': '韩国',
            Kosovo: '科索沃',
            Kuwait: '科威特',
            Laos: '老挝',
            Lebanon: '黎巴嫩',
            Liberia: '利比里亚',
            Libya: '利比亚',
            'Sri Lanka': '斯里兰卡',
            Lesotho: '莱索托',
            Lithuania: '立陶宛',
            Luxembourg: '卢森堡',
            Latvia: '拉脱维亚',
            Morocco: '摩洛哥',
            Moldova: '摩尔多瓦',
            Madagascar: '马达加斯加',
            Mexico: '墨西哥',
            Macedonia: '马其顿',
            Mali: '马里',
            Myanmar: '缅甸',
            Montenegro: '黑山',
            Mongolia: '蒙古',
            Mozambique: '莫桑比克',
            Mauritania: '毛里塔尼亚',
            Malawi: '马拉维',
            Malaysia: '马来西亚',
            Namibia: '纳米比亚',
            'New Caledonia': '新喀里多尼亚',
            Niger: '尼日尔',
            Nigeria: '尼日利亚',
            Nicaragua: '尼加拉瓜',
            Netherlands: '荷兰',
            Norway: '挪威',
            Nepal: '尼泊尔',
            'New Zealand': '新西兰',
            Oman: '阿曼',
            Pakistan: '巴基斯坦',
            Panama: '巴拿马',
            Peru: '秘鲁',
            Philippines: '菲律宾',
            'Papua New Guinea': '巴布亚新几内亚',
            Poland: '波兰',
            'Puerto Rico': '波多黎各',
            'North Korea': '北朝鲜',
            Portugal: '葡萄牙',
            Paraguay: '巴拉圭',
            Qatar: '卡塔尔',
            Romania: '罗马尼亚',
            Russia: '俄罗斯',
            Rwanda: '卢旺达',
            'Western Sahara': '西撒哈拉',
            'Saudi Arabia': '沙特阿拉伯',
            Sudan: '苏丹',
            'South Sudan': '南苏丹',
            Senegal: '塞内加尔',
            'Solomon Islands': '所罗门群岛',
            'Sierra Leone': '塞拉利昂',
            'El Salvador': '萨尔瓦多',
            Somaliland: '索马里兰',
            Somalia: '索马里',
            'Republic of Serbia': '塞尔维亚和国',
            Suriname: '苏里南',
            Slovakia: '斯洛伐克',
            Slovenia: '斯洛文尼亚',
            Sweden: '瑞典',
            Swaziland: '斯威士兰',
            Syria: '叙利亚',
            Chad: '乍得',
            Togo: '多哥',
            Thailand: '泰国',
            Tajikistan: '塔吉克斯坦',
            Turkmenistan: '土库曼斯坦',
            'East Timor': '东帝汶',
            'Trinidad and Tobago': '特里尼达和多巴哥',
            Tunisia: '突尼斯',
            Turkey: '土耳其',
            'United Republic of Tanzania': '坦桑尼亚联合和国',
            Uganda: '乌干达',
            Ukraine: '乌克兰',
            Uruguay: '乌拉圭',
            'United States': '美国',
            Uzbekistan: '乌兹别克斯坦',
            Venezuela: '委内瑞拉',
            Vietnam: '越南',
            Vanuatu: '瓦努阿图',
            'West Bank': '西岸',
            Yemen: '也门',
            'South Africa': '南非',
            Zambia: '赞比亚',
            Zimbabwe: '津巴布韦'
          }
        }
      },
      countryChart: {
        columns: ['位置', '国外'],
        rows: [
          { '位置': '俄罗斯', 国外: 223 },
          { '位置': '日本', 国外: 123 }
        ]
      },
      departmentChart: {
        columns: ['单位', '总人数', '国内', '国外'],
        rows: [
          { 单位: '一公司', 总人数: 323, 国内: 100, 国外: 223 },
          { 单位: '二公司', 总人数: 233, 国内: 100, 国外: 123 },
          { 单位: '三公司', 总人数: 345, 国内: 100, 国外: 245 },
          { 单位: '四公司', 总人数: 543, 国内: 100, 国外: 443 }
        ]
      },
      tableAutoHeight: null,
      query: {
        type: 'year',
        format: 'yyyy',
        date: new Date()
      },
      dateChart: {
        columns: ['日期', '出国人数', '回国人数'],
        rows: [
          { 日期: '2019-01', 出国人数: 1393, 回国人数: 1093 },
          { 日期: '2019-02', 出国人数: 3530, 回国人数: 3230 },
          { 日期: '2019-03', 出国人数: 2923, 回国人数: 2623 },
          { 日期: '2019-04', 出国人数: 1723, 回国人数: 1423 },
          { 日期: '2019-05', 出国人数: 3792, 回国人数: 3492 },
          { 日期: '2019-06', 出国人数: 4593, 回国人数: 4293 }
        ]
      },
      tableData: []
    }
  },
  mounted () {
    this.main()
    this.$nextTick(() => {
      this.setTableHeight()
    })
  },

  methods: {
    setTableHeight: function () {
      const containerHeight = this.$refs['container'].$el.clientHeight
      const dynamicHeight = containerHeight
      this.tableAutoHeight = dynamicHeight + 'px'
    },

    // 跳转页面
    onOpenRoute (route) {
      this.$router.push({ path: route })
    },
    main () {
      // dashboard().then(response => {
      //   this.flows = response.flows
      //   this.infor = response.infor
      // })
      // country().then(response => {
      //   // this.countryChart.rows = response
      // })
      // department().then(response => {
      //   // this.departmentChart.rows = response
      // })
      // date('year').then(response => {
      //   // this.dateChart.rows = response
      // })
    },
    openFlow (data) {
      const name = data.id + 'sh'
      this.$router.push({
        name
      })
    }
  }
}
</script>

<style scoped>
.index-container-maxs {
  /* overflow-y: auto;
  height: 100vh; */
  background: #fff;
  border: 1px solid #cfd7e5;
  border-top: none;
  margin-right: 20px;
  padding-bottom: 20px;
}
.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-container
  .d2-theme-container-main
  .d2-theme-container-main-body
  .container-component
  .d2-container-full
  .d2-container-full__body {
  overflow-y: auto;
}
.grid-content-max {
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 10px;
  overflow: auto;
}
.grid-header-row,
.grid-content-row,
.grid-footer-row,
.grid-bottom-row {
  margin-bottom: 20px;
}
.grid-content-row,
.grid-footer-row,
.grid-bottom-row {
  padding: 0 2.65% 0 2.8%;
}
.bg-purple {
  text-align: center;
}
.grid-header-top {
  border-radius: 4px 4px 0 0;
}
.grid-header-center {
  margin-top: 10px;
}
.grid-header-bottom {
  border-radius: 0 0 4px 4px;
  margin-top: 10px;
}
.grid-header {
  margin-left: 2.8%;
}
.grid-header-click {
  display: flex;
  flex-direction: column;
  height: 160px;
  background: rgba(0, 0, 0, 0.03);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  font-family: MicrosoftYaHei;
  color: #606266;
  justify-content: center;
  font-size: 20px;
  border-radius: 4px;
  cursor: pointer;
}

.grid-header-click-flow {
  display: flex;
  flex-direction: column;
  height: 160px;
  background: rgba(0, 0, 0, 0.03);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  font-family: MicrosoftYaHei;
  color: #606266;
  justify-content: center;
  font-size: 20px;
  border-radius: 4px;
}
.flow {
  padding-left: 3px;
  font-size: 14px;
  cursor: pointer;
}
</style>
