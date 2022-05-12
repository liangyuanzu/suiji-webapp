<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import { RequestResetPasswordApi, ResetPasswordApi } from '@suiji/apis/user'
import { useMessage } from '@/hooks/web/useMessage'

const props = defineProps<{ username: string }>()

interface FormState {
  code: string
  password: string
  checkPassword: string
}

const router = useRouter()

const formState = reactive<FormState>({
  code: '',
  password: '',
  checkPassword: '',
})

const validateCode = async(_rule: Rule, value: string) => {
  if (value === '')
    return Promise.reject(new Error('邮箱验证码不能为空'))

  else if (value.length !== 6)
    return Promise.reject(new Error('请输入正确的邮箱验证码'))

  else
    return Promise.resolve()
}

const validatePassword = async(_rule: Rule, value: string) => {
  if (value === '') return Promise.reject(new Error('密码不能为空'))

  else if (value.length < 6 || value.length > 18)
    return Promise.reject(new Error('密码长度需为6~18个字符'))

  else return Promise.resolve()
}

const validateCheckPassword = async(_rule: Rule, value: string) => {
  if (value === '') return Promise.reject(new Error('密码不能为空'))

  else if (value !== formState.password)
    return Promise.reject(new Error('两次密码输入不一致'))

  else
    return Promise.resolve()
}

const rules: Record<string, Rule[]> = {
  code: [{ required: true, validator: validateCode, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  checkPassword: [{ required: true, validator: validateCheckPassword, trigger: 'blur' }],
}

const handleFinish = async(values: FormState) => {
  try {
    const params = {
      code: values.code,
      username: props.username,
      password: values.password,
    }
    await ResetPasswordApi(params)
    const { createMessage } = useMessage()
    createMessage.success('密码重置成功')
    router.push('/signin')
  }
  catch (err) {
    console.error(err)
  }
}

const sendCode = async(): Promise<boolean> => {
  try {
    await RequestResetPasswordApi({ username: props.username })
    return true
  }
  catch (err) {
    console.error(err)
    return false
  }
}
</script>

<template>
  <div class="leading-25px py-40px">
    验证码已发送至邮箱 {{ props.username }}
  </div>

  <a-form
    :rules="rules"
    :model="formState"
    @finish="handleFinish"
  >
    <a-form-item name="code">
      <div>
        <div class="flex items-center">
          <i class="verify-code-icon inline-block w-24px h-24px mr-4px" />
          <a-input v-model:value="formState.code" size="large" placeholder="邮箱验证码" :bordered="false" class="flex-1" />
          <CountButton
            :count="60"
            :before-start-func="sendCode"
          />
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

    <a-form-item name="checkPassword">
      <div>
        <div class="flex items-center">
          <i class="password-icon inline-block w-24px h-24px mr-4px" />
          <a-input v-model:value="formState.checkPassword" type="password" size="large" placeholder="密码" :bordered="false" />
        </div>
        <span class="h-1px block bg-black bg-opacity-5" />
      </div>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" block class="confirm-btn" html-type="submit">
        重置密码
      </a-button>
    </a-form-item>
  </a-form>
</template>

<style lang="less" scoped>
.verify-code-icon {
  background-image: url(@/assets/images/sprite.png);
  background-position: -144px -72px;
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
