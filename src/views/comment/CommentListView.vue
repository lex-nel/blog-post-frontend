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
    query fetchComments($skip: Int, $take: Int) {
      comments(skip: $skip, take: $take) {
        id
        createdAt
        content
        author {
          id
          firstName
          lastName
        }
      }
      commentCount
    }
  `,
  variables,
)
const { mutate: deleteComment } = useMutation(gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      id
    }
  }
`)

const comments = computed(() => result.value?.comments ?? [])
const commentTotal = computed(() => result.value?.commentCount ?? 0)

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
    <h1>Comment List</h1>

    <RouterLink class="no-underline" :to="{ name: 'comment.create' }">
      <Button
        class=""
        label="Добавить"
        type="button"
        icon="pi pi-plus"
      ></Button>
    </RouterLink>
  </div>

  <DataTable
    :value="comments"
    :lazy="true"
    :loading="loading"
    :paginator="true"
    :rows="10"
    :totalRecords="commentTotal"
    :rowsPerPageOptions="[10, 20, 50]"
    responsiveLayout="scroll"
    @page="handleChangePage"
  >
    <Column field="content" header="Text"></Column>

    <Column field="createdAt" header="Date" style="width: 12rem">
      <template #body="{ data }">
        <span>{{ dateFormat(data.createdAt) }}</span>
      </template>
    </Column>

    <Column field="author" header="Author">
      <template #body="{ data }">
        <span>{{ data.author.firstName }} {{ data.author.lastName }}</span>
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
