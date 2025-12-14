<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h1 class="text-center mb-6 text-xl font-semibold">Login</h1>

      <!-- Username -->
      <input
        type="text"
        placeholder="ชื่อผู้ใช้"
        v-model="input.username"
        class="w-full p-3 border mb-1 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <p v-if="errors.username" class="text-sm text-red-500 mb-3">
        {{ errors.username }}
      </p>

      <!-- Password -->
      <input
        type="password"
        placeholder="รหัสผ่าน"
        v-model="input.password"
        class="w-full p-3 border mb-1 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <p v-if="errors.password" class="text-sm text-red-500 mb-4">
        {{ errors.password }}
      </p>

      <!-- Button -->
      <button
        @click="onLogin"
        :disabled="!isValid"
        class="w-full py-3 rounded-md text-white
               bg-blue-500 hover:bg-blue-600
               disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        ตกลง
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const { login, user } = useAuth()

const input = ref({
  username: '',
  password: '',
})

const errors = ref({
  username: '',
  password: '',
})

const isValid = computed(() => {
  return (
    input.value.username.length > 0 &&
    input.value.password.length >= 4
  )
})

function validate() {
  errors.value = { username: '', password: '' }

  if (!input.value.username) {
    errors.value.username = 'กรุณากรอกชื่อผู้ใช้'
  }

  if (!input.value.password) {
    errors.value.password = 'กรุณากรอกรหัสผ่าน'
  } else if (input.value.password.length < 4) {
    errors.value.password = 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร'
  }

  return !errors.value.username && !errors.value.password
}

async function onLogin() {
  if (!validate()) return

  try {
    await login(input.value)
    console.log(user.value)
  } catch (err) {
    errors.value.password = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
  }
}
</script>
