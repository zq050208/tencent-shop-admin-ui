<template>
	<div class="content">
		<div class="search_cont">
      <el-form :model="couponForm" :rules="rules" ref="couponForm" label-width="120px" class="demo-ruleForm" style="display:flex;flex-wrap:wrap;">
        <el-form-item label="优惠券名称：" prop="couponName" class="w50">
          <el-input v-model="couponForm.couponName" maxlength="10" :disabled="editDisabled"></el-input>
        </el-form-item>
        <el-form-item label="派发用户类型：" prop="grantUserType" class="w50">
          <el-select v-model="couponForm.grantUserType" class="w200" :disabled="editDisabled">
            <el-option v-for="i in allUserTypeList" :label="i.name" :value="i.id" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发放数量：" prop="stockAmount" class="w50">
          <input type="text" v-model="couponForm.stockAmount" oninput="value=value.replace(/[^\d]/g,'')" class="number_input" :disabled="editDisabled">
          <!-- <el-input v-model="couponForm.stockAmount" @keyup.native="e => checkAmount(e, 'stockAmount')" class="short_input" :disabled="editDisabled"></el-input> -->
          <span class="color_grey">（张）</span>
        </el-form-item>
        <el-form-item label="每人限领数量：" prop="limitAmount" class="w50">
          <input type="text" v-model="couponForm.limitAmount" oninput="value=value.replace(/[^\d]/g,'')" class="number_input" :disabled="editDisabled">
          <!-- <el-input v-model="couponForm.limitAmount" @keyup.native="e => checkAmount(e, 'limitAmount')" class="short_input" :disabled="editDisabled"></el-input> -->
          <span class="color_grey">（张）</span>
        </el-form-item>
        <div class="w50 inlin_block" style="display: flex;">
          <el-form-item label="派发起止时间：" prop="grantBegin">
            <el-date-picker
              v-model="couponForm.grantBegin"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              :disabled="editDisabled"
              placeholder="选择开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label-width="0" prop="grantEnd">
            <el-date-picker
              v-model="couponForm.grantEnd"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59"
              :disabled="editDisabled"
              placeholder="选择结束日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="发放地区：" prop="areaLimitType" class="w100">
          <el-radio-group v-model="couponForm.areaLimitType" size="small" :disabled="editDisabled">
            <el-radio label="all" border>全国</el-radio>
            <el-radio label="special_area" border>指定地区</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" class="w100" v-if="couponForm.areaLimitType === 'special_area'">
          <el-select v-model="couponForm.areaLimitProvinceCode" @change="provinceChange" :disabled="editDisabled">
            <el-option v-for="i in proviencesList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
          </el-select>
          <el-select v-model="couponForm.areaLimitCityCode" @change="cityChange" style="margin-left: 10px;" :disabled="editDisabled">
            <el-option v-for="i in cityList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型：" prop="couponType" class="w100">
          <el-radio-group v-model="couponForm.couponType" size="small" :disabled="editDisabled" @change="couponTypeChange">
            <el-radio label="full_less" border>满减券</el-radio>
            <el-radio label="discount" border>折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" class="w100">
          <div v-if="couponForm.couponType === 'full_less'" class="inline_block">
            满
            <el-form-item label-width="0" class="inline_block" prop="thresholdAmount">
              <input type="text" v-model="couponForm.thresholdAmount" oninput="value=value.replace(/[^\d]/g,'')" class="number_input" :disabled="editDisabled">
              <!-- <el-input v-model="couponForm.thresholdAmount" @keyup.native="e => checkMoneyAmount(e, 'thresholdAmount')" :disabled="editDisabled"></el-input> -->
            </el-form-item> 减
            <el-form-item label-width="0" class="inline_block" prop="cutAmount">
              <input type="text" v-model="couponForm.cutAmount" oninput="value=value.replace(/[^\d]/g,'')" class="number_input" :disabled="editDisabled">
              <!-- <el-input v-model="couponForm.cutAmount"  @keyup.native="e => checkMoneyAmount(e, 'cutAmount')" :disabled="editDisabled"></el-input> -->
            </el-form-item>
            <span class="color_grey">元</span>
          </div>
          <div v-if="couponForm.couponType === 'discount'" class="inline_block">
            满
            <el-form-item label-width="0" class="inline_block" prop="thresholdAmount">
              <input type="text" v-model="couponForm.thresholdAmount" oninput="value=value.replace(/[^\d]/g,'')" class="number_input" :disabled="editDisabled">
              <!-- <el-input v-model="couponForm.thresholdAmount" @keyup.native="e => checkMoneyAmount(e, 'thresholdAmount')" :disabled="editDisabled"></el-input> -->
            </el-form-item> 享&nbsp;
            <el-form-item label-width="0" class="inline_block" prop="cutOff">
              <input type="text" v-model="couponForm.cutOff" oninput="value=value.replace(/[^\d]/g,'')" class="number_input" placeholder="请输入10-99正整数" :disabled="editDisabled">
              <!-- <el-input v-model="couponForm.cutOff" @keyup.native="e => checkAmount(e, 'cutOff')" :disabled="editDisabled"></el-input> -->
            </el-form-item>
            <span class="color_grey">折</span>
          </div>
          <div v-if="couponForm.couponType === 'discount'" class="ml20 inline_block">
            最多优惠&nbsp;
            <el-form-item label-width="0" class="inline_block" prop="maxDiscountAmount">
              <input type="text" v-model="couponForm.maxDiscountAmount" oninput="value=value.replace(/[^\d]/g,'')" class="number_input" :disabled="editDisabled">
              <!-- <el-input v-model="couponForm.maxDiscountAmount"  class="short_input" @keyup.native="e => checkMoneyAmount(e, 'maxDiscountAmount')" :disabled="editDisabled"></el-input> -->
            </el-form-item>
            <span class="color_grey">元</span>
          </div>
        </el-form-item>
        <el-form-item label="有效期：" prop="expireType" class="w100">
          <el-radio-group v-model="couponForm.expireType" size="small" :disabled="editDisabled" @change="expireTypeChange">
            <el-radio label="fix" border>固定期限</el-radio>
            <el-radio label="cached" border>浮动期限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" prop="expireBegin" v-if="couponForm.expireType === 'fix'">
          <el-date-picker
            v-model="couponForm.expireBegin"
            type="datetime"
            :disabled="editDisabled"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="0" prop="expireEnd" v-if="couponForm.expireType === 'fix'">
          <el-date-picker
            v-model="couponForm.expireEnd"
            type="datetime"
            :disabled="editDisabled"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="expireTime" class="w100" v-if="couponForm.expireType === 'cached'">
          <input type="text" v-model="couponForm.expireTime" oninput="value=value.replace(/[^\d]/g,'')" class="number_input" :disabled="editDisabled">
          <!-- <el-input v-model="couponForm.expireTime" class="short_input" @keyup.native="e => checkAmount(e, 'expireTime')" :disabled="editDisabled"></el-input> -->
          <span class="color_grey">（天）用户领取后的有效期</span>
        </el-form-item>
        <el-form-item label="可使用油站：" prop="stationLimitType" class="w100">
          <el-radio-group v-model="couponForm.stationLimitType" size="small" :disabled="editDisabled" @change="usedGasStationChange">
            <el-radio label="all" border>全国</el-radio>
            <el-radio label="special_merchant" border>指定商户</el-radio>
            <el-radio label="special_station" border>指定油站</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" class="w100" prop="stationLimitMerchantId" v-if="couponForm.stationLimitType === 'special_merchant'">
          <!-- <el-select v-model="couponForm.stationLimitMerchantId" multiple placeholder="请选择" class="w200" :disabled="editDisabled">
            <el-option
              v-for="item in merchantList"
              :key="item.id"
              :label="item.merchantName"
              :value="item.id">
            </el-option>
          </el-select> -->
          <el-select
            v-model="couponForm.stationLimitMerchantId"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入商户名称搜索"
            :disabled="editDisabled"
            :remote-method="merchantRemoteMethod"
          >
              <el-option v-for="i in merchantList" :label="i.merchantName" :value="i.id" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" class="w100" prop="stationLimitStationId" v-if="couponForm.stationLimitType === 'special_station'">
          <el-select
            v-model="couponForm.stationLimitStationId"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入油站名称"
            :remote-method="remoteMethod"
            :disabled="editDisabled"
            :loading="loading">
            <el-option
              v-for="item in gasStationList"
              :key="item.id"
              :label="item.stationName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片：" prop="couponDetailImg" ref="image" style="width: 100%;">
          <el-upload
            action="/platform/file/upload"
            list-type="picture-card"
            :headers="header"
            :limit="1"
            :on-success="handleSuccess"
            :on-preview="handlePictureCardPreview"
            :on-exceed="handleExceed"
            :data="{dir: '/platform-manage/logo'}"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            :disabled="editDisabled"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="warn_msg">图片尺寸为850*350，最大为2M的jpg/png图片</div>
        </el-form-item>
        <el-form-item label="优惠说明：" class="w100" prop="couponDescription">
          <el-input v-model="couponForm.couponDescription"
            type="textarea"
            class="w400"
            max-length="15"
            :disabled="editDisabled"
            :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="使用须知：" class="w100" prop="usageNotice">
          <el-input v-model="couponForm.usageNotice"
            type="textarea"
            class="w400"
            max-length="1000"
            :disabled="editDisabled"
            :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="备注：" class="w100">
          <el-input v-model="couponForm.remark"
            type="textarea"
            class="w400"
            :disabled="editDisabled"
            :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status" class="w50">
          <el-radio-group v-model="couponForm.status" size="small">
            <!-- <el-radio label="not_in_use" border>未启用</el-radio> -->
            <el-radio label="in_use" border>启用</el-radio>
            <el-radio label="off_use" border>停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
		</div>
    <div style="padding-left: 120px;"><el-button type="primary" class="button" @click="submit" :loading="submitBtnLoading">提交</el-button></div>
		<div class="dialog" v-show="dialogVisible" @click="hideBigImg">
      <img :src="couponDetailImgUrl" alt="">
    </div>
  </div>
