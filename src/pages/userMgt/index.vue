<template>
    <div>
        <div class="content" id="userinfo">
            <div class="block">
                <div class="block-header form-horizontal">
                        <div class="row searchuser" >
                            <el-input class="slogoncontent" v-model="username" placeholder="搜索用户"></el-input>
                            <el-button class="confticketId " type="primary" @click="searchUser()">搜索</el-button>
                        </div>
                        <div class="block-content" style="margin-left:20px;" >
                            <el-table :data="users"  ref="multipleTable" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                              style="width: 100%;" >
                                <el-table-column label="用户头像" header-align="center">
                                    <template slot-scope="scope"> 
                                        <div class="image">
                                            <img :src="scope.row.head_img_url">
                                        </div>
                                    </template> 
                                </el-table-column>
                                <el-table-column prop="nick_name" label="用户昵称" header-align="center">
                                    <template slot-scope="scope"> 
                                       <span>{{scope.row.nick_name == "" ? '匿名用户':scope.row.nick_name}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column label="真实姓名" header-align="center">
                                    <template slot-scope="scope"> 
                                       <span>{{scope.row.real_name == "" ? '-':scope.row.real_name}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column prop="telephone" label="联系方式" header-align="center">
                                     <template slot-scope="scope"> 
                                       <span>{{scope.row.telephone == "" ? '-':scope.row.telephone}}</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column label="联系方式" header-align="center">
                                    <template slot-scope="scope"> 
                                       <span v-if="scope.row.gender == 1">男</span>
                                       <span v-else>女</span>
                                    </template> 
                                </el-table-column>
                                <el-table-column prop="createdAt" label="注册时间" header-align="center" width="165">
                                    <template slot-scope="scope"> 
                                        {{formattime(scope.row.createdAt)}}
                                    </template> 
                                </el-table-column>
                                <el-table-column label="操作" header-align="center" width="120">
                                    <template slot-scope="scope">
                                        <el-button  size="small" @click="moredetails(scope.$index)">查看用户详情</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination">
                            <el-pagination
                                @current-change="pageChange"
                                :current-page.sync="queryParams.page"
                                :page-size="queryParams.perPage"
                                layout="total, prev, pager, next"
                                :total="totalCount">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import userApi from "@/services/user";
import moment from "moment";
export default {
  data() {
    return {
      item: {},
      username: "",
      gcname: "",
      users: [],
      listLoading: false,
      queryParams: {
        page: 1,
        perPage: 15
      },
      totalCount: 0
    };
  },
  mounted() {
    let vm = this;
    vm.load(vm.queryParams.page);
  },
  methods: {
    load(val) {
      let vm = this;
      if (!val) val = vm.queryParams.page;
      let params = {
        page: val,
        pageSize: vm.queryParams.perPage
      };
      
      if(vm.gcname != "") params.name = vm.gcname;
      userApi.getList(params).then(res => {
        if (res.code == 0) {
          vm.users = res.data.data;
          vm.totalCount = res.data.total;
        } else vm.$message.error(res.errMsg);
      });
    },
    pageChange(val) {
      let vm = this;
      vm.load(val);
      scrollTo(0, 0);
    },
    searchUser(){
        let vm = this;
        vm.gcname = vm.username;
        vm.load(1)
    },
    formattime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    moredetails(index) {
      let vm = this;
      vm.$router.push({
        path: "/userDetail",
        query: { id: vm.users[index].user_id }
      });
    }
  }
};
</script>
<style lang="scss">
.image{
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    img{
        width: 100%;
    }
}
</style>
