<template> 
    <div id="page-container" class="sidebar-l sidebar-o side-scroll" style="position:relative;height:100%">
        <main id="main-container">  
            <!-- Page Content -->
            <div class="content content-boxed">
                <!-- User Header -->
                <div class="block" style="padding-top:0">
                    <!-- Basic Info -->
                    <div class="bg-image" style="background-image: url('../../static/photo6@2x.jpg');">
                        <div class="block-content bg-primary-dark-op text-center overflow-hidden">
                            <div class="push-30-t push animated fadeInDown dp" >
                                <div class="k-image">
                                    <img :src='user.head_img_url' alt="">
                                </div>
                            </div>
                            <div class="push-30 animated fadeInUp">
                                <h2 class="h4 font-w600 text-white push-5">{{user.nick_name == '' ? '匿名用户':user.nick_name}}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="block-content text-center">
                        <div class="row items-push text-uppercase">
                            <div class="col-xs-8 col-sm-2">
                                <div class="font-w700 text-gray-darker animated fadeIn">真实姓名</div>
                                <span class="h6 font-w300 text-primary animated flipInX" >{{user.real_name == ""?'匿名用户':user.real_name}}</span>
                            </div>
                            <div class="col-xs-8 col-sm-2">
                                <div class="font-w700 text-gray-darker animated fadeIn">联系方式</div>
                                <span class="h6 font-w300 text-primary animated flipInX" >{{user.telephone == ""?'暂无':user.telephone}}</span>
                            </div>
                            <div class="col-xs-8 col-sm-2">
                                <div class="font-w700 text-gray-darker animated fadeIn">性别</div>
                                <span class="h6 font-w300 text-primary animated flipInX" >{{user.gender == 1 ?'男':'女'}}</span>
                            </div>
                            <div class="col-xs-8 col-sm-3">
                                <div class="font-w700 text-gray-darker animated fadeIn">购买件数</div>
                                <span class="h6 font-w300 text-primary animated flipInX" >{{buy.count}}</span>
                            </div>
                            <div class="col-xs-8 col-sm-3">
                                <div class="font-w700 text-gray-darker animated fadeIn">消费额</div>
                                <span class="h6 font-w300 text-primary animated flipInX" >￥{{buy.money}}</span>
                            </div>
                            <!--
                            <div class="col-xs-6 col-sm-3">
                                <div class="font-w700 text-gray-darker animated fadeIn">已使用优惠券</div>
                                <span class="h2 font-w300 text-primary animated flipInX" >{{user.usedtickets}}</span>
                            </div>
                            -->
                        </div>
                    </div>
                    <!-- END Stats -->
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <!-- Follow -->
                        <div class="user">
                            <div class="user-info" v-if="shop.id">
                                <div class="image"><img :src="shop.thumbnail_url"/></div>
                                <div class="count">店铺名：<span>{{shop.name}}</span></div>
                                <div class="count">浏览量：<span>{{shop.viewQuantity ? shop.viewQuantity:0}}</span></div>
                                <div class="count">销量：<span>{{shop.sellQuantity ? shop.sellQuantity:0}}</span></div>
                                <div class="money">销售额：<span>￥{{shop.sellMoney? shop.sellMoney:0}}</span></div>
                                <div class="detail"><a @click="toDetail">查看详情</a></div>
                            </div>
                            <div class="no-exist" v-else>
                                暂无店铺信息
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
import userApi from "@/services/user";
import moment from "moment";
export default {
  data() {
    return {
      user: {},
      shop: {},
      buy: {}
    };
  },
  mounted() {
    let vm = this;
    vm.load();
  },
  methods: {
    formattime(time) {
      return moment(time).format("YYYY年MM月DD日HH时mm分ss秒");
    },
    load() {
      let vm = this;
      let params = {
        id: vm.$route.query.id
      };
      userApi.getUserById({ id: vm.$route.query.id }).then(res => {
        if (res.code == 0) {
          vm.user = res.data.data;
          vm.shop = res.data.commodity[0];
          vm.buy = res.data.buy[0];
        } else {
          vm.$message.error("用户信息显示异常");
        }
      });
    },
    toDetail() {
      let vm = this;
      vm.$router.push({ path: "/shopDetail", query: { id: vm.shop.id } });
    }
  }
};
</script>
<style lang="scss">
.user {
  margin-top: 10px;
  border: 1px solid #ddd;
  margin-bottom: 23px;
  font-size: 12px;
  color: #4b4b4b;
  position: relative;
  z-index: 3;
  .user-info {
    display: flex;
    color: #546d7e;
    padding: 10px;
    background: #f5f8fa;
    line-height: 23px;
    .image {
      display: flex;
      align-items: center;
      width: 60px;
      border-radius: 50%;
      border: 1px solid #dec57b;
      height: 60px;
      overflow: hidden;
      margin-right: 10px;
      img {
        width: 100%;
      }
    }
    .detail {
      align-self: center;
      margin-left: 20px;
    }
    .base {
      width: 130px;
      margin: 10px 10px 0 0;
      color: #000;
    }
    .shop {
      align-self: center;
      width: 150px;
      margin-right: 10px;
    }
    .count {
      align-self: center;
      width: 150px;
      margin-right: 10px;
    }
    .money {
      align-self: center;
      span {
        color: #e4393c;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
  .no-exist {
    height: 200px;
    display: flex;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    align-items: center;
    background: #fff;
  }
}
.dp {
  display: flex;
  justify-content: center;
}
.k-image {
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  img {
    width: 100%;
  }
}
</style>