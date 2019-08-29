<template>
    <div>
        <div class="content">
            <div class="block">
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
                            <span>等待审核</span>
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
      searchContent:""
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
      params.checked = -1;
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
        .$confirm("你确定要删除当商铺吗？", "提示", {
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
          vm.$message.success("商品信息删除成功");
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
