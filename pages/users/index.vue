<template>
    <section>
        <b-row>
            <b-col lg="3" class="pb-2"><h1>Phone Book</h1></b-col>
            <b-col lg="4" class="pb-2 add-user">
                <div>
                    <b-input-group>
                        <b-form-input v-model="filterVal" @keyup="filter"></b-form-input>

                        <template v-slot:append>
                            <b-form-select v-model="selected" :options="options" calss="mb-3"></b-form-select>
                        </template>
                    </b-input-group>
                </div>
            </b-col>
            <b-col lg="4" class="pb-2 add-user">
                <b-button variant="primary" v-b-modal.modal-update @click.prevent="showModal">Add Person</b-button>
            </b-col>
        </b-row>
        <table class="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Phone Numbers</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="({ id, firstName = '', lastName = '', phones =[] }, index) of users" :key="id">
                <th scope="row">{{ index + 1 }}</th>
                <td>
                    <a href="#" @click.prevent="openUser(id)">{{ firstName }}</a>
                </td>
                <td>{{ lastName }}</td>
                <td>{{ phones.join(', ') }}</td>
            </tr>
            </tbody>
        </table>
        <AddUserForm :submit="createUser" :user="{}" :needShow="needCreate" />
    </section>

</template>

<script>
    import AddUserForm from '@/components/AddUserForm'
    export default {
        data: () => ({
            users: [],
            needCreate: false,
            filterVal: undefined,
            selected: 'filterName',
            options: [
                {
                    text: 'Filter by Name',
                    value: 'filterName'
                }, {
                    text: 'Filter by Phone',
                    value: 'filerPhone'
                }]
        }),
        async mounted () {
            this.users = await this.$axios.$get('/api/users').catch(err => {console.log(err)})
        },
        components: {
            AddUserForm
        },
        methods: {
            openUser(id){
                this.$router.push(`/users/${id}`)
            },
            async createUser(data) {
                await this.$axios.$post('/api/users', data)
                this.users = await this.$axios.$get('/api/users').catch(err => {console.log(err)})
            },
            showModal() {
                this.needCreate = true
            },
            async filter() {
                switch (this.selected) {
                    case 'filterName':
                        this.users = await this.$axios.$get(`/api/users?firstName=${this.filterVal || ''}`).catch(err => {console.log(err)})
                        break
                    case 'filerPhone':
                        this.users = await this.$axios.$get(`/api/users?phone=${this.filterVal || ''}`).catch(err => {console.log(err)})
                        break
                }
            }
        }
    }
</script>

<style scoped>
    .add-user {
        margin-top: 14px;
    }
</style>
