<template>
    <div>
        <div class="content" >
            <div class="block">
                <div class="block-header form-horizontal">
                    <div class="row">
                        <div class="lout">
                            <el-button id="newType" @click="newRootType" v-if="!newType">新增分类</el-button>
                            <div v-else>
                                <el-input @click="newRootType" size="small" v-model="newcontent" placeholder="请输入分类名称..."/>
                                <el-button  @click="confNew" size="small">确认</el-button>
                                <el-button  @click="cancelNew" size="small">取消</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="block-content ">
                    <el-table ref="multipleTable" :data="types" highlight-current-row v-loading="listLoading"
                              style="width: 100%;">
                    <el-table-column prop="name" label="分类名称" header-align="center" width="300">
                      <template slot-scope="scope">
                            <div v-if="!scope.row.showEditing">{{scope.row.name}}</div>
                            <div v-else>
                              <el-input size="small" @click="editRootType" v-model="editcontent[scope.$index]"/>
                              <el-button size="small" @click="confEdit(scope.$index)" >确认</el-button>
                              <el-button size="small" @click="cancelEdit(scope.$index)">取消</el-button>
                            </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="typesQuantity" label="分类数量" header-align="center"></el-table-column>
                    <el-table-column prop="goodsQuantity" label="商品数量"  header-align="center" width="160">
                    </el-table-column>
                    <el-table-column label="排序" header-align="center" width="100">
                        <template slot-scope="scope">
                            <div class="changeidx" v-if="scope.$index != 0" @click="idxMove(scope.$index,0)" ><i class="fa fa-long-arrow-up sortic" ></i></div>
                            <div class="changeidx" v-if="scope.$index != types.length - 1" @click="idxMove(scope.$index,-1)" ><i class="fa fa-long-arrow-down sortic" ></i></div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" header-align="center" width="300">
                        <template slot-scope="scope">
                            <el-button size="small" @click="editType(scope.$index)">编辑</el-button>
                            <el-button size="small" @click="viewSelected(scope.$index)">查看精选商品</el-button>
                            <el-button size="small" type="danger" @click="delType(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
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
    vm.getList();
  },
  data() {
    return {
      types: [],
      listLoading: false,
      newType: false,
      newcontent: "",
      editcontent:[]
    };
  },
  watch: {},
  methods: {
    getList() {
      let vm = this;
      vm.listLoading = true;
      typeApi.getRootType().then(res => {
        if (res.code == 0){
          vm.editcontent = [];
          for(let i of res.data){
            i.showEditing = false;
            vm.editcontent.push("")
          }
          vm.types = res.data;
        }
        else vm.$message.error(res.errMsg);
        vm.listLoading = false;
      });
    },
    initial() {
      let vm = this;
      vm.newType = false;
      vm.newcontent = "";
    },
    idxMove(index, op) {
      let vm = this;
      vm.loading = true;
      let params = {
        fromId: vm.types[index].id,
        from: vm.types[index].seq,
        operation: op,
        condition: {
          parent_id: null
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
    newRootType() {
      let vm = this;
      vm.newType = true;
    },
    confNew() {
      let vm = this;
      vm.loading = true;
      let params = {
        name: vm.newcontent,
        parent_id: null
      };
      typeApi.edit(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("新增分类成功");
          vm.getList();
          vm.initial();
        } else {
          vm.$message.error(res.errMsg);
        }
        vm.listLoading = false;
      });
    },
    cancelNew() {
      let vm = this;
      vm.newType = false;
      vm.newcontent = "";
    },
    confEdit(index){
      let vm = this;
      if(vm.editcontent[index].length == 0)
        return vm.$message.error('分类名称不能为空');
      let params = {
        id: vm.types[index].id,
        name: vm.editcontent[index]
      }
      typeApi.edit(params).then( res => {
        if(res.code == 0){
          vm.$message.success('分类信息更新成功');
          vm.getList();
          vm.initial();
        }else
          vm.$message.error(res.errMsg);
      })
    },
    cancelEdit(index){
      let vm = this;
      vm.types[index].showEditing = false;
    },
    editType(index) {
      let vm = this;
      vm.editcontent[index] = vm.types[index].name;
      vm.types[index].showEditing = true;
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
    },
    viewSelected(index){
      let vm = this;
      vm.$router.push({path:'/typeSelected',query:{typeId:vm.types[index].id}});
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
</style>
