<template>
    <div>
        <div class="content">
            <div class="block">
                <div class="block-header form-horizontal">
                    <div class="row searchimg">
                        <div class="lout">
                            <label class="mlabel" >分类：</label>
                             <el-select  class="setwidth"  clearable  v-model="rootType" placeholder="请选择" @change="rootTypeSelected">
                                <el-option v-for="item in rootTypes" :key="item.id" :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select class="setwidth" style="margin-left:10px;"  clearable  v-model="type" placeholder="请选择" @change="cTypeSelected">
                                <el-option v-for="item in types" :key="item.id" :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="lout"> 
                            <label class="mlabel" >排序：</label>
                             <el-select  class="setwidth" v-model="sort" placeholder="请选择" @change="sortSelected">
                                <el-option v-for="item in sorts" :key="item.id" :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="lout"> 
                            <label class="mlabel" >筛选：</label>
                             <el-select  class="setwidth" v-model="state" placeholder="请选择" @change="stateSelected">
                                <el-option v-for="item in states" :key="item.id" :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="lout serachbar">
                            <el-input id="searchinput" class="serachLabel" v-model="searchLabel" placeholder="输入商品名称"></el-input>
                            <el-button id="searchbtn" type="primary" @click="search(1)">搜索</el-button>
                            
                        </div>
                    </div>
                </div>
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
                    <el-table-column prop="sellQuantity" label="销量"  header-align="center" ></el-table-column>
                    <el-table-column prop="checked" label="状态" header-align="center">
                        <template slot-scope="scope"> 
                            <span v-if="scope.row.checked == -1">等待审核</span>
                            <span v-else-if="scope.row.checked == 0">审核失败</span>
                            <span v-else-if="scope.row.checked == 1">正在销售</span>
                            <span v-else-if="scope.row.checked == 2">审核成功</span>
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
    vm.getRootType();
    vm.load();
  },
  data() {
    return {
      totalCount: 0,
      queryParams: {
        page: 1,
        perPage: 10
      },
      types: [],
      rootTypes: [],
      rootType: "",
      type: "",
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
      },
      sorts: [
        { name: "综合排序", id: 0 },
        { name: "价格升序", id: 1 },
        { name: "价格降序", id: 2 },
        { name: "销量降序", id: 3 },
        { name: "销量升序", id: 4 }
      ],
      sort: 0,
      states: [
        { name: "全部状态", id: 0 },
        { name: "正在销售", id: 1 },
        { name: "等待审核", id: 2 },
        { name: "审核失败", id: 3 },
        { name: "待出售", id: 4 }
      ],
      state: 0
    };
  },
  watch: {},
  methods: {
    load(val) {
      let vm = this;
      if (!val) val = vm.queryParams.page;
      let params = {
        page: val,
        pageSize: vm.queryParams.perPage
      };
      if (vm.sort == 1) params.price = 1;
      if (vm.sort == 2) params.price = 2;
      if (vm.sort == 3) params.sellQuantity = 2;
      if (vm.sort == 4) params.sellQuantity = 1;
      if (vm.state == 1) params.checked = 1;
      if (vm.state == 2) params.checked = -1;
      if (vm.state == 3) params.checked = 0;
      if (vm.state == 4) params.checked = 2;

      if (vm.type != "") params.typeId = vm.type;
      else if (vm.rootType != "") params.typeId = vm.rootType;
      if(vm.searchContent != "") params.name = vm.searchContent;

      commodityApi.getList(params).then(res => {
        if (res.code == 0) {
          vm.commodities = res.data.data;
          vm.totalCount = res.data.total;
        } else vm.$message.error(res.errMsg);
      });
    },
    getRootType() {
      let vm = this;
      typeApi.getRootList().then(res => {
        if (res.code == 0) vm.rootTypes = res.data;
        else vm.$message.error(res.errMsg);
      });
    },
    rootTypeSelected() {
      let vm = this;
      vm.getTypeList();
      vm.load();
    },
    cTypeSelected() {
      let vm = this;
      vm.load();
    },
    stateSelected(){
      let vm = this;
      vm.load();
    },
    sortSelected(){
      let vm = this;
      vm.load();
    },
    getTypeList() {
      let vm = this;
      vm.type = "";
      let params = {
        type: vm.rootType
      };
      typeApi.getTypes(params).then(res => {
        if (res.code == 0) {
          vm.types = res.data;
        } else vm.$message.error(res.errMsg);
      });
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
    search(val) {
      let vm = this;
      vm.searchContent = vm.searchLabel;
      vm.load(val);
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
    getDetail(id){
        let vm = this;
        vm.$router.push({path:'/commodityDetail', query :{id:id}})
    }
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
