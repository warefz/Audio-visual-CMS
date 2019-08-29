<template>
    <div>
        <div class="content" >
            <div class="block">
                <div class="block-hd form-horizontal">
                    <div class="row">
                        <div class="lout">
                            <el-button id="newTip" size="small" @click="newTip" >新增</el-button>
                        </div>
                    </div>
                </div>
                <div class="tip-block">
                    <div class="tip-item" v-for="(tip,i) in tips" :key="i">
                        <div class="par">
                            <p class="title">{{tip.name}}</p>
                            <div class="detail"><a @click="toUrl('/editTip',tip.id)">查看详情</a></div>
                            <div class="op">
                                <div class="sort">
                                    <a v-if="i != 0" @click="idxMove(tip.id,tip.seq,0,null)"><i class="fa fa-long-arrow-up"></i></a>
                                    <a v-if="i != tips.length-1" @click="idxMove(tip.id,tip.seq,-1,null)"><i class="fa fa-long-arrow-down"></i></a>
                                </div>
                                <div class="del"><a @click="delTip(tip.id)">删除</a></div>
                            </div>
                        </div>
                        <div class="children" v-if="tip.children">
                            <div class="child" v-for="(item,k) in tip.children" :key="k">
                                <p class="title">{{item.name}}</p>
                                    <div class="detail"><a @click="toUrl('/editTip',item.id)">查看详情</a></div>
                                <div class="op">
                                    <div class="sort">
                                        <a v-if="k != 0" @click="idxMove(item.id,item.seq,0,tip.id)"><i class="fa fa-long-arrow-up"></i></a>
                                        <a v-if="k != tip.children.length-1" @click="idxMove(item.id,item.seq,-1,tip.id)"><i class="fa fa-long-arrow-down"></i></a>
                                    </div>
                                    <div class="del"><a @click="delTip(item.id)">删除</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import tipApi from "@/services/tip";
export default {
  components: {},
  mounted() {
    let vm = this;
    vm.load();
  },
  data() {
    return {
      tips: []
    };
  },
  watch: {},
  methods: {
    load() {
      let vm = this;
      tipApi.getList().then(res => {
        if (res.code == 0) vm.tips = res.data;
        else vm.$message.error("信息获取异常");
      });
    },
    idxMove(id,seq, op,parent) {
      let vm = this;
      vm.loading = true;
      let params = {
        fromId: id,
        from: seq,
        operation: op,
        condition: {
          parent_id: parent
        }
      };
      tipApi.changeSeq(params).then(res => {
        if (res.code == 0) {
          vm.$message.success("顺序交换成功");
          vm.load();
        } else {
          vm.$message.error("位置交换异常");
        }
        vm.listLoading = false;
      });
    },
    newTip() {
      let vm = this;
      vm.$router.push({ path: "/editTip" });
    },
    editTip(val) {
      let vm = this;
      vm.$router.push({ path: "/editTip", query: { id: val } });
    },
    delTip(index) {
      let vm = this;
      let params = {
        id: index
      };
      vm
        .$confirm(`你确定删除分类信息吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
          dangerouslyUseHTMLString: true
        })
        .then(() => {
          tipApi.delTip(params).then(res => {
            if (res.code == 0) {
              vm.$message.success("删除分类成功");
              vm.load();
            } else {
              vm.$message.error(res.errMsg);
            }
          });
        })
        .catch(() => {
          vm.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toUrl(val, id) {
      let vm = this;
      let params = {
        path: val
      };
      if (id) params.query = { id: id };
      vm.$router.push(params);
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
.sortic {
  padding: 0 3px;
  margin-right: 2px;
}
.el-input {
  width: 150px;
}
.edit {
  position: absolute;
  left: 0;
}
.block-hd {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.tip-block {
  width: 100%;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 14px;
  p {
    margin: 0;
  }
  .tip-item {
    box-sizing: border-box;
    padding: 20px;
    width: 48%;

    border: 1px solid transparent;
    &:hover {
      border-color: #e9e9e9;
    }
    .par {
      display: flex;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 10px;
      align-items: center;
      .title {
        width: 180px;
        font-size: 16px;
        font-weight: 600;
      }
      .detail {
        width: 100px;
      }
      .op {
        display: flex;
        width: 110px;
        justify-content: flex-end;
        .sort {
          margin-right: 40px;
          a {
            color: tan;
          }
        }
      }
    }
    .children {
      .child {
        display: flex;
        padding: 5px 0;
        .title {
          width: 180px;
        }
        .detail {
          width: 100px;
        }
        .op {
          display: flex;
          width: 110px;
          justify-content: flex-end;
          .sort {
            margin-right: 40px;
          }
        }
      }
    }
  }
}
</style>
