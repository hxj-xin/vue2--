<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>商品管理</el-breadcrumb-item>
           <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button class="addbn" type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table :data="catelist" :columns="columns" :selection-type="false"
             :expand-type="false" show-index index-text="#" border 
             :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false"
                     style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <!-- 一级 -->
                    <el-tag size="mini" v-if="scope.row.cat_level ===0">一级</el-tag>
                    <!-- 二级 -->
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level ===1">二级</el-tag>
                    <!-- 三级 -->
                    <el-tag size="mini" type="warning"  v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <!-- <template slot="opt" slot-scope="scope"> -->
                <template slot="opt" >
                    <el-button type="primary" icon="el-icon-edit"  size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15,30,50]" :page-size="queryInfo.pagesize"
             layout="total, sizes, prev, pager, next, jumper"
            :total="total">
           </el-pagination>

        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible"
        width="50%" @close="addCateDialogClosed">
           <!-- 添加分类的表单 -->
           <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" 
           label-width="100px">
              <el-form-item label="分类名称：" prop="cat_name">
                 <el-input v-model="addCateForm.cat_name"></el-input>
              </el-form-item>
              <el-form-item label="父级分类：">
                <!-- options 指定数据源 Props用来指定配置对象 -->
                <el-cascader :options="parentCateList" :props="cascaderProps"
                 v-model="selectedKeys" @change="parentCateChanged" clearable 
                 >
                </el-cascader>
              </el-form-item>
           </el-form>  
           <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <!-- <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button> -->
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询条件
            queryInfo:{
                type:3,
                // query:'',
                pagenum:1,
                pagesize:5
            },
            catelist:[],
            //总数据条数
            total:0,
            columns:[
                {
                   label:'分类名称',
                   prop:'cat_name'
                },
                {
                    label: '是否有效',
                    // 表示把当前列定义为模板列
                    type: 'template',
                    // 表示当前模板列的名称
                    template:'isOk'
                },
                {
                    label: '排序',
                    // 表示把当前列定义为模板列
                    type: 'template',
                    // 表示当前模板列的名称
                    template:'order'
                },
                {
                    label: '操作',
                    // 表示把当前列定义为模板列
                    type: 'template',
                    // 表示当前模板列的名称
                    template:'opt'
                }
            ],
            // 控制添加对话框的显示与隐藏
            addCateDialogVisible:false,
            // 添加分类的表单数据对象
            addCateForm:{
                // 将要添加的分类名称
                cat_name: '',
                cat_pid: 0,
                // 分类的等级 默认添加一级分类
                cat_level: 0
            },
            // 添加分类表单的验证规则
            addCateFormRules: {
                cat_name:[
                  { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            // 父级分类的列表
            parentCateList:[],
            // 指定级联选择器的配置对象
            cascaderProps:{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly:true
            },
            // 选中的父级分类的id数组
            selectedKeys:[],



        };
    },
    created(){
        this.getCateList();
    },
    methods: {
        // 获取商品分类数据
        async getCateList(){
           const {data:res}= await this.$http.get('categories',{params:this.queryInfo});
           if(res.meta.status !==200){
             return this.$message.error('获取数据失败！')
           }
        //    console.log(res.data);
           this.catelist = res.data.result;
           this.total = res.data.total;
        },
        // 监听pagesize改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        // 监听pagenum改变 页码
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        showAddCateDialog(){
            // 先获取父级分类的数据列表
            this.getParentCateList();
            this.addCateDialogVisible=true;
        },
        // 获取父级分类的数据列表
        async getParentCateList(){
            const {data:res}= await this.$http.get('categories',{
                params: { type: 2 }
            })
            if(res.meta.status !==200){
                return this.$message.error('获取父级分类失败！')
            }
            console.log(res.data);
            this.parentCateList = res.data;
        },
        // 选择项发生变化触发该函数
        parentCateChanged(){
            console.log(this.selectedKeys);
            // 如果 selectedKeys 数组中的length大于0 ，证明选中的父级分类
            // 反之，就说明没有选中任何父级分类
            // if(this.selectedKeys.length >  0 ){
            if(this.selectedKeys.length >  0 ){
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[
                    this.selectedKeys.length - 1
                ]
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length;
                return
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 确认添加
        addCate(){
            // console.log(this.addCateForm);
            this.$refs.addCateFormRef.validate( async valid => {
                if(!valid)return
                const {data:res} = await this.$http.post('categories',
                this.addCateForm)
                if(res.meta.status !==201){
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加分类成功！')
                this.getCateList();
                this.addCateDialogVisible = false ;
            })
        },
        // 添加分类 关闭对话框
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys = [];
            this.addCateForm.cat_level = 0 ;
            this.addCateForm.cat_pid = 0 ;
        },



    },
};
</script>

<style scoped lang="less">
.el-cascader{
    width: 100%;
}
.addbn{
    margin-bottom: 20px;
}

</style>
