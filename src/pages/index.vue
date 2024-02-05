<template>
  <div class="m-8 flex flex-col justify-center gap-4">
    <h1>{{ t('title') }}</h1>
    <VioForm
      :form="v$"
      :is-form-sent="isFormSent"
      :submit-name="t('formDownloadButton')"
      @submit.prevent="submit"
    >
      <VioFormInput
        id-label="input-username"
        :placeholder="t('placeholderUsername')"
        :title="t('username')"
        type="text"
        :value="v$.username"
        @input="form.username = $event"
      >
      </VioFormInput>
    </VioForm>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { withQuery } from 'ufo'

const { t } = useI18n()

// data
const form = reactive({
  username: ref<string>(),
})
const isFormSent = ref(false)

// validation
const rules = {
  username: {
    required,
  },
}
const v$ = useVuelidate(rules, form)

// submit
const fileDownload = useFileDownload()
const submit = async () => {
  if (!(await isFormValid({ v$, isFormSent }))) return

  const href = withQuery('/api/membercard_generator', {
    username: form.username,
  })

  fileDownload({ href, fileName: `membercard_${form.username}` })
}
</script>

<i18n lang="yaml">
de:
  formDownloadButton: Mitgliedskarte herunterladen
  placeholderUsername: Manu Musterperson
  title: flipdot-Mitgliedskarten-Generator
  username: Nutzername
en:
  formDownloadButton: Download membercard
  placeholderUsername: Person Doe
  title: flipdot Membercard Generator
  username: Username
</i18n>
