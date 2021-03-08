import {get,post} from './request';
import downloadData from './dowload';
import fileRequest from './file-request';
//登陆
// export const  login=(params)=>post('login',params)
// // 注销
// export const  logout=(params)=>post('logout',params)
//油站列表
export const  getGasStationList = (params) => post('/platform/station/queryPageList', params)
//添加油站
export const  addGasStation = (params) => post('/platform/station/save', params)
//修改油站
export const  editGasStation = (params) => post('/platform/station/update', params)

//获取省市区下拉列表
export const  getProvinceList = (params = {}) => post('/platform/systemArea/queryList', params)
//获取油站详情
export const  getStationDetail = (params) => post('/platform/station/stationInfo', params)
//确定添加油枪
export const  addOilGun = (params) => post('/platform/stationOilGun/save', params)
//删除油枪
export const  deleteOilGun = (params) => post('/platform/stationOilGun/delete', params)
//获取所有油品
export const  getAllOilList = (params = {}) => post('/platformManage/oilsVarietiesManage/queryList', params)
//删除油站
export const  deleteGasStation = (params) => post('/platform/station/delete', params)
//新增车位
export const  addParkingLot = (params) => post('/platform/parkingLot/save', params)
//删除车位
export const  deleteParkingLot = (params) => post('/platform/parkingLot/delete', params)
//新增车道
export const  addvehicleAne = (params) => post('/platform/vehicleAne/save', params)
//删除车道
export const  deletevehicleAne = (params) => post('/platform/vehicleAne/delete', params)
//天线列表 绑定-- 查询油站列表
export const  getAllStationNames = (params) => post('/platform/station/stationNames', params)
//天线管理 绑定-- 查询车道/车位列表
export const  getAllVehiclePark = (params) => post('/platform/station/parkingOrVehicle', params)
//天线管理 绑定天线
export const  bindAntennaForStation = (params) => post('/platform/antenna/bind', params)
//获取天线列表（下拉框）为加油位，车道绑定天线
export const  getAntennaSelectList = (params = {}) => post('/platformManage/antennaManage/queryAntennaList', params)
//查询油机已绑定的天线列表
export const  getAntennaBindList = (params = {}) => post('/platformManage/antennaManage/queryBindList', params)
//查询油机已绑定的天线列表
export const  bindAntenna = (params = {}) => post('/platformManage/antennaManage/bind', params)
//获取订单列表
export const  getOrderList = (params = {}) => post('/platform/payOrder/queryPageList', params)
//获取订单详情
export const  getOrderDetail = (params = {}) => post('/platform/payOrder/detail', params)
//获取商户列表
// export const  getStoreList = (params = {}) => post('/platformManage/merchant/queryPageList', params)
//获取商户列表
export const  getMerchantList = (params = {}) => post('/platform/merchant/queryPageList', params)
//添加-修改油站页面 获取归属主体
export const  getMerchantNameList = (params = {}) => post('/platform/merchant/queryNamesList', params)
export const  getWolfUserList = (params = {}) => post('/platform/account/wolfUserList', params)
//车主认证——列表
export const authList = (params = {}) => post('/platform/carOwnerIdentify/queryPageList', params)
//车主认证——修改车主认证状态
export const updateAuthStatus = (params = {}) => post('/platform/carOwnerIdentify/update', params)
//优惠券管理——获取优惠券列表
export const getCouponList = (params = {}) => post('/platform/stock/queryPageList', params)
//优惠券管理——删除优惠券
export const deleteCoupon = (params = {}) => post('/platform/stock/delete', params)
//优惠券管理——新增优惠券
export const addCoupon = (params = {}) => post('/platform/stock/save', params)
//优惠券管理——修改优惠券
export const editCoupon = (params = {}) => post('/platform/stock/update', params)
//优惠券管理—— 查询详情
export const getCouponDetail = (params = {}) => post('/platform/stock/detail', params)
//优惠券追踪 -- 查询列表
export const getUsedCouponList = (params = {}) => post('/platform/coupon/account/queryList', params)
//优惠券追踪 -- 统计数量
export const getCouponStatistics = (params = {}) => post('/platform/coupon/account/statistics', params)
// 优惠券包 - 查询列表
export const queryPackageList = (params = {}) => post('/platform/package/queryPageList', params)
// 优惠券包 - 删除券包
export const deletePackage = (params = {}) => post('/platform/package/delete', params)
// 优惠券包 - 新增券包
export const savePackage = (params = {}) => post('/platform/package/save', params)
// 改为formata格式传参
// export async function savePackage(params ){
//   return fileRequest('/platform/package/save', { data: params })
// }

