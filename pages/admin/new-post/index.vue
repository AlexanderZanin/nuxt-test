<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <AdminPostForm @submit="onSumbmitted" />
    </section>
  </div>
</template>


<script>
import axios from 'axios';
import AdminPostForm from '@/components/Admin/AdminPostForm'

export default {
  layout: 'admin',
  components: {
    AdminPostForm
  },
  // data() {
  //   return {
  //       loadedPost: {
  //       author: 'Zanin',
  //       title: 'My title',
  //       content: 'amazing content!!!',
  //       thumbnail: 'https://scontent.fiev15-1.fna.fbcdn.net/v/t31.0-8/12698273_1685993638346339_1851182126284243223_o.jpg?_nc_cat=0&oh=2f5c31e35b9b79ad7fad5b83213cbd56&oe=5C1089E5'
  //     }
  //   }
  // },
  methods: {
    onSumbmitted(postData) {
      axios.post('https://nuxt-blog-d548f.firebaseio.com/posts.json', {
        ...postData,
        updatedDate: new Date()
      })
      .then(result => {
        console.log('result', result)
      })
      .catch(e => {
        console.log(e)
      })
    }
  }
}
</script>


<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>


