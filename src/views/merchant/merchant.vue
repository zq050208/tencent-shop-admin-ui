<template>
    <div class="content">
      <el-card class="search_cont box-card">
        <el-row>
          <label>商品编号：</label
          ><el-input v-model="searchData.merchantNo" placeholder="" class="search-input"></el-input>
          <label>商品名称：</label><el-input v-model="searchData.merchantName" placeholder="" class="search-input"></el-input>
          <label>商品状态：</label>
          <el-select v-model="searchData.status" @change="statusTypeChange" class="search-input">
            <el-option
              v-for="i in statusTypes"
              :label="i.name"
              :value="i.value"
              :key="i.value"
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
      <!-- table表格 -->
      <div class="table">
        <div class="add-btn-line"><el-button type="primary">添加商户</el-button></div>
        <el-table
          :data="tableData"
          :loading="loading"
          border
          :header-cell-style="{
            'background-color': '#fff',
          }"
        >
          >
          <el-table-column
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
          <el-table-column label="操作" width="230" align="center">
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
    </div>
</template>

<script>
    
export default {
	data(){
		return {
			searchData: {
        merchantNo: '',
        merchantName: '',
        status: ''
      },
      statusTypes: [
        {name: '全部', value: 0 },
        {name: '已上架', value: 1 },
        {name: '待上架', value: 2 },
        {name: '已失效', value: 3 },
      ],
      tableData: [],
      loading: false,
      pageParams: {
        current_page: 1,
        page_size: 10,
        total: 0,
      },
		}
	},
	computed:{
		
  },
  mounted(){
		
	},
	methods:{
    getInitData(){

    },
    statusTypeChange(val){

    },
    search(){

    }
	},
	created(){

	},
}
</script>

<style scoped lang="scss">
.search-input{
  width: $searchInputWidth;
  height: $searchInputHeight;
}
    

</style>
