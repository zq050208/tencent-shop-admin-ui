<template>
    <div class="content">
        <el-form :model="accountForm" :rules="rules" ref="accountForm" label-width="100px" style="display:flex;flex-wrap:wrap;">
            <el-form-item label="姓名" prop="nickname">
                <el-input v-model="accountForm.nickname"  maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="cellphone">
                <el-input v-model="accountForm.cellphone" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="department">
                <el-input v-model="accountForm.department"  maxlength="30"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="button" @click="onAddAccount" :disabled="loading">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import { addAccount } from '@/api/api'
  export default {
    inject: ['reload'],
    components: {},
    data(){
      return {
        rules: {
          nickname: [ { required: true, message: '请输入姓名', trigger: 'blur' } ],
          cellphone: [ { required: true, message: '请输入联系电话', trigger: 'blur' } ],
          department: [ { required: true, message: '请输入部门', trigger: 'blur' } ],
        },
        loading: false,
        accountForm: {
          nickname: '',
          cellphone: '',
          department: '',
        }
      }
    },
    computed:{

    },
    methods:{
      onAddAccount() {
        this.$refs.accountForm.validate((valid) => {
          if(valid) {
            const params = {
              ...this.accountForm
            };
            this.loading = true;
            addAccount(params).then(res => {
              this.loading = false;
              if(res.bizCode && res.bizCode === "SUCCESS"){
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.$router.push('/system/accountList')
              } else {
                this.$message({
                  message: res.bizMsg,
                  type: 'error'
                });
              }
            })
          }
        })
      },
    },
    created(){

    },
    mounted(){

    }
  }
</script>

<style scoped>



</style>
