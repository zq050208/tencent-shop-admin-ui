<template>
  <div class="container">
    <div class="l-content">
      <div class="data-count-wrap">
        <ul>
          <li v-for="(item, index) in countData" :key="index">
            <span class="num-l"></span>
            <span class="num-r"><countTo :startVal='startVal' :endVal='item.num' :duration='3000'></countTo></span>
          </li>
        </ul>
      </div>
      <div>
        <div id="main" style="width: 600px;height:400px;"></div>
      </div>
    </div>
    <div class="r-content">
      <p>版本信息</p>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to';
export default {
  components: { countTo },
	data(){
		return {
      startVal: 0,
      countData: [
        {num: 16700 },
        {num: 18900 },
        {num: 59600 },
        {num: 4523 },
      ]
		}
  },
  mounted(){
		this.drawChart();
	},
	computed:{
		
	},
	methods:{
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "ECharts 入门示例"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
        },
        legend: {
          data: ["销量"]
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六"],
          axisLine: {
            lineStyle:{
              color:'#43A4FF',
              width:2,//这里是为了突出显示加上的
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle:{
              color:'#43A4FF',
              width:2,//这里是为了突出显示加上的
            }
          }
        },
        series: [
          {
            name: "销量",
            type: "line",
            stack: '总量',
            areaStyle: {
              normal: {
                color: '#D7ECFF', //区域颜色
              },
            },
            itemStyle: { 
              normal : { 
                color:'#1C92FF', //改变折线点的颜色
                lineStyle:{ 
                  color:'#43A4FF' //改变折线颜色
                } 
              }
            },
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
	},
	created(){
		// 设置cookie
		// this.$cookie.set('test', 'Hello world!', 1);
		// 获取cookie
		// this.$cookie.get('test'); 
		// 删除cookie
		// this.$cookie.delete('test');
	},
	
}
</script>

<style scoped lang="less">
    .container{
      width: 100%;
      padding: 40px;
      box-sizing: border-box;
      display: flex;
      .l-content{
         flex: 1;
      }
      .r-content{
        width: 300px;
        border: 1px solid #eeeeee;
      }
      .data-count-wrap{
        ul{
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          li{
            width: 200px;
            height: 100px;
            line-height: 100px;
            border: 1px solid #eeeeee;
            display: flex;
            .num-l{
              width: 50%;
              height: 100%;
              background: #80C269;
            }
            .num-r{
              width: 50%;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
            }
          }
        }
      }
    }
    

</style>
