<template>
    <div>
        <div class="content">
            <div class="block">
                <div class="block-content " >
                    <el-table ref="multipleTable" :data="commodities" highlight-current-row v-loading="listLoading" 
                              style="width: 100%;">
                    <el-table-column prop="imgs" label="照片" header-align="center">
                        <template slot-scope="scope" class="imgclo"> 
                            <div class="img" @click="showswiper(scope.row)">
                                <img  :src="scope.row.thumbnailImg == null?'':scope.row.thumbnailImg[0]" style="width:80px;height:80px"/> 
                                <span>{{scope.row.thumbnailImg == null||scope.row.thumbnailImg == 'undefined'? 0 :scope.row.thumbnailImg.length}}</span>
                            </div>
                        </template> 
                    </el-table-column>
                     <el-table-column prop="name" label="商品名称" header-align="center"></el-table-column>
                    <el-table-column prop="username" label="用户昵称" header-align="center"></el-table-column>
                    <el-table-column label="价格" header-align="center">
                      <template slot-scope="scope"> 
                            <span style="color:#e4393c">￥{{scope.row.price}}</span>
                        </template> 
                    </el-table-column>
                    <el-table-column label="原价"  header-align="center" >
                      <template slot-scope="scope"> 
                            <span style="text-decoration-line: line-through">￥{{scope.row.costPrice}}</span>
                        </template> 
                    </el-table-column>
                    <el-table-column label="操作" header-align="center" width="200">
                        <template slot-scope="scope">
                        <el-button size="small" @click="getDetail(scope.row.id)">查看详情</el-button>
                        <el-button size="small" type="danger" @click="delCommodity(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="pagination">
             <el-pagination 
                @current-change="pageChange"
                :current-page.sync="queryParams.page"
                :page-size="queryParams.perPage"
                layout="total, prev, pager, next"
                :total="totalCount">
            </el-pagination>
        </div>
        </div>
        
        <div class="imgswiper" v-if="swiperinfor.imgswipershow">
            <a class="swiperclose"><i class="fa fa-close" @click="closeswiper"></i></a>
                <swiper :options="swiperOption">
                    <swiper-slide v-for="(img,idx) in swiperinfor.imgs" :key="idx"><img :src="img">
                    </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
                <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
                <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                
            </swiper>
        </div>
    </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import typeApi from "@/services/type";
import commodityApi from "@/services/commodity";
import utils from "@/utils/utils";
export default {
  components: {
    swiper,
    swiperSlide
  },
  mounted() {
    let vm = this;
    vm.load();
  },
  data() {
    return {
      totalCount: 0,
      queryParams: {
        page: 1,
        perPage: 10
      },
      commodities:[],
      listLoading: false,
      searchLabel: "",
      searchContent:"",
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      swiperinfor: {
        id: "",
        imgs: [],
        imgswipershow: false
      }
    };
  },
  watch: {},
  methods: {
    load(val) {
      let vm = this;
      if (!val) val = vm.queryParams.page;
      let params = {
        page: val,
        pageSize: vm.queryParams.perPage,
        checked: -1
      };
      commodityApi.getList(params).then(res => {
        if (res.code == 0) {
          vm.commodities = res.data.data;
          vm.totalCount = res.data.total;
        } else vm.$message.error(res.errMsg);
      });
    },
    getDetail(id){
        let vm = this;
        vm.$router.push({path:'/commodityDetail', query :{id:id}})
    },
    formattime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    pageChange(val) {
      let vm = this;
      vm.load(val);
    },
    showswiper(data) {
      let vm = this;
      vm.swiperinfor.imgs = data.thumbnailImg;
      vm.swiperinfor.imgswipershow = true;
    },
    closeswiper() {
      let vm = this;
      vm.swiperinfor.imgswipershow = false;
    },
    delCommodity(id) {
      let vm = this;
      vm
        .$confirm("你确定要删除当前商品吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
          dangerouslyUseHTMLString: true
        })
        .then(() => {
          vm.confDeleteCommodity(id);
        })
        .catch(() => {
          vm.$message({
            type: "info",
            message: "删除操作已取消"
          });
        });
    },
    confDeleteCommodity(id) {
      let vm = this;
      vm.listLoading = true;
      let params = {
        id: id
      };
      commodityApi.delById(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("商品信息删除成功");
          if (
            vm.queryParams.page != 1 &&
            vm.commodities.length == 1 &&
            vm.queryParams.page ==
              Math.ceil(vm.totalCount / vm.queryParams.perPage)
          ) {
            vm.queryParams.page = vm.queryParams.page - 1;
          }
          vm.items = [];
          vm.load(vm.queryParams.page);
        } else {
          vm.$message.error(res.errMsg);
        }
        vm.listLoading = false;
      });
    },
  }
};
</script>
<style lang="scss">
.el-message-box__wrapper {
  z-index: 9999 !important;
}
.el-message {
  z-index: 9999 !important;
}
.slogonshow {
  display: flex;
  flex-wrap: wrap;
}
</style>
