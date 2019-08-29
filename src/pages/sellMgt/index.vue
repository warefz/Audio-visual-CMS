<template>
  <div class="sell-container">
      <div class="header">
          <h2>音像销售平台</h2>
          <div class="content">
            <span>网站销售总额：<span class="total">￥{{sellInfo.total}}</span></span>
            <span>网站成交量：<span>{{sellInfo.deal}}</span></span>
            <span>网站销售件数：<span>{{sellInfo.count}}</span></span>
          </div>
      </div>
      <div id="myChart1" class="chart"></div>
      <div id="myChart2" class="chart"></div>
  </div>
</template>

<script>
import purchaseApi from "@/services/purchase";
export default {
  components: {
  },
  data(){
      return {
        sellData:[],
        count:[],
        money:[],
        typeName:[],
        sellInfo:{
            count:0,
            deal:0,
            total:0
        }
      }
  },
  mounted(){
      let vm = this;
      vm.load();
  },
  methods:{
      load(){
          let vm = this;
          purchaseApi.getSellInfo().then(res => {
              if(res.code == 0){
                if(res.data.length > 0)
                    vm.sellInfo = res.data[0];
                else
                    vm.sellInfo = {
                        count:0,
                        deal:0,
                        total:0
                    }
              }
              else
              vm.$message.error(res.errMsg);
          })
          vm.drawPie();
          vm.drawLine();
      },
      drawPie() {
      let vm = this;
      let myChart = echarts.init(document.getElementById("myChart2"));

      purchaseApi.getSoldListByType().then(res => {
        if (res.code == 0) {
          vm.sellData = res.data;
          vm.count = [];
          vm.money = [];
          vm.typeName = [];
          let maxCount = 0;
          let maxMoney = 0;
          for (let i of vm.sellData) {
            vm.count.push(parseInt(i.count));
            vm.money.push({ value: i.money, name: i.name });
            vm.typeName.push(i.name);
            maxCount =
              maxCount > parseInt(i.count) ? maxCount : parseInt(i.count);
            maxMoney = maxMoney > i.money ? maxMoney : i.money;
          }
          myChart.clear();
          myChart.setOption({
            title: {
              text: "当月分类销售情况",
              subtext: "销售额(元)",
              x: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              left: "left",
              data: vm.typeName
            },
            series: [
              {
                name: "访问来源",
                type: "pie",
                radius: "55%",
                center: ["50%", "60%"],
                data: vm.money,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          });
        }
      });
    },
    drawLine() {
      let vm = this;
      let myChart = echarts.init(document.getElementById("myChart1"));

      purchaseApi.getSoldList().then(res => {
        if (res.code == 0) {
          vm.sellData = res.data;
          vm.date = [];
          vm.count = [];
          vm.money = [];
          let maxCount = 0;
          let maxMoney = 0;
          for (let i of vm.sellData) {
            vm.date.push(i.y + "年" + i.m + "月");
            vm.count.push(parseInt(i.count));
            vm.money.push(i.money);
            maxCount =
              maxCount > parseInt(i.count) ? maxCount : parseInt(i.count);
            maxMoney = maxMoney > i.money ? maxMoney : i.money;
          }
          myChart.clear();
          myChart.setOption({
            title: {
              text: "商品销售情况",
              subtext: "近8个月"
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999"
                }
              }
            },
            toolbox: {
              feature: {
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            legend: {
              data: ["销量", "销售额"]
            },
            xAxis: [
              {
                type: "category",
                data: vm.date,
                axisPointer: {
                  type: "shadow"
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "销量",
                min: 0,
                interval: 20,
                axisLabel: {
                  formatter: "{value} 件"
                }
              },
              {
                type: "value",
                name: "销售额",
                interval: 1000,
                min: 0,
                axisLabel: {
                  formatter: "{value} (元)"
                }
              }
            ],
            series: [
              {
                name: "销量",
                type: "bar",
                yAxisIndex: 0,
                data: vm.count
              },
              {
                name: "销售额",
                type: "line",
                yAxisIndex: 1,
                data: vm.money
              }
            ]
          });
        }
      });
    }
  }
}

</script>

<style lang="scss">
.sell-container{
    padding: 30px;
    .header{
        padding: 20px;
        background: white;
        margin-top:50px;
        color:rgba(0,0,0,.8);
        .content{
            span{
                margin-right: 5px;
                
            }
            .total{
                color:#e4393c;
            }
        }
    }
    .chart{
        margin-top: 50px;
        width: 100%;
        height:300px;
    }
}
</style>
