import axios from 'axios'

/**
 * 统一websocket mix
 */
export default {

  methods: {
    websocket (topic = 'xls') {
      // let stomp = axios.defaults.baseURL + "/stomp"
      let socket = new SockJS('/stomp')
      let client = Stomp.over(socket)
      let self = this
      client.connect({}, function () {
        client.subscribe(`/topic/${topic}`, function (message) {
          if (DEV) {
            console.log(message)
          }
          let json = JSON.parse(message.body)
          const user = self.$store.getters.user
          const username = _.get(json, 'username', '1')
          if (_.get(user.user, 'username', '') === username) {
            let model = _.get(json, 'model', '')
            if (model === self.model || _.includes(self.model, model)) {
              let type = json.type
              let title = json.title
              if (_.has(json, 'docname')) {
                self.docName = _.get(json, 'docname')
              }
              if (_.has(json, 'method')) {
                let method = _.get(json, 'method')
                if (method == '') {
                  return
                }
                if (method === 'setLoading') {
                  console.log('setLoading')
                  if (_.has(json, 'msg')) {
                    let msg = _.get(json, 'msg')
                    self.loadingtext = msg
                  }
                } else if (method === 'load') {
                  self.load()
                }
              }

              if (_.has(json, 'type')) {
                let type = _.get(json, 'type')
                let msg = _.get(json, 'msg')
                let title = _.get(json, 'title')
                if (_.indexOf(['error', 'success', 'warning', 'info'], type) >= 0) {
                  self.$notify[type]({
                    title: title,
                    message: msg,
                    duration: 5000
                  })
                }
              }
              // else{
              //     self.$notify.info({
              //         title: title,
              //         message: msg
              //     });
              // }
            }
          }
        })
      })
      // client.send("/app/send-userb", {}, "");
    }
    // setLoading(){
    //     this.loadingtext = "数据加载中..."
    //     this.showLoading = true;
    // },
  }
}
