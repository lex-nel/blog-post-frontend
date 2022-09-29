<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const router = useRouter()

const email = ref()
const password = ref()
const firstName = ref()
const midName = ref()
const lastName = ref()

const { mutate: createUser, onDone } = useMutation(gql`
  mutation createUser($user: CreateUserInput!) {
    createUser(user: $user) {
      email
      firstName
      midName
      lastName
    }
  }
`)

const handleCreate = () => {
  createUser({
    user: {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      midName: midName.value,
      lastName: lastName.value,
    },
  })
}

onDone(result => {
  router.replace({ name: 'user.list' })
})
</script>

<template>
  <div class="flex align-items-center justify-content-between">
    <h1>User Create</h1>

    <Button
      label="Создать"
      type="button"
      icon="pi pi-save"
      @click="handleCreate"
    ></Button>
  </div>

  <div class="flex gap-3 mb-3">
    <div class="flex flex-column flex-1">
      <label for="email">Email</label>
      <InputText id="email" type="text" v-model="email" />
    </div>

    <div class="flex flex-column flex-1">
      <label for="password">Password</label>
      <InputText id="password" type="password" v-model="password" />
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
</template>
