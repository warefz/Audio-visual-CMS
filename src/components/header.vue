<template>
  <!-- Header -->
  <header id="header-navbar" class="content-mini content-mini-full">
    <!-- Header Navigation Right -->
    <ul class="nav-header pull-right">
        <li>
            <div class="btn-group">
                <button class="btn btn-default btn-image dropdown-toggle" data-toggle="dropdown" type="button">
                    <img src="~@/assets/imgs/avatar.jpg" alt="Avatar">
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right">
                    <li class="headeruser">{{username}}</li>
                    <!--<li class="dropdown-header">Actions</li>-->
                    <!--<li>-->
                        <!--<router-link tabindex="-1" to="/changePassword">-->
                            <!--<i class="si si-user pull-right"></i>修改密码-->
                        <!--</router-link>-->
                    <!--</li>-->
                    
                    <li>
                        <router-link tabindex="-1" to="/resetPwd">
                            修改密码
                        </router-link>
                        <a  @click="quit">
                            <i class="si si-logout pull-right" ></i>退出登录
                        </a>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
  <ul class="nav-header pull-left">
      <li class="hidden-md hidden-lg">
          <!-- Layout API, functionality initialized in App() -> uiLayoutApi() -->
          <button class="btn btn-default" data-toggle="layout" data-action="sidebar_toggle" type="button">
              <i class="fa fa-navicon"></i>
          </button>
      </li>
      <li class="hidden-xs hidden-sm">
          <!-- Layout API, functionality initialized in App() -> uiLayoutApi() -->
          <button class="btn btn-default" data-toggle="layout" data-action="sidebar_mini_toggle" type="button">
              <i class="fa fa-ellipsis-v"></i>
          </button>
      </li>
  </ul>
  </header>
  <!-- END Header -->
</template>

<script>
import adminApi from '@/services/admin.js'
import config from '@/config.js'
var uiLayoutApi = function($mode) {
    var $windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var $lPage = $('#page-container')
    // Mode selection
    switch($mode) {
        case 'sidebar_toggle':
            if ($windowW > 991) {
                $lPage.toggleClass('sidebar-o');
            } else {
                $lPage.toggleClass('sidebar-o-xs');
            }
            break;
        case 'sidebar_mini_toggle':
            if ($windowW > 991) {
                $lPage.toggleClass('sidebar-mini');
            }
            break;
        default:
            return false;
    }
};
export default {
  mounted() {
    var $lHtml = $('html');
    $('[data-toggle="layout"]').on('click', function(){
        var $btn = $(this);

        uiLayoutApi($btn.data('action'));

        if ($lHtml.hasClass('no-focus')) {
            $btn.blur();
        }
    });
    if(localStorage.getItem(config.username))
        this.username=localStorage.getItem(config.username)
  },
  props: {},
  data() {
    return {
        username:''
    };
  },
  methods: {
      quit(){
        let vm = this;
        adminApi.logout({token:localStorage.getItem(config.token)})
        localStorage.removeItem(config.username)
        localStorage.removeItem(config.username.token)
        vm.$router.push({path:'/login'})
      }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.headeruser{
    margin: 0 12px;
    padding: 5px 0 4px;
    font-weight: 600;
    color: #999999;
    font-size: 12px;
    line-height: 1.42857143;
    border-bottom: 1px solid #bebcbc;
}
</style>
