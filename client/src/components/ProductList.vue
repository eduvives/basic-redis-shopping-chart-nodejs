<template>
  <div id="product-list">
    <b-modal ref="editProductModal"
             id="product-modal"
             title="Update product"
             hide-footer>
      <b-form @submit="onSubmitUpdate" @reset="onResetUpdate" v-if="productUpdate">
        <b-form-group id="input-group-1" label="ID:" label-for="input-1">
          <b-form-input
              id="input-1"
              v-model="editProductForm.id"
              placeholder="Enter id"
              type="number"
              required readonly
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" label="Name:" label-for="input-2">
          <b-form-input
              id="input-2"
              v-model="editProductForm.name"
              placeholder="Enter product name"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-3" label="Price:" label-for="input-3">
          <b-form-input
              id="input-3"
              v-model="editProductForm.price"
              type="number"
              step="0.01"
              min="0.00"
              max="1000.00"
              placeholder="Enter price"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-4" label="Stock:" label-for="input-4">
          <b-form-input
              id="input-4"
              v-model="editProductForm.stock"
              type="number"
              min="0"
              max="999"
              placeholder="Enter stock"
          ></b-form-input>
        </b-form-group>
        <p>*Empty fields will not be modified</p>
        <p>*Only the fields with input will be modified</p>
        <b-alert
            variant="danger"
            dismissible
            fade
            :show="showDismissibleAlert"
            @dismissed="showDismissibleAlert=false">
          <b v-if="statusCode">Error Status Code {{this.statusCode}}</b><br v-if="statusCode"/>{{this.errorMessage}}
        </b-alert>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button class="ml-1" type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
    <v-row v-if="products.length" align="stretch">
      <product
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add="addToCart"
          @delete="deleteProduct"
          @edit="openEditForm"
      />
    </v-row>
    <v-row v-else>
      <p> No products in store </p>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Product from '@/components/Product';

export default {
    name: 'ProductList',

    data () {
      return {
        statusCode: 0,
        errorMessage: '',
        showDismissibleAlert: false,
        productUpdate: true,
        editProductForm: {
          id: '',
          name: '',
          price: '',
          stock: ''
        },
        oldProductValues: {
          name: '',
          price: '',
          stock: ''
        },
        formProduct: null,
      }
    },

    props: {
        products: {
            type: Array,
            required: false,
            defaultValue: () => []
        }
    },

    components: {
        Product
    },

    methods: {
      ...mapActions({
          saveItem: 'cart/save',
          deleteItem: 'products/delete',
          updateItem: 'products/update'
      }),

      async addToCart(id) {
          try {
              await this.saveItem({ id, incrementBy: 1 });
          } catch (error) {
              console.error(error);
          }
      },
      async deleteProduct(id) {
        try {
          await this.deleteItem(id);
        } catch (error) {
          console.error(error);
        }
      },
      async updateProduct (parameters) {
          try {
              await this.updateItem(parameters);

              // if success
              this.$refs.editProductModal.hide()

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
      openEditForm(product) {
        this.formProduct = product
        this.setFormData(product)
        this.$refs['editProductModal'].show()
      },
      setFormData (product) {
        this.editProductForm.id = product.id
        this.editProductForm.name = product.name
        this.editProductForm.price = product.price
        this.editProductForm.stock = product.stock
        this.oldProductValues.name = product.name
        this.oldProductValues.price = product.price
        this.oldProductValues.stock = product.stock
      },
      onResetUpdate (evt) {
        evt.preventDefault()
        this.setFormData(this.formProduct)
        // Trick to reset/clear native browser form validation state
        this.productUpdate = false
        this.$nextTick(() => {
          this.productUpdate = true
        })
      },
      onSubmitUpdate (evt) {
        evt.preventDefault()
        const parameters = {
          id: this.editProductForm.id,
          name: this.editProductForm.name === '' ? this.oldProductValues.name : this.editProductForm.name,
          price: this.editProductForm.price === '' ? this.oldProductValues.price : this.editProductForm.price,
          stock: this.editProductForm.stock === '' ? this.oldProductValues.stock : this.editProductForm.stock,
          oldName: this.oldProductValues.name,
          oldPrice: this.oldProductValues.price,
          oldStock: this.oldProductValues.stock,
        }
        this.updateProduct(parameters)
      },
    }
};
</script>
