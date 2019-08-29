<template>
    <div>
        <div class="content bg-gray-lighter">
            <div class="row items-push">
                <div class="col-sm-7">
                    <h1 class="page-heading">
                        商品信息
                    </h1>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="block">
                <div class="body">
                    <div class="item-name">
                        <span class="name">商品名称：</span>
                        <input type="text" placeholder="请输入商品名称" disabled v-model="commodity.name"/>
                    </div>
                    <div class="item-type">
                        <span class="name">商品分类：</span>
                        <input type="text" disabled v-model="commodity.rootType"/>
                        <input type="text" disabled v-model="commodity.type"/>
                    </div>
                    <div class="item-banner">
                        <div class="title">
                            <span class="name">横幅图片：</span>
                        </div>
                        <div class="images">
                        <img :src="commodity.bannerImg"/>
                        </div>
                    </div>
                    <div class="item-thumbnail">
                        <div class="title">
                            <span class="name">商品缩略图：</span>
                        </div>
                        <div class="images">
                            <div class="title">
                                <div class="show-img">图片</div>
                            </div>
                            <div class="tip" v-if="commodity.thumbnails.length == 0">
                            暂无缩略图信息
                            </div>
                            <div class="image" v-else v-for="(t,i) in commodity.thumbnails" :key="i">
                                <div class="source">
                                    <img :src="t.src"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item-cost">
                        <span class="name">原价：</span>
                        <input type="text"  disabled placeholder="请输入商品原价" v-model="commodity.costPrice"/>
                    </div>
                    <div class="item-price">
                        <span class="name">现价：</span>
                        <input type="text" disabled placeholder="请输入商品售价" v-model="commodity.price"/>
                    </div>
                    <div class="item-quantity">
                        <span class="name">数量：</span>
                        <input type="text" disabled placeholder="请输入商品数量" v-model="commodity.quantity"/>
                    </div>
                    <div class="item-sell" v-if="id.length != 0">
                        <span class="name">销量：</span>
                        <span class="number"><span>{{commodity.sellQuantity}}</span>件</span>
                    </div>
                    <div class="item-attribute">
                        <span class="name">商品属性：</span>
                        <div class="list">
                            <div class="sitem" v-for="d in commodity.attributeContent" :key="d.seq">
                                <div class="content-area">
                                    <el-select v-model="d.name" disabled size="small" placeholder="请选择">
                                        <el-option v-for="item in commodity.attributes" :key="item.id" 
                                        :label="item.name" :value="item.name" >
                                        </el-option>
                                    </el-select>
                                    <input type="text" disabled v-model="d.content"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item-intro">
                        <span class="name">商品介绍：</span>
                        <div style="width:774px;" class="ql-editor" v-html="commodity.intro"> </div>
                    </div>
                    <div class="item-edit" >
                        <a class="save" v-if="commodity.checked != 1 && commodity.checked != 2" @click="updateChecked(2)">通过审核</a>
                        <a class="save" @click="updateChecked(0)">未通过</a>
                        <a class="cancel" @click="cancel">取消</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import commodityApi from "@/services/commodity";
