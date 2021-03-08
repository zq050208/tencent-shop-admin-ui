<template>
  <div class="content">
    <el-card class="search_cont box-card">
      <el-row>
        <label>订单号：</label
        ><el-input
          v-model="searchData.transactionNo"
          placeholder=""
          clearable
        ></el-input>
        <label class="w120" style="margin-left: 10px">日期：</label>
        <el-date-picker
          v-model="searchData.beginTime"
          type="date"
          value-format="yyyy-MM-dd"
          width="150"
          placeholder="开始日期"
          class="date-input"
        >
        </el-date-picker>
        <el-date-picker
          v-model="searchData.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          width="150"
          placeholder="结束日期"
          class="date-input"
        >
        </el-date-picker>
        <label>油站关键词：</label
        ><el-input
          v-model="searchData.stationName"
          placeholder=""
          clearable
        ></el-input>
        <label>状态：</label>
        <el-select v-model="searchData.status" @change="selectChange">
          <el-option
            v-for="i in statusTypes"
            :label="i.name"
            :value="i.status"
            :key="i.name"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          class="anniu"
          @click="search"
          style="margin-left: 10px"
          >搜索</el-button
        >
      </el-row>
    </el-card>
    <div>
      <el-checkbox
        :disabled="!tableData || !tableData.length"
        v-model="selectAll"
        @change="handleSelectAll"
        >全部</el-checkbox
      >
      <el-button
        :disabled="!tableData || !tableData.length"
        type="primary"
        class="export-btn"
        @click="exportExcel"
        :loading="loading"
        >导出excel</el-button
      >
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        :loading="loading"
        border
        style="width: 98%"
        :header-cell-style="{
          'background-color': '#fff',
        }"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        >
        <el-table-column 
          type="selection"
          :selectable="selectMethod"
          width="55"> 
        </el-table-column>
        <el-table-column
          prop="transactionNo"
          label="订单号"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="amount" label="结算金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recoveryTime"
          label="发起追缴时间"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="statusDesc" label="状态" align="center">
        </el-table-column>
        <el-table-column prop="payResult" label="备注" align="center">
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
        style="margin-top: 20px; text-align: center"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { recoveryListApi, exportRecoveryOrderExcel } from "@/api/api";
export default {
  data() {
    return {
      selectAll: false,
      loading: false,
      searchData: {
        status: null,
      },
      tableData: [],
      pageParams: {
        current_page: 1,
        page_size: 10,
        total: 0,
      },
      multipleSelection: [],
      statusTypes: [
        { name: "全部", status: null },
        { name: "失败", status: "PAY_FAIL" },
        { name: "成功", status: "SUCCESS" },
      ],
      selectAllExport: true
    };
  },
  computed: {},
  mounted() {
    this.getInitData();
  },
  methods: {
    getInitData() {
      const params = {
        current: this.pageParams.current_page,
        size: this.pageParams.page_size,
        ...this.searchData,
      };
      this.loading = true;
      recoveryListApi(params).then((res) => {
        this.loading = false;
        if (res.bizCode && res.bizCode === "SUCCESS") {
          let tempData = res.respData[0];
          if (this.selectAll) {
            this.$refs.multipleTable.toggleAllSelection();
            setTimeout(() => {
							this.selectAllExport = false
						},10)
          }
          this.tableData = tempData.payOrderList || [];
          this.pageParams.page_size = tempData.size;
          this.pageParams.total = tempData.total;
        } else {
          this.tableData = 0;
          this.pageParams.total = 0;
        }
      });
    },
    search() {
      this.selectAll = false; //取消导出表格的全部选中状态
      this.selectAllExport = true
      this.getInitData();
    },
    // 下拉选择项更改
    selectChange(val) {
      this.selectAll = false;
      this.selectAllExport = true
      this.getInitData();
    },
    //分页
    handleSizeChange(val) {
      this.pageParams.page_size = val;
      this.selectAllExport = true
      this.getInitData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageParams.current_page = val;
      this.selectAllExport = true
      this.getInitData();
      console.log(`当前页: ${val}`);
    },
    handleSelectionChange(val) {
      // this.selectAll  = false;
      this.multipleSelection = val;
    },
    selectMethod(){
			if(this.selectAllExport){
				return true
			} else {
				return false
			}
		},
    // 手动选中全部
    handleSelectAll(e) {
      if (e) {
        this.$refs.multipleTable.toggleAllSelection();
        setTimeout(() => {
					this.selectAllExport = false
				},20)
      } else {
        this.$refs.multipleTable.clearSelection();
        setTimeout(() => {
					this.selectAllExport = true
				},20)
      }
    },
    exportExcel() {
      if (!this.selectAll && !this.multipleSelection.length) {
        this.$message.warning("请勾选要导出的订单或者全选导出全部订单！");
        return;
      }
      // 判断是全选还是勾选
      const selectId = this.multipleSelection.map((item) => item.id);
      let params = Object.assign(
        {},
        this.searchData,
        { selectAll: this.selectAll },
        { selectId: this.selectAll ? [] : selectId }
      );
      this.loading = true;
      exportRecoveryOrderExcel(params).then((res) => {
        this.loading = false;
      });
    },
  },
  created() {},
};
</script>

<style scoped>
.content .el-input {
  width: 200px;
  margin-right: 10px;
}
.content .date-input {
  width: 150px;
}
.search_cont {
  margin-bottom: 10px;
  width: 98%;
}
.box-card {
  margin-top: 10px;
}
.export-btn {
  margin-left: 10px;
  margin-bottom: 10px;
}
/deep/ .el-dialog__body {
  padding: 0 30px 20px;
}
</style>
