<script setup lang="ts">
import { computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { format, parse } from 'date-fns'

defineProps({
  posts: Array,
  loading: Boolean,
})

const userPostsFragment = gql`
  fragment userPosts on User {
    posts {
      image
      title
      isPublished
      publishedAt
      postCategory
      tags {
        title
      }
    }
  }
`
const { mutate: deletePost } = useMutation(gql`
  mutation deletePost($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`)

const dateFormat = (date: string | null) => {
  if (!date) return

  return format(parse(date, 'T', new Date()), 'dd.MM.yyyy HH:mm')
}

defineExpose({ userPostsFragment })
</script>

<template>
  <DataTable :value="posts" :lazy="true" :loading="loading">
    <Column field="title" header="Title" style="width: 50rem"></Column>

    <Column field="image" header="Image">
      <template #body="{ data }">
        <img :src="data.image" alt="" width="100" />
      </template>
    </Column>

    <Column field="postCategory" header="Category"></Column>

    <Column field="isPublished" header="Published"></Column>

    <Column field="publishedAt" header="Published Date" style="width: 12rem">
      <template #body="{ data }">
        <span>{{ dateFormat(data.publishedAt) }}</span>
      </template>
    </Column>

    <Column field="tags" header="Tags" style="width: 20rem">
      <template #body="{ data }">
        <div class="flex flex-wrap align-items-center">
          <Chip
            v-for="(tag, index) in data.tags"
            :key="index"
            class="mr-2 mb-2"
            :label="tag.title"
          />
        </div>
      </template>
    </Column>

    <Column>
      <template #body="{ data }">
        <RouterLink
          class="no-underline"
          :to="{ name: 'post.update', params: { postId: data.id } }"
        >
          <Button
            class="p-button-rounded p-button-text"
            type="button"
            icon="pi pi-pencil"
          ></Button>
        </RouterLink>

        <Button
          class="p-button-rounded p-button-text p-button-danger"
          type="button"
          icon="pi pi-trash"
          @click="deletePost({ id: data.id })"
        ></Button>
      </template>
    </Column>
  </DataTable>
</template>
