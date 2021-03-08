<template>
  <div class="agent content">
    <el-card class="search_cont box-card">
      <label>券包名称：</label><el-input v-model="searchData.packageName" placeholder=""></el-input>
      <label style="margin-left: 10px;">状态：</label>
      <el-select v-model="searchData.status" @change="couponStatusChange">
        <el-option v-for="i in couponStatus" :label="i.name" :value="i.id" :key="i.id"></el-option>
      </el-select>
      <label style="margin-left: 10px;">可使用地区：</label>
      <el-select v-model="provinceCode" @change="provinceChange" clearable>
        <el-option v-for="i in provincesList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
      </el-select>
      <el-select v-model="cityName" @change="cityChange" style="margin-left: 10px;" clearable>
        <el-option v-for="i in cityList" :label="i.areaName" :value="i.areaName" :key="i.areaCode"></el-option>
      </el-select>
      <el-button type="primary" class="anniu" @click="search" style="margin-left:10px;">搜索</el-button>
      <div style="margin-top: 10px">
        <el-button type="primary"  class="anniu" @click="addCouponPack">添加优惠券包</el-button>
      </div>
    </el-card>
    <div class="table">
      <el-table
          :data="tableData"
          border
          style="width: 95%"
          v-loading="loading"
      >
        <el-table-column
            prop="id"
            label="券包id"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="packageName"
            label="名称"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="packageContent"
            label="种类"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="salePrice"
            label="售价(元)"
            align="center"
            :formatter="(row, column, cellValue, index) => getYuan(cellValue)"
        >
        </el-table-column>
        <el-table-column
            prop="availableArea"
            label="可使用地区"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            align="center"
            :formatter="(row, column, cellValue, index) => {
              switch (cellValue) {
                case 'in_use':
                  return '启用';
                case 'off_use':
                  return '停止';
                default:
                  return '';
              }
            }"
        >
        </el-table-column>
        <el-table-column
            prop="packageSaleCount"
            label="购买量"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="updateTime"
            label="最近更新时间"
            align="center"
        >
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            width="230"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editRow(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteRow(scope.$index,scope.row)">删除</el-button>
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
  queryPackageList,
  deletePackage,
  getProvinceList,
} from '@/api/api'
import { regFenToYuan } from '@/utils'
export default {
  data (){
    return {
      loading: false,
      searchData: {
        packageName: '',
        status: '',
        availableArea: '',
      },
      provinceCode: '',
      cityName: '',
      tableData: [],
      pageParams: {
        current_page: 1,
        page_size: 10,
        total: 0
      },
      couponStatus: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '启用',
          id: 'in_use'
        },
        {
          name: '停止',
          id: 'off_use'
        },
      ],
      provincesList: [],
      cityList: [],
      // 四个直辖市的编码
      provinceCity: [
        {
          areaCode: '110000',
          areaName: '北京市',
        },
        {
          areaCode: '120000',
          areaName: '天津市',
        },
        {
          areaCode: '310000',
          areaName: '上海市',
        },
        {
          areaCode: '500000',
          areaName: '重庆市',
        },
      ],
    }
  },
  created(){
    
  },
  mounted(){
    this.init()
  },
  methods: {
    async init () {
      await getProvinceList().then(res => {
        this.provincesList = res.respData
      })
      this.getInitData()
    },
    getInitData(val) {
      // 北京 110000 天津 120000 上海 310000 重庆 500000
      // val  是对应省份或者城市的名字
      if (val) {
        this.searchData.availableArea = val;
      }
      const params = {
        ...this.searchData,
        current: this.pageParams.current_page,
        size: this.pageParams.page_size,
      }
      queryPackageList(params).then(res => {
        if (res.bizCode === 'SUCCESS') {
          const { size, total } = res.respData
          this.tableData = res.respData.list
          this.pageParams.page_size = size
          this.pageParams.total = total
        } else {
          this.$message({
            message: res.bizMsg || '查询失败，请稍后重试',
            type: 'error'
          });
        }
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
    },
    // 售价 分转为 元
    getYuan(val) {
      if(val){
        return regFenToYuan(val)
      }
      return ''
    },
    //审核状态
    couponStatusChange(val){
      this.searchData.status = val
      this.getInitData()
    },
    //搜索
    search(){
      this.pageParams.current_page = 1
      this.getInitData()
    },
    // 跳转至添加优惠券包
    addCouponPack(){
      this.$router.push('/coupon/addCouponPack')
    },
    // 编辑优惠券包
    editRow(index, row) {
      this.$router.push({path: '/coupon/addCouponPack', query: { couponId: row.id }})
    },
    //删除
    deleteRow(index,row){
      let params = {
        id: row.id,
      }
      this.$confirm("确定删除吗", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(()=>{
        this.loading = true;
        deletePackage(params).then(res => {
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
    getProvinceList(){
      getProvinceList().then(res => {
        this.provincesList = res.respData
      })
    },
    //切换省份
    provinceChange(val){
      this.provinceCode = val;
      this.cityName = '';
      this.cityList = [];
      if (val) {
        if (this.provinceCity.find(i => i.areaCode === val)) {
          this.getInitData(this.provinceCity.find(i => i.areaCode === val).areaName);
        } else {
          this.getInitData(this.provincesList.find(i => i.areaCode === val).areaName);
        }
        // 获取对应的城市列表
        getProvinceList({ parentArea: val }).then(res => {
          this.cityList = res.respData
        })
      } else {
        this.searchData.availableArea = '';
        this.getInitData();
      }
    },
    // 切换城市
    // 这里的val是对应的areaName,因为切换城市要马上搜索，而availableArea入参是中文
    cityChange(val) {
      if (val) {
        this.searchData.availableArea = val
      } else {
        this.searchData.availableArea = this.provincesList.find(i => i.areaCode === this.provinceCode).areaName
      }
      const codeArr = ['110000', '120000', '310000', '500000'];
      if (codeArr.indexOf(this.provinceCode) !== -1) {
        return;
      } else {
        this.getInitData(this.searchData.availableArea)
      }
    }
  }
}
</script>

<style scoped lang="less">
  .agent .el-input{
    width: 200px;
    margin-right: 10px;
  }
  .search_cont{
    margin-bottom: 10px;
    width: 95%;
  }
</style>
