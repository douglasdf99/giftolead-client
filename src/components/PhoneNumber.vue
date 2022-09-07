<template>
  <div>
    <VuePhoneNumberInput
      v-bind.sync="inputOptions"
      v-model="phoneNumber"
      @update="onUpdate"
      @phone-number-blur="onBlur"
      :error="!isValid"
      v-validate="'required'"
      required
      :default-country-code="countryAbbr"
    />
  </div>
</template>
<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import countries from "@/countries.js";
import saveleadsConfig from "@/../saveleadsConfig.js";

export default {
  name: "PhoneNumber",
  props: {
    ddi: {
      type: String,
    },
    phone: {
      type: String | Number,
    },
  },
  data() {
    return {
      phoneNumber: "",
      countryAbbr: "BR",
      countries: countries,
      translations: { ...saveleadsConfig.phoneNumberInputTranslations },
      inputOptions: {
        id: `${Math.floor(Math.random() * 10)}`,
        name: "telefone",
        translations: { ...saveleadsConfig.phoneNumberInputTranslations },
        noFlags: true,
        required: true,
        clearable: true,
        borderRadius: 8,
        showCodeOnList: true,
      },
      isValid: true,
    };
  },
  components: {
    VuePhoneNumberInput,
  },
  mounted() {
    this.phoneNumber = this.phone;
    this.findddi();
  },
  methods: {
    async findddi() {
      if(!this.ddi) {
        this.$emit("update:ddi", "55");
      }
      await this.countries.forEach((country) => {
        if (country.dial_code) {
          let ddi = country.dial_code.replace(/[{+}]/g, "");
          if (ddi == this.ddi) {
            this.countryAbbr = country.code;
            return country.code;
          }
        }
      });
    },
    onUpdate(payload) {
      if (payload && payload.countryCallingCode) {
        this.$emit("update:ddi", payload.countryCallingCode);
        this.isValid = payload.isValid;
      }
    },
    onBlur() {
      this.$emit("update:phone", this.phoneNumber);
      this.$emit("update:ddi", this.ddi);
    },
  },
  computed: {
    inputListeners: function () {
      var vm = this;
      // `Object.assign` mescla objetos para formar um novo objeto
      return Object.assign(
        {},
        // Nós adicionamos todas as escutas do pai
        this.$listeners,
        // Então podemos adicionar escutas personalizadas ou substituir
        // comportamento de algumas escutas.
        {
          // Isso garante que o componente funcione com o v-model
          input: function (event) {
            vm.$emit("input", event.target.value);
          },
        }
      );
    },
  },
};
</script>