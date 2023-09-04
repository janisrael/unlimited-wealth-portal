<template>
  <div>
    <el-col :span="24">
      <div class="login-wrapper">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="Email" prop="email">
            <el-input v-model="ruleForm.email" clearable></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input
              v-model="ruleForm.password"
              clearable
              type="password"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >Login</el-button
            >
            <!-- <el-button @click="resetForm('ruleForm')">Reset</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "LoginComponent",
  data() {
    return {
      ruleForm: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "Please input Email",
            trigger: "blur",
          },
          // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: "Please input password",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    /* eslint-disable */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = process.env.VUE_APP_API_URL + "/api/auth/login";
          this.axios
            .post(url, {
              email: this.ruleForm.email,
              password: this.ruleForm.password,
            })
            .then((response) => {
              if (response.status === 200) {
                sessionStorage.clear();
                this.$store.dispatch("assignCustomer", response.data);
                var session_token = "";
                session_token = response.data.app_session.session_key;
                sessionStorage.setItem(
                  "region",
                  response.data.customer.use_region
                );
                if (session_token) {
                  this.$emit("login", response.data);
                }
              }
              //  else {
              //     this.currentRightComponent = null
              //     this.currentLeftComponent = LoginComponent
              // }
            })
            .catch((err) => {
              this.$notify.error({
                title: "Login Error",
                message: "Invalid Credentials",
              });
            });
        } else {
          console.log("error submit!!");
          this.$notify.error({
            title: "Login Error",
            message: "Invalid Credentials",
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped></style>
