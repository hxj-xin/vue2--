<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="@/assets/tanx.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="loginOut">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 左侧menu 是否开启折叠动画collapse-transition :default-active="activePath"保持高亮状态-->
                <el-menu background-color="#323744" text-color="#fff"
                 active-text-color="#409eef" unique-opened :collapse="isCollapse"
                 :collapse-transition="false" router :default-active="activePath">
                   <!-- 一级菜单 -->
                   <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                      <!-- 一级菜单模板区 -->
                      <template slot="title">
                         <!-- 图标 -->
                         <i :class="iconsObj[item.id]" class="iconsyi"></i>
                         <!-- 文本 -->
                         <span>{{item.authName}}</span>
                      </template>
                      <!-- 二级菜单 -->
                      <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" 
                      :key="subitem.id" @click="saveNavState('/' + subitem.path)">
                         <template slot="title">
                         <!-- 图标 -->
                         <i class="el-icon-menu"></i>
                         <!-- 文本 -->
                         <span>{{subitem.authName}}</span>
                      </template>
                      </el-menu-item>
                   </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>

export default {
    props: {},
    data() {
        return {
            menuList:[],
            iconsObj:{
                // 摘取一级菜单id
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-shuju'
            },
            //是否折叠
            isCollapse:false,
            // 被激活的链接dizhi
            activePath:''
        };
    },
    created(){
        this.getMenuList();
        // 被激活的链接地址
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
        // 退出登录
        loginOut(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        // 获取左侧菜单
        async getMenuList(){
           const { data: res } = await this.$http.get('menus');
           if(res.meta.status !==200) return this.$message.error(res.meta.msg);
           this.menuList=res.data;
           // console.log(res);
        },
        // 点击按钮 菜单折叠 展开
        toggleCollapse(){
           this.isCollapse = !this.isCollapse;
        },
        saveNavState(activePath){
           window.sessionStorage.setItem('activePath',activePath);
           this.activePath = activePath;

        }
    },
    components: {},
};
</script>
<style scoped lang="less">
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 2rem;
    padding-left: 0px;
    div{
        display: flex;
        align-items: center;
        img{
            width: 60px;
            margin: 0 10px;
        }
    }
}
.el-aside{
    background-color: #333744;  
    .el-menu{
        border: none;
    }
    .toggle-button{
        background-color: #4a5054;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2rem;
        cursor: pointer;
    }
}
.el-main{
    background-color: #eaedf1;

}
.iconsyi{
    width: 10px;
    margin-right: 10px;
}
</style>
