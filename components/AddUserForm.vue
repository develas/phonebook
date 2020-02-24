<template>
    <b-modal
            id="modal-update"
            ref="modal"
            title="Update Person"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk"
            v-model="show"
    >
        <form ref="formR" @submit.stop.prevent="handleSubmit">
            <b-form-group
                    :state="nameState"
                    label="First Name"
                    label-for="user-input"
                    invalid-feedback="First Name is required"
            >
                <b-form-input
                        id="user-input"
                        v-model="form.firstName"
                        :state="nameState"
                        required
                ></b-form-input>
            </b-form-group>
            <b-form-group
                    :state="lastNameState"
                    label="Last Name"
                    label-for="user-input"
                    invalid-feedback="Last Name is required"
            >
                <b-form-input
                        id="user-input"
                        v-model="form.lastName"
                        :state="lastNameState"
                        required
                ></b-form-input>

                <ul style="padding-top: 10px">
                    <li v-for="(pn, index) in form.phones">
                        <b-row class="my-1">
                            <b-col sm="5">
                                <b-form-input type="text" v-model="form.phones[index]"></b-form-input>
                            </b-col>
                            <b-col sm="5">
                                <b-button variant="danger" @click.prevent="deletePhone(index)">Delete Phone</b-button>
                            </b-col>
                        </b-row>
                    </li>
                </ul>

                <b-button variant="primary" @click.prevent="addPhone">Add Phone</b-button>
            </b-form-group>
        </form>
    </b-modal>
</template>

<script>
    export default {
        props: {
            user: {
                required: false,
                type: Object,
                default: {}
            },
            needShow: Boolean,
            submit: Function,
            editMode: {
                required: false,
                type: Boolean,
                default: false
            }
        },
        data: () => ({
            show: (this || {}).needShow,
            form: {
                firstName: '',
                lastName: '',
                phones: []
            },
            nameState: null,
            lastNameState: null
        }),
        async mounted () {
            this.form.firstName = this.user.firstName
            this.form.lastName = this.user.lastName
            this.form.phones = [...(this.user.phones || [])]
        },
        methods: {
            checkFormValidity() {
                const valid = this.$refs.formR.checkValidity()
                this.nameState = valid
                this.lastNameState = valid
                return valid
            },
            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.handleSubmit()
            },
            resetModal() {
                if (!this.editMode) {
                    this.form.firstName = ''
                    this.form.lastName = ''
                    this.form.phones = []
                }
            },
            async handleSubmit() {
                const data = Object.keys(this.form).reduce((result, opt) => {
                    return { ...result, [opt]: this.form[opt] }
                }, {})

                this.submit(data)

                if (!this.checkFormValidity()) {
                    return
                }

                this.$nextTick(() => {
                    this.$bvModal.hide('modal-update')
                })
            },
            addPhone() {
                this.form.phones.push('')
            },
            deletePhone(index) {
                this.form.phones.splice(index,1)
            }
        }
    }
</script>

<style scoped>

</style>