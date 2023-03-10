<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>商品管理</el-breadcrumb-item>
           <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 栅格布局   gutter 列与列之间的距离 -->
           <el-row :gutter="20">
              <el-col :span="8">
                <!-- 搜索框 -->
               <el-input placeholder="请输入内容" v-model="queryInfo.query"
                 clearable @clear="getGoodsList">
               <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
               </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="goAddPage">添加商品</el-button>
              </el-col>
           </el-row>
           <!-- 用户列表区域 -->
           <el-table :data="goodsList" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="goods_name" label="商品名称"></el-table-column>
              <el-table-column prop="goods_price" label="商品价格（元）" width="95px"></el-table-column>
              <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
              <el-table-column prop="add_time" label="创建时间" width="140px">
                <template slot-scope="scope">
                    {{ scope.row.add_time | dateFormat }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="130px">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete"
                     @click="renoveById(scope.row.goods_id)"></el-button>
                </template>
              </el-table-column>
           </el-table>

           <!-- 分页区域 -->
           <el-pagination @size-change="handleSizeChange"
            @current-change="handleCurrentChange" 
            :current-page="queryInfo.pagenum"
            :page-sizes="[5,10,15,30,60]" :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
           </el-pagination>
        </el-card>

    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            // 查询参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            goodsList:[],
            // 总数据
            total:0,

        };
    },
    mounted(){
        this.getGoodsList();
    },
    methods: {
        // 根据分页获取对应的商品列表
        async getGoodsList(){
            const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status !==200){
                return this.$message.error('获取列表失败！')
            }
            this.$message.success('获取列表成功！')
            // console.log(res.data);
            this.goodsList = res.data.goods;
            this.total = res.data.total;
        },
        // 当前每页数据发生变化时触发
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoodsList()
        },
        // 当前页码发生变化时触发
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoodsList()
        },
        // 删除商品
        async renoveById(id){
            const confirmResult=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err)
            if(confirmResult !=='confirm'){
                return this.$message.info('已取消删除！')
            }
            const {data:res} = await this.$http.delete(`goods/${id}`)
            if(res.meta.status !==200){
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getGoodsList()
        },
        goAddPage(){
            this.$router.push('/goods_add')
        }
    },
    components: { },
};
</script>

<style scoped lang="less">

</style>
