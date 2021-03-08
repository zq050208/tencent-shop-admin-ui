<template>
    <div class="content">
        <div class="search_cont">
            <el-form :model="couponForm" :rules="rules" ref="couponForm" label-width="120px" class="couponForm">
                <div class="el-form-item-div">
                    <el-form-item label="优惠券包名称：" prop="packageName">
                        <el-input v-model="couponForm.packageName" maxlength="10" :disabled="editDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="副标题：" prop="packageSubTitle">
                        <el-input v-model="couponForm.packageSubTitle" maxlength="10" :disabled="editDisabled"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="优惠券包图片：" prop="packageUrl" style="width: 50%;">
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
                                :on-remove="handleRemove"
                                v-show="!editDisabled"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <img :src="couponForm.packageUrl" v-show="editDisabled" alt="">
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="imgUrl" alt="">
                        </el-dialog>
                        <span style="color: #ccc">上传图片大小为390*234</span>
                    </el-form-item>

                    <el-form-item label="优惠券图片：" prop="stockDetailImgUrl" ref="image" style="width: 100%;">
                      <el-upload
                        action="/platform/file/upload"
                        list-type="picture-card"
                        :headers="header"
                        :limit="1"
                        :on-success="handleSuccess1"
                        :on-preview="handlePictureCardPreview1"
                        :on-exceed="handleExceed1"
                        :data="{dir: '/platform-manage/logo'}"
                        :before-upload="beforeAvatarUpload1"
                        :file-list="fileList1"
                        :disabled="editDisabled"
                        :on-remove="handleRemove1">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      <div class="warn_msg">图片尺寸为850*350，最大为2M的jpg/png图片</div>
                    </el-form-item>

                </div>
                <div>
                    <div v-for="(item, index) in couponForm.couponList" :key="index" style="margin-top: 5px;">
                        <el-form-item :label="index === 0 ? '类型：' : ''" v-show="item.couponType === 'full_less'" :class="index === 0? 'showRedDot' : ''">
                            <el-checkbox label="full_less" v-model="item.isUse" border :disabled="editDisabled">满减券</el-checkbox>
                            满
                            <el-input v-model="item.thresholdAmount" :disabled="editDisabled"></el-input>
                            <span class="discount_text">减</span>
                            <el-input v-model="item.cutAmount" oninput="value=value.replace(/[^\d]/g,'')" :disabled="editDisabled"></el-input>
                            <span class="input_unit">(元)</span>
                            数量
                            <el-input v-model="item.couponCount" oninput="value=value.replace(/[^\d]/g,'')" :disabled="editDisabled"></el-input>
                            <span class="input_unit">(张)</span>
                        </el-form-item>
                        <el-form-item :label="index === 0 ? '类型：' : ''" v-show="item.couponType === 'discount'">
                            <el-checkbox label="discount" v-model="item.isUse" border :disabled="editDisabled">折扣券</el-checkbox>
                            满
                            <el-input v-model="item.thresholdAmount" :disabled="editDisabled"></el-input>
                            <span class="discount_text">享</span>
                            <el-input placeholder="10-99" v-model="item.cutOff" oninput="value=value.replace(/[^\d]/g,'')" :disabled="editDisabled"></el-input>
                            <span class="input_unit">
                            (折)
                                    <el-tooltip effect="dark" content="请输入10-99的整数，80代表8.0折" placement="top" >
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </span>
                            <div class="max_count" v-if="item.isUse">
                                最多优惠
                                <el-input v-model="item.maxDiscountAmount" oninput="value=value.replace(/[^\d]/g,'')" :disabled="editDisabled"></el-input>
                                数量
                                <el-input v-model="item.couponCount" oninput="value=value.replace(/[^\d]/g,'')" :disabled="editDisabled"></el-input>
                                <span class="input_unit">(张)</span>
                            </div>
                        </el-form-item>
                    </div>
                </div>
                <div class="el-form-item-div">
                    <el-form-item label="原价：" prop="originPrice">
                        <el-input v-model="couponForm.originPrice" :disabled="editDisabled" @keyup.native="e => checkMoneyAmount(e, 'originPrice')"></el-input>
                    </el-form-item>
                    <el-form-item label="售价：" prop="salePrice">
                        <el-input v-model="couponForm.salePrice" :disabled="editDisabled" @keyup.native="e => checkMoneyAmount(e, 'salePrice')"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="使用说明：" prop="useInfo">
                    <el-input
                        type="textarea"
                        maxlength="1000"
                        style="width: 530px"
                        :rows="4"
                        v-model="couponForm.useInfo"
                        :disabled="editDisabled"
                        :placeholder="useInfoText"
                    >

                    </el-input>
                </el-form-item>
                <div class="el-form-item-div">
                    <el-form-item label="有效期：" prop="expireTime">
                        <el-input v-model="couponForm.expireTime" placeholder="(天)用户购买后的有效期" :disabled="editDisabled" @keyup.native="e => checkAmount(e, 'expireTime')"></el-input>
                    </el-form-item>
                    <el-form-item label="每人限购次数：" prop="limitAmount">
                        <el-input v-model="couponForm.limitAmount" :disabled="editDisabled" @keyup.native="e => checkAmount(e, 'limitAmount')"></el-input>
                        <span class="input_unit">(次)</span>
                    </el-form-item>
                </div>
                <el-form-item label="可使用油站：" prop="stationLimitType">
                    <el-radio-group v-model="couponForm.stationLimitType" size="small" :disabled="editDisabled" @change="usedGasStationChange">
                        <el-radio label="all" border>全部</el-radio>
                        <el-radio label="special_merchant" border>指定商户</el-radio>
                        <el-radio label="special_station" border>指定油站</el-radio>
                    </el-radio-group>
                    <div>
                        <el-form-item prop="stationLimitMerchantId"  v-if="couponForm.stationLimitType === 'special_merchant'">
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
                    </div>
                    <div v-if="couponForm.stationLimitType === 'special_station'">
                        <el-form-item prop="stationLimitStationId">
                            <el-select
                               @change="gasChange"
                               v-model="couponForm.stationLimitStationId"
                               multiple
                               filterable
                               remote
                               reserve-keyword
                               placeholder="请输入油站名称搜索"
                               :disabled="editDisabled"
                               :remote-method="gasRemoteMethod"
                            >
                                <el-option v-for="i in stationList" :label="i.stationName" :value="i.id" :key="i.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form-item>
                <div class="el-form-item-div">
                    <el-form-item label="可使用地区：" prop="areaLimitType" >
                        <el-radio-group v-model="couponForm.areaLimitType" size="small" :disabled="editDisabled">
                            <el-radio label="all" border>全国</el-radio>
                            <el-radio label="special_area" border>指定地区</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status" >
                        <el-radio-group v-model="couponForm.status" size="small" >
                            <el-radio label="in_use" border>启用</el-radio>
                            <el-radio label="off_use" border>停用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <el-form-item label="" style="width: 100%;" v-show="couponForm.areaLimitType === 'special_area'">
                    <el-select v-model="couponForm.areaLimitProvinceCode" @change="provinceChange" :disabled="editDisabled">
                        <el-option v-for="i in provincesList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
                    </el-select>
                    <el-select v-model="couponForm.areaLimitCityCode" @change="cityChange" style="margin-left: 10px;" :disabled="editDisabled">
                        <el-option v-for="i in cityList" :label="i.areaName" :value="i.areaCode" :key="i.areaCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="submit('couponForm')">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
  import { packageDetail, upload, getProvinceList, getMerchantNameList, savePackage, updatePackage, getAllStationList } from '@/api/api'
  import config from '@/api/config'
  import { validNum, regFenToYuan, regYuanToFen } from '@/utils'
  export default {
  inject: ['reload'],
  components: {},
  data() {
    return {
      header: { accessToken: localStorage.getItem('accessToken') },
      editDisabled: false, // 是否禁止编辑，对于已经启用的或启用过的券包，只能更改状态
      loading: false,
      useInfoText: "示例：\n1、只能使用3次。\n2、消费满100使用。",
      rules: {
        packageName: [
          { required: true, message: '请输入券包名称', trigger: 'blur' }
        ],
        packageSubTitle: [
          { required: true, message: '请输入副标题', trigger: 'blur'  }
        ],
        // couponType: [{ required: true, message: '请选择券包类型', trigger: 'blur'  }],
        // thresholdAmount: [{ required: true, message: '请输入消费门槛金额', trigger: 'blur'  }],
        // cutAmount: [{ required: true, message: '请输入立减金额', trigger: 'blur'  }],
        // cutOff:[{ required: true, message: '请输入折扣数额', trigger: 'blur'  }], // 享xx折
        // maxDiscountAmount: [ { required: true, message: '请输入最多优惠金额', trigger: 'blur'  }],
        // fullLessCouponCount: [{ required: true, message: '请输入数量', trigger: 'blur'  }],
        // discountCouponCount: [{ required: true, message: '请输入数量', trigger: 'blur'  }],
        useInfo: [
          { required: true, message: '请输入使用说明', trigger: 'blur'  }
        ],
        areaLimitType: [
          { required: true, message: '请选择可使用地区', trigger: 'blur'  }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur'  }
        ],
        packageUrl: [
          { required: true, message: '请上传图片', trigger: 'blur'  }
        ],
        stockDetailImgUrl: [
          { required: true, message: '请上传图片', trigger: 'blur'  }
        ],
        salePrice: [
          { required: true, message: '请输入售价', trigger: 'blur'  }
        ],
        originPrice: [
          { required: true, message: '请输入原价', trigger: 'blur'  }
        ],
        expireTime: [
          { required: true, message: '请输入有效期', trigger: 'blur'  }
        ],
        limitAmount: [
          { required: true, message: '请输入每人限购次数', trigger: 'blur'  }
        ],
        stationLimitType: [
          { required: true, message: '请选择可使用油站', trigger: 'blur'  }
        ],
      }, // 校验必填规则
      merchantList: [], // 商户下拉数据
      stationList: [], // 油站下拉数据
      provincesList: [],
      cityList: [],
      couponForm: {
        packageName: '',
        packageSubTitle: '',
        salePrice: '',
        originPrice: '',
        useInfo: '',
        expireTime: '',
        limitAmount: '',
        stationLimitMerchantId: '',
        stationLimitStationId: '',
        // stationLimitStationName: '',
        areaLimitType: 'all', // 地区限制类型，all：不限制，special_area:指定地区,
        areaLimitProvinceCode: '',
        areaLimitCityCode: '',
        status: 'off_use', // in_use:正在使用，off_use:停用
        packageUrl: '',
        stockDetailImgUrl: '',
        stationLimitType: 'all', // 油站限制类型，all：不限制，special_merchant:指定商户,special_station:指定油站
        areaLimitProvinceName: '',
        areaLimitCityName: '',
        couponList: [
          {
            couponType: 'full_less',
            thresholdAmount: '',
            cutAmount: '', // 减xx元
            cutOff:'', // 享xx折
            maxDiscountAmount: '',
            couponCount: '', // 张数
            isUse: false,
          },
          {
            couponType: 'discount',
            thresholdAmount: '',
            cutAmount: '', // 减xx元
            cutOff:'', // 享xx折
            maxDiscountAmount: '',
            couponCount: '', // 张数
            isUse: false,
          },
        ]
      },
      imgUrl: '',
      fileList: [],
      fileList1: [],
      dialogVisible: false,
      packageFile: '', //优惠券包图片文件
      couponFile: '', //优惠券图片文件
    }
  },
  mounted(){
    this.getProvinceList();
    if(this.couponId) {
      this.getInitData();
    }
  },
  computed: {
    couponId(){
      return this.$route.query.couponId || ''
    }
  },
  methods: {
    // 初始化获取数据
    getInitData(){
      let params = {
        id: this.couponId
      };
      packageDetail(params).then(res => {
        if(res.bizCode === "SUCCESS"){
          const obj = res.respData[0]
          console.log('obj',obj)
          let couponList = []
          if (obj.couponList) {
            couponList = obj.couponList.map(item => (
              {
                ...item,
                isUse: true,
                maxDiscountAmount: regFenToYuan(item.maxDiscountAmount),
                thresholdAmount: regFenToYuan(item.thresholdAmount),
                cutAmount: regFenToYuan(item.cutAmount),
              }
            ))
          }
          if(obj.stockDetailImgUrl){
            this.fileList1.push({url: config.UPLOAD_IMG_BASE_URL + obj.stockDetailImgUrl })
            let addIcon = document.getElementsByClassName('el-upload--picture-card')
            addIcon[1].style.display = 'none'
          }else{
            this.fileList1 = []
          }
          const newParam = {
            stationLimitStationId: obj.stationLimitStationName ? obj.stationLimitStationName.split(',') : [],
            stationLimitMerchantId: obj.stationLimitMerchantName ? obj.stationLimitMerchantName.split(',') : [],
            originPrice: regFenToYuan(obj.originPrice),
            salePrice: regFenToYuan(obj.salePrice),
            maxDiscountAmount: regFenToYuan(obj.maxDiscountAmount),
            thresholdAmount: regFenToYuan(obj.thresholdAmount),
            cutAmount: regFenToYuan(obj.cutAmount),
            packageUrl: config.UPLOAD_IMG_BASE_URL + obj.packageUrl,
            couponList,
          }
          this.couponForm = { ...obj, ...newParam }
          this.editDisabled = true;
          // 如果有省份 还需要匹配城市
          if (obj.areaLimitProvinceCode) {
            getProvinceList({ parentArea: obj.areaLimitProvinceCode }).then(res => {
              this.cityList = [{ areaCode: '', areaName: '全部' }, ...res.respData]
            })
          }
        }
      })
    },
    //选择可使用油站
    usedGasStationChange(val){
      if(val === "all"){
        this.couponForm.stationLimitStationId = []
        this.couponForm.stationLimitMerchantId = []
      } else if(val === "special_merchant"){
        this.couponForm.stationLimitStationId = []
      } else {
        this.couponForm.stationLimitMerchantId = []
      }
    },
    merchantChange(e) {
      console.log('2333', e);
    },
    gasChange(e){
      console.log('2333', e);
    },
    getProvinceList(){
      getProvinceList().then(res => {
        this.provincesList = res.respData
      })
    },
    //切换省份
    provinceChange(val){
      this.couponForm.areaLimitCityCode = '';
      this.couponForm.areaLimitCityName = '';
      this.couponForm.areaLimitProvinceName = this.provincesList.find(i => i.areaCode === val).areaName;
      getProvinceList({ parentArea: val }).then(res => {
        this.cityList = [{ areaCode: '', areaName: '全部' }, ...res.respData]
      })
    },
    // 切换城市
    cityChange(val) {
      // this.couponForm.city = val
      this.couponForm.areaLimitCityName = this.cityList.find(i => i.areaCode === val).areaName;
    },
    gasRemoteMethod(val) {
      if (val) {
        getAllStationList({ stationName: val }).then(res => {
          this.stationList = res.respData;
        })
      } else {
        this.stationList = [];
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
    async beforeAvatarUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 2;
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      const [imgWidth, imgHeight] = await this.getImageSize(file);
      if (imgWidth !== 390 || imgHeight !== 234) {
        this.$message.error('图片尺寸不符合要求 390*234');
        throw new Error('图片尺寸不符合要求 390*234');
        return false;
      }
      this.packageFile = file;
      console.log('beforeAvatarUpload:',file)
      return isLt1M;
    },
    handleSuccess(response, file, fileList){
      if(response.bizCode === "SUCCESS"){
        let addIcon = document.getElementsByClassName('el-upload--picture-card')
        addIcon[0].style.display = 'none'
        this.couponForm.packageUrl = response.respData
      } else {
        this.$message.warning(response.respMsg || '上传失败');
      }
    },
    handleRemove(file, fileList) {
      this.couponForm.packageUrl = '';
      let addIcon = document.getElementsByClassName('el-upload--picture-card')
      addIcon[0].style.display = 'inline-block'
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一张图片`);
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      if(file.response){
        let imgUrl = config.UPLOAD_IMG_BASE_URL + file.response.respData
        this.imgUrl = imgUrl
      }else{
        let imgUrl = file.url
        this.imgUrl = imgUrl
      }
    },
    //上传图片
    handleSuccess1(response, file, fileList){
      if(response.bizCode === "SUCCESS"){
        let addIcon = document.getElementsByClassName('el-upload--picture-card')
        addIcon[1].style.display = 'none'
        this.couponForm.stockDetailImgUrl = response.respData
        this.$refs.image.clearValidate()
      } else {
        this.$message.warning(response.respMsg || '上传失败');
      }
       
    },
    handlePictureCardPreview1(file) {
      this.dialogVisible = true
      if(file.response){
        let imgUrl = config.UPLOAD_IMG_BASE_URL + file.response.respData
        this.imgUrl = imgUrl
      }else{
        let imgUrl = file.url
        this.imgUrl = imgUrl
      }
    },
    beforeAvatarUpload1(file) {
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
          this.couponFile = file;
          return file;
      }, () => {
          this.$message.error('上传的图片尺寸必须是850*350且不能大于2M!');
          return Promise.reject();
      });
      return  isSize;
    },
    handleExceed1(files, fileList) {
      this.$message.warning(`只能上传一张图片`);
    },
    handleRemove1(file, fileList) {
      this.couponForm.stockDetailImgUrl = ''
      let addIcon = document.getElementsByClassName('el-upload--picture-card')
      addIcon[1].style.display = 'inline-block'
    },
    // 校验金额相关的
    checkMoneyAmount(e, type) {
      const reg = /^\d+\.?\d{0,2}$/;
      if (!reg.test(e.target.value)) {
        this.couponForm[type] = ''
      }
    },
    // 校验数额相关的
    checkAmount(e, type) {
      const val = e.target.value;
      if (val && !validNum(val)) {
        this.couponForm[type] = ''
      }
    },
    // 校验折扣 10-99
    checkDiscount(e, type) {
      const val = e.target.value;
      if (!validNum(val)) {
        this.couponForm[type] = e.target.value.slice(0, -1)
        return;
      }
      if (val && val > 100) {
        this.$message({ message: '折扣额度不能大于100', type: 'error' });
        this.couponForm[type] = e.target.value.slice(0, -1)
        return;
      }
    },
    getImageSize(file) {
      return new Promise(resolve => {
        const fr = new FileReader();

        fr.onload = function fileReanderOnload() {
          // file is loaded
          const img = new Image();

          img.onload = () => {
            resolve([img.width, img.height]);
          };

          img.src = fr.result;
        };
        fr.readAsDataURL(file);
      });
    },
    // 提交结果
    submit(formName) {
      // 判断是新增还是编辑
      if (this.couponId) {
        if (!this.couponForm.status) {
          this.$message({ message: '请选择状态', type: 'error' });
          return;
        }
        this.loading = true;
        updatePackage(Object.assign({}, { status: this.couponForm.status }, { id: this.couponId })).then(res => {
          this.loading = false;
          if (res.bizCode === 'SUCCESS') {
            this.$message({ message: '修改成功', type: 'success' });
            this.$router.push('/coupon/couponPackList')
          } else {
            this.$message({ message: res.bizMsg ||  '修改失败，请稍后重试', type: 'error' });
          }
        })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 如果选择折扣券 maxDiscountAmount 必填
            // 如果选择了折扣券，则折扣不能小于10
            let newCouponList = [];
            for(let item of this.couponForm.couponList) {
              if(item.isUse && (!+item.couponCount || !item.thresholdAmount)) {
                this.$message({ message: '券的张数和门槛金额都是必填,且张数不能为0', type: 'error' });
                return;
              }
              // 满减券
              if(item.isUse && item.couponType === 'full_less' && !item.cutAmount) {
                this.$message({ message: '请填写满减金额', type: 'error' });
                return;
              }
              // 如果是满减券，减的金额不能高于消费门槛
              if (
                item.isUse &&
                item.couponType === 'full_less' &&
                (+item.thresholdAmount <= +item.cutAmount)
              ) {
                this.$message({ message: '满减券，满减金额需小于消费门槛', type: 'error' });
                return;
              }

              if(item.isUse && item.couponType === 'discount' && !item.maxDiscountAmount) {
                this.$message({ message: '请填写最多优惠金额', type: 'error' });
                return;
              }
              if (item.isUse && item.couponType === 'discount' && (+item.cutOff < 10 || +item.cutOff > 99)) {
                this.$message({ message: '折扣不能小于10且不能大于99', type: 'error' });
                return;
              }
              if (item.isUse) {
                // 元转分
                if (
                  item.couponType === 'full_less'
                  && item.thresholdAmount
                ){
                  newCouponList.push({
                    ...item,
                    thresholdAmount: regYuanToFen(item.thresholdAmount),
                    cutAmount: regYuanToFen(item.cutAmount),
                  });
                }
                if(item.couponType === 'discount'
                  && item.maxDiscountAmount
                ) {

                  newCouponList.push({
                    ...item,
                    thresholdAmount: regYuanToFen(item.thresholdAmount),
                    maxDiscountAmount: regYuanToFen(item.maxDiscountAmount),
                  });
                }

              }
            }

            // 如果选择了指定商户
            if (this.couponForm.stationLimitType !== 'all') {
              if (
                this.couponForm.stationLimitType === 'special_merchant' &&
                (!this.couponForm.stationLimitMerchantId || this.couponForm.stationLimitMerchantId.length === 0)
              ) {
                this.$message({ message: '请选择指定商户', type: 'error' });
                return;
              }
              // 如果选择了指定油站
              if (
                this.couponForm.stationLimitType === 'special_station' &&
                (!this.couponForm.stationLimitStationId || this.couponForm.stationLimitStationId.length === 0)
              ) {
                this.$message({ message: '请选择指定油站', type: 'error' });
                return;
              }
            } else {
              this.couponForm.stationLimitMerchantId = '';
              this.couponForm.stationLimitStationId = '';
            }
            // 如果选择了指定地区 则 省份必填
            if (
              this.couponForm.areaLimitType === 'special_area' &&
              (!this.couponForm.areaLimitProvinceCode || this.couponForm.areaLimitProvinceCode.length === 0)
            ) {
              this.$message({ message: '请选择省份', type: 'error' });
              return;
            }
            // 售价是否高于原价
            if (+this.couponForm.originPrice < +this.couponForm.salePrice) {
              this.$message({ message: '售价不得高于原价', type: 'error' });
              return;
            }
            // 是否选择了指定油站
            // 元转分 售价，原价，最高优惠
            // 必须勾选 满减券或者折扣券其中一个
            if (!newCouponList.length) {
              this.$message({ message: '折扣券和满减券至少选择一种！', type: 'error' });
              return;
            }
            // const params = Object.assign(
            //   {},
            //   this.couponForm,
            //   { originPrice: regYuanToFen(this.couponForm.originPrice) },
            //   { salePrice: regYuanToFen(this.couponForm.salePrice)},
            //   { stationLimitMerchantId: (this.couponF2orm.stationLimitMerchantId || []).join(',') },
            //   { stationLimitStationId: (this.couponForm.stationLimitStationId || []).join(',')  },
            //   { couponList: newCouponList },
            // );
            const params = {
              ...this.couponForm,
              originPrice: regYuanToFen(this.couponForm.originPrice),
              salePrice: regYuanToFen(this.couponForm.salePrice),
              stationLimitMerchantId: (this.couponForm.stationLimitMerchantId || []).join(','),
              stationLimitStationId: (this.couponForm.stationLimitStationId || []).join(','),
              couponList: '',
              packageCouponList: JSON.stringify(newCouponList)
            }
            const formData = new FormData();
            Object.keys(params).forEach((key) => {
              formData.append(key, params[key]);
            });
            formData.append('couponFile', this.couponFile)
            formData.append('packageFile', this.packageFile)
            this.loading = true;
            savePackage(formData).then(res => {
              console.log("res:::",res)
              this.loading = false;
              if (res.bizCode === 'SUCCESS') {
                this.$message({ message: '添加成功', type: 'success' });
                this.$router.push('/coupon/couponPackList')
              } else {
                this.$message({ message: res.bizMsg || '添加失败，请稍后重试', type: 'error' });
              }
            })
          } else {
            console.log('error submit!!');
            this.$message({ message: '有必填项还未填写', type: 'error' });
            return false;
          }
        });
      }
    },
  }
}

</script>

<style scoped lang="less">
    .content .el-input{
        width: 200px;
        margin-right: 10px;
    }
    .content /deep/ .el-upload-list--picture .el-upload-list__item-thumbnail{
        width: auto;
        height: auto;
    }
    .content /deep/ .el-upload--picture-card{
        width: 100px;
        height: 50px;
        line-height: 54px;
    }
    .content /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 390px;
        height: 234px;
    }
    .content /deep/ showRedDot .el-form-item__label:before {
        content: '*';
        color: #F56C6C;
        margin-right: 4px;
    }
    .max_count {
        padding-left: 58px;
        margin-top: 10px;
    }
    .discount_text {
        display: inline-block;
        width: 33px;
        text-align: right;
    }
    .search_cont{
        margin-bottom: 10px;
        width: 95%;
        .el-form-item-div {
            display: flex;
            flex-wrap: wrap;
        }

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
        .input_num {
            margin-left: 5px;
            width: 120px;
        }
        .input_unit {
            padding-right: 20px;
            color: #ccc;
        }
    }
</style>
