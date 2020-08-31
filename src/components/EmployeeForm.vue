<template>
  <v-form v-model="valid" id="employee-details-form">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="firstname"
            :rules="nameRules"
            :counter="10"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="lastname"
            :rules="nameRules"
            :counter="10"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="occupation"
            label="Occupation"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-col class="text-center" cols="18" sm="11">
      <div class="my-2">
        <v-btn form="check-login-form" text large color="primary" @click="submit">Add Customer</v-btn>
      </div>
    </v-col>
  </v-form>   
</template>

<script>
import { initTracer } from '../tracing';
export default {
  methods: {
    submit() {
      initTracer();
      console.log()
      alert("hi");
    }
  },
  data: () => ({
    valid: false,
    firstname: '',
    lastname: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => v.length <= 10 || 'Name must be less than 10 characters',
    ],
    occupation: ''
  }),
}
</script>
