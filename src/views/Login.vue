<template>
  <div class="login">
    <el-form ref="loginForm" :model="form" :rules="rules" class="login-box" v-if="!updatePwd">
      <h3 class="login-title">ETC加油管理后台</h3>
      <el-form-item prop="cellphone">
        <el-input type="text" placeholder="请输入用户名" v-model="form.cellphone"  @input="inputBlur"/>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"  @keyup.enter.native="onSubmit" @input="inputBlur"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :class="{'opacity': isLogin}" :loading="loading">登录</el-button>
      </el-form-item>
      <div class="forget_pwd" @click="onForgetPassword">忘记密码？</div>
    </el-form>
    <el-form ref="updateFormRef" :model="updateForm" :rules="updateRules" class="login-box" v-if="updatePwd">
      <h3 class="login-title">修改密码</h3>
      <el-form-item prop="newPassword">
        <el-input v-model="updateForm.newPassword" type="password" placeholder="请输入新密码" @input="updateInputBlur" />
      </el-form-item>
      <el-form-item prop="rePassword">
        <el-input v-model="updateForm.rePassword" type="password" placeholder="请再次输入新密码" @input="updateInputBlur" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onUpdatePwd" :class="{'opacity': isLogin}" :loading="loading">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login, updatePassword, forgetPassword } from "@/api/api.js"; //引入login
import cookies from 'js-cookie'
import { MessageBox } from 'element-ui'
import  { getPageQuery } from '@/utils/tools'
export default {
  data() {
    return {
      form: {
        cellphone: "",
        password: ""
      },
      updateForm: {
        newPassword: '',
        rePassword: '',
      },
      isLogin: true,
      loading: false,
      updatePwd: false, // 首次登陆需要修改密码
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        cellphone: [
          { required: true, message: "账号不可为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不可为空", trigger: "blur" }]
      },
      updateRules: {
        newPassword: [
          { required: true, message: "密码不可为空", trigger: "blur" }
        ],
        rePassword: [{ required: true, message: "再次确认密码不可为空", trigger: "blur" }]
      },
    };
  },
  methods: {
    inputBlur(){
      console.log(this.form)
      if(this.form.cellphone && this.form.password){
        this.isLogin = false
      }
    },
    updateInputBlur(){
      if(this.updateForm.newPassword && this.updateForm.rePassword){
        this.isLogin = false
      }
    },
    onSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.isLogin = false
          // 为表单绑定验证功能
          // 登录前要清掉token
          localStorage.setItem('accessToken', '');
          localStorage.setItem('isFirstLogin', 0);
          //17503087262 gaodeng123  15626597271 Machine2020-
          // 新登录
          this.loading = true;
          login(this.form).then(res => {
            this.loading = false;
            if (res.bizCode === 'SUCCESS') {
              const { accessToken, isFirstLogin } = res.respData;
              cookies.set('accessToken', accessToken )
              localStorage.setItem('cellphone', this.form.cellphone);
              localStorage.setItem('password', this.form.password);
              localStorage.setItem('accessToken', accessToken);
              // 是否首次登陆,初次需要修改密码
              if (isFirstLogin) {
                localStorage.setItem('isFirstLogin', 1);
                this.$message.warning('首次登录请修改密码')
                this.updatePwd = true;
                return;
              }
              const params = getPageQuery();
              let { redirect } = params;
              // 重定向 则直接跳转到该页面
              console.log('2333', redirect);
              if (redirect) {
                this.$router.push(redirect)
                return;
              }
              this.$router.push("/order");
            } else {
              this.$message.error(res.bizMsg || '登录错误，请重试')
            }
          })
        }
      })
    },
    // 修改密码
    onUpdatePwd() {
      this.$refs.updateFormRef.validate((valid) => {
        if (valid) {
          const { newPassword, rePassword } = this.updateForm;
          if (newPassword === 'admin') {
            this.$message.error('新密码不能与旧密码相同，请确认');
            return;
          }
          if (newPassword !== rePassword) {
            this.$message.error('两次输入的密码不一致，请确认');
            return;
          }
          this.loading = true;
          updatePassword({ newPassword }).then(res => {
            this.loading = false;
            if (res && res.bizCode === 'SUCCESS') {
              MessageBox.confirm('密码修改成功，请重新登录', {
                confirmButtonText: '确定',
                type: 'success'
              }).then(() => {
                this.updatePwd = false;
              })
            } else {
              this.$message.error(res.bizMsg || '密码修改失败，请重试');
            }
          })
        }
      })
    },
    // 忘记密码
    onForgetPassword() {
      if(!this.form.cellphone) {
        this.$message.error('请先填写账号再进行操作');
        return;
      }
      this.$confirm("是否确认密码重置？确认后请联系管理员处理。", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(()=>{
        this.loading = true;
        forgetPassword({ cellphone: this.form.cellphone }).then(res => {
          this.loading = false;
          if(res.bizCode === "SUCCESS"){
            this.$message({
              message: '提交成功，请联系管理员',
              type: 'success'
            });
          } else {
            this.$message({
              message: res.bizMsg || '修改失败，请稍后重试',
              type: 'error'
            });
          }
        })
      })
    }
  },


};
</script>
<style scoped>
.login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("../assets/img/login_bg.png") no-repeat left #1590FD;
  background-size: auto 100%;
}
.login-p {
  width: 1200px;
  /* margin: 0 auto; */
  text-align: center;
  font-size: 30px;
  color: #3e3e3e;
  margin-top: 40px;
}
.login /deep/ .el-input__inner{
  border: none;
  border-bottom: 1px solid #DCDFE6;
  padding: 0px;
  border-radius: 0;
}
.login /deep/ .el-input__inner:focus{
  border-bottom: 1px solid #1590FD;
}
.login /deep/ .el-form-item__content{
  text-align: center;
}
.login /deep/ .el-form-item{
  margin-bottom: 40px;
}
.login-box {
  /* border: 1px solid #dcdfe6; */
  width: 408px;
  height: 408px;
  padding: 54px 64px 15px 64px;
  border-radius: 20px;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  box-shadow: 0 0 5px #909399;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  right: 278px;
  margin-top: -204px;
  background: #ffffff;
}

.login-title {
  text-align: center;
  margin: 0 auto 60px auto;
  color: #999999;
  font-size: 24px;
  font-weight: 600;
}
.el-button {
  width: 100%;
  margin-top: 19px;
}
.opacity{
  opacity: 0.4;
}
.el-button span {
  font-size: 16px;
}
.dialog-footer button {
  width: 70px;
  text-align: center;
  font-size: 14px;
}
.login /deep/ .el-form-item__label{
  color: #ffffff;
}
.login /deep/ .el-button--primary{
  background-color:#1590FD;
  border: 1px solid #1590FD;
  font-size: 18px;
  border-radius: 12px;
}
.forget_pwd {
  cursor: pointer;
  color: #999;
  margin-top: -30px;
}
.forget_pwd:hover {
  color: #1590FD;
}
@media screen and (max-width: 1440px){
  .login-box{
    right: 12%;
  }
}

</style>