</template>
<script>
import {
  getProvinceList,
  getMerchantNameList,
  addCoupon,
  editCoupon,
  getCouponDetail,
  getAllStationList
} from '@/api/api'
import config from '@/api/config'
import { validNum, regFenToYuan, regYuanToFen, dateToTimeStamp } from '@/utils'
export default {
  inject: ['reload'],
  components: {},
	data(){
		return {
      header: { accessToken: localStorage.getItem('accessToken') },
      tableData: [],
      couponDetailImgUrl: '',
      dialogVisible: false,
      fileList: [],
      rules: {
        couponName: [
					{ required: true, message: '请输入商户名称', trigger: 'blur' },
				],
        grantUserType: [
					{ required: true, message: '请选择派发用户类型', trigger: 'change' },
				],
        areaLimitType: [
					{ required: true, message: '请选择发放地区', trigger: 'change' },
				],
        couponType: [
					{ required: true, message: '请选择发放类型', trigger: 'change' },
				],
        thresholdAmount: [
					{ required: true, message: '请输入消费门槛金额', trigger: 'blur' },
				],
        maxDiscountAmount: [
					{ required: true, message: '请输入最大优惠金额', trigger: 'blur' },
				],
        cutAmount: [
					{ required: true, message: '请输入立减金额', trigger: 'blur' },
				],
        cutOff: [
					{ required: true, message: '请输入立减折扣', trigger: 'blur' },
				],
        expireBegin: [
					{ required: true, message: '请选择发放地区', trigger: 'change' },
				],
        expireEnd: [
					{ required: true, message: '请选择发放地区', trigger: 'change' },
				],
        expireTime: [
					{ required: true, message: '请输入浮动期限', trigger: 'blur' },
				],
        grantBegin: [
					{ required: true, message: '请选择开始时间', trigger: 'change' },
				],
        grantEnd: [
					{ required: true, message: '请选择截止时间', trigger: 'change' },
				],
        expireType: [
					{ required: true, message: '请选择有效期', trigger: 'change' },
				],
        stockAmount: [
					{ required: true, message: '请输入发放数量', trigger: 'blur' },
				],
        limitAmount: [
					{ required: true, message: '请输入限领数量', trigger: 'blur' },
				],
        stationLimitType: [
					{ required: true, message: '请选择可使用油站', trigger: 'change' },
				],
        // stationLimitStationId: [
				// 	{ required: true, message: '请选择可使用油站', trigger: 'change' },
				// ],
        // stationLimitMerchantId: [
				// 	{ required: true, message: '请选择可使用商户', trigger: 'change' },
				// ],
        status: [
					{ required: true, message: '请选择优惠券状态', trigger: 'change' },
				],
        couponDetailImg: [
					{ required: true, message: '请上传图片', trigger: 'change' },
				],
        couponDescription: [
					{ required: true, message: '请输入优惠说明', trigger: 'blur' },
				],
        usageNotice: [
					{ required: true, message: '请输入使用须知', trigger: 'blur' },
				],
      },
      editDisabled: false,
      couponForm: {
        couponName: '', //优惠券名称
        grantUserType: 'all', //用户类型
        areaLimitType: 'all', //发放地区
        areaLimitProvinceCode: '',
        areaLimitProvinceName: '', //省份名称
        areaLimitCityCode: '',
        areaLimitCityName: '', //城市名称
        couponType: 'full_less',
        thresholdAmount: '',
        cutAmount: '',
        cutOff: '',
        maxDiscountAmount: '',
        grantBegin: '',
        grantEnd: '',
        expireType: 'fix', //有效期类型
        expireBegin: '',
        expireEnd: '',
        expireTime: '', //浮动期限
        stockAmount: '', //发放数量
        limitAmount: '', //每人限领数量
        stationLimitType: 'all', //油站限制类型
        stationLimitMerchantId: [], //指定商户
        stationLimitStationId: [], //指定油站
        status: 'off_use', //状态
        couponDescription: '', //优惠说明
        usageNotice: '', //使用须知
        remark: '', //备注
        couponDetailImg: '', //优惠券图片
      },
      gasStationList: [], //指定油站列表
      loading: false,
      proviencesList: [],
      cityList: [],
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
      merchantList: [],
      submitBtnLoading: false,
      file: '', // 上传图片后的二进制文件
    }
  },
  watch: {
    $route:{
      handler(val,oldval){
        if(val.fullPath !== oldval.fullPath){
          this.reload()
        }
      },
      // 深度观察监听
      deep: true
    }
  },
	computed:{
    id(){
      return this.$route.query.id || ''
    }
	},
	mounted(){
    this.getProvinceList()
    if(this.id){
      this.getInitData()
      this.editDisabled = true
    }
	},
	methods:{
		getInitData(){
      let params = {
        id: this.id
      }
			getCouponDetail(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          let tempData = res.respData[0]
          let newData = {
            stationLimitStationId: tempData.stationLimitStationName ? tempData.stationLimitStationName.split(',') : [],
            stationLimitMerchantId: tempData.stationLimitMerchantName ? tempData.stationLimitMerchantName.split(',') : [],
            thresholdAmount: regFenToYuan(tempData.thresholdAmount),
            cutAmount: regFenToYuan(tempData.cutAmount),
            maxDiscountAmount: regFenToYuan(tempData.maxDiscountAmount),
          }
          this.couponForm = { ...tempData, ...newData }
          if(tempData.couponDetailImg){
            this.fileList.push({url: config.UPLOAD_IMG_BASE_URL + tempData.couponDetailImg })
            let addIcon = document.querySelector('.el-upload--picture-card')
            addIcon.style.display = 'none'
          }else{
            this.fileList = []
          }
          let { areaLimitProvinceCode } = this.couponForm
          let params = {
            parentArea: areaLimitProvinceCode,
          }
          getProvinceList(params).then(res => {
            res.respData.unshift({areaCode: '',areaName: '全部'})
            this.cityList = res.respData
          })
        }
      })
    },
    getProvinceList(){
      getProvinceList().then(res => {
        this.proviencesList = res.respData
        // console.log(res)
      })
    },
    //选择省份
    provinceChange(val){
      let obj = []
      obj = this.proviencesList.filter((item) => {
        return item.areaCode == val
      })
      this.couponForm.areaLimitProvinceName = obj[0].areaName
      let params = {
        parentArea: val,
      }
      getProvinceList(params).then(res => {
        res.respData.unshift({areaCode: '',areaName: '全部'})
        this.cityList = res.respData
        this.couponForm.areaLimitCityCode = ''
      })
    },
    //选择城市
    cityChange(val){
      let obj = []
      obj = this.cityList.filter((item) => {
        return item.areaCode == val
      })
      this.couponForm.areaLimitCityName = obj[0].areaName
    },
    //选择可使用油站
    usedGasStationChange(val){
      console.log(val)
      if(val === "all"){
        this.couponForm.stationLimitStationId = []
        this.couponForm.stationLimitMerchantId = []
      } else if(val === "special_merchant"){
        this.couponForm.stationLimitStationId = []
      } else {
        this.couponForm.stationLimitMerchantId = []
      }
    },
    remoteMethod(query) {
      console.log(query)
      if (query !== '') {
        const params = {
          stationName: query
        }
        getAllStationList(params).then(res => {
          this.gasStationList = res.respData
        })
      } else {
        this.gasStationList = [];
      }
    },
    merchantRemoteMethod(val) {
      if(val){
        getMerchantNameList({ merchantName: val }).then(res => {
          this.merchantList = res.respData
        })  
      } else {
        this.merchantList = []
      }
    },
    // 校验数额相关的
    checkAmount(e, type) {
      const val = e.target.value;
      if (val && !validNum(val)) {
        this.couponForm[type] = val.slice(0, -1)
      }
    },
    // 校验金额相关的
    // checkMoneyAmount(e, type) {
    //   const reg = /^\d+\.?\d{0,2}$/;
    //   if (!reg.test(e.target.value)) {
    //     // this.couponForm[type] = e.target.value.slice(0, -1)
    //     this.couponForm[type] = ''
    //   }
    // },
    //上传图片
    handleSuccess(response, file, fileList){
      if(response.bizCode === "SUCCESS"){
        let addIcon = document.querySelector('.el-upload--picture-card')
        addIcon.style.display = 'none'
        this.couponForm.couponDetailImg = response.respData
        this.$refs.image.clearValidate()
      } else {
        this.$message.warning(response.respMsg || '上传失败');
      }
      
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      if(file.response){
        let imgUrl = config.UPLOAD_IMG_BASE_URL + file.response.respData
        this.couponDetailImgUrl = imgUrl
      }else{
        let imgUrl = file.url
        this.couponDetailImgUrl = imgUrl
      }
    },
    beforeAvatarUpload(file) {
      const isSize = new Promise(function(resolve, reject) {
          let width = 850;
          let height = 350;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function() {
            const isLt2M = file.size / 1024 / 1024 < 2;
            let valid = img.width == width && img.height == height;
            (valid && isLt2M) ? resolve() : reject();
          }
          img.src = _URL.createObjectURL(file);
      }).then(() => {
        this.file = file;
          return file;
      }, () => {
          this.$message.error('上传的图片尺寸必须是850*350且不能大于2M!');
          return Promise.reject();
      });
      return  isSize;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一张图片`);
    },
    handleRemove(file, fileList) {
      this.couponForm.couponDetailImg = ''
      let addIcon = document.querySelector('.el-upload--picture-card')
      addIcon.style.display = 'inline-block'
    },
    hideBigImg(){
      this.dialogVisible = false
    },
    couponTypeChange(val){
      this.couponForm.thresholdAmount = ''
      this.couponForm.cutAmount = ''
      this.couponForm.cutOff = ''
      this.couponForm.maxDiscountAmount = ''
    },
    expireTypeChange(val){
      console.log(val)
      if(val === 'cached'){
        this.couponForm.expireBegin = ''
        this.couponForm.expireEnd = ''
      }else{
        this.couponForm.expireTime = ''
      }
    },
    submit(){
      console.log(this.couponForm)
      this.$refs.couponForm.validate((valid) => {
        if (valid) {
          if(this.id){
            // let data = {
            //   id: this.id
            // }
            let editParams = {
              id: this.id,
              status: this.couponForm.status
            }
            editCoupon(editParams).then(res => {
              this.submitBtnLoading = false
              if(res.bizCode === "SUCCESS"){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$router.push('/coupon/couponList')
              }else{
                this.$message({
                  message: res.bizMsg,
                  type: 'error'
                });
              }
            })
          }else{
            if(this.couponForm.stationLimitType === 'special_merchant' && this.couponForm.stationLimitMerchantId.length === 0){
              return this.$message({
                message: '请选择商户',
                type: 'error'
              });
            }
            if(this.couponForm.stationLimitType === 'special_station' && this.couponForm.stationLimitStationId.length === 0){
              return this.$message({
                message: '请选择油站',
                type: 'error'
              });
            }
            if(+this.couponForm.cutAmount > +this.couponForm.thresholdAmount){
              return this.$message({
                message: '优惠金额不能大于满减金额',
                type: 'error'
              });
            }
            if(this.couponForm.cutOff && +(this.couponForm.cutOff < 10 || +this.couponForm.cutOff >= 100)){
              return this.$message({
                message: '折扣额度要在10-99之间',
                type: 'error'
              });
            }
            const { grantBegin, grantEnd, expireBegin, expireEnd } = this.couponForm
            const timeStampGrantBegin = dateToTimeStamp(grantBegin)
            const timeStampGrantEnd = dateToTimeStamp(grantEnd)
            const timeStampExpireBegin = dateToTimeStamp(expireBegin)
            const timeStampExpireEnd = dateToTimeStamp(expireEnd)
            if(timeStampGrantBegin && timeStampGrantEnd && timeStampGrantBegin >= timeStampGrantEnd){
              return this.$message({
                message: '派发开始日期不能晚于结束日期',
                type: 'error'
              });
            }
            if(timeStampExpireBegin && timeStampExpireEnd && timeStampExpireBegin >= timeStampExpireEnd){
              return this.$message({
                message: '固定期限开始日期不能晚于结束日期',
                type: 'error'
              });
            }
            if(timeStampGrantEnd && timeStampExpireEnd && timeStampGrantEnd > timeStampExpireEnd){
              return this.$message({
                message: '派发截至时间不能晚于有效期的截至时间',
                type: 'error'
              });
            }
            this.submitBtnLoading = true
            let params = {
              ...this.couponForm,
              couponDetailImg: this.couponForm.couponDetailImg,
              stationLimitMerchantId: this.couponForm.stationLimitMerchantId ? this.couponForm.stationLimitMerchantId.join(',') : '',
              stationLimitStationId: this.couponForm.stationLimitStationId ? this.couponForm.stationLimitStationId.join(',') : '',
              thresholdAmount: regYuanToFen(this.couponForm.thresholdAmount),
              cutAmount: regYuanToFen(this.couponForm.cutAmount),
              maxDiscountAmount: regYuanToFen(this.couponForm.maxDiscountAmount),
            }
            const formData = new FormData();
            Object.keys(params).forEach((key) => {
              formData.append(key, params[key]);
            });
            formData.append('file', this.file)
            addCoupon(formData).then(res => {
              this.submitBtnLoading = false
              if(res.bizCode === "SUCCESS"){
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.file = '';
                this.$router.push('/coupon/couponList')
              }else{
                this.$message({
                  message: res.bizMsg,
                  type: 'error'
                });
              }
            })
          }
        }else{
          this.$message({
            message: '您有必填项未输入',
            type: 'error'
          });
        }
      })
    },

	},
	created(){


	}
}
</script>

<style scoped lang="less">
	.content .el-input{
		width: 200px;
		margin-right: 10px;
  }
  .warn_msg{
    color: #ccc;
  }
  // .content  .short_input{
  //   width: 100px;
  // }
  .mt25{
    margin-top: 25px;
  }
  .ml20{
    margin-left: 20px;
  }
  .w50{
    width: 50%;
  }
  .w100{
    width: 100%;
  }
  .inline_block{
    display: inline-block;
  }
  .w200{
    width: 200px;
  }
  .w400{
    width: 400px;
  }
  .content /deep/ .el-upload-list--picture-card .el-upload-list__item{
    width: 425px;
    height: 175px;
  }
  .color_grey{
    color: #999999;
    margin-left: 10px;
  }
  .dialog{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    img{
      // width: 850px;
      // height: 350px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 11;
    }
  }
  .content /deep/ .el-upload--picture-card{
    width: 100px;
    height: 50px;
    line-height: 54px;
  }
  // .content  /deep/ .el-upload--picture-card{
  //   height: 50px;
  //   position: relative;
  //   .el-icon-plus{
  //     position: absolute;
  //     top: 11px;
  //     left: 49px;
  //   }
  // }
	.search_cont{
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    .item{
      width: 25%;
      label{
        display: block;
        padding: 10px 0;
      }
    }
    .item_long{
      width: 50%;
    }
  }
  .button{
    width: 100px;
  }
</style>
