<template>
  <section style="padding-top: 10px">
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">{{ `${user.firstName} ${user.lastName}` }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">Phone Numbers</h6>
        <p class="card-text">{{ (user.phones || []).join(', ') }}</p>
        <a href="#" class="card-link" v-b-modal.modal-update @click.prevent="showModal">Update</a>
        <a href="#" class="card-link" @click.prevent="confirmDelete" >Delete</a>

        <template v-if="childDataLoaded">
          <EditUserForm :user="user" :needShow="needEdit" :submit="updateUser" :editMode="true"/>
        </template>
      </div>
    </div>
</section>
</template>

<script>
  import EditUserForm from '@/components/AddUserForm'
  export default {
    data: () => ({
      needEdit: false,
      user: {},
      childDataLoaded: false
    }),
    async mounted () {
      this.user = await this.$axios.$get(`/api/users/${this.$nuxt.$route.params.id}`).catch(err => console.log(err))
      this.childDataLoaded = true
    },
    components: {
      EditUserForm
    },
    methods: {
      confirmDelete() {
        this.$bvModal.msgBoxConfirm('Are you sure?')
          .then(value => {
            if (value) {
              this.$axios.$delete(`/api/users/${this.$nuxt.$route.params.id}`)
              this.$router.push(`/users`)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      showModal() {
        this.needEdit = true
      },
      async updateUser(data) {
        await this.$axios.$put(`/api/users/${this.$nuxt.$route.params.id}`, data).catch(err => console.log(err))
        this.user = await this.$axios.$get(`/api/users/${this.$nuxt.$route.params.id}`).catch(err => console.log(err))
      }
    }
  }
</script>

<style scoped>

</style>