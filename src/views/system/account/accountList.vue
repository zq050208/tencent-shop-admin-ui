<template>
    <div class="content">
        <!-- <h5 class="tip">点击按钮，将跳转到权限管理系统，统一添加人员</h5>
        <div class="wrap">
            <el-button type="primary" class="add_button" @click="addAccount">添加人员</el-button>
        </div> -->
        <div class="table">
            <el-table
              :data="tableData"
              border
              style="width: 95%"
              v-loading="loading"
            >
              <el-table-column
                prop="realname"
                label="姓名"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="cellphone"
                label="联系电话"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="department"
                label="部门"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="status"
                label="账号状态"
                align="center"
              >
                <template slot-scope="scope">
                    <el-switch
                      :value="scope.row.status === 'on'"
                      @change="changeStatus(scope.row)"
                    >
                    </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="230"
              >
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="editRow(scope.$index,scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteRow(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageParams.current_page"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageParams.page_size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams.total"
              style="margin-top: 20px;text-align:center;"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { getAccountList, deleteAccount, changeAccountStatus } from '@/api/api'

  export default {
    data(){
      return {
        loading: false,
        tableData: [],
        pageParams: {
          current_page: 1,
          page_size: 10,
          total: 0
        },
      }
    },
    computed:{

    },
    created() {
    },
    mounted(){
      // this.getInitData()
    },
    methods:{
      getInitData() {
        const params = {
          current: this.pageParams.current_page,
          size: this.pageParams.page_size,
        }
        getAccountList(params).then(res => {
          if (res.bizCode === 'SUCCESS') {
            if (res.respData) {
              const { pageSize, total } = res.respData
              this.tableData = res.respData.list
              this.pageParams.page_size = pageSize
              this.pageParams.total = total
            }
          } else {
            this.$message({
              message: res.bizMsg || '查询失败，请稍后重试',
              type: 'error'
            });
          }
        })
      },
      handleSizeChange(val) {
        this.pageParams.current_page = 1;
        this.pageParams.page_size = val;
        this.getInitData()
      },
      handleCurrentChange(val) {
        this.pageParams.current_page = val;
        this.getInitData()
      },
      addAccount(){
        // this.$router.push('/system/addAccount')
        console.log('env:', process.env.NODE_ENV, window.location.origin)
        let wolfUrl
        if ( process.env.NODE_ENV=== 'development') {
          wolfUrl = 'http://dev.refuel.gplqdb.com/console/#/user/list'
        } else {
          wolfUrl = window.location.origin + '/console/#/user/list'
        }
        window.open(wolfUrl)
      },
      // 删除人员
      deleteRow(row) {
        const params = {
          id: row.id,
        }
        this.$confirm("确定删除该账号吗？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(()=>{
          this.loading = true;
          deleteAccount(params).then(res => {
            this.loading = false;
            if(res.bizCode === "SUCCESS"){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              if(this.tableData.length === 1 && this.pageParams.current_page != 1){
                this.pageParams.current_page--
              }
              this.getInitData()
            } else {
              this.$message({
                message: res.bizMsg || '删除失败，请稍后重试',
                type: 'error'
              });
            }
          })
        })
      },
      // 更改状态
      changeStatus(row){
        const params = {
          id: row.id,
          status: row.status === 'on' ? 'off' : 'on'
        }
        this.$confirm("确定修改账号状态吗？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(()=>{
          this.loading = true;
          changeAccountStatus(params).then(res => {
            this.loading = false;
            if(res.bizCode === "SUCCESS"){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              if(this.tableData.length === 1 && this.pageParams.current_page != 1){
                this.pageParams.current_page--
              }
              this.getInitData()
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
    created(){

    },
  }
</script>

<style scoped>
  .tip {
    text-align: center;
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.6);
  }
  .wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add_button {
    width: 400px;
  }

</style>
