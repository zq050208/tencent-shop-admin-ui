<template>
  <div class="content">
    <el-card class="search_cont box-card">
      <el-row>
        <label>订单号：</label
        ><el-input v-model="searchData.transactionNo" placeholder=""></el-input>
        <!-- <label>地址：</label><el-input v-model="searchData.address" placeholder=""></el-input> -->
        <label>日期：</label>
        <el-date-picker
          v-model="searchData.beginTime"
          type="date"
          value-format="yyyy-MM-dd"
          width="200"
          placeholder="开始日期"
        >
        </el-date-picker>
        <el-date-picker
          v-model="searchData.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          width="200"
          placeholder="结束日期"
        >
        </el-date-picker>
        <label>订单状态：</label>
        <el-select v-model="searchData.status" @change="statusTypeChange">
          <el-option
            v-for="i in statusTypes"
            :label="i.name"
            :value="i.status"
            :key="i.name"
          ></el-option>
        </el-select>
        <label>手机号：</label><el-input v-model="searchData.phone"></el-input>
        <el-button
          type="primary"
          class="anniu"
          @click="search"
          style="margin-left: 10px"
          >搜索</el-button
        >
      </el-row>
    </el-card>
    <div class="btn-line">
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
          class="handle-btn"
          @click="exportExcel"
          :loading="ExportBtnLoading"
          >导出excel</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        :loading="loading"
        border
        style="width: 95%"
        :header-cell-style="{
          'background-color': '#fff',
        }"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        >
        <el-table-column type="selection" :selectable="selectMethod" width="55">
        </el-table-column>
        <el-table-column
          fixed
          prop="transactionNo"
          label="订单号"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="phone" width="180" label="联系方式" align="center">
        </el-table-column>
        <el-table-column prop="content" width="180" label="内容" align="center">
          <template slot-scope="scope">
            <span :class="{'limit-width': scope.row.showMore}">{{scope.row.content}}</span> <span v-if="scope.row.showMore" @click="showMore(scope.$index)">更多</span>
          </template>
        </el-table-column>
        <el-table-column prop="oilGunNo" label="枪号" align="center">
        </el-table-column>
        <el-table-column prop="oilsVarieties" label="油号" align="center">
        </el-table-column>
        <el-table-column prop="litre" label="升数（升）" align="center">
        </el-table-column>
        <el-table-column prop="amount" label="结算金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" align="center">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.status.toLowerCase() === 'unpaid' ||
                scope.row.status.toLowerCase() === 'acceptfail' ||
                scope.row.status.toLowerCase() === 'fail'
              "
              >待支付</span
            >
            <span v-if="scope.row.status.toLowerCase() === 'paid'">已支付</span>
            <span v-if="scope.row.status.toLowerCase() === 'settled'"
              >已结算</span
            >
            <span v-if="scope.row.status.toLowerCase() === 'close'"
              >交易关闭</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="230" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="detail(scope.$index, scope.row)"
              >详情</el-button
            >
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
        style="margin-top: 20px; text-align: center"
      >
      </el-pagination>
    </div>
    <el-dialog title="订单详情" :visible.sync="orderDetailDialog" width="50%">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>订单基本信息</span>
        </div>
        <el-row>
          <el-col :span="12"> 订单号： {{ orderDetail.transactionNo }} </el-col>
          <el-col :span="12">
            订单状态： {{ orderDetail.transactionStatusDesc }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"> 下单时间： {{ orderDetail.orderTime }} </el-col>
          <el-col :span="12"> 支付时间： {{ orderDetail.payTime }} </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"> 枪单价： {{ orderDetail.price }} </el-col>
          <el-col :span="12"> 消费升数： {{ orderDetail.litre }} </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            订单总金额： {{ orderDetail.amount / 100 }}
          </el-col>
          <el-col :span="12">
            优惠券抵扣： {{ orderDetail.couponAmount / 100 || 0 }}
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>用户基本信息</span>
        </div>
        <el-row>
          <el-col :span="12"> 用户手机号： {{ orderDetail.cellphone }} </el-col>
          <el-col :span="12"> 车牌号： {{ orderDetail.plateNo }} </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>商品信息</span>
        </div>
        <el-row>
          <el-col :span="12"> 油站名称： {{ orderDetail.stationName }} </el-col>
          <el-col :span="12"> 地区： {{ orderDetail.address }} </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"> 油枪： {{ orderDetail.oilGunNo }} </el-col>
          <el-col :span="12"> 油号： {{ orderDetail.oilsVarieties }} </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>订单日志</span>
        </div>
        <el-table :data="orderDetail.orderLogDtos" style="width: 100%">
          <el-table-column prop="operationType" label="操作类型" width="180">
          </el-table-column>
          <el-table-column prop="operationTime" label="操作时间" width="180">
          </el-table-column>
          <el-table-column prop="operationUser" label="操作人">
          </el-table-column>
          <el-table-column prop="operationContent" label="操作内容">
          </el-table-column>
        </el-table>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDetailDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderList,
  getOrderDetail,
  exportOrderExcel,
  deductionApi,
  plateNoDeductionApi,
} from "@/api/api";
import { regYuanToFen } from "@/utils";
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      selectAll: false,
      loading: false,
      ExportBtnLoading: false,
      searchData: {
        transactionNo: "",
        // address: '',
        status: "",
        beginTime: "",
        endTime: "",
      },
      tableData: [],
      pageParams: {
        current_page: 1,
        page_size: 10,
        total: 0,
      },
      orderDetailDialog: false,
      orderDetail: {},
      multipleSelection: [],
      statusTypes: [
        { name: "全部", status: "" },
        { name: "待支付", status: "unpaid" },
        { name: "已支付", status: "paid" },
        { name: "交易关闭", status: "close" },
      ],
      selectAllExport: true,
    };
  },
  computed: {},
  mounted() {
    this.getInitData();
  },
  methods: {
    showMore(index){
      console.log(index)
      let tempArray = {
        ...this.tableData[index],
        showMore: false
      };
      Vue.set(this.tableData,0,tempArray)
    },
    getInitData() {
      const params = {
        current: this.pageParams.current_page,
        size: this.pageParams.page_size,
        ...this.searchData,
        // payBeginTime: this.searchData.payBeginTime ? `${this.searchData.payBeginTime} 00:00:00` : '',
        // payEndTime: this.searchData.payEndTime ? `${this.searchData.payEndTime} 23:59:59` : '',
      };
      this.loading = true;
      getOrderList(params).then((res) => {
        //  this.$refs.multipleTable.toggleRowSelection(this.listPowerSupplyTab[0],true);
        this.loading = false;
        if (res.bizCode && res.bizCode === "SUCCESS") {
          let tempData = res.respData[0];
          if (this.selectAll) {
            this.$refs.multipleTable.toggleAllSelection();
            setTimeout(() => {
              this.selectAllExport = false;
            }, 10);
          }
          this.tableData = tempData.payOrderList || [];
          this.tableData[0].content = "通过设置和可以开启展开行功能的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的相同。"
          this.tableData.forEach(item => {
            console.log(item.content.length)
            if(item.content.length > 20){
              // item.content = item.content.slice(0,20)
              item.showMore = true
            }else {
              item.showMore = false
            }
          })
          this.pageParams.page_size = tempData.size;
          this.pageParams.total = tempData.total;
        } else {
          this.tableData = 0;
          this.pageParams.total = 0;
        }
      });
    },
    getOrderDetail(id) {
      let params = {
        transactionId: id,
      };
      getOrderDetail(params).then((res) => {
        if (res.bizCode === "SUCCESS") {
          this.orderDetail = res.respData;
        }
      });
    },
    search() {
      this.getInitData();
      this.selectAll = false;
      this.selectAllExport = true;
    },
    //查看订单详情
    detail(index, row) {
      this.getOrderDetail(row.id);
      this.orderDetailDialog = true;
      this.orderDetail = row;
    },
    statusTypeChange(val) {
      this.searchData.status = val;
      this.selectAll = false;
      this.selectAllExport = true;
      this.getInitData();
    },
    //分页
    handleSizeChange(val) {
      this.pageParams.page_size = val;
      this.selectAllExport = true;
      this.getInitData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageParams.current_page = val;
      this.selectAllExport = true;
      this.getInitData();
      console.log(`当前页: ${val}`);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectMethod() {
      if (this.selectAllExport) {
        return true;
      } else {
        return false;
      }
    },
    // 手动选中全部
    handleSelectAll(e) {
      if (e) {
        this.$refs.multipleTable.toggleAllSelection();
        setTimeout(() => {
          this.selectAllExport = false;
        }, 20);
      } else {
        this.$refs.multipleTable.clearSelection();
        setTimeout(() => {
          this.selectAllExport = true;
        }, 20);
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
      this.ExportBtnLoading = true;
      exportOrderExcel(params).then((res) => {
        this.ExportBtnLoading = false;
      });
    },
  },
  created() {},
};
</script>

<style scoped lang="less">
.limit-width{
  display: inline-block;
  width: 150px;
  height: 50px;
  overflow: hidden;
}
.content .el-input {
  width: 200px;
  margin-right: 10px;
}
.search_cont {
  margin-bottom: 10px;
  width: 95%;
}
.search_cont label {
  width: 80px;
  display: inline-block;
  text-align: right;
}
.search_cont .el-select {
  margin-right: 10px;
}
.box-card {
  margin-top: 10px;
}
.handle-btn {
  margin-left: 10px;
  margin-bottom: 10px;
}
/deep/ .el-dialog__body {
  padding: 0 30px 20px;
}
.btn-line {
  width: 100%;
  padding-right: 5%;
  display: flex;
  justify-content: space-between;
}
</style>
