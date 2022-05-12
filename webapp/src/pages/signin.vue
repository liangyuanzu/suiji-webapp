<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import { SigninApi } from '@suiji/apis/user'

interface FormState {
  username: string
  password: string
}

const router = useRouter()

const formState = reactive<FormState>({
  username: '',
  password: '',
})

const validateUsername = async(_rule: Rule, value: string) => {
  if (value === '')
    return Promise.reject(new Error('邮箱不能为空'))

  else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))
    return Promise.reject(new Error('邮箱格式不正确'))

  else
    return Promise.resolve()
}

const validatePassword = async(_rule: Rule, value: string) => {
  if (value === '') return Promise.reject(new Error('密码不能为空'))

  else if (value.length < 6 || value.length > 18)
    return Promise.reject(new Error('密码长度需为6~18个字符'))

  else return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
}

const handleFinish = async(values: FormState) => {
  try {
    const { token } = await SigninApi(values)
    localStorage.setItem('token', token)
    router.push('/')
  }
  catch (err) {
    console.error(err)
  }
}

const toRequestResetPassword = () => {
  router.push('/sign/requestResetPassword')
}

const toSignup = () => {
  router.push('/signup')
}
</script>

<template>
  <a-form
    :rules="rules"
    :model="formState"
    @finish="handleFinish"
  >
    <a-form-item name="username">
      <div>
        <div class="flex items-center">
          <i class="username-icon inline-block w-24px h-24px mr-4px" />
          <a-input v-model:value="formState.username" size="large" placeholder="邮箱" :bordered="false" />
        </div>
        <span class="h-1px block bg-black bg-opacity-5" />
      </div>
    </a-form-item>

    <a-form-item name="password">
      <div>
        <div class="flex items-center">
          <i class="password-icon inline-block w-24px h-24px mr-4px" />
          <a-input v-model:value="formState.password" type="password" size="large" placeholder="密码" :bordered="false" />
        </div>
        <span class="h-1px block bg-black bg-opacity-5" />
      </div>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" block class="confirm-btn" html-type="submit">
        登录
      </a-button>
    </a-form-item>
  </a-form>

  <div class="flex items-center justify-between">
    <a-button type="link" class="options-btn" @click="toRequestResetPassword">
      忘记密码
    </a-button>
    <a-button type="link" class="options-btn" @click="toSignup">
      注册
    </a-button>
  </div>
</template>

<style lang="less" scoped>
.username-icon {
  background-image: url(@/assets/images/sprite.png);
  background-position: -120px -100px;
  background-size: 168px 124px;
}

.password-icon {
  background-image: url(@/assets/images/sprite.png);
  background-position: -72px -100px;
  background-size: 168px 124px;
}

/deep/ .ant-form-item-explain-error {
  color: #ff3180;
  transition: opacity .2s ease-in-out;
  text-align: right;
  font-size: 13px;
}

.confirm-btn {
  background-color: #4772fa;
  height: 36px;
}

.options-btn {
  padding: 0px;
  color: #4772fa;
  font-size: 13px;
}
</style>

<route lang="yaml">
meta:
  layout: account
</route>
