<template>
    <div> 
         <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>商品管理</el-breadcrumb-item>
           <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
            <!-- 选择商品分类 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择器 -->
                    <el-cascader :options="cateList" :props="cateProps"
                     v-model="selectedCateKeys" @change="handleChange" clearable 
                     filterable>
                   </el-cascader>
                </el-col>
            </el-row>
            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
               <el-tab-pane label="动态参数" name="many">
                  <el-button type="primary" size="mini" :disabled="idBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                  <!-- 动态参数表格 -->
                  <el-table :data="manyTableData" border stripe>
                    <!-- 展开行 -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <!-- 循环渲染tag标签 -->
                            <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                              @close="handleClose(i,scope.row)">{{ item }}</el-tag>
                            <!-- 输入的文本框 -->
                            <el-input class="input-new-tag"  v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                             ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                             @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <!-- 添加按钮 -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <!-- 索引列 -->
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" 
                             @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button type="primary" icon="el-icon-delete" size="mini"
                            @click="removeParams(scope.row.attr_id)">删除</el-button>
                        </template>                      
                    </el-table-column>
                  </el-table>
               </el-tab-pane>
               <!-- 添加静态属性的面板 -->
               <el-tab-pane label="静态属性" name="only">
                  <el-button type="primary" size="mini" :disabled="idBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                  <!-- 静态参数表格 -->
                  <el-table :data="onlyTableData" border stripe>
                    <!-- 展开行 -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <!-- 循环渲染tag标签 -->
                            <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable
                            @close="handleClose(i,scope.row)">{{ item }}</el-tag>
                            <!-- 输入的文本框 -->
                            <el-input class="input-new-tag"  v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                             ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                             @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <!-- 添加按钮 -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <!-- 索引列 -->
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" 
                             @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button type="primary" icon="el-icon-delete" size="mini"
                            @click="removeParams(scope.row.attr_id)">删除</el-button> 
                        </template>                     
                    </el-table-column>
                  </el-table>
               </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" 
         width="50%" @close="addDialogClosed">
           <!-- 验证表单 -->
           <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
              <el-form-item label="titleText" prop="attr_name">
                 <el-input v-model="addForm.attr_name"></el-input>
              </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
               <el-button @click="addDialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="addParams">确 定</el-button>
           </span>
        </el-dialog>
        <!-- 修改参数的对话框 -->
        <el-dialog title="修改" :visible.sync="editDialogVisible" width="50%" 
         @close="editDialogClosed">
           <!-- 验证表单 -->
           <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
              <el-form-item label="titleText" prop="attr_name">
                 <el-input v-model="editForm.attr_name"></el-input>
              </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
           </span>
        </el-dialog>

    </div>
</template>

<script>

