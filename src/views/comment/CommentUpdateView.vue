<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const route = useRoute()

const variables = ref({
  id: route.params.commentId,
})

const { result, loading } = useQuery(
  gql`
    query fetchComment($id: ID!) {
      comment(id: $id) {
        id
        createdAt
        content
        author {
          id
          firstName
          lastName
        }
      }
    }
  `,
  variables,
)
</script>

<template>
  <div class="flex align-items-center justify-content-between">
    <h1>Comment Update</h1>

    <Button label="Сохранить" type="button" icon="pi pi-save"></Button>
  </div>
</template>
