<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { format, parse } from 'date-fns'
import { DataTablePageEvent } from 'primevue/datatable'

const variables = ref({
  skip: 0,
  take: 10,
})

const { result, loading } = useQuery(
  gql`
    query fetchPosts($skip: Int, $take: Int) {
      posts(skip: $skip, take: $take) {
        id
        image
        title
        isPublished
        publishedAt
        postCategory
        author {
          id
          firstName
          lastName
        }
        tags {
          title
        }
        commentCount
      }
      postCount
    }
  `,
  variables,
)
const { mutate: deletePost } = useMutation(gql`
  mutation deletePost($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`)

const posts = computed(() => result.value?.posts ?? [])
const postTotal = computed(() => result.value?.postCount ?? 0)

const dateFormat = (date: string | null) => {
  if (!date) return

  return format(parse(date, 'T', new Date()), 'dd.MM.yyyy HH:mm')
}

const handleChangePage = (e: DataTablePageEvent) => {
  variables.value.skip = e.page * e.rows
  variables.value.take = e.rows + e.page * e.rows
}
</script>

<template>
  <div class="flex align-items-center justify-content-between">
    <h1>Post List</h1>

    <RouterLink class="no-underline" :to="{ name: 'post.create' }">
      <Button
        class=""
        label="Добавить"
        type="button"
        icon="pi pi-plus"
      ></Button>
    </RouterLink>
  </div>

  <DataTable
    :value="posts"
    :lazy="true"
    :loading="loading"
    :paginator="true"
    :rows="10"
    :totalRecords="postTotal"
    :rowsPerPageOptions="[10, 20, 50]"
    responsiveLayout="scroll"
    @page="handleChangePage"
  >
    <Column
      field="title"
      header="Title"
      :sortable="true"
      style="width: 50rem"
    ></Column>

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

    <Column field="author" header="Author">
      <template #body="{ data }">
        <span>{{ data.author.firstName }} {{ data.author.lastName }}</span>
      </template>
    </Column>

    <Column
      field="commentCount"
      header="Comment Quantity"
      :sortable="true"
    ></Column>

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
