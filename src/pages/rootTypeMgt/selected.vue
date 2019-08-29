<template>
    <div>
      <div class="content bg-gray-lighter">
            <div class="row items-push">
                <div class="col-sm-7">
                    <h1 class="page-heading">
                        {{typeName}}分类精选管理
                    </h1>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="block">
                <div class="block-select block-content">
                    <el-table ref="multipleTable" :data="hotCommodities" highlight-current-row
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
                     <el-table-column label="排序" header-align="center" width="200">
                        <template slot-scope="scope" >
                            <a class="sort" v-if="scope.$index != 0" @click="idxMove(scope.row.id,scope.row.seq,0)"><i class="fa fa-long-arrow-up"></i></a>
                            <a class="sort" v-if="scope.$index != hotCommodities.length-1" @click="idxMove(scope.row.id,scope.row.seq,-1)"><i class="fa fa-long-arrow-down"></i></a>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" header-align="center" width="200">
                        <template slot-scope="scope">
                        <el-button size="small" @click="getDetail(scope.row.id)">查看详情</el-button>
                        <el-button size="small" type="success" @click="cancelSelected(scope.row.commodity_id)">取消精选</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>
                <div class="block-header form-horizontal">
                    <div class="row searchimg">
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
                    <el-table-column label="操作" header-align="center" width="200">
                        <template slot-scope="scope">
                        <el-button size="small" @click="getDetail(scope.row.id)">查看详情</el-button>
                        <el-button size="small" v-if="!scope.row.isSelected" @click="setSelected(scope.row.id)">设为精选</el-button>
                        <el-button size="small" v-if="scope.row.isSelected" type="success" @click="cancelSelected(scope.row.id)">取消精选</el-button>
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
import hotApi from "@/services/hot";
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
        perPage: 8
      },
      commodities:[],
      hotCommodities:[],
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
        { name: "全部", id: 0 },
        { name: "精选", id: 1 },
        { name: "未精选", id: 2 }
      ],
      state: 0,
      type_id: 0,
      typeName:""
    };
  },
  watch: {},
  methods: {
    load(val) {
      let vm = this;
      vm.type_id = vm.$route.query.typeId || 0
      let cdn = {
          type_id: vm.type_id,
          type:'SELECTED'
      }
      hotApi.getList(cdn).then(res => {
        if (res.code == 0) {
          vm.hotCommodities = res.data;
        } else vm.$message.error(res.errMsg);
      });
      if (!val) val = vm.queryParams.page;
      let params = {
        page: val,
        pageSize: vm.queryParams.perPage,
        checked: 1,
        hotTypeId: vm.type_id,
        typeId: vm.type_id
      };
      if (vm.sort == 1) params.price = 1;
      if (vm.sort == 2) params.price = 2;
      if (vm.sort == 3) params.sellQuantity = 2;
      if (vm.sort == 4) params.sellQuantity = 1;
      if (vm.state == 1)
        params.selected = 1;
      else if (vm.state == 2)
        params.selected = 2;

      if(vm.searchContent != "") params.name = vm.searchContent;

      commodityApi.cmsGetSelected(params).then(res => {
        if (res.code == 0) {
          vm.commodities = res.data.data;
          vm.totalCount = res.data.total;
        } else vm.$message.error(res.errMsg);
      });
    },
    idxMove(id,seq, op) {
      let vm = this;
      vm.loading = true;
      let params = {
        fromId: id,
        from: seq,
        operation: op,
        condition: {
          type_id: vm.type_id,
          type: 'SELECTED'
        }
      };
      hotApi.changeSeq(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("顺序交换成功");
          vm.load();
        } else {
          vm.$message.error("位置交换异常");
        }
        vm.listLoading = false;
      });
    },
    getRootType() {
      let vm = this;
      typeApi.getRootList().then(res => {
        if (res.code == 0){
          vm.rootTypes = res.data;
          for(let i of vm.rootTypes)
            if(i.id == vm.type_id)
              vm.typeName = i.name
        }
        else vm.$message.error(res.errMsg);
      });
    },
    stateSelected(){
      let vm = this;
      vm.load(1);
    },
    sortSelected(){
      let vm = this;
      vm.load();
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
    getDetail(id){
        let vm = this;
        vm.$router.push({path:'/commodityDetail', query :{id:id}})
    },
    setSelected(id){
        let vm = this;
        let params = {
            commodity_id: id,
            type_id: vm.type_id,
            type: 'SELECTED',
            limit: 5
        }
        hotApi.setSelected(params).then(res => {
            if(res.code == 0){
                vm.$message.success('设为精选成功')
                vm.load();
            }
            else
                vm.$message.error('设为精选失败')
        })
    },
    cancelSelected(id){
        let vm = this;
        let params = {
            commodity_id: id,
            type_id: vm.type_id,
            type: 'SELECTED'
        }
        hotApi.cancelSelected(params).then(res => {
            if(res.code == 0){
                vm.$message.success('取消精选成功')
                vm.load();
            }
            else
                vm.$message.error('取消精选失败')
        })
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
.sort{
    font-size: 15px;
    margin: 0 3px;
}
</style>
