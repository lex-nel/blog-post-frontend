import { createApp, h, provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo.client'

import router from './router'

import App from './App.vue'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import MegaMenu from 'primevue/megamenu'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Row from 'primevue/row'
import Chip from 'primevue/chip'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Editor from 'primevue/editor'
import MultiSelect from 'primevue/multiselect'
import InputSwitch from 'primevue/inputswitch'

import './style.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})
  .use(router)
  .use(PrimeVue)
  .component('Button', Button)
  .component('MegaMenu', MegaMenu)
  .component('DataTable', DataTable)
  .component('Column', Column)
  .component('Row', Row)
  .component('Chip', Chip)
  .component('InputText', InputText)
  .component('Textarea', Textarea)
  .component('Editor', Editor)
  .component('MultiSelect', MultiSelect)
  .component('InputSwitch', InputSwitch)
  .mount('#app')
