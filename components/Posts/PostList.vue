<template>
  <div class="posts-page">
    <section class="post-list">
      <PostPreview
        id="1"
        :is-admin="isAdmin"
        title="One"
        preview-text="First post"
        thumbnail="https://yw553ftvhw1iqegz29fycoyw-wpengine.netdna-ssl.com/wp-content/uploads/2017/09/technology-16-9.jpg" />
      <PostPreview
        id="2"
        :is-admin="isAdmin"
        title="Two"
        preview-text="Second post"
        thumbnail="https://www.brookings.edu/wp-content/uploads/2017/11/metro_20171121_tech-empowers-tech-polarizes-mark-muro.jpg" />
      <PostPreview
        id="3"
        :is-admin="isAdmin"
        title="Three"
        preview-text="HI!"
        thumbnail="https://static.pulse.ng/img/incoming/origs3589500/3876364943-w644-h960/tech.jpg" />
    </section>
  </div>
</template>

<script>
import PostPreview from '@/components/Posts/PostPreview'

export default {
  components: {
    PostPreview
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.post-list {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
