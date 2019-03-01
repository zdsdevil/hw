<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="welcome sign in" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <div style="text-align: right;">
            <span>no account?</span>
            <a @click="signUp = true">sign up</a>
          </div>
        </div>
      </Card>
    </div>
    <Modal v-model="signUp" title="sign up" ok-text="submit" cancel-text="cancel" @on-ok="ok" :loading="signUpLoading">
      <Form ref="signUpForm" :model="signUpForm" :label-width="90">
        <FormItem label="signUp type" prop="type">
          <RadioGroup v-model="signUpForm.type">
            <Radio label="email">Email</Radio>
            <Radio label="phone">Phone</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="LoginName" prop="loginName">
          <Input v-model="signUpForm.loginName" placeholder="Enter your loginName"></Input>
        </FormItem>
        <FormItem label="Name">
          <Row>
            <Col span="11">
              <Input v-model="signUpForm.firstName" placeholder="Enter your firstName"></Input>
            </Col>
            <Col span="11" offset="2">
              <Input v-model="signUpForm.lastName" placeholder="Enter your lastName"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="Gender">
            <RadioGroup v-model="signUpForm.gender">
                <Radio label="M">Male</Radio>
                <Radio label="F">Female</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="Password" prop="pwd">
          <Input type="password" v-model="signUpForm.pwd" placeholder="Enter your password"></Input>
        </FormItem>
        <FormItem>
          <p>You must be at least 18 years of age to register with embi. Other users can't see your birthday</p>
        </FormItem>
        <FormItem label="Birth">
          <DatePicker type="date" placeholder="Select date" v-model="signUpForm.birth"></DatePicker>
        </FormItem>
        <FormItem class="verifyCode" label="verifyCode">
          <Input v-model="signUpForm.verifyCode" placeholder="Enter your verifyCode"></Input>
          <img :src="verifyCodeUrl" @click="changeVerifyCode">
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
import { signUp } from "@/api/data";
export default {
  data() {
    return {
      signUp: false,
      signUpLoading: true,
      signUpForm: {
        type: "email",
        loginName: "",
        firstName: "",
        lastName: "",
        pwd: "",
        birth: "",
        notify: "",
        gender: "",
        verifyCode: '',
      },
      verifyCodeUrl: 'http://47.107.166.120:8000/hw/auth/verify-code'
    };
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(["handleLogin"]),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.$router.push("/index");
      });
    },
    changeVerifyCode() {
      this.verifyCodeUrl = 'http://47.107.166.120:8000/hw/auth/verify-code?' + Math.random()
    },
    ok() {
      let self = this;
      let params = {
        type: self.signUpForm.type,
        loginName: self.signUpForm.loginName,
        firstName: self.signUpForm.firstName,
        lastName: self.signUpForm.lastName,
        pwd: self.signUpForm.pwd,
        birth: self.signUpForm.birth,
        notify: 'Y',
        gender: self.signUpForm.gender,
        verifyCode: self.signUpForm.verifyCode
      }

      let verifyStatus = true;
      if(params.loginName === '') {
        self.$Message.error('Enter your loginName');
        verifyStatus = false;
      } else if(params.firstName === '') {
        self.$Message.error('Enter your firstName');
        verifyStatus = false;
      } else if(params.lastName === '') {
        self.$Message.error('Enter your lastName');
        verifyStatus = false;
      } else if(params.pwd === '') {
        self.$Message.error('Enter your pwd');
        verifyStatus = false;
      } else if(params.birth === '') {
        self.$Message.error('Choose your birth');
        verifyStatus = false;
      } else if(params.gender === '') {
        self.$Message.error('Choose your gender');
        verifyStatus = false;
      } else if(params.notify === '') {
        self.$Message.error('Please check the your notify');
        verifyStatus = false;
      } else if(params.verifyCode === '') {
        self.$Message.error('Enter your verifyCode');
        verifyStatus = false;
      }
      if(!verifyStatus) {
        self.signUpLoading = false;
        setTimeout(() => {
          self.signUpLoading = true;
        },0)
        return;
      }
      signUp(params).then((res)=> {
        console.log(res);
        self.$Message.info(res.data.msg);
        if(res.data.msg === 'success') {
            self.signUp = false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .verifyCode {
    position: relative;
    padding-right: 120px;
    img {
      position: absolute;
      right: -120px;
      width: 100px;
      height: 32px;
    }
  }
</style>
