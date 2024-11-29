<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';

definePageMeta({
  layout: "login",
});


const validationSchema = toTypedSchema(
  zod.object({
    apikey: zod.string().min(1, { message: 'This is required' }).min(8, { message: 'Too short' }),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: apikey } = useField('apikey');

const onSubmit = handleSubmit(values => {
  alert(JSON.stringify(values, null, 2));


  // try {
  //   await $login(username.value, password.value);
  //   $router.push("/dashboard");
  // } catch (error) {
  //   console.error(error);
  // }
});

</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to the portal</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit="onSubmit">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">API Key</label>
          <div class="mt-2">
            <input v-model="apikey" name="apikey" type="password" class="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm/6" />
            <span>{{ errors.apikey }}</span>
          </div>
        </div>

      
        <div>
          <button class="flex w-full justify-center rounded-md bg-yellow-500 first-letter:px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-yellow-600">Sign in</button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        <RouterLink to="/" class="font-semibold text-yellow-500 hover:text-yellow-600">Login with Email & Password</RouterLink>
      </p>
      
      
    </div>
  </div>
</template>