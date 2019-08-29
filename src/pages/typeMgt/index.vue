<template>
    <div>
        <div class="content" >
            <div class="block">
                <div class="block-hd form-horizontal">
                    <div class="row">
                        <div class="lout">
                            <el-select size="small" v-model="rootType" placeholder="全部分类" @change="getRootTypeSelected">
                                <el-option
                                v-for="item in rootTypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button id="newType" size="small" @click="newType" style="margin-left: 20px;" >新增分类</el-button>
                        </div>
                    </div>
                    <div class=" row serachbar">
                        <el-input id="searchinput" class="serachLabel" size="small" v-model="searchLabel" placeholder="输入分类名称"></el-input>
                        <el-button id="searchbtn" type="primary" size="small"  @click="search(1)">搜索</el-button>
                    </div>
                </div>
                <div class="searchcdn" v-if="nameCdn != ''">
                    搜索条件：<div class="label" @click="closeLabel">{{nameCdn}}<a @click="closeLabel"><i class="fa fa-close"></i></a></div>
                </div>
                <div class="block-content ">
                    <el-table ref="multipleTable" :data="types" highlight-current-row v-loading="listLoading"
                              >
                    <el-table-column prop="name" label="分类名称" header-align="center" >
                      <template slot-scope="scope">
                            <div v-if="!scope.row.showEditing">{{scope.row.name}}</div>
                            <div v-else>
                              <el-input size="small" @click="editRootType" v-model="editcontent[scope.$index]"/>
                              <el-button size="small" @click="confEdit(scope.$index)" >确认</el-button>
                              <el-button size="small" @click="cancelEdit(scope.$index)">取消</el-button>
                            </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="goodsQuantity" label="商品数量"  header-align="center">
                    </el-table-column>
                    <el-table-column label="排序" header-align="center" v-if =" id != '' && nameCdn == ''">
                        <template slot-scope="scope">
                            <div class="changeidx" v-if="scope.$index != (queryParams.page - 1) * queryParams.perPage" @click="idxMove(scope.$index,0)" ><i class="fa fa-long-arrow-up sortic" ></i></div>
                            <div class="changeidx" v-if="totalCount - 1 != (queryParams.page - 1) * queryParams.perPage + scope.$index" @click="idxMove(scope.$index,-1)" ><i class="fa fa-long-arrow-down sortic" ></i></div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" header-align="center" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" @click="editType(scope.$index)">编辑</el-button>
                            <el-button size="small" type="danger" @click="delType(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
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
        </div>
    </div>
</template>
<script>
import typeApi from "@/services/type";
export default {
  components: {},
  mounted() {
    let vm = this;
    vm.getRootType();
    vm.getList();
  },
  data() {
    return {
      queryParams: {
        page: 1,
        perPage: 10
      },
      totalCount:0,
      types: [],
      listLoading: false,
      rootTypes:[],
      rootType:"",
      id:"",
      searchLabel:"",
      nameCdn:""
    };
  },
  watch: {},
  methods: {
    closeLabel(){
        let vm = this;
        vm.nameCdn = "";
        vm.getList(1);
    },
    search(val){
        let vm = this;
        vm.nameCdn = vm.searchLabel;
        vm.searchLabel = "";
        vm.getList(val);
    },
    getRootType(){
        let vm = this;
        typeApi.getRootList().then(res => {
            if(res.code == 0)
                vm.rootTypes = res.data;
            else
                vm.$message.error(res.errMsg);
        })
    },
    getRootTypeId(val){
        let vm = this;
        for(let i in vm.rootTypes){
            if(vm.rootTypes[i].name == val)
                return i;
        }
        return -1;
    },
    getRootTypeSelected(){
        let vm = this;
        vm.id = vm.rootType;
        vm.queryParams.page = 1;
        console.log(vm.id)
        vm.getList();
    },
    getList(val) {
      let vm = this;
      vm.listLoading = true;
      let params = {
          page: val ? val:vm.queryParams.page,
          pageSize: vm.queryParams.perPage
      }
      if(vm.id != "")
        params.id = vm.id
      if(vm.nameCdn != "")
        params.name = vm.nameCdn;
      typeApi.getTypesInfo(params).then(res => {
        if (res.code == 0){
          vm.types = res.data.data;
          vm.totalCount = res.data.total;
        }
        else vm.$message.error(res.errMsg);
        vm.listLoading = false;
      });
    },
    pageChange(val){
        let vm = this;
        vm.getList(val);
    },
    idxMove(index, op) {
      let vm = this;
      vm.loading = true;
      let params = {
        fromId: vm.types[index].id,
        from: vm.types[index].seq,
        operation: op,
        condition: {
          parent_id: vm.id
        }
      };
      typeApi.changeSeq(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("顺序交换成功");
          vm.getList();
        } else {
          vm.$message.error("位置交换异常");
        }
        vm.listLoading = false;
      });
    },
    newType(){
        let vm = this;
        vm.$router.push({path:'/editType'});
    },
    editType(val){
        let vm = this;
        let id = vm.types[val].id;
        vm.$router.push({path:'/editType' ,query:{id: id}});
    },
    delType(index) {
      let vm = this;
      let type = vm.types[index];
      console.log(type);
      let params = {
        id: type.id
      };
      vm.$confirm(`你确定删除${type.name}分类信息吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
          dangerouslyUseHTMLString: true
        })
        .then(() => {
          typeApi.delType(params).then(res => {
            if (res.code == 0) {
              vm.$message.success("删除分类成功");
              vm.getList();
              vm.initial();
            } else {
              vm.$message.error(res.errMsg);
            }
            vm.listLoading = false;
          });
        })
        .catch(() => {
          vm.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
.sortic {
  padding: 0 3px;
  margin-right: 2px;
}
.el-input {
  width: 150px;
}
.edit{
  position: absolute;
  left :0;
}
.block-hd{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.searchcdn{
    margin-left: 30px;
    .label{
        padding: 5px 6px;
        color: #666;
        border: 1px solid #e8e8e8;
        &:hover{
            border-color: #fe7300;
            cursor: pointer;
            a{
                color: #fe7300;
            }
        }
        a{
            margin-left: 5px;
            color: #e8e8e8;
        }
    }
}
</style>
