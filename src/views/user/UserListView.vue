<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { DataTablePageEvent } from 'primevue/datatable'

const variables = ref({
  skip: 0,
  take: 10,
})

const { result, loading } = useQuery(
  gql`
    query fetchUsers($skip: Int, $take: Int) {
      users(skip: $skip, take: $take) {
        id
        email
        firstName
        lastName
        postCount
        commentCount
      }
      userCount
    }
  `,
  variables,
)
const { mutate: deleteUser } = useMutation(gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`)

const users = computed(() => result.value?.users ?? [])
const userTotal = computed(() => result.value?.userCount ?? 0)

const handleChangePage = (e: DataTablePageEvent) => {
  variables.value.skip = e.page * e.rows
  variables.value.take = e.rows + e.page * e.rows
}
</script>

<template>
  <div class="flex align-items-center justify-content-between">
    <h1>User List</h1>

    <RouterLink class="no-underline" :to="{ name: 'user.create' }">
      <Button
        class=""
        label="Добавить"
        type="button"
        icon="pi pi-plus"
      ></Button>
    </RouterLink>
  </div>

  <DataTable
    :value="users"
    :lazy="true"
    :loading="loading"
    :paginator="true"
    :rows="10"
    :totalRecords="userTotal"
    :rowsPerPageOptions="[10, 20, 50]"
    responsiveLayout="scroll"
    @page="handleChangePage"
  >
    <Column field="email" header="Email"></Column>

    <Column field="firstName" header="First Name"></Column>

    <Column field="lastName" header="Last Name"></Column>

    <Column field="postCount" header="Post Quantity"></Column>

    <Column field="commentCount" header="Comment Quantity"></Column>

    <Column>
      <template #body="{ data }">
        <RouterLink
          class="no-underline"
          :to="{ name: 'user.update', params: { userId: data.id } }"
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
          @click="deleteUser({ id: data.id })"
        ></Button>
      </template>
    </Column>
  </DataTable>
</template>
