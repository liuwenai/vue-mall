/**
 * 流程相关处理
 */
import { flcspjlflow } from '../api/flow/flcspjl'
export default {
  data () {
    return {
      flowvisible: false, // 流程审批窗口是否可见
      nodes: [] // 流程节点
    }
  },

  methods: {
    // 加载流程需要审批的节点
    showflow (id) {
      flcspjlflow(id).then(response => {
        this.nodes = response
      })
    },
    doCloseFlowDialog () {
      this.flowvisible = false
    }
  }
}
