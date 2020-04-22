<template>
  <div class="page-login">
    <el-row style="height:100vh">
      <el-col :span="18" style="height:100vh">
        <!-- <div class="page-loginLeft" :style="{ background:'url('+bgUrl+')' }"> -->
        <div class="page-loginLeft">
          <!-- <span class="page-loginLeftT"></span> -->
          <!-- <span class="page-loginLeftB">工程结算管理系统工具</span> -->
        </div>
      </el-col>
      <el-col
        :span="6"
        style="height:100vh;position:relative;border-left: 1px solid rgba(15, 26, 113, 1);"
      >
        <div class="page-login--form">
          <p class="page-login-title">
            <span>{{title}}</span>
            <b></b>
          </p>
          <el-form
            ref="loginForm"
            label-position="top"
            :rules="rules"
            :model="formLogin"
            size="default"
          >
            <el-form-item prop="username" style="marginTop:20px">
              <div class="page-loginItem">
                <i class="el-icon-user"></i>
                <el-input
                  type="text"
                  class="page-loginItemInput"
                  v-model="formLogin.username"
                  placeholder="用户名"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="page-loginItem">
                <i class="el-icon-lock"></i>
                <el-input
                  type="password"
                  class="page-loginItemInput"
                  v-model="formLogin.password"
                  placeholder="密码"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item prop="code">
              <div class="page-loginItem">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconiconfont-yanzhengma" />
                </svg>
                <el-input
                  type="text"
                  class="page-loginItemInput"
                  v-model="formLogin.code"
                  placeholder="- - - -"
                ></el-input>
                <img class="login-code" src="./image/login-code.png" />
              </div>
            </el-form-item>
            <el-button size="default" @click="submit" type="primary" class="button-login">登录</el-button>
          </el-form>
          <!-- <p class="page-login--options" flex="main:justify cross:center">
            <span>忘记密码</span>
            <span>注册用户</span>
          </p>-->
          <!-- 快速登录按钮 -->
          <!-- <el-button
            class="page-login--quick"
            size="default"
            type="info"
            @click="dialogVisible = true"
          >快速选择用户（测试功能）</el-button>-->
          <div class="login-group" v-if="socail">
            <d2-icon name="weibo" class="login-icon" />
            <d2-icon name="wechat" class="login-icon" />
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-dialog title="快速选择用户" :visible.sync="dialogVisible" width="400px">
      <el-row :gutter="10" style="padding: 20px 0px 10px 0px;">
        <el-col v-for="(user, index) in users" :key="index" :span="8" style="textAlign:center;">
          <div class="page-login--quick-user" @click="handleUserBtnClick(user)">
            <d2-icon name="user-circle-o" />
            <span>{{user.name}}</span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>-->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      title: '欢迎登录',
      bgUrl: '@/assets/image/login.png',
      socail: true,
      // 表单
      formLogin: {
        username: 'admin',
        password: 'admin',
        code: 'v9am'
      },
      // 校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  mounted () {},
  beforeDestroy () {},
  methods: {
    ...mapActions('d2admin/account', ['login']),
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.login({
            vm: this,
            username: this.formLogin.username,
            password: this.formLogin.password,
            usertype: '0'
          }).then(() => {
            // 重定向对象不存在则返回顶层路径
            this.$router.replace(this.$route.query.redirect || '/')
          })
        } else {
          // 登录表单校验失败
          // this.$message.error('表单校验失败')
          this.$notify.error({
            title: '错误',
            message: '表单校验失败'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/*@import "~@/assets/style/common.scss";*/
.page-login .el-form-item {
  margin-bottom: 22px;
}
.page-login .el-input__inner {
  height: 40px;
  line-height: 40px;
}
.page-login {
  // @extend %unable-select;
  $backgroundColor: #fff;
  background-color: $backgroundColor;
  height: 100%;
}
.page-loginLeft {
  position: relative;
  background: url("./image/login.png");
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
.page-loginLeftT {
  position: absolute;
  top: 54px;
  left: 58px;
  font-size: 24px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
.page-loginLeftB {
  display: inline-block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: rgba(15, 26, 113, 0.2);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 40px;
  text-align: center;
}
.page-login--form {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  padding: 0 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.page-login-title {
  position: relative;
  padding-bottom: 10px;
}
.page-login-title > span {
  font-size: 24px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.page-login-title > b {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 4px;
  background: rgba(15, 26, 113, 1);
  border-radius: 5px;
}
.page-loginItem {
  display: flex;
  border-bottom: 1px solid rgba(233, 233, 233, 1);
}
.page-loginItem > i {
  font-size: 22px;
  line-height: 40px;
  color: #333;
}
.page-loginItemInput > .el-input__inner {
  border: 0;
  outline: 0;
}
.login-code {
  width: 64px;
  height: 24px;
  margin-top: 10px;
}
.button-login {
  width: 100%;
  height: 40px;
  background: rgba(15, 26, 113, 1) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  border-radius: 2 !important;
  border: 0 !important;
}
.page-login--options {
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(15, 26, 113, 1);
  cursor: pointer;
}
.page-loginItem > .icon {
  width: 31px;
  height: 31px;
  margin-top: 5px;
}
.login-group {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 40px;
}
.login-icon {
  font-size: 30px !important;
  color: rgba(15, 26, 113, 1);
}
</style>
