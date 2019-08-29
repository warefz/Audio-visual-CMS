<template>
    <div>
        <div class="content">
            <div class="block">
                <div class="block-header form-horizontal">
                    <div class="row searchimg">
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
                        <div class="lout searchbar">
                            <el-input id="searchinput" class="searchLabel" v-model="searchLabel" placeholder="输入店铺名称"></el-input>
                            <el-button id="searchbtn" type="primary" @click="search(1)">搜索</el-button>
                        </div>
                    </div>
                </div>
                <div class="block-content " >
                    <el-table ref="multipleTable" :data="shops" highlight-current-row v-loading="listLoading" 
                              style="width: 100%;">
                    <el-table-column label="照片" header-align="center">
                        <template slot-scope="scope" class="imgclo"> 
                            <img  :src="scope.row.thumbnail_url" style="width:80px;height:80px"/> 
                        </template> 
                    </el-table-column>
                     <el-table-column prop="name" label="商品名称" header-align="center"></el-table-column>
                    <el-table-column prop="nickname" label="用户昵称" header-align="center"></el-table-column>
                    <el-table-column prop="telephone" label="联系方式" header-align="center"></el-table-column>
                    <el-table-column prop="address" label="地址" header-align="center" ></el-table-column>
                    <el-table-column prop="count" label="商品数量" header-align="center"></el-table-column>
                    <el-table-column prop="money" label="销量"  header-align="center" ></el-table-column>
                    <el-table-column prop="checked" label="状态" header-align="center">
                        <template slot-scope="scope"> 
                            <span v-if="scope.row.checked == -1">等待审核</span>
                            <span v-else-if="scope.row.checked == 0">审核失败</span>
                            <span v-else-if="scope.row.checked == 1">正在销售</span>
                        </template> 
                    </el-table-column>
                    <el-table-column label="操作" header-align="center" width="200">
                        <template slot-scope="scope">
                        <el-button size="small" @click="getDetail(scope.row.id)">查看详情</el-button>
                        <el-button size="small" type="danger" @click="delShop(scope.row.id)">删除</el-button>
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
        
    </div>
</template>
<script>
import shopApi from "@/services/shop";
export default {
  components:{},
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
      shops:[],
      listLoading: false,
      searchLabel: "",
      searchContent:"",
      states: [
        { name: "全部状态", id: 0 },
        { name: "正在销售", id: 1 },
        { name: "等待审核", id: 2 },
        { name: "审核失败", id: 3 },
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
      if (vm.state == 1) params.checked = 1;
      if (vm.state == 2) params.checked = -1;
      if (vm.state == 3) params.checked = 0;
      if(vm.searchContent != "") params.name = vm.searchContent;

      shopApi.getInfoList(params).then(res => {
        if (res.code == 0) {
          vm.shops = res.data.data;
          vm.totalCount = res.data.total;
        } else vm.$message.error(res.errMsg);
      });
    },
    stateSelected(){
      let vm = this;
      vm.load();
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
    search(val) {
      let vm = this;
      vm.searchContent = vm.searchLabel;
      vm.load(val);
    },
    delShop(id) {
      let vm = this;
      vm
        .$confirm("你确定要删除当前店铺吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
          dangerouslyUseHTMLString: true
        })
        .then(() => {
          vm.confDeleteShop(id);
        })
        .catch(() => {
          vm.$message({
            type: "info",
            message: "删除操作已取消"
          });
        });
    },
    confDeleteShop(id) {
      let vm = this;
      vm.listLoading = true;
      let params = {
        id: id
      };
      shopApi.delById(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("店铺信息删除成功");
          if (
            vm.queryParams.page != 1 &&
            vm.commodities.length == 1 &&
            vm.queryParams.page ==
              Math.ceil(vm.totalCount / vm.queryParams.perPage)
          ) {
            vm.queryParams.page = vm.queryParams.page - 1;
          }
          vm.shops = [];
          vm.load(vm.queryParams.page);
        } else {
          vm.$message.error(res.errMsg);
        }
        vm.listLoading = false;
      });
    },
    getDetail(id){
        let vm = this;
        vm.$router.push({path:'/shopDetail', query :{id:id}})
    }
  }
};
</script>
<style scoped lang="scss">
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
.searchLabel{
  margin-right: 10px;
}
</style>