import attributeApi from "@/services/attribute";
import typeApi from "@/services/type";
export default {
  data() {
    return {
      commodity: {
        intro: "",
        name: "", //商品名
        rootTypes: [],
        rootType: "",
        types: [],
        type: "", //分类,
        bannerImg: "", //横幅图片
        thumbnails: [], //缩略图
        costPrice: "", //原价
        price: "", //价格
        quantity: "", //数量
        sellQuantity: 0,
        //detailContent: [],
        attributeContent: [],
        attributes: [], //属性
        addImg: "" ,//商品内容上传图片
        checked: 1
      },
      id:"",
      props: {
        value: "label",
        children: "children"
      }
    };
  },
  mounted: function() {
    let vm = this;
    
    if(vm.$route.query.id){
      vm.id = vm.$route.query.id
      let cId = { id: vm.id }
      
        attributeApi.getList().then(res=>{
        vm.commodity.attributes = res.data;
        });
      commodityApi.getInfo(cId).then(res => {
        if(res.code == 0){
          let ls = res.data;
          let item = vm.commodity;
          item.intro = ls.content;
          item.name = ls.name;
          item.bannerImg = ls.bannerImg;
          item.costPrice = ls.costPrice == 0 ? "":ls.costPrice;
          item.quantity = ls.quantity;
          item.price = ls.price;
          item.checked = ls.checked;
          item.sellQuantity = ls.sellQuantity;
          for(let i of ls.thumbnails)
            item.thumbnails.push({src: i.thumbnail_url,seq: i.seq});
          item.attributeContent = ls.attributeContent;
          item.rootType = ls.typeRoute[0].name;
          item.type = ls.typeRoute[1].name;
        }
        else
          vm.$message.error(res.errMsg)
      })
    }
  },
  updated() {
    $('.ql-editor img').css('max-width', '100%');
  },
  methods: {
    updateChecked(val) {
      let vm = this;
      let params = {
          id: vm.id,
          checked: val
      }
      commodityApi.setChecked(params).then(res => {
          if(res.data == 0){
              vm.$message.success('商品状态更新成功');
              vm.$router.go(-1);
          }
      })
    },
    getAttributeId(val){
      let vm = this;
      for(let i of vm.commodity.attributes){
        if(val.name == i.name){
          val.attribute_id = i.id
        }
      }
    },
    cancel(){
        let vm = this;
        vm.$router.go(-1)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-select-dropdown {
  ul {
    li {
      float: initial;
    }
  }
}
.el-select{
    width: 100px;
}
.content {
  margin-top: 10px;
  margin-left: 20px;
  background: #fff;
  border: 1px solid #e9e9e9;
  width: 88%;
  min-width: 900px;
  .block {
    .header {
      border-bottom: 1px solid #e9e9e9;
      display: flex;
      .title {
        color: #666;
        font-weight: 700;
        font-size: 16px;
        padding: 15px 20px;
      }
    }
  }
  .body {
    padding: 20px;
    div {
      .name {
        display: block;
        width: 100px;
        text-align: right;
        line-height: 16px;
        padding: 5px;
        font-size: 13px;
        font-weight: 600;
      }
    }
    input {
      box-sizing: border-box;
      margin-left: 5px;
      padding: 6px 12px;
      height: 34px;
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #dad7d7;
      &:focus {
        border-color: #409eff;
      }
    }
    .item-name {
      display: flex;
      align-items: center;
      input {
        width: 350px;
      }
    }
    .item-type {
      display: flex;
      align-items: center;
      margin:20px 0;
    }
    .item-banner {
        display: flex;
        align-items: flex-start;
        margin:20px 0;
      .images {
        margin-left: 5px;
        img {
          max-width: 800px;
          max-height: 400px;
        }
      }
    }
    .item-thumbnail {
      margin-top: 15px;
        display: flex;
      .images {
        margin-left: 5px;
        display: flex;
        flex-direction: column;
        .title {
          text-align: center;
          border-bottom: 1px solid #ebeef5;
          border-top: 1px solid #ebeef5;
          padding: 10px 0;
          font-weight: 600;
        }
        .image {
          display: flex;
          justify-content: center;
          border-bottom: 1px solid #ebeef5;
          .source {
            text-align: center;
            width: 120px;
            padding: 10px 5px;
            img {
              width: 80px;
              height: 80px;
            }
          }
        }
        .bt {
          width: 260px;
          color: #e6a23c;
          padding-top: 5px;
          i {
            margin-right: 5px;
          }
        }
      }
    }
    .item-cost {
      margin-top: 20px;
      display: flex;
    }
    .item-price {
      margin-top: 20px;
      display: flex;
    }
    .item-quantity {
      margin-top: 20px;
      display: flex;
    }
    .item-sell {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .number {
        margin: 0 10px;
        span {
          margin-right: 5px;
        }
      }
    }
    .item-attribute {
      margin-top: 20px;
      display: flex;
      .list {
        .sitem {
          display: flex;
          margin-bottom: 10px;
          .content-area {
              display: flex;
              align-items: center;
            margin-left: 5px;
          }
        }
      }
    }
    .item-intro {
      margin-top: 20px;
      display: flex;
      .ql-editor{
          border:1px solid #e9e9e9;
      }
    }
    .item-edit {
      margin: 130px 0 20px 130px;
      a {
        padding: 7px 20px;
        margin-right: 10px;
        border-radius: 3px;
        font-size: 14px;
      }
      .save {
        background: #5584ff;
        color: #fff;
      }
      .cancel {
        background: #fff;
        border: 1px solid #bdbdbd;
        &:hover {
          background: #e9e9e9;
        }
      }
    }
  }
}
</style>
