<template>
    <div>
        <div class="content bg-gray-lighter">
            <div class="row items-push">
                <div class="col-sm-7">
                    <h1 class="page-heading">
                        店铺信息
                    </h1>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="block">
                <div class="body">
                    <div class="item-name">
                        <span class="name">店铺名称：</span>
                        <input type="text" placeholder="请输入商品名称" disabled v-model="shop.name"/>
                    </div>
                    <div class="item-state">
                        <span class="name">店铺状态：</span>
                        <span class="state" v-if="shop.checked == 1">正在销售</span>
                        <span class="state" v-if="shop.checked == -1">正在审核</span>
                        <span class="state" v-if="shop.checked == 0">审核失败</span>
                    </div>
                    <div class="item-banner">
                        <div class="title">
                            <span class="name">横幅图片：</span>
                        </div>
                        <div class="images">
                            <img :src="shop.bannerImg"/>
                        </div>
                    </div>
                    <div class="item-thumbnail">
                        <div class="title">
                            <span class="name">缩略图：</span>
                        </div>
                        <div class="images">
                            <img :src="shop.thumbnail"/>
                        </div>
                    </div>
                    <div class="item-quantity">
                        <span class="name">商品数量：</span>
                        <span class="number"><span>{{shop.commodityQuantity}}</span>件</span>
                    </div>
                    <div class="item-sell" v-if="id.length != 0">
                        <span class="name">销售金额：</span>
                        <span class="number"><span>{{shop.sellQuantity}}</span>件</span>
                    </div>
                    <div class="item-address">
                        <span class="name">地址信息：</span>
                        <input type="text" disabled placeholder="请输入地址信息" v-model="shop.address"/>
                    </div>
                    <div class="item-intro">
                        <span class="name">店铺介绍：</span>
                        <textarea disabled v-model="shop.description" rows="4" cols="80"></textarea>
                    </div>
                    <div class="item-telephone">
                        <span class="name">联系方式：</span>
                        <input type="text" disabled placeholder="请输入联系方式" v-model="shop.telephone"/>
                    </div>
                    <div class="item-edit" >
                        <a class="save" v-if="shop.checked != 1 " @click="updateChecked(1)">通过审核</a>
                        <a class="save" @click="updateChecked(0)">未通过</a>
                        <a class="cancel" @click="cancel">取消</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import shopApi from "@/services/shop";
export default {
  data() {
    return {
      shop: {},
      id: ""
    };
  },
  mounted: function() {
    let vm = this;

    if (vm.$route.query.id) {
      vm.id = vm.$route.query.id;
      let cId = { id: vm.id };

      shopApi.getInfo(cId).then(res => {
        if (res.code == 0) {
          vm.shop = res.data;
        } else vm.$message.error(res.errMsg);
      });
    }
  },
  methods: {
    updateChecked(val) {
      let vm = this;
      let params = {
        id: vm.id,
        checked: val
      };
      shopApi.setChecked(params).then(res => {
        if (res.data == 0) {
          vm.$message.success("店铺状态更新成功");
          vm.$router.go(-1);
        }
      });
    },
    cancel() {
      let vm = this;
      vm.$router.go(-1);
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
.el-select {
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
    .item-state {
      display: flex;
      align-items: center;
      margin: 20px 0;
      .state {
          margin-left: 5px;
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
      margin: 20px 0;
    }
    .item-banner {
      display: flex;
      align-items: flex-start;
      margin: 20px 0;
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
        img {
          width: 100px;
          height: 100px;
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
      align-items: center;
      .number {
        margin: 0 10px;
        span {
          margin-right: 5px;
        }
      }
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
    .item-intro {
      margin-top: 20px;
      display: flex;
      textarea {
        margin-left: 5px;
        resize: none;
        border-radius: 3px;
        border-color: #dad7d7;
        padding: 8px;
      }
    }
    .item-telephone {
      margin-top: 20px;
      display: flex;
    }
    .item-address {
      margin-top: 20px;
      display: flex;
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
