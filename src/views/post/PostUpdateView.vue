<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// Components
import TableComment from './components/tables/TableComment.vue'

const route = useRoute()

const tableCommentRef = ref<InstanceType<typeof TableComment> | null>(null)

const variables = ref({
  id: route.params.postId,
})

const { result, loading } = useQuery(
  gql`
    query fetchPost($id: ID!) {
      post(id: $id) {
        id
        image
        title
        longTitle
        content
        isPublished
        publishedAt
        postCategory
        author {
          id
          firstName
          lastName
        }
        tags {
          id
          title
        }
        ...postComments
      }

      tags {
        id
        title
      }
    }

    fragment postComments on Post {
      comments {
        id
        content
        createdAt
      }
    }

    # ${tableCommentRef.value?.postCommentsFragment}
  `,
  variables,
)

const { mutate: updatePost } = useMutation(gql`
  mutation updatePost($post: UpdatePostInput!) {
    updatePost(post: $post) {
      id
      isPublished
      title
      longTitle
      content
    }
  }
`)

const title = ref()
const longTitle = ref()
const content = ref()
const isPublished = ref()
const postTags = ref()

const post = computed(() => {
  if (result.value?.post) {
    title.value = result.value?.post.title
    longTitle.value = result.value?.post.longTitle
    content.value = result.value?.post.content
    isPublished.value = result.value?.post.isPublished
    postTags.value = result.value?.post.tags

    return result.value?.post
  } else {
    return null
  }
})
const tags = computed(() => result.value?.tags ?? [])

const handleUpdate = () => {
  updatePost({
    post: {
      id: post.value.id,
      isPublished: isPublished.value,
      title: title.value,
      longTitle: longTitle.value,
      content: content.value,
    },
  })
}
</script>

<template>
  <template v-if="post">
    <div class="flex align-items-center justify-content-between">
      <h1>Post Update</h1>

      <Button
        label="Сохранить"
        type="button"
        icon="pi pi-save"
        @click="handleUpdate"
      ></Button>
    </div>

    <div class="mb-3">
      <div class="flex flex-column flex-1">
        <label for="isPublished">Published</label>
        <InputSwitch id="isPublished" type="text" v-model="isPublished" />
      </div>
    </div>

    <div class="mb-3">
      <div class="flex flex-column flex-1">
        <label for="title">Title</label>
        <InputText id="title" type="text" v-model="title" />
      </div>
    </div>

    <div class="mb-3">
      <div class="flex flex-column flex-1">
        <label for="longTitle">Long Title</label>
        <Textarea id="longTitle" type="text" v-model="longTitle" />
      </div>
    </div>

    <div class="mb-3">
      <div class="flex flex-column flex-1">
        <label for="content">Content</label>
        <Editor id="content" type="text" v-model="content" />
      </div>
    </div>

    <div class="mb-3">
      <div class="flex flex-column flex-1">
        <label for="tags">Tags</label>
        <MultiSelect
          id="tags"
          type="text"
          :options="tags"
          v-model="postTags"
          optionLabel="title"
        />
      </div>
    </div>

    <h2>Comments</h2>
    <TableComment
      ref="tableCommentRef"
      :comments="post.comments"
      :loading="loading"
    />
  </template>
</template>
