<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { AuthType, type AuthCredentials } from "~/types/auth"
import type { ToastNotification } from '~/components/Toast.vue';

definePageMeta({
  layout: "login",
});

//const runtimeConfig = useRuntimeConfig();
const toast = inject('toast') as Ref<ToastNotification>

const validationSchema = toTypedSchema(
  zod.object({
    email: zod.string().min(1, { message: 'This is required' }).email({ message: 'Must be a valid email' }),
    password: zod.string().min(1, { message: 'This is required' }).min(4, { message: 'Too short' }),
  })
);

const error = ref<string | null>(null);

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: email } = useField('email');
const { value: password } = useField('password');

const onSubmit = handleSubmit(async (values) => {

  error.value = null;
  toast.value = {
		show: false,
	}

    try {
      const auth = await $login(AuthType.JWT, <AuthCredentials>{
        username: values.email,
        password: values.password,
      });

      if(!auth.success) {
        console.error(auth.error);
        toast.value = {
          show: true,
          title: 'Login failed',
          message: auth.error || 'An error occurred during login.',
          type: 'error',
          timeout: 20,
        }
      }

    } catch (error) {
      console.error(error);
      toast.value = {
          show: true,
          title: 'Login failed',
          message: error.message || 'An error occurred during login.',
          type: 'error',
          timeout: 20,
        }
    }
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
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email Address</label>
          <div class="mt-2">
            <input name="email" type="email" v-model="email" class="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm/6" />
            <span class="text-red-700 text-sm">{{ errors.email }}</span>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <input name="password" type="password" v-model="password" class="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm/6" />
            <span class="text-red-700 text-sm">{{ errors.password }}</span>
          </div>
        </div>

        <div>
          <button class="flex w-full justify-center rounded-md bg-yellow-500 first-letter:px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-yellow-600">Sign in</button>
        </div>
      </form>
      
    </div>
  </div>
</template>