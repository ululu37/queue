<template>
  <div ref="scrollBox" class="h-[500px] overflow-y-auto border p-4" @scroll="onScroll">

    <!-- ROOM TABLE -->
    <table class="w-full border">


      <tbody>
        <tr v-for="room in rooms" :key="room.id" class="border-b">
          <td>
            <NuxtLink :to="`/room/${room.id}`">
              {{ room.name }}
            </NuxtLink>
          </td>
       
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="text-center py-3">กำลังโหลด...</div>
    <div v-if="!hasMore" class="text-center py-3 text-gray-400">
      ไม่มีข้อมูลแล้ว
    </div>
</div>

</template>

<script setup>
definePageMeta({ middleware: 'role' })

const config = useRuntimeConfig()
const fetch = useRequestFetch()

const rooms = ref([])
const page = ref(1)
const perPage = 10
const loading = ref(false)
const hasMore = ref(true)
const scrollBox = ref(null)



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

</script>
