<template>
  <div class="mx-auto">
    <b-modal ref="addProductModal"
             id="product-modal"
             title="Add product"
             hide-footer>
      <b-form @submit="onSubmitUpdate" @reset="onResetUpdate" v-if="productUpdate">
        <b-form-group id="input-group-1" label="Name:" label-for="input-1">
          <b-form-input
              id="input-1"
              v-model="addProductForm.name"
              placeholder="Enter product name"
              required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" label="Price:" label-for="input-2">
          <b-form-input
              id="input-2"
              v-model="addProductForm.price"
              type="number"
              step="0.01"
              min="0.00"
              max="1000.00"
              placeholder="Enter price"
              required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-3" label="Stock:" label-for="input-3">
          <b-form-input
              id="input-3"
              v-model="addProductForm.stock"
              type="number"
              min="0"
              max="999"
              placeholder="Enter stock"
              required
          ></b-form-input>
        </b-form-group>
        <p>*All fields are required</p>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button class="ml-1" type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
    <v-btn class="success" @click="openAddForm">
      Add Product
      <v-icon right dark>mdi-plus-circle-outline</v-icon>
    </v-btn>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data () {
    return {
      productUpdate: true,
      addProductForm: {
        name: '',
        price: '',
        stock: ''
      },
    }
  },

  computed: {
    ...mapGetters({ cartItems: 'cart/getItems' })
  },

  methods: {
    ...mapActions({
      addProduct: 'products/add'
    }),

    async callAddProduct(parameters) {
      try {
        await this.addProduct(parameters);

        // if success
        this.$refs.addProductModal.hide()

      } catch (error) {
        // Error
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          this.statusCode = error.response.status
          this.errorMessage = error.response.data.message // the response payload
        } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          this.errorMessage = error.request
          console.log(error.request)
        } else {
          // Something happened in setting up the request and triggered an Error
          this.errorMessage = 'Error ' + error.message
          console.log('Error', error.message)
        }
        // eslint-disable-next-line
        console.log(error)
        this.showDismissibleAlert = true
      }
    },
    openAddForm() {
      this.initFormData()
      this.$refs['addProductModal'].show()
    },
    initFormData () {
      this.addProductForm.name = ""
      this.addProductForm.price = ""
      this.addProductForm.stock = ""
    },
    onResetUpdate (evt) {
      evt.preventDefault()
      this.initFormData()
      // Trick to reset/clear native browser form validation state
      this.productUpdate = false
      this.$nextTick(() => {
        this.productUpdate = true
      })
    },
    onSubmitUpdate (evt) {
      evt.preventDefault()
      const parameters = {
        name: this.addProductForm.name,
        price: this.addProductForm.price === '' ? "0" : this.addProductForm.price,
        stock: this.addProductForm.stock === '' ? "0" : this.addProductForm.stock,
      }
      this.callAddProduct(parameters)
    },
  }
};
</script>
