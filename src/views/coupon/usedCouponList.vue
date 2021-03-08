<template>
  <div class="agent content">
		<el-card class="search_cont box-card">
      <label style="margin-left: 10px;">优惠券批次ID：</label><el-input v-model="searchData.couponStockId" placeholder=""></el-input>
      <label style="margin-left: 10px;">code码：</label><el-input v-model="searchData.couponCode" placeholder=""></el-input>
      <label style="margin-left: 10px;">状态：</label>
      <el-select v-model="searchData.status" @change="couponStatusChange">
        <el-option v-for="i in allcouponStatus" :label="i.name" :value="i.id" :key="i.id"></el-option>
      </el-select>
			<el-button type="primary" class="anniu" @click="search" style="margin-left: 10px;">搜索</el-button>
		</el-card>
    <el-card class="search_cont box-card" v-if="isShowStatic">
      <span class="ml10">发放总量：{{ statics.grantAmount || 0 }}</span>
      <span class="ml10">已领取：{{ statics.receiveAmount || 0}}</span>
      <span class="ml10">待领取：{{ statics.waitingReceiveAmount || 0}}</span>
      <span class="ml10">已消费：{{ statics.consumeAmount || 0}}</span>
      <span class="ml10">待消费：{{ statics.waitingConsumeAmount || 0}}</span>
      <span class="ml10">已过期：{{ statics.expiredAmount || 0}}</span>
    </el-card>
		<div class="table">
			<el-table
				:data="tableData"
				border
				style="width: 95%">
				<el-table-column
					prop="couponStockId"
					label="优惠券批次ID"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="couponCode"
					label="code码"
					align="center"
					>
				</el-table-column>
        <el-table-column
					prop="status"
					label="状态"
					align="center"
					width="80"
					>
					<template slot-scope="scope">
						<span v-if="scope.row.status === 'not_consume'">待销费</span>
						<span v-if="scope.row.status === 'consumed'">已消费</span>
						<span v-if="scope.row.status === 'expired'">已过期</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="consumeTime"
					label="消费时间"
					align="center"
					>
				</el-table-column>
        <el-table-column
					label="派发起止时间"
					align="center"
					>
					<template slot-scope="scope">
						<div>{{scope.row.grantBegin}}</div>
						<div>{{scope.row.grantEnd}}</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="couponContent"
					label="券种类"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="expireEnd"
					label="过期时间"
					align="center"
					>
				</el-table-column>
        <el-table-column
					prop="transactionPrice"
					label="客单价（元）"
					align="center"
					>
				</el-table-column>
        <el-table-column
					prop="transactionNo"
					label="订单号"
					align="center"
					>
				</el-table-column>
        <el-table-column
					prop="accountId"
					label="用户ID"
					align="center"
					>
				</el-table-column>
        <!-- <el-table-column label="操作" width="230" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="pass(scope.row, 1)" :disabled="scope.row.couponStatus == 1 || scope.row.couponStatus == 3">通过</el-button>
						<el-button size="mini" type="danger"  @click="pass(scope.row, 3)" :disabled="scope.row.couponStatus == 1 || scope.row.couponStatus == 3">不通过</el-button>
					</template>
				</el-table-column> -->
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
import { 
	getUsedCouponList,
	getCouponStatistics
} from '@/api/api'
import config from '@/api/config'
import { regFenToYuan } from '@/utils'
export default {
	data(){
		return {
      searchData: {
        status: '',
				couponStockId: '',
				couponCode: ''
			},
			statics: {},
      allcouponType: [
				{
          name: '全部',
          id: ''
        },
        {
          name: '满减券',
          id: 1
        },
        {
          name: '折扣券',
          id: 2
        },
      ],
      allcouponStatus: [
				{
          name: '全部',
          id: ''
        },
				{
					name: '已消费',
					id: 'consumed'
				},
        {
          name: '待消费',
          id: 'not_consume'
        },
        {
          name: '已过期',
          id: 'expired'
        },
			],
			imgBaseUrl: config.UPLOAD_IMG_BASE_URL,
			tableData: [],
			pageParams: {
				current_page: 1,
				page_size: 10,
				total: 0
			},
			isShowStatic: false
		}
	},
	computed:{
		id(){
			return this.$route.query.id || ''
		}
	},
	mounted(){
		if(this.id){
			this.isShowStatic = true
			this.searchData.couponStockId = this.id
		}
		this.getInitData()
	},
	methods:{
		async getInitData(){
			await getCouponStatistics(this.searchData).then(res => {
				if(res.bizCode === "SUCCESS"){
					this.statics = res.respData
				}
			})
			const params = {
				...this.searchData,
				current: this.pageParams.current_page,
				size: this.pageParams.page_size
			}
			getUsedCouponList(params).then(res => {
				if(res.bizCode === "SUCCESS"){
					res.respData.list.forEach(item => {
						item.transactionPrice = regFenToYuan(item.transactionPrice)
					});
					this.tableData = res.respData.list
					this.pageParams.page_size = res.respData.pageSize
					this.pageParams.total = res.respData.total
				}
			})
    },
    //审核状态
    couponStatusChange(val){
			this.searchData.status = val
			this.getInitData()
    },
		//搜索
		search(){
			this.pageParams.current_page = 1
			if(this.searchData.couponStockId){
				this.isShowStatic = true
			}else{
				this.isShowStatic = false
			}
			this.getInitData()
    },
		handleSizeChange(val) {
			this.pageParams.current_page = 1
			this.pageParams.page_size = val
			this.getInitData()
		},
		handleCurrentChange(val) {
			this.pageParams.current_page = val
			this.getInitData()
			// console.log(`当前页: ${val}`);
		}

	},
	created(){
		
	}
}
</script>

<style scoped>
  .agent .el-input{
		width: 200px;
		margin-right: 10px;
	}
  .ml10{
    margin-left: 10px;
  }
  .content /deep/ .el-card__body{
    width: 100%;
  }
	.search_cont{
    display: flex;
		margin-bottom: 10px;
		width: 95%;
	}
	.add_antenna_popup{
		position: absolute;
		top: 0;
		left: 0;
	}
	.el-form-item{
		width: 50%;
	}
	.item-status{
		display: inline-block;
		padding: 5px;
		border: 1px solid #eee;
		border-radius: 5px;
		margin-left: 2px;
		margin-top: 2px;
	}
	.item-status.active{
		background: #409EFF;
		color: #ffffff;
	}
	.td_img{
		width: 50px;
		/* height: 50px; */
	}
</style>

