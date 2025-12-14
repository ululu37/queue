<template>
  <div ref="scrollBox" class="h-[500px] overflow-y-auto border p-4" @scroll="onScroll">
    <!-- ADD ROOM -->
    <div class="mb-6 flex gap-2">
      <input v-model="input.name" placeholder="ชื่อห้อง" class="p-2 border rounded w-1/3" />
      <button @click="onAdd" class="bg-blue-500 text-white px-4 rounded">
        เพิ่มห้อง
      </button>
    </div>

    <!-- ROOM TABLE -->
    <table class="w-full border">


      <tbody>
        <tr v-for="room in rooms" :key="room.id" class="border-b">
          <td>
            <NuxtLink :to="`/room/${room.id}`">
              {{ room.name }}
            </NuxtLink>
          </td>
          <td class="flex justify-end gap-2">
            <button class="bg-yellow-500 text-white px-2 py-1 rounded" @click="openEdit(room)">
              Edit
            </button>
            <button class="bg-red-500 text-white px-2 py-1 rounded" @click="onDelete(room.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="text-center py-3">กำลังโหลด...</div>
    <div v-if="!hasMore" class="text-center py-3 text-gray-400">
      ไม่มีข้อมูลแล้ว
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEdit" class="fixed inset-0 bg-black/50 flex items-center justify-center" @click.self="closeEdit">
      <div class="bg-white p-6 rounded w-[400px]">
        <h2 class="font-semibold mb-4">แก้ไขห้อง</h2>

        <input v-model="editForm.name" class="w-full p-2 border rounded mb-3" />

        <div class="flex justify-end gap-2">
          <button @click="closeEdit" class="bg-gray-400 text-white px-4 py-2 rounded">
            ยกเลิก
          </button>
          <button @click="onUpdate" class="bg-blue-500 text-white px-4 py-2 rounded">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'role' })
const {user} = useAuth()
if (!user.value || user.value.role !== 0) {
   navigateTo('/')
}

const config = useRuntimeConfig()
const fetch = useRequestFetch()

const rooms = ref([])
const page = ref(1)
const perPage = 10
const loading = ref(false)
const hasMore = ref(true)
const scrollBox = ref(null)

const input = ref({
  name: '',
})

const showEdit = ref(false)
const editForm = ref({
  id: null,
  name: '',

})

async function load() {
  if (loading.value || !hasMore.value) return
  loading.value = true

  const data = await fetch(
    `${config.public.api}/room/listing?page=${page.value}&per_page=${perPage}`,
    { credentials: 'include' }
  )

  if (data.length < perPage) hasMore.value = false
  rooms.value.push(...data)
  page.value++
  loading.value = false
}

function onScroll() {
  const el = scrollBox.value
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    load()
  }
}

onMounted(load)

// CRUD
async function onAdd() {
  await fetch(`${config.public.api}/room`, {
    method: 'POST',
    body: input.value,
    credentials: 'include',
  })
  resetAndReload()
}

async function onDelete(id) {
  await fetch(`${config.public.api}/room`, {
    method: 'DELETE',
    body: { room_id: id },
    credentials: 'include',
  })
  resetAndReload()
}

function openEdit(room) {
  editForm.value = { ...room }
  showEdit.value = true
}

function closeEdit() {
  showEdit.value = false
}

async function onUpdate() {
  await fetch(`${config.public.api}/room`, {
    method: 'PATCH',
    body: {
      room_id: editForm.value.id,
      name: editForm.value.name
    },
    credentials: 'include',
  })
  closeEdit()
  resetAndReload()
}

function resetAndReload() {
  rooms.value = []
  page.value = 1
  hasMore.value = true
  load()
}
</script>