// 优惠券包 - 修改券包
export const updatePackage = (params = {}) => post('/platform/package/update', params)
// 优惠券包 -- 查询详情
export const packageDetail = (params = {}) => post('/platform/package/detail', params)
// 模糊搜索油站
export const getAllStationList = (params = {}) => post('/platform/station/getAllStationList', params)
// 运营管理 - 天线扫描成功记录
export const getAntennaSuccessList = (params = {}) => post('/platform/carOwnerIdentify/adminOrderStatusManageList', params)
// 运营管理 - 天线扫描流水
export const getAntennaScanList = (params = {}) => post('/platform/carOwnerIdentify/antennaScanningDataList', params)


// 登录
export const login = (params = {}) => post('/platform/account/login', params)
// 修改密码
export const updatePassword = (params = {}) => post('/platform/account/updatePassword', params)
// 忘记密码
export const forgetPassword = (params = {}) => post('/platform/account/forgetPassword', params)
// 反馈信息列表
export const getFeedbackList = (params = {}) => post('/platform/feedback/list', params)
// 系统通知列表
export const getSystemNotifyList = (params = {}) => post('/platform/systemNotify/list', params)
// 系统通知详情
export const systemNotifyDetail = (params = {}) => post('/platform/systemNotify/detail', params)
// 新建系统通知
export const addSystemNotify = (params = {}) => post('/platform/systemNotify/add', params)
// 编辑系统通知
export const editSystemNotify = (params = {}) => post('/platform/systemNotify/edit', params)
// 删除系统通知
export const deleteSystemNotify = (params = {}) => post('/platform/systemNotify/delete', params)
// 订单管理 导出excel
export async function exportOrderExcel(params) {
  return downloadData('/platform/payOrder/listToExcel', { data: params, });
}

// 系统设置
// 人员列表
export const getAccountList = (params = {}) => post('/platform/account/memberList', params)
// 添加人员
export const addAccount = (params = {}) => post('/platform/account/add', params)
// 删除人员
export const deleteAccount = (params = {}) => post('/platform/account/delete', params)
// 启用/停用账号
export const changeAccountStatus = (params = {}) => post('/platform/account/changeStatus', params)

// 订单管理 - 发起扣款（无感支付失败）
export const deductionApi = (params = {}) => post('/platform/payOrder/deduction', params)
// 订单管理 - 车牌扣款
export const plateNoDeductionApi = (params = {}) => post('/platform/payOrder/plateNoDeduction', params)
// 订单管理 - 追缴订单列表
export const recoveryListApi = (params = {}) => post('/platform/payOrder/queryPageRecoveryOrderList', params)
// 追缴列表导出 Excel
export async function exportRecoveryOrderExcel(params) {
  return downloadData('/platform/payOrder/recoveryOrder/listToExcel', { data: params, });
}

// 用户列表 - 获取用户列表
export const getUserList = (params = {}) => post('/platform/userInfo/queryPageList', params)

// 用户列表 - 导出excel
export async function exportUserExcel(params) {
  return downloadData('/platform/userInfo/exportExcel', { data: params })
}

// 行为日志 - 查询列表
export const getActionLogList = (params = {}) => post('/platform/behaviorLog/queryPageList', params)
