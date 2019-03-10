<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" :placeholder="form.userNamePlaceholder">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="Enter your password">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <a @click="changeType">sign in by {{form.signInType === 'email' ? 'phone' : 'email'}}</a>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>sign in</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: 'The userName cannot be empty', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: 'The password cannot be empty', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: '',
        signInType: 'email',
        userNamePlaceholder: 'Enter email'
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    changeType() {
      if(this.form.signInType === 'email') {
        this.form.signInType = 'phone';
      } else {
        this.form.signInType = 'email';
      }
      this.form.userNamePlaceholder = 'Enter ' + this.form.signInType;
      this.$refs['loginForm'].resetFields();
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            type: this.form.signInType
          })
        }
      })
    }
  }
}
</script>
