<template>
    <div class="content overflow-hidden">
        <div class="row">
            <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <!-- Login Block -->
                <div class="block block-themed animated fadeIn" style="padding-top:0">
                    <div class="block-header bg-primary">
                        <h3 class="block-title">修改登录密码</h3>
                    </div>
                    <div class="block-content block-content-full block-content-narrow" style="text-align:left">
                        <!-- Login Title -->
                        <h1 class="h2 font-w600 push-30-t push-5">Monkistyle管理后台</h1>
                        <!-- END Login Title -->

                        <!-- Login Form -->
                        <!-- jQuery Validation (.js-validation-login class is initialized in js/pages/base_pages_login.js) -->
                        <!-- For more examples you can check out https://github.com/jzaefferer/jquery-validation -->
                        <div class="js-validation-login form-horizontal push-30-t push-50" method="post">
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <div class="form-material form-material-primary ">
                                        <input class="form-control" type="password" id="oldpwd" v-model="oldpwd"
                                               placeholder="请输入旧密码" name="oldpwd">
                                        <label for="oldpwd">旧密码</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <div class="form-material form-material-primary ">
                                        <input class="form-control" type="password" id="password"
                                               placeholder="请输入新密码（6-12位字符）" @blur="checkpwdlen" maxlength="12" v-model="pwd" name="password">
                                        <label for="password">新密码</label>
                                    </div>
                                </div>
                                 <label v-if="showpwdlabel" class="pwdtip">密码长度不得小于6</label>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <div class="form-material form-material-primary ">
                                        <input class="form-control" type="password" id="confirmpwd"
                                              placeholder="确认新密码" maxlength="12" @blur="checkconfirmpwdlen" v-model="confirmpwd" name="confirmpwd">
                                        <label for="confirmpwd">确认密码</label>
                                    </div>
                                </div>
                                <label v-if="showconfirmpwdlabel" class="pwdtip">密码长度不得小于6</label>
                            </div>
                            
                            <div class="form-group">
                                <div class="col-xs-12 col-sm-6 col-md-4" style="display:flex;">
                                    <a class="btn btn-block btn-primary" @click="confirmr">确认</a>
                                    <a class="btn btn-block btn-primary" @click="giveup" style="margin:0;margin-left:30px">取消</a>
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
    import adminApi from '@/services/admin.js'
    import config from '@/config.js'
    export default {
        components: {
        },
        mounted() {
        },
        data() {
            return {
                checked:false,
                oldpwd: '',
                pwd: '',
                confirmpwd:'',
                showModal: false,
                showpwdlabel:false,
                showconfirmpwdlabel:false,
            };
        },
        methods: {
            checkconfirmpwdlen(){
                let vm = this
                if(vm.pwd.length<6)
                    vm.showconfirmpwdlabel=true
                else
                    vm.showconfirmpwdlabel=false
            },
            checkpwdlen(){
                let vm = this
                if(vm.pwd.length<6){
                    vm.showpwdlabel=true
                }
                else{
                    vm.showpwdlabel=false
                }
            },
            confirmr(){
                let vm = this
                if(vm.oldpwd!=''&&vm.pwd.length>=6&&vm.confirmpwd.length>=6){
                    if(vm.pwd!=vm.confirmpwd){
                        vm.$message.error("两次密码输入不一致")
                    }
                    else{
                        if(vm.pwd!=vm.oldpwd){
                            let params={
                                username:localStorage.getItem(config.username),
                                oldPassword:vm.oldpwd,
                                password:vm.pwd
                            }
                            adminApi.editPassword(params).then(res=>{
                                if(res.code==0){
                                    vm.$message.success("修改密码成功请重新登录")
                                    localStorage.removeItem(config.username)
                                    localStorage.removeItem(config.token)
                                    vm.$router.push({path:"/login"})
                                }
                                else{
                                    if(res.code==104){
                                        vm.$message.error("用户密码错误")
                                    }
                                    else{
                                        vm.$message.error("修改密码失败")
                                    }
                                }
                            })
                        }
                        else{
                            vm.$message.error("新旧密码应不相同")
                        }
                    }
                }
                else{
                    vm.$message.error("密码格式不正确")
                }
            },
            giveup(){
                this.$router.go(-1)
            }
        },
    };
</script>

<style lang="scss">
.pwdtip{
    margin-left:15px;
    color:red
}
</style>
