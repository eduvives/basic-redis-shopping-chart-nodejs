<template>
    <v-col cols="6" sm="6" md="6" lg="4">
        <v-card class="h-full">
          <v-card-actions class="pa-3 top-buttons justify-end">
            <v-btn
                class="primary"
                @click="$emit('edit', product)"
            >
              <span class="d-xs-flex d-none d-xl-flex">Edit</span>
              <div class="pl-2 d-xs-flex d-none d-xl-flex"></div>
              <v-icon class="edit-icon" dark>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
                class="error"
                @click="$emit('delete', product.id)"
            >
              <span class="d-xs-flex d-none d-xl-flex">Delete</span>
              <div class="pl-2 d-xs-flex d-none d-xl-flex"></div>
              <v-icon class="delete-icon" dark>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>

          <v-divider />

            <div class="d-flex justify-center">
                <v-img
                        max-width="65%"
                        :src="product.id > 24 ? require(`@/assets/products/default.png`) : require(`@/assets/products/${product.id}.jpg`)"
                />
            </div>

            <v-card-title class="pa-3 text-subtitle-1 text-xl-h6">
                {{ product.name }}
            </v-card-title>

            <v-card-subtitle class="pa-3 text-subtitle-1 text-xl-h6">
                ${{ product.price }}
            </v-card-subtitle>

            <v-card-text class="pa-3 text-left text caption"> </v-card-text>

            <v-divider />

            <v-card-actions class="pa-3 justify-space-between">
                <span>{{ product.stock ? `${product.stock} in` : 'out of' }} stock</span>

                <v-btn
                    class="success"
                    :disabled="product.stock === 0"
                    @click="$emit('add', product.id)"
                >
                    <span class="d-xs-flex d-none d-xl-flex">Add to cart</span>
                    <v-icon right dark>mdi-cart-plus</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
export default {
    name: 'Product',

    props: {
        product: {
            type: Object,
            required: true
        }
    }
};
</script>