export default {
    props: {},
    data() {
        return {
            // 商品列表
            cateList:[],
            // 级联选择器
            cateProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children: "children",
                checkStrictly: true,
            },
            // 级联选择框绑定的数组
            selectedCateKeys:[],
            // 被激活的页签的名称
            activeName:'many',
            // idArryLength:'',
            // 动态数据的数据
            manyTableData:[],
            // 静态数据的数据
            onlyTableData:[],
            // 控制添加对话框的显示与隐藏
            addDialogVisible: false,
            // 添加参数的表单数据对象
            addForm:{
                attr_name:''
            },
            addFormRules:{
                attr_name:[
                    {required:true,message:'请输入参数名称',trigger:'blur'}
                ]
            },
            // 控制修改对话框的显示与隐藏
            editDialogVisible:false,
            editForm:{
                attr_name:''
            },
            editFormRules:{
                attr_name:[
                   {required:true,message:'请输入参数名称',trigger:'blur'}
                ]
            },
            // // 控制按钮与文本框的切换显示
            // inputVisible: false,
            // // 文本框输入的内容
            // inputValue:'',

        };
    },
    created(){
        // 获取数据列表
        this.getCateList();
    },
    methods: {
        // 获取数据列表
        async getCateList(){
            const {data:res} = await this.$http.get('categories');
            if(res.meta.status !==200){
                return this.$message.error('获取商品分类失败！')
            }
            this.cateList = res.data;
            // console.log(this.cateList);
        },
        // 级联选择框 选中变化 会触发这个函数
        async handleChange(selectedCateKeys){
            this.getParamsData();
        },
        // tab页签点击事件的处理函数
        handleTabClick(){
            console.log(this.activeName);
            this.getParamsData();
        },
        async getParamsData(){
            if(this.selectedCateKeys.length !==3){
                this.selectedCateKeys = []
                this.manyTableData =[]
                this.onlyTableData = []
                return
            }
            // console.log(this.selectedCateKeys);
           
            // 根据所选分类的id 和当前所处的面板 获取对应的参数
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,
             {params: {sel:this.activeName}
            })
            if(res.meta.status !==200){
                return this.$message.error('获取参数列表失败！')
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals?item.attr_vals.split(' '):[];
                // 控制文本框的显示与隐藏
                item.inputVisible = false
                // 文本框中输入的值
                item.inputValue = ''
            });
            // console.log(res.data);
            if(this.activeName ==='many'){
                this.manyTableData = res.data;
            }else{
               this.onlyTableData = res.data;
            }
        },
        // 监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        addParams(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid)return
                const {data:res}= await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status !==201){
                    return this.$message.error('添加参数失败！')
                }
                this.$message.success('添加参数成功！');
                this.addDialogVisible = false;
                this.getParamsData();
            })
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮 展示修改的对话框
        async showEditDialog(attr_id){
            const {data: res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
                params: {attr_sel: this.activeName}
            })
            if(res.meta.status !==200){
                return this.$message.error('获取参数信息失败！')
            }
            this.editForm = res.data;
            // console.log(this.editForm);
            this.editDialogVisible= true;
        },
        
        // 点击按钮修改参数信息
        editParams(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid)return
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                    attr_name: this.editForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status !==200){
                    return this.$message.error('修改参数失败！')
                }
                this.$message.success('修改参数成功！')
                this.getParamsData();
                this.editDialogVisible = false;
            })
        },
        // 点击删除
        async removeParams(attr_id){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该文件, 是否继续?',
                '提示', 
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
            ).catch(err => err)
            if(confirmResult !=='confirm'){
                return this.$message.info('已取消删除！')
            }
            // 删除的业务逻辑
            const {data:res}= await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if(res.meta.status !==200){
                return this.$message.error('删除参数失败')
            }
            this.$message.success('删除参数成功！')
            this.getParamsData();
        },
        async handleInputConfirm(row){
            if(row.inputValue.trim().length ===0){
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            // 如果没有return 则证明输入的内容 需要左后续的处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            // // 需要发起请求 保存这一次操作
            // const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
            //     attr_name: row.attr_name,
            //     attr_sel: row.attr_sel,
            //     attr_vals: row.attr_vals.join(',')
            // })
            // if(res.meta.status !==200){
            //     return this.$message.error('修改参数项失败！')
            // }
            // this.$message.success('修改参数项成功！')
            this.saveAttrVals(row);
        },
        async saveAttrVals(row){
            // 需要发起请求 保存这一次操作
            const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' ')
            })
            if(res.meta.status !==200){
                return this.$message.error('修改参数项失败！')
            }
            this.$message.success('修改参数项成功！')

        },
        // 点击按钮 展示文本输入框
        showInput(row){
            row.inputVisible = true ;
            // 让文本框自动获得焦点
            // $nextTick 方法的作用：当页面上的元素被重新渲染之后 才会指定回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleClose(i, row){
            row.attr_vals.splice(i, 1);
            this.saveAttrVals(row);
        }
    },
    computed:{
        idBtnDisabled(){
            if(this.selectedCateKeys.length !== 3){
                return true
            }
            return false
        },
        cateId(){
            if(this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2];
            }
            return null;
        },
        titleText(){
            if(this.activeName ==='many'){
                return '动态参数'
            }
            return '静态属性'
        }
    }
};
</script>

<style scoped lang="less">
.cat_opt{
    margin:  15px 0;
}
.el-tag{
    margin: 5px;
}
.input-new-tag{
    width: 120px;
}
</style>
