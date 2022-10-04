<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// Components
import TableComment from './components/tables/TableComment.vue'
import TablePost from './components/tables/TablePost.vue'

const route = useRoute()

const tableCommentRef = ref<InstanceType<typeof TableComment> | null>(null)
const tablePostRef = ref<InstanceType<typeof TablePost> | null>(null)

const variables = ref({
  id: route.params.userId,
})

const { result, loading } = useQuery(
  gql`
    query fetchUser($id: ID!) {
      user(id: $id) {
        id
        createdAt
        email
        firstName
        midName
        lastName
        ...userPosts
        ...userComments
      }
    }

    fragment userPosts on User {
      posts {
        id
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

    fragment userComments on User {
      comments {
        id
        content
        createdAt
      }
    }

    # ${tablePostRef.value?.userPostsFragment}
    # ${tableCommentRef.value?.userCommentsFragment}
  `,
  variables,
)

const { mutate: updateUser } = useMutation(gql`
  mutation updateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      email
      firstName
      midName
      lastName
    }
  }
`)

const firstName = ref()
const midName = ref()
const lastName = ref()

const user = computed(() => {
  if (result.value?.user) {
    firstName.value = result.value?.user.firstName
    midName.value = result.value?.user.midName
    lastName.value = result.value?.user.lastName

    return result.value?.user
  } else {
    return null
  }
})

const handleUpdate = () => {
  updateUser({
    user: {
      id: user.value.id,
      firstName: firstName.value,
      midName: midName.value,
      lastName: lastName.value,
    },
  })
}
</script>

<template>
  <template v-if="user">
    <div class="flex align-items-center justify-content-between">
      <h1>User Update</h1>

      <Button
        label="Сохранить"
        type="button"
        icon="pi pi-save"
        @click="handleUpdate"
      ></Button>
    </div>

    <div class="flex gap-3 mb-3">
      <div class="flex flex-column flex-1">
        <label for="email">Email</label>
        <InputText id="email" type="text" v-model="user.email" disabled />
      </div>
    </div>

    <div class="flex gap-3">
      <div class="flex flex-column flex-1">
        <label for="firstName">First Name</label>
        <InputText id="firstName" type="text" v-model="firstName" />
      </div>

      <div class="flex flex-column flex-1">
        <label for="midName">Mid Name</label>
        <InputText id="midName" type="text" v-model="midName" />
      </div>

      <div class="flex flex-column flex-1">
        <label for="lastName">Last Name</label>
        <InputText id="lastName" type="text" v-model="lastName" />
      </div>
    </div>

    <h2>Posts</h2>
    <TablePost ref="tablePostRef" :posts="user.posts" :loading="loading" />

    <h2>Comments</h2>
    <TableComment
      ref="tableCommentRef"
      :comments="user.comments"
      :loading="loading"
    />
  </template>
</template>
