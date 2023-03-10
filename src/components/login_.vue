<template>
    <div class="login_container">
        <div class="login_box">
            <!-- logo区域 -->
            <div class="login_img">
                <img src="@/assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form ref="loginFormRef" label-width="0" class="login_form" :model="form" :rules="formRules">
                <el-form-item prop="username">
                     <el-input prefix-icon="iconfont icon-user" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                     <el-input prefix-icon="iconfont icon-3702mima" v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="form_btn">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
      return {
        // 登录表单的数据绑定对象
        form: {
          username:'admin',
          password:'123456',
        },
        formRules: {
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请选择登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
        },  
      }
    },
    methods: {
        // 重置
        resetLoginForm() {
            // console.log(this);
            // console.log(this.$refs.loginFormRef.resetFields);
            this.$refs.loginFormRef.resetFields();
        },
        // 登录预验证
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                // console.log(valid);
                if(!valid) return;
                const { data: res } = await this.$http.post('login',this.form);
                console.log(res);
                if(res.meta.status !==200) return this.$message.error('登录失败');
                this.$message.success('登录成功');
                // 登录成功后的token保存到sessionStorage
                console.log(res.data.token);
                window.sessionStorage.setItem('token_',res.data.token);
                this.$router.push('/home');
            })
        },
    }
};
</script>

<style scoped lang="less">
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 45rem;
    height: 30rem;
    background-color: #fff;
    border-radius: 0.3rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.login_img{
    width: 13rem;
    height: 13rem;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 1rem;
    box-shadow: 0 0 1rem #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeee;

    }
}
.login_form{
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0 2rem;
    box-sizing: border-box ;
}
.form_btn{
    display: flex;
    justify-content: flex-end;
}
</style>
