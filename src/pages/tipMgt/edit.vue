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
                            <label class="col-md-2 control-label">*名称</label>
                            <div class="col-md-7">
                                <input class="form-control dll-title" type="text" v-model="name"
                                       placeholder="请输入名称">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">上级分类</label>
                            <div class="col-md-2">
                                <el-select size="small" v-model="rootTip" placeholder="全部分类">
                                    <el-option
                                    v-for="item in rootTips"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">图标</label>
                            <div class="col-md-2">
                                <el-input size="small"  v-model="icon" ></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">介绍</label>
                            <div class="col-md-9">
                                <quill-editor  ref="newEditor"  v-model="intro" ></quill-editor>
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

                    <file-wrapper @on-file-change="contentImgChange" ref="contentFileWrap"></file-wrapper>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import tipApi from "@/services/tip";
import fileUploader from "@/utils/fileUploader";
import { quillEditor } from "vue-quill-editor";
import { addQuillTitle } from "@/utils/quill-title.js";
import * as Quill from "quill";
import FileWrapper from "@/components/file-upload-wrapper";
export default {
  components:{FileWrapper},
  mounted() {
    let vm = this;
    vm.getRootTip();
    if(vm.$route.query.id)
        vm.id = vm.$route.query.id;
    if(vm.id != "")
        tipApi.getTip({id:vm.id}).then(res => {
            if(res.code == 0){
                vm.rootTip = res.data.parent_id;
                vm.name = res.data.name;
                vm.intro = res.data.content;
                vm.icon = res.data.icon;
            }
            else
                vm.$message.error(res.errMsg)
        })
    let imgHandler = async function(state) {
      if (state) vm.contentUpload();
    };
    vm.$refs.newEditor.quill
      .getModule("toolbar")
      .addHandler("image", imgHandler);
  },
  data() {
    return {
      pageTitle: "编辑分类",
      rootTip:null,
      rootTips:[],
      name:"",
      id:"",
      intro:"",
      icon:""
    };
  },
  methods: {
    contentUpload() {
      let vm = this;
      vm.$refs.contentFileWrap.openFinder();
    },
    getRootTip() {
      let vm = this;
      tipApi.getRootList().then(res => {
        if (res.code == 0) vm.rootTips = res.data;
        else vm.$message.error(res.errMsg);
      });
    },
    save(){
        let vm = this;
        if(vm.name == "")
            return vm.$message.error("分类名称不能为空");
        let params = {
            name: vm.name,
            parent_id: vm.rootTip,
            content: vm.intro,
            icon:vm.icon
        }
        if(vm.id != "")
            params.id = vm.id
        tipApi.edit(params).then(res => {
            if (res.code == 0){
                vm.$message.success('商品分类信息保存成功');
                vm.$router.push({path: '/tipMgt'});
            }
            else vm.$message.error(res.errMsg);
        })
    },
    cancel() {
      this.$router.go(-1);
    },
    contentImgChange(file) {
      let vm = this;
      fileUploader.normal(file).then(data => {
          vm.addImg = vm.$refs.newEditor.quill.getSelection();
          vm.$refs.newEditor.quill.insertEmbed(
            vm.addImg != null ? vm.addImg.index : 0,
            "image",
            data,
            Quill.sources.USER
          );
      });
    },
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