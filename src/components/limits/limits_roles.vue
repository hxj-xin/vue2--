<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>权限管理</el-breadcrumb-item>
           <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <!-- <el-table :data="rolesList" border stripe row-key="id"> -->
            <el-table :data="rolesList" border stripe >
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- <pre>
                            {{ scope.row }}
                        </pre> -->
                        <el-row :class="['bdbottom',i1 ===0?'bdtop':'','padding']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5" class="vcenter">
                                <el-tag closable @close="removeRightId(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染 二级，三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <el-row :class="[ i2===0 ?'':'bdtop',]" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6" class="vcenter">
                                        <el-tag type="success" closable @close="removeRightId(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable
                                         @close="removeRightId(scope.row,item3.id)">
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"> </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                    <!-- <template> -->
                        <!-- 修改 -->
                        <el-button size="mini" type="primary" icon="el-icon-edit"
                        @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <!-- 删除 -->
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                        @click="removeUserById(scope.row.id)">删除</el-button>
                        <!-- 分配权限 -->
                        <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button size="mini" type="warning" icon="el-icon-setting"
                             @click="showSetRightDialog(scope.row)">
                            分配权限
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">
           <!-- 内容主体区 -->
           <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" 
           label-width="80px">
              <el-form-item label="角色名称" prop="roleName">
                 <el-input v-model="addForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                 <el-input v-model="addForm.roleDesc"></el-input>
              </el-form-item>
           </el-form>
           <!-- 底部按钮区 -->
           <span slot="footer" class="dialog-footer">
             <el-button @click="addDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="addUsers">确 定</el-button>
           </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog  title="修改用户" :visible.sync="editDialogVisible"
         width="50%" @close="editDialogClosed">
           <!-- 表单 -->
           <el-form :model="editForm" :rules="editFormRules" 
           ref="editFormRef" label-width="80px">
              <el-form-item label="角色名称" prop="roleName">
                 <el-input v-model="editForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                 <el-input v-model="editForm.roleDesc"></el-input>
              </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUserInfo">确 定</el-button>
           </span>
        </el-dialog>

        <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible"
        width="50%" @close="setRightDialogClosed">
           <!-- 内容主体区 树形控件 -->
           <el-tree :data="rightsList" :props="treeProps" show-checkbox  node-key="id"
            default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
           <!-- 底部按钮区 -->
           <span slot="footer" class="dialog-footer">
             <el-button @click="setRightDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="allotRights">确 定</el-button>
           </span>
        </el-dialog>



    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            rolesList:[],
            // 添加角色
            addDialogVisible:false,
            addForm:{
                roleName:'',
                roleDesc:''
            },
            addFormRules:{
                roleName:[
                    {  required: true, message: '请输入角色名称', trigger: 'blur'},
                    { min: 1, max: 10, message: '用户名的长度在1~10个字符之间', trigger: 'blur' }
                ],
                roleDesc:[
                    {  required: false, message: '请输入角色描述', trigger: 'blur'},
                    { min: 0, max: 10, message: '用户名的长度在0~10个字符之间', trigger: 'blur' }
                ]
            },
             // 控制修改对话框
            editDialogVisible:false,
            editForm:{},
            editFormRules:{
                roleName:[
                    {  required: true, message: '请输入角色名称', trigger: 'blur'},
                    { min: 1, max: 10, message: '用户名的长度在1~10个字符之间', trigger: 'blur' }
                ],
                roleDesc:[
                    {  required: false, message: '请输入角色描述', trigger: 'blur'},
                    { min: 0, max: 10, message: '用户名的长度在0~10个字符之间', trigger: 'blur' }
                ]
            },
            // 控制权限分配对话框显示与隐藏
            setRightDialogVisible:false,
            rightsList:[],
            // 树形控件的绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            // 默认选中的权限节点 数组
            defKeys:[],
            // 当前即将分配权限的角色id
            roleId:''
        };
    },
    created(){
        this.getRolesList();
    },
    methods: {
        // 获取数据
        async getRolesList(){
            const {data:res}= await this.$http.get('roles');
            if(res.meta.status !==200){
                return this.$message('获取角色列表失败');
            }
            this.rolesList = res.data;
            // console.log(this.rolesList);
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields(); 
        },
        // 确定添加角色
        addUsers(){
            this.$refs.addFormRef.validate(async valid=>{
                console.log(valid);
                if(!valid)return;
                // 发起网络请求
                const {data:res}=await this.$http.post('roles',this.addForm);
                if(res.meta.status !==200){
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功');
                // 隐藏添加用户的对话框
                 this.addDialogVisible = false;
                // 重新获取用户列表是数据
                this.getRolesList();
            })
        },

        // 展示 修改用户对话框
        async showEditDialog(id){
            const {data:res} = await this.$http.get('roles/'+id);
            if(res.meta.status !==200){
                return this.$message.error('查询用户失败!')
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 监听修改用户对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        // 确定修改用户角色
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid =>{
                // console.log(valid);
                if(!valid)return;
                const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,{
                    roleName: this.editForm.roleName,
                    roleDesc: this.editForm.roleDesc
                })
                if(res.meta.status !==200){
                    return this.$message.error('更新用户信息失败！')
                }
                // 关闭对话框
                this.editDialogVisible = false;
                this.getRolesList();
                // 提示修改成功
                this.$message.success('更新用户信息成功！');
            })
        },
        // 根据id删除用户信息删除
        async removeUserById(id){
            const confirmResult= await this.$confirm(
                '此操作将永久删除该用户, 是否继续?',
                '提示', 
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning' 
                } 
            ).catch(error => error)
             // 如果用户确认删除，则返回值为字符串confirm
            // 如果用户取消了删除，则返回值为字符串cancel
            // console.log(confirmResult);
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除');
            }
            const {data:res} = await this.$http.delete('roles/'+id);
            if(res.meta.status !==200){
                return this.$message.error('删除用户失败');
            }
            this.getRolesList();
            return this.$message.success('删除用户成功');
        },
        // 删除权限
        async removeRightId(role,rightId){
          const confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }
          ).catch(error => error)
          if(confirmResult !=='confirm'){
            return this.$message.info('取消删除')
          }
         // console.log(确认删除);
          const {data:res}= await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
           if(res.meta.status !==200){
             return this.$message.error('删除权限失败');
           }
          //不再重新调用getRolesList函数 而是重新赋值 最新数据 避免了展开列表关闭 刷新
           role.children = res.data;
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role){
            this.roleId = role.id;
            // 获取权限数据
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status !==200){
                return this.$message.error('获取权限失败！');
            }
            this.rightsList = res.data;
            console.log(this.rightsList);
            // 递归获取三级节点的id
            this.getLeafKeys(role,this.defKeys);
            this.setRightDialogVisible=true;
        },
        // 通过递归形式 获取3级权限的id 并保存到数组中
        getLeafKeys(node,arr){
            // 如果当前node节点不包含children属性 则他是3级结点
            if(!node.children){
                return arr.push(node.id);
            }
            node.children.forEach( item =>{
                this.getLeafKeys(item,arr)
            })
        },
        // 监听分配权限的关闭事件（清空id 防止id重复）
        setRightDialogClosed(){
            this.defKeys=[]
        },
        async allotRights(){
            const keys =[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys);
            // 逗号拼接的字符串
            const idStr=keys.join(',');
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{
                rids:idStr
            })
            if(res.meta.status !==200){
                return this.$message.error('分配权限失败!');
            }
            this.$message.success('权限分配成功!');
            // 刷新列表
            this.getRolesList();
            this.setRightDialogVisible = false;
        }
    },
    components: {},
};
</script>

<style scoped lang="less">
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.padding{
    margin: 0 50px;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>
