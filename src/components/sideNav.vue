<template>
    <nav id="sidebar">
        <!-- Sidebar Scroll Container -->
        <div id="sidebar-scroll">
            <!-- Sidebar Content -->
            <!-- Adding .sidebar-mini-hide to an element will hide it when the sidebar is in mini mode -->
            <div class="sidebar-content">
                <!-- Side Header -->
                <div class="side-header side-content bg-white-op">
                    <!-- Layout API, functionality initialized in App() -> uiLayoutApi() -->
                    <button @click="close" class="btn btn-link text-gray pull-right hidden-md hidden-lg" type="button"
                            data-toggle="layout" data-action="sidebar_close">
                        <i class="fa fa-times"></i>
                    </button>
                    <a class="h5 text-white" @click="tohome">
                        <!--<i class="fa fa-circle-o-notch text-primary"></i>-->
                        <span class="h5 font-w600 sidebar-mini-hide">销售平台管理后台</span>
                    </a>
                </div>
                <!-- END Side Header -->
                <!-- Side Content -->
                <div class="side-content">
                    <ul class="nav-main">
                        <li v-for="(m,index) in menus" :key="index">
                            <a v-if="m.subMenus" class="nav-submenu" data-toggle="nav-submenu" href="#">
                                <!--<i class="si si-badge"></i>-->
                                <img :src="m.icon" class="icon">
                                <span class="sidebar-mini-hide">{{m.name}}</span>
                            </a>
                            <router-link v-if="!m.subMenus" :to="m.path">
                                <!--<i class="si si-badge"></i>-->
                                <img :src="m.icon" class="icon">
                                <span class="sidebar-mini-hide">{{m.name}}</span>
                            </router-link>
                            <ul v-if="m.subMenus">
                                <li @click="close" v-for="(sm,i) in m.subMenus" :key="i">
                                    <router-link :to="sm.path">{{sm.name}}</router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <!-- END Side Content -->
            </div>
            <!-- Sidebar Content -->
        </div>
        <!-- END Sidebar Scroll Container -->
    </nav>
</template>

<script>
    import {mapGetters} from "vuex";

    let menus = [
        {
            name: "主页管理",
            path: "/homeMgt",
            icon: '/static/img.png',
        },
        {
            name: "商品属性管理",
            path: "/attributeMgt",
            icon: '/static/tag.png',
        },
        {
            name: "分类管理",
            icon: '/static/topic.png',
            subMenus:[
                {
                    name:"主分类管理",
                    path: "/rootTypeMgt"
                },
                {
                    name:"子分类管理",
                    path: "/typeMgt"
                }
            ]
        },
        {
            name: "商品管理",
            icon: '/static/activity.png',
            subMenus:[
                {
                    name:"商品信息",
                    path: "/commodityMgt"
                },
                {
                    name:"商品审核",
                    path: "/commodityCheck"
                },
            ]
        },
         {
            name: "店铺管理",
            icon: '/static/message.png',
            subMenus:[
                {
                    name:"店铺信息",
                    path: "/shopMgt"
                },
                {
                    name:"店铺审核",
                    path: "/shopCheck"
                },
            ]
        },
        {
            name: "页脚管理",
            icon: '/static/question.png',
            subMenus:[
                {
                    name:"相关信息",
                    path: "/tipMgt"
                },
                {
                    name:"新建信息",
                    path: "/editTip"
                },
            ]
        },
        {
            name: "用户管理",
            icon: '/static/user.png',
            subMenus:[
                {
                    name:"用户信息",
                    path: "/userMgt"
                }
            ]
        },
        {
            name: "销售情况展示",
            icon: '/static/user.png',
            path: "/sellInfo"
        },
    ];
    export default {
        mounted() {
            this.$lPage = $("#page-container");
            setTimeout(() => {
                // 这里写jquery代码
                $('[data-toggle="nav-submenu"]').on("click", function (e) {
                    // Get link
                    var $link = jQuery(this);

                    // Get link's parent
                    var $parentLi = $link.parent("li");

                    if ($parentLi.hasClass("open")) {
                        // If submenu is open, close it..
                        $parentLi.removeClass("open");
                    } else {
                        // .. else if submenu is closed, close all other (same level) submenus first before open it
                        $link
                            .closest("ul")
                            .find("> li")
                            .removeClass("open");

                        $parentLi.addClass("open");
                    }

                    // Remove focus from submenu link
                    if ($("html").hasClass("no-focus")) {
                        $link.blur();
                    }

                    return false;
                });
            }, 10);
        },
        props: {},
        data() {
            return {
                menus: menus
            };
        },
        methods: {
            close() {
                var $windowW =
                    window.innerWidth ||
                    document.documentElement.clientWidth ||
                    document.body.clientWidth;
                this.$lPage.removeClass("sidebar-o-xs");
            },
            tohome(){
                this.$router.push({path:'/imgMgt'})
            }
        }
    };
</script>

<style lang="scss" scoped>
    .logo {
        width: 40px;
        height: 40px;
    }

    .icon {
        width: 20px;
        height: 20px;
    }
</style>