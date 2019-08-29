<template>
    <div>
        <div class="content bg-gray-lighter">
            <div class="row items-push">
                <div class="col-sm-7">
                    <h1 class="page-heading">
                        {{pageTitle}}
                    </h1>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="block">
                <div class="block-content block-content-narrow">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-2 control-label">*分类名称</label>
                            <div class="col-md-7">
                                <input class="form-control dll-title" type="text" v-model="name"
                                       placeholder="分类名称">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">*上级分类</label>
                            <div class="col-md-2">
                                <el-select size="small" v-model="rootType" placeholder="全部分类">
                                    <el-option
                                    v-for="item in rootTypes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-2"></div>
                            <div class="row" style="margin-left:40px;">
                                <div class="col-md-2">
                                    <a class="btn btn-success add-btn dll-save" @click="save">保存</a>
                                </div>
                                <div class="col-md-2">
                                    <a class="btn btn-success add-btn dll-save" @click="cancel">取消</a>
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
import typeApi from "@/services/type";
export default {
  mounted() {
    let vm = this;
    vm.getRootType();
    if(vm.$route.query.id)
        vm.id = vm.$route.query.id;
    if(vm.id != "")
        typeApi.getType({id:vm.id}).then(res => {
            if(res.code == 0){
                vm.rootType = res.data.parent_id;
                vm.name = res.data.name;
            }
            else
                vm.$message.error(res.errMsg)
        })
  },
  data() {
    return {
      pageTitle: "编辑分类",
      rootType:"",
      rootTypes:[],
      name:"",
      id:""
    };
  },
  methods: {
    getRootType() {
      let vm = this;
      typeApi.getRootList().then(res => {
        if (res.code == 0) vm.rootTypes = res.data;
        else vm.$message.error(res.errMsg);
      });
    },
    save(){
        let vm = this;
        if(vm.name == "")
            return vm.$message.error("分类名称不能为空");
        if(vm.rootType == "")
            return vm.$message.error("父分类名称不能为空");
        let params = {
            name: vm.name,
            parent_id: vm.rootType
        }
        if(vm.id != "")
            params.id = vm.id
        typeApi.edit(params).then(res => {
            if (res.code == 0){
                vm.$message.success('商品分类信息保存成功');
                vm.$router.push({path: '/typeMgt'});
            }
            else vm.$message.error(res.errMsg);
        })
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.spec {
  background: #eee;
  margin-top: 20px;
}

.spec-label {
  padding-top: 7px;
}

.list-left {
  flex: 1;
}

.list-item {
  padding-bottom: 15px;
  border-bottom: 1px #ddd solid;
}

.quest-title {
  font-size: 14px;
  font-weight: bold;
}

.add-btn {
  width: 80px;
}

.detail-link {
  width: 80px;
  text-align: center;
}
</style>