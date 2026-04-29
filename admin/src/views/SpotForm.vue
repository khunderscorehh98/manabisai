<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center mb-6" style="gap: 12px;">
      <v-btn icon small @click="$router.back()" style="color: #555; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;">
        <v-icon small>mdi-arrow-left</v-icon>
      </v-btn>
      <div>
        <h1 class="page-title">{{ isEdit ? 'Edit Spot' : 'New Spot' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Update food spot details' : 'Add a new food spot to the directory' }}</p>
      </div>
    </div>

    <v-card elevation="0" class="form-card">
      <v-card-text class="pa-6">
        <v-form @submit.prevent="handleSubmit">
          <!-- Section: Basic Info -->
          <div class="section-label">Basic Information</div>

          <div class="field-label">Name</div>
          <v-text-field
            v-model="form.name"
            placeholder="e.g. Nasi Katok Seria"
            outlined
            dense
            required
            class="mb-2"
          ></v-text-field>

          <div class="field-label">Description</div>
          <v-textarea
            v-model="form.description"
            placeholder="Describe this food spot..."
            outlined
            dense
            rows="3"
            class="mb-2"
          ></v-textarea>

          <!-- Section: Location -->
          <div class="section-label mt-4">Location</div>

          <div class="field-label">Address</div>
          <v-text-field
            v-model="form.address"
            placeholder="Street, district, mukim..."
            outlined
            dense
            class="mb-2"
            prepend-inner-icon="mdi-map-marker-outline"
          ></v-text-field>

          <v-row dense>
            <v-col cols="6">
              <div class="field-label">Latitude</div>
              <v-text-field
                v-model="form.latitude"
                type="number"
                step="any"
                placeholder="4.9031"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <div class="field-label">Longitude</div>
              <v-text-field
                v-model="form.longitude"
                type="number"
                step="any"
                placeholder="114.9398"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Section: Classification -->
          <div class="section-label mt-2">Classification</div>

          <div class="field-label">Category</div>
          <v-select
            v-model="form.category_id"
            :items="categories"
            item-value="id"
            item-text="name"
            placeholder="Select a category"
            outlined
            dense
            required
            class="mb-3"
            prepend-inner-icon="mdi-tag-outline"
          ></v-select>

          <!-- Halal toggle -->
          <div class="halal-toggle">
            <div>
              <div style="font-size: 14px; font-weight: 600; color: #fff;">Halal Certified</div>
              <div style="font-size: 12px; color: #444; margin-top: 2px;">Mark this spot as halal certified</div>
            </div>
            <v-switch
              v-model="form.is_halal"
              inset
              color="primary"
              hide-details
              class="mt-0"
            ></v-switch>
          </div>

          <v-alert v-if="error" type="error" dense text class="mt-4" style="border-radius: 10px; font-size: 13px;">
            {{ error }}
          </v-alert>

          <!-- Actions -->
          <div class="d-flex mt-6" style="gap: 12px;">
            <v-btn
              text
              @click="$router.back()"
              style="border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #555; font-size: 13px;"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              :loading="loading"
              elevation="0"
              class="submit-btn"
            >
              {{ isEdit ? 'Update Spot' : 'Create Spot' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SpotForm',
  data() {
    return {
      form: {
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        address: '',
        category_id: null,
        is_halal: true,
      },
      error: '',
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['categories', 'spots']),
    isEdit() {
      return !!this.$route.params.id;
    },
  },
  async mounted() {
    await this.$store.dispatch('fetchCategories');
    if (this.isEdit) {
      await this.$store.dispatch('fetchSpots');
      const spot = this.spots.find((s) => s.id === parseInt(this.$route.params.id));
      if (spot) {
        this.form = { ...spot };
      }
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.error = '';
      try {
        if (this.isEdit) {
          await this.$store.dispatch('updateSpot', { id: this.$route.params.id, ...this.form });
        } else {
          await this.$store.dispatch('createSpot', this.form);
        }
        this.$router.push('/spots');
      } catch (err) {
        this.error = err.response?.data?.message || 'Operation failed';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}

.page-subtitle {
  font-size: 13px;
  color: #444;
  margin-top: 2px;
}

.form-card {
  max-width: 640px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: #39FF14;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(57, 255, 20, 0.1);
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.halal-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(57, 255, 20, 0.04);
  border: 1px solid rgba(57, 255, 20, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
}

.submit-btn {
  flex: 1;
  height: 44px !important;
  border-radius: 10px !important;
  background: #39FF14 !important;
  color: #0A0A0A !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.25) !important;
}
</style>
