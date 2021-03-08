<template>
  <div class="agent content">
		<el-card class="search_cont box-card">
			<el-row>
				<el-col :span="8">
					<label class="w120">券种类：</label>
					<el-select v-model="searchData.couponType" @change="couponTypeChange" class="w200">
						<el-option v-for="i in allcouponType" :label="i.name" :value="i.id" :key="i.id"></el-option>
					</el-select>
				</el-col>
				<el-col :span="8">
					<label class="w120" style="margin-left: 10px;">用户类型：</label>
					<el-select v-model="searchData.grantUserType" class="w200">
            <el-option v-for="i in allUserTypeList" :label="i.name" :value="i.id" :key="i.id"></el-option>
          </el-select>
				</el-col>
				<el-col :span="8">
					<label  class="w120" style="margin-left: 10px;">状态：</label>
					<el-select v-model="searchData.status" @change="couponStatusChange" class="w200">
						<el-option v-for="i in allcouponStatus" :label="i.name" :value="i.id" :key="i.id"></el-option>
					</el-select>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col :span="8" style="margin-top: 10px;">
      		<label  class="w120">券名称：</label>
					<el-input v-model="searchData.couponName" placeholder="" class="w200"></el-input>
				</el-col>
				<el-col :span="16">
					<label  class="w120" style="margin-left: 10px;">派发日期：</label> 
					<el-date-picker
						v-model="searchData.grantBegin"
						type="date"
						value-format="yyyy-MM-dd"
						width="200"
						placeholder="开始日期">
					</el-date-picker>
					<el-date-picker
						v-model="searchData.grantEnd"
						type="date"
						value-format="yyyy-MM-dd"
						width="200"
						placeholder="结束日期">
					</el-date-picker>
					<el-button type="primary" class="anniu" @click="search" style="margin-left: 10px;">搜索</el-button>
					<el-button type="primary" class="anniu" @click="addCoupon" style="margin: 10px;">添加优惠券</el-button>
				</el-col>
			</el-row>
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
					<template slot-scope="scope">
						<span @click="viewCouponStockDetail(scope.row)" class="pointer_style">{{scope.row.couponStockId}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="couponName"
					label="名称"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="grantUserType"
					label="用户类型"
					align="center"
					>
          <template slot-scope="scope">
						<span v-if="scope.row.grantUserType === 'all'">全体用户</span>
						<span v-if="scope.row.grantUserType === 'new'">新用户</span>
						<span v-if="scope.row.grantUserType === 'old'">老用户</span>
						<span v-if="scope.row.grantUserType === 'activation'">激活用户</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="couponType"
					label="券种类"
					align="center"
					>
          <template slot-scope="scope">
						<span v-if="scope.row.couponType === 'full_less'">满减券</span>
						<span v-if="scope.row.couponType === 'discount'">折扣券</span>
					</template>
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
					prop="status"
					label="状态"
					align="center"
					width="70"
					>
					<template slot-scope="scope">
						<!-- <span v-if="scope.row.status === 'not_in_use'">未启用</span> -->
						<span v-if="scope.row.status === 'in_use'">启用</span>
						<span v-if="scope.row.status === 'off_use'">停用</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="stockAmount"
					label="发放总量"
					align="center"
					>
				</el-table-column>
        <el-table-column
					label="余量"
					align="center"
					>
					<template slot-scope="scope">
						<span>{{scope.row.stockAmount - scope.row.outAmount}}</span>
					</template>
				</el-table-column>
        <el-table-column
					prop="updateTime"
					label="最近更新时间"
					align="center"
					>
				</el-table-column>
        <el-table-column label="操作" width="230" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
						<el-button size="mini" type="danger"  @click="delCoupon(scope.row)">删除</el-button>
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
import { 
	getCouponList,
	deleteCoupon
} from '@/api/api'
// import config from '@/api/config'
export default {
	data(){
		return {
      searchData: {
        grantBegin: '',
        grantEnd: '',
        status: '',
				couponType: '',
				grantUserType: 'all',
        couponName: ''
      },
      allcouponType: [
				{
          name: '全部',
          id: ''
        },
        {
          name: '满减券',
          id: 'full_less'
        },
        {
          name: '折扣券',
          id: 'discount'
        },
			],
			allUserTypeList: [
        {
          name: '全体用户',
          id: 'all',
        },
        {
          name: '新用户',
          id: 'new',
        },
        {
          name: '老用户',
          id: 'old',
        },
        {
          name: '激活用户',
          id: 'activation',
        },
      ],
      allcouponStatus: [
				{
          name: '全部',
          id: ''
        },
				// {
				// 	name: '未启用',
				// 	id: 'not_in_use'
				// },
        {
          name: '启用',
          id: 'in_use'
        },
        {
          name: '停用',
          id: 'off_use'
        },
			],
			tableData: [],
			pageParams: {
				current_page: 1,
				page_size: 10,
				total: 0
			}
		}
	},
	computed:{
		
	},
	mounted(){
		this.getInitData()
	},
	methods:{
		getInitData(){
			const params = {
				...this.searchData,
				current: this.pageParams.current_page,
				size: this.pageParams.page_size
			}
			getCouponList(params).then(res => {
				if(res.bizCode === "SUCCESS"){
					this.tableData = res.respData.list
					this.pageParams.page_size = res.respData.size
					this.pageParams.total = res.respData.total
				}
			})
    },
    //添加优惠券	
    addCoupon(){
      // this.$router.push('/addCoupon')
      this.$router.push({path: '/coupon/addCoupon'})
    },
    //券种类
    couponTypeChange(val){
			this.searchData.couponType = val
			this.pageParams.current_page = 1
			this.getInitData()
    },
    //审核状态
    couponStatusChange(val){
			this.searchData.status = val
			this.pageParams.current_page = 1
			this.getInitData()
    },
		//搜索
		search(){
      // console.log(this.searchData.startDate)
			this.pageParams.current_page = 1
			this.getInitData()
		},
		viewCouponStockDetail(row){
			this.$router.push({path: '/coupon/usedCouponList', query: {id: row.couponStockId}})
		},
		edit(row){
			this.$router.push({path: '/coupon/addCoupon', query: {id: row.id}})
		},
		delCoupon(row){
			this.$confirm("是否确认删除该批次优惠券，一经删除将无法恢复", "提示", {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(()=>{
				let params = {
					id: row.id
				}
				deleteCoupon(params).then(res => {
					if(res.bizCode === "SUCCESS"){
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						if(this.tableData.length === 1 && this.pageParams.current_page != 1){
							this.pageParams.current_page--
						}
						this.getInitData()
					}
				})
			})
		},
		handleSizeChange(val) {
			this.pageParams.current_page = 1
			this.pageParams.page_size = val
			this.getInitData()
			// console.log(`每页 ${val} 条`);
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
	.w120{
		display: inline-block;
		text-align: right;
		width: 90px;
	}
  .content /deep/ .el-card__body{
    width: 100%;
  }
	.search_cont{
    display: flex;
		margin-bottom: 10px;
		width: 95%;
	}
	.content .pointer_style{
		cursor: pointer;
		color: #409EFF;
	}
	.el-form-item{
		width: 50%;
	}
</style>

