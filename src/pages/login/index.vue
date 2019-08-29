<template>
    <div class="content overflow-hidden">
        <div class="row">
            <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <!-- Login Block -->
                <div class="block block-themed animated fadeIn" style="padding-top:0">
                    <div class="block-header bg-primary">
                        <ul class="block-options">
                            <li><a @click="forgetPwd">忘记密码?</a></li>
                        </ul>
                        <h3 class="block-title">登录</h3>
                    </div>
                    <div class="block-content block-content-full block-content-narrow">
                        <!-- Login Title -->
                        <h1 class="h2 font-w600 push-30-t push-5">音像销售平台管理后台</h1>
                        <p>欢迎, 请登录.</p>
                        <!-- END Login Title -->

                        <!-- Login Form -->
                        <!-- jQuery Validation (.js-validation-login class is initialized in js/pages/base_pages_login.js) -->
                        <!-- For more examples you can check out https://github.com/jzaefferer/jquery-validation -->
                        <div class="js-validation-login form-horizontal push-30-t push-50" method="post">
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <div class="form-material form-material-primary ">
                                        <input class="form-control" type="text" id="login-username" v-model="username"
                                               name="login-username">
                                        <label for="login-username">用户名</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <div class="form-material form-material-primary ">
                                        <input class="form-control" type="password" id="login-password"
                                               v-model="password" name="login-password">
                                        <label for="login-password">密码</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-12 col-sm-6 col-md-4">
                                    <a class="btn btn-block btn-primary" @click="login"><i
                                            class="si si-login pull-right"></i> 登录</a>
                                </div>
                            </div>
                        </div>
                        <!-- END Login Form -->
                    </div>
                </div>
                <!-- END Login Block -->
            </div>
        </div>
    </div>
</template>

<script>
    import adminApi from '@/services/admin'
    import config from '@/config.js'
    export default {
        components: {
        },
        mounted() {
            let vm = this;
            if(localStorage.getItem(config.token)){
                adminApi.isLogin({token:localStorage.getItem(config.token)}).then(res=>{
                    if(res.code==0){
                        vm.$router.push({path:'/homeMgt'})
                    }
                })
            }
        },
        data() {
            return {
                checked:false,
                username: '',
                password: '',
                tele:'11111111111',
                email:'ware_fz@163.com'
            };
        },
        methods: {
            forgetPwd(){
                this.$alert(`手机号：${this.tele}<br>邮箱：${this.email}`, '请联系开发人员找回密码', {
                    confirmButtonText: '确定',
                    dangerouslyUseHTMLString: true,
                    center: true,
                    callback: action => {
                    }
                });
            },
            login() {
                let vm = this
                let params={
                    username:vm.username,
                    password:vm.password
                }
                
                adminApi.login(params).then(res=>{
                    if(res.code==0){
                        localStorage.setItem(config.username,vm.username)
                        localStorage.setItem(config.token,res.data)
                        vm.$router.push({path:"/homeMgt"})
                    }
                    else{
                        vm.$message.error("用户名或密码错误")
                    }
                })
            }
        },
    };
</script>

<style lang="scss">
</style>
