<template>
    <div class="content">
        <!-- 条件查询区域 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span :style="{fontWeight: '700'}">行为日志</span>
            </div>
            <el-row>
                <el-form :inline="true"  :model="searchData" class="form-inline">
                    <el-form-item label="操作">
                        <el-select v-model="searchData.operation" :style="{marginRight: '20px'}" @change="operationTypeChange">
                            <el-option v-for="item in operationType" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="菜单" :style="{marginRight: '20px'}">
                        <el-input v-model="searchData.menuName" placeholder="" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="日期">
                        <el-date-picker
                            v-model="searchData.logBeginDate"
                            type="date"
                            placeholder="开始日期"
                            value-format="yyyy-MM-dd"
                            :style="{width: '180px'}">
                        </el-date-picker>
                        <span :style="{margin: '0 10px', color: '#ccc'}">-</span>
                        <el-date-picker
                            v-model="searchData.logEndDate"
                            type="date"
                            placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :style="{width: '180px'}">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" :style="{width: '120px', marginLeft: '20px'}">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-card>

        <!-- 表格展示区域 -->
        <div class="table-wrap">
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading">
                <el-table-column
                    prop="createTime"
                    label="时间"
                    align="center">
                </el-table-column>

                <el-table-column
                    prop="menuName"
                    label="菜单"
                    align="center">
                </el-table-column>

                <el-table-column
                    prop="operation"
                    label="操作"
                    align="center">
                </el-table-column>

                <el-table-column
                    prop="content"
                    label="内容"
                    align="center">
                </el-table-column>

                <el-table-column
                    prop="phone"
                    label="管理员"
                    align="center">
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页功能 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParams.current_page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageParams.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
            style="margin-top: 20px; text-align:center">
        </el-pagination>
    </div>
</template>

<script>
import { getActionLogList } from '@/api/api'
export default {
    data () {
        return {
            loading: false,
            searchData: {
                operation: '',
                menuName: '',
                logBeginDate: '',
                logEndDate: ''
            },
            operationType: [
                {name: '全部', value: ''},
                {name: '新增', value: 'add'},
                {name: '更改', value: 'update'},
                {name: '删除', value: 'delete'},
                {name: '导出', value: 'export'},
                {name: '绑定', value: 'bind'},
            ],
            tableData: [],
            pageParams: {
                current_page: 1,
                page_size: 10,
                total: 0
            }
        }
    },
    created () {
    },
    mounted () {
        this.getInitData()
    },
    methods: {
        // 接口查询列表数据
        getInitData () {
            const params = {
                current: this.pageParams.current_page,
                size: this.pageParams.page_size,
                ...this.searchData,
            }
            console.log('params:', params)
            this.loading = true
            getActionLogList(params).then(res => {
                console.log('res:', res)
                this.loading = false
                if (res.bizCode === "SUCCESS") {
                    this.tableData = res.respData.list || []
                    this.pageParams.page_size = res.respData.size
                    this.pageParams.total = res.respData.total
                }
            }).catch(err => {
                console.log('err:', err)
                this.loading = false
            })
        },

        // 操作类型变化
        operationTypeChange (val) {
            this.pageParams.current_page = 1
            this.searchData.operation = val
            this.getInitData()
        },

        // 查找
        onSubmit () {
            this.pageParams.current_page = 1 // 每次重新搜索默认查第一页
            this.getInitData()
        },

        // 分页-每页数量改变
        handleSizeChange (val) {
            this.pageParams.page_size = val
            this.getInitData()
        },

        // 分页-切换页数
        handleCurrentChange (val) {
            this.pageParams.current_page = val
            this.getInitData()
        }
    }
}
</script>

<style scoped lang="less">
    .table-wrap {
        margin-top: 20px;
    }
</style>