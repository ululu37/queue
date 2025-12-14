export default defineNuxtRouteMiddleware(async(to,from) => {
  const { user,getMe } = useAuth();
  if (!user.value) {
     try {
      await getMe()
     } catch (error) {
     
      return  navigateTo('/login')
     } 
   }
   if (!user.value) {
     return  navigateTo('/login')
   }
  if (user.value.role == 0) {
    to.meta.layout = "admin";
  } else if (user.value.role == 1) {
    to.meta.layout = "user1";
  }else if (user.value.role == 2) {
    to.meta.layout = "user2";
  }
});