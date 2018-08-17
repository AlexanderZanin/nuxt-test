<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'
import axios from 'axios'

export default {
  layout: 'admin',
  components: {
    AdminPostForm
  },
  asyncData(context) {
    return axios.get(`https://nuxt-blog-d548f.firebaseio.com/posts/${context.params.postId}.json`)
      .then(response => {
        return {
          loadedPost: response.data
        }
      })
      .catch(e => context.error(e))
  },
  methods: {
    onSubmitted(editedPost) {
      console.log('this.$route.params.postId', this.$route.params.postId)
      axios.put(`https://nuxt-blog-d548f.firebaseio.com/posts/${this.$route.params.postId}.json`, editedPost)
      .then(response => console.log(response))
      .catch(e => console.log(e))
    }
  }
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
