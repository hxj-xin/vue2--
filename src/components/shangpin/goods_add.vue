<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>商品管理</el-breadcrumb-item>
           <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 提示 -->
            <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏区域 -->
            <!-- el-form需在el-tabs外边包裹 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
               <el-tabs tab-position="left"  v-model="activeIndex" 
               :before-leave="beforeTabLeave"  @tab-click="tabClicked">
                    <!-- 基本信息 -->
                    <el-tab-pane label="基本信息" name="0">
                        <!-- label：输入框绑定的名称  prop：该输入框值的校验规则-->
                        <el-form-item label="商品名称" prop="goods_name">
                          <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                          <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                          <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                          <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!-- 级联选择器 -->
                            <!-- options:指定数据源 v-model:选中项的值（id）-->
                            <el-cascader :options="cateList" v-model="addForm.goods_cat"
                             :props="cateProps" @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品参数 -->
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" 
                         :key="item.attr_id">
                         <!-- 复选框组 -->
                         <el-checkbox-group v-model="item.attr_vals">
                           <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                         </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品属性 -->
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" 
                         :key="item.attr_id">
                           <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品图片 -->
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload action="http://127.0.0.1:8888/api/private/v1/upload"
                         :on-preview="handlePreview" :on-remove="handleRemove"
                         list-type="picture" :headers="headersObj" :on-success="handleSuccess">
                           <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <!-- 商品内容 -->
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce">
                        </quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
               </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible"
         width="50%" id="imgPre">
           <img :src="previewPath" alt="" >
        </el-dialog>

    </div>
</template>

<script>
import _ from 'lodash'

export default {
    props: {

    },
    data() {
        return {
            // 步骤条 动态绑定激活状态
            activeIndex:0,
            // tab栏在左侧方向
            // tabPosition: 'left',
            addForm:{
                goods_name:'',
                goods_price:'0',
                goods_weight:'0',
                goods_number:'0',
                // 商品所属的分类数组
                goods_cat:[],
                // 图片的数组
                pics:[],
                goods_introduce: '',
                attrs:[]
            },
            addFormRules:{
                goods_name:[
                    {required:true,message:'请输入商品名称',trigger:'blur'}
                ],
                goods_price:[
                    {required:true,message:'请输入商品价格',trigger:'blur'}
                ],
                goods_weight:[
                    {required:true,message:'请输入商品重量',trigger:'blur'}
                ],
                goods_number:[
                    {required:true,message:'请输入商品数量',trigger:'blur'}  
                ],
                goods_cat:[
                    {required:true,message:'请选择商品分类',trigger:'blur'}   
                ]
            },
            // 商品分类列表
            cateList:[],
            cateProps:{
                expandTrigger: 'hover',
                label:'cat_name',
                value:'cat_id',
                children:'children',
            },
            // 动态参数列表数据
            manyTableData:[],
            onlyTableData:[],
            // 为图片添加 token 请求头
            headersObj:{
                Authorization: window.sessionStorage.getItem('token_')
            },
            previewPath:'',
            previewVisible:false,
        };
    },
    mounted(){
        this.getCateList()
    },
    methods: {
        // 获取所有商品分类数据
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !=200){
                return this.$message,error('获取商品分类数据失败！')
            }
            this.cateList = res.data;
            // console.log(this.cateList);
        },
        // 级联选择器 选择项变化会触发此函数
        handleChange(){
            console.log(this.addForm.goods_cat);
            if(this.addForm.goods_cat.length !==3){
                this.addForm.goods_cat = []
            }
        },
        beforeTabLeave(activeName, oldActiveName){
            // console.log('即将离开的标签页名字是：'+ oldActiveName);
            // console.log('即将到达的标签页名字是：'+ activeName);
            // return false;
            if(oldActiveName ==='0' && this.addForm.goods_cat.length !==3){
                this.$message.error('请先选择商品分类！')
                return false
            }

        },


        
        async tabClicked(){
            // console.log(this.activeIndex);
            // 证明访问的是动态参数面板
            if(this.activeIndex ==='1'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                  params: { sel: 'many' }
                })
                if(res.meta.status !== 200){
                  return this.$message.error('获取动态参数列表失败！')
                }
                console.log(res.data);
                res.data.forEach(item =>{
                    item.attr_vals = item.attr_vals.length ===0?[]:item.attr_vals.split(' ')
                })
                this.manyTableData = res.data;
            }else if(this.activeIndex ==='2'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                  params: { sel: 'only' }
                })
                if(res.meta.status !== 200){
                  return this.$message.error('获取动态参数列表失败！')
                }
                console.log(res.data);

                this.onlyTableData = res.data;

            }                     
        },
        // 处理图片预览效果
        handlePreview(file){
            console.log(file);
            this.previewPath = file.response.data.url;
            this.previewVisible = true
        },
        // 处理图片移除的操作
        handleRemove(file){
            console.log(file);
            // 1.获取将要移除的图片路径
            const filePath = file.response.data.tmp_path
            // 2.从pics中 找到这个图片对应的索引值
            const i= this.addForm.pics.findIndex( x => x.pic ===filePath)
            // 3.调用数组的splice方法 把图片信息对象 从pics数组中移除
            this.addForm.pics.splice(i, 1)
            // console.log(this.addForm);
        },
        // 监听图片上传成功的事件
        handleSuccess(response){
        //    console.log(response);
           // 1.拼接得到一个图片信息对象
           const picInfo = { pic: response.data.tmp_path}
           // 2.将图片  信息对象 push到pics数组中
           this.addForm.pics.push(picInfo) 
        //    console.log(this.addForm);
        },
        //添加商品
        add(){
            // console.log(this.addForm);
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid){
                    return this.$message.error('请填写必要的表单项！')
                }
                // 执行添加的业务逻辑
                // lodash cloneDeep(深拷贝)
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                // 处理动态参数
                this.manyTableData.forEach(item =>{
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.onlyTableData.forEach(item =>{
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs
                // console.log(form);
                // 发起请求 添加商品 
                // 商品的名称 必须是惟一的
                const {data:res} = await this.$http.post('goods', form)
                if(res.meta.status !==201){
                    return this.$message.error('添加商品失败！')
                }
                this.$message.success('添加商品成功！')
                this.$router.push('/goods')

            })
        }
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2]
            }
            return false
        }
    },
    components: { },
};
</script>

<style scoped lang="less">
.el-checkbox{
    margin:0 10px 0 0;
}
#imgPre{
    display: block;
    text-align: center;
    img{
        width: 100%;
    }
}
.btnAdd{
    margin-top: 20px;
}
</style>
