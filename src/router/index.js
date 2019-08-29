import Vue from 'vue'
import Router from 'vue-router'
//components
import Login from '@/pages/login/index'
import Layout from '@/pages/layout/index'
import ResetPwd from '@/pages/resetPwd/index'
import HomeMgt from '@/pages/homeMgt/index'
import AttributeMgt from '@/pages/attributeMgt/index'
import RootTypeMgt from '@/pages/rootTypeMgt/index'
import TypeSelected from '@/pages/rootTypeMgt/selected'
import TypeMgt from '@/pages/typeMgt/index'
import EditType from '@/pages/typeMgt/edit'
import TipMgt from '@/pages/tipMgt/index'
import EditTip from '@/pages/tipMgt/edit'
import ShopMgt from '@/pages/shopMgt/index'
import ShopCheck from '@/pages/shopMgt/check'
import ShopDetail from '@/pages/shopMgt/detail'
import CommodityMgt from '@/pages/commodityMgt/index'
import CommodityCheck from '@/pages/commodityMgt/check'
import CommodityDetail from '@/pages/commodityMgt/detail'
import UserMgt from '@/pages/userMgt/index'
import UserDetail from '@/pages/userMgt/detail'
import SellDetail from '@/pages/sellMgt/index'
Vue.use(Router)

export default new Router({
    mode:'history',
    routes: [
        {path: '/login', component: Login},
        {path: '/resetPwd', component: ResetPwd},
        {
            path: '/', component: Layout,redirect:'/login',
            children: [
                {path:'/homeMgt', component: HomeMgt},
                {path:'/attributeMgt', component: AttributeMgt},
                {path:'/rootTypeMgt', component: RootTypeMgt},
                {path:'/typeMgt', component:TypeMgt},
                {path:'/editType', component:EditType},
                {path:'/typeSelected', component:TypeSelected},
                {path:'/tipMgt', component:TipMgt},
                {path:'/editTip', component:EditTip},
                {path:'/shopMgt', component:ShopMgt},
                {path:'/shopCheck', component:ShopCheck},
                {path:'/shopDetail', component:ShopDetail},
                {path:'/commodityMgt', component:CommodityMgt},
                {path:'/commodityCheck', component:CommodityCheck},
                {path:'/commodityDetail', component:CommodityDetail},
                {path:'/userMgt', component:UserMgt},
                {path:'/userDetail', component:UserDetail},
                {path:'/sellInfo', component:SellDetail}
            ]
        },
    ]
})
