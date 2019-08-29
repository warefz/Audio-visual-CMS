<template>
    <div>
        <div class="content">
            <div class="block">
                <div class="block-header form-horizontal">
                        <div class="row">
                            <el-button id="newdevbtn" class="confticketId" v-if="!newitem" @click="newAttribute">新建属性</el-button>
                            <div class="newattribute" v-if="newitem">
                                <el-input id="devname" class="attributecontent" v-model="newcontent" placeholder="再此输入属性名称..."></el-input>
                                <el-button id="confnew" class="confticketId" @click="confAttribute">确认</el-button>
                                <el-button id="giv"  class="confticketId" @click="cancelAttribute">取消</el-button>
                            </div>
                        </div>
                        <div class="block-content" style="margin-left:20px;">
                            <el-table :data="showitems" highlight-current-row v-loading="listLoading"
                                        style="width:100%;">
                                <el-table-column  type="index" :index="typeIndex" label="序号" width="150" header-align="center">></el-table-column>
                                <el-table-column prop="content" label="属性内容" header-align="center" width="500">
                                    <template slot-scope="scope"> 
                                        <div class="editattribute" v-if="scope.row.editing">
                                            <el-input class="attributecontent" v-model="editingcontent" ></el-input>
                                            <el-button class="confticketId" size="small" @click="confedit(scope.$index)">确认</el-button>
                                            <el-button class="confticketId" size="small" @click="canceledit(scope.$index)">取消</el-button>
                                        </div>
                                        <span v-if="!scope.row.editing">{{scope.row.name}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column prop="seq" label="排序" header-align="center">
                                    <template slot-scope="scope">

                                        <div class="changeidx" v-if="scope.$index != 0" @click="idxMove(scope.$index,0)" ><i class="fa fa-long-arrow-up sortic" ></i></div>
                                        <div class="changeidx" v-if="totalCount - 1 != (queryParams.page - 1) * queryParams.perPage + scope.$index" @click="idxMove(scope.$index,-1)" ><i class="fa fa-long-arrow-down sortic" ></i></div>
                                    </template> 
                                </el-table-column>
                                <el-table-column label="操作" header-align="center" width="150">
                                    <template slot-scope="scope">
                                    <el-button type="primary" size="small" @click="editItem(scope.$index)">编辑</el-button>
                                    <el-button type="danger" size="small" @click="confDel(scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
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
            </div>
    </div>
</template>
<script>
import attributeApi from "@/services/attribute";
export default {
  data() {
    let data = {
      item: {},
      ticketId: "",
      gcname: "",
      listLoading: false,
      attributes: [],
      showitems: [],
      queryParams: {
        page: 1,
        perPage: 5
      },
      dec: {
        st: "",
        ed: ""
      },
      totalCount: 0,
      newitem: false,
      newcontent: "",
      editingcontent: ""
    };
    return data;
  },
  methods: {
    pageChange(val) {
      let vm = this;
      vm.showitems = vm.attributes.slice(
        val * vm.queryParams.perPage - vm.queryParams.perPage,
        val * vm.queryParams.perPage
      );
    },
    typeIndex(index) {
      return index + (this.queryParams.page - 1) * this.queryParams.perPage + 1;
    },
    editItem(index) {
      let vm = this;
      vm.editingcontent = vm.showitems[index].name;
      for (let i = 0; i < vm.showitems.length; i++)
        vm.showitems[i].editing = false;
      vm.showitems[index].editing = true;
    },
    canceledit(index) {
        let vm = this;
      this.showitems[index].editing = false;
    },
    confedit(index) {
      let vm = this;
      if (vm.editingcontent != "") {
          vm.listLoading = true;
          let params = {
            id: vm.showitems[index].id,
            name: vm.editingcontent
          };
          attributeApi.edit(params).then(res => {
            if (res.code == 0) {
              vm.$message.success("属性修改成功");
              vm.getList();
              vm.showitems = vm.attributes.slice(
                vm.queryParams.page * vm.queryParams.perPage -
                  vm.queryParams.perPage,
                vm.queryParams.page * vm.queryParams.perPage
              );
            } else {
              vm.$message.error("属性修改异常");
            }
            vm.listLoading = false;
          });
      } else {
        vm.$message.error("属性内容不能为空");
      }
    },
    confAttribute() {
      let vm = this;
      if (vm.newcontent.length <= 1) {
        vm.$message.error("属性内容不能为空");
      } else {
          vm.listLoading = true;
          let params = {
            name: vm.newcontent
          };
          attributeApi.edit(params).then(res => {
            if (res.code == 0) {
              vm.$message.success("添加属性成功");
              vm.queryParams.page = 1;
              vm.getList();
              vm.newcontent = "";
              vm.newitem = false;
            } else {
              vm.$message.error("属性添加异常");
            }
            vm.listLoading = false;
          });
      }
    },
    idxMove(index,op) {
      let vm = this;
      vm.loading = true;
      let realindex = parseInt(
        index +
          vm.queryParams.page * vm.queryParams.perPage -
          vm.queryParams.perPage
      );
      let params = {
        fromId: vm.attributes[realindex].id,
        from: vm.attributes[realindex].seq,
        operation: op
      };
      attributeApi.changeSeq(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("顺序交换成功");
          vm.getList();
        } else {
          vm.$message.error("位置交换异常");
        }
        vm.listLoading = false;
      });
    },
    cancelAttribute() {
        let vm = this;
      vm.newcontent = "";
      vm.newitem = false;
    },
    newAttribute() {
    let vm  = this;
    vm.newitem = true;
    },
    confDel(index) {
      let vm = this;
      let params = {
        id: vm.showitems[index].id
      };
      attributeApi.isUsed(params).then(res => {
        if (res.code == 0) {
          let word = "";
          if (res.data == true) {
            word =
              "你确定要删除当前属性吗？<br>删除属性会造成部分页面属性展示缺失";
          } else {
            word = "你确定要删除当前属性吗？";
          }
          vm.$confirm(word, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true,
            dangerouslyUseHTMLString: true
          })
            .then(() => {
              vm.delAttribute(index);
            })
            .catch(() => {
              vm.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        } else {
          vm.$message.error("查询属性信息异常");
        }
      });
    },
    delAttribute(index) {
      let vm = this;
      vm.listLoading = true;
      let params = {
        id: vm.showitems[index].id
      };
      let page = vm.queryParams.page;
      if (vm.showitems.length == 1 && vm.queryParams.page != 1) page = page - 1;
      attributeApi.delAttribute(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("删除成功");
          vm.queryParams.page = page;
          vm.getList();
        } else {
          vm.$message.error("删除操作异常");
        }
        vm.listLoading = false;
      });
    },
    getList() {
      let vm = this;
      vm.listLoading = true;
      attributeApi.getList().then(res => {
        if (res.code == 0) {
          vm.attributes = [];
          if (res.data.length > 0) {
            for (let i in res.data) {
              vm.attributes[i] = res.data[i];
              vm.attributes[i].editing = false;
            }
            vm.dec.st = vm.attributes[0].id;
            vm.dec.ed = vm.attributes[vm.attributes.length - 1].id;
            vm.showitems = vm.attributes.slice(
              vm.queryParams.page * vm.queryParams.perPage -
                vm.queryParams.perPage,
              vm.queryParams.page * vm.queryParams.perPage
            );
          } else {
            vm.showitems = [];
          }
          vm.totalCount = res.data.length;
        } else {
          vm.$message.error("数据加载异常");
        }
        vm.listLoading = false;
      });
    }
  },
  mounted() {
    let vm = this;
    vm.getList();
  }
};
</script>
<style lang="scss">
.changeidx {
  border: 1px solid rgb(197, 197, 197);
  &:hover {
    background: rgb(226, 226, 226);
    cursor: pointer;
  }
  i{
      padding: 3px 4px;
  }
}
.newattribute{
    display: flex;
}
.editattribute{
    display: flex;
}
.el-input input{
    width: 150px;
}
</style>
