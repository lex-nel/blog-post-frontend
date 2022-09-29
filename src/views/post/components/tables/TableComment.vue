<script setup lang="ts">
import gql from 'graphql-tag'
import { format, parse } from 'date-fns'
import { useMutation } from '@vue/apollo-composable'

defineProps({
  comments: Array,
  loading: Boolean,
})

const postCommentsFragment = gql`
  fragment postComments on Post {
    comments {
      id
      content
      createdAt
    }
  }
`
const { mutate: deleteComment } = useMutation(gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      id
    }
  }
`)

const dateFormat = (date: string | null) => {
  if (!date) return

  return format(parse(date, 'T', new Date()), 'dd.MM.yyyy HH:mm')
}

defineExpose({ postCommentsFragment })
</script>

<template>
  <DataTable :value="comments" :lazy="true" :loading="loading">
    <Column field="content" header="Text"></Column>

    <Column field="createdAt" header="Date" style="width: 12rem">
      <template #body="{ data }">
        <span>{{ dateFormat(data.createdAt) }}</span>
      </template>
    </Column>

    <Column>
      <template #body="{ data }">
        <RouterLink
          class="no-underline"
          :to="{ name: 'comment.update', params: { commentId: data.id } }"
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
          @click="deleteComment({ id: data.id })"
        ></Button>
      </template>
    </Column>
  </DataTable>
</template>
