<template>
  <div>
    <el-col :span="24">
      <div class="login-wrapper">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="Email" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="ruleForm.password" type="password" ></el-input>
          </el-form-item>
      
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">Login</el-button>
            <!-- <el-button @click="resetForm('ruleForm')">Reset</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  
  </div>
</template>

<script>
  export default {
    name: 'LoginComponent',
    data() {
      return {
        ruleForm: {
          email: '',
          password: '',

        },
        rules: {
          email: [
            { required: true, message: 'Please input Email', trigger: 'blur' },
            // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please input password', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            let url = 'https://uw-portal-api.tinkerpub.com/api/auth/login'
            this.axios
            .post(url, {
                    email: this.ruleForm.email,
                    password: this.ruleForm.password
                })
            .then(response => {
              if (response.status === 200) {
                  var session_token = ''
                  session_token = response.data.app_session.session_key
                  if(session_token) {
                    this.$emit('login',session_token)
                  }
              }
              //  else {
              //     this.currentRightComponent = null   
              //     this.currentLeftComponent = LoginComponent   
              // }
              
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>