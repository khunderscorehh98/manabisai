<template>
  <div class="login-page">
    <div class="login-glow"></div>

    <v-row justify="center" align="center" style="min-height: 100vh; margin: 0;">
      <v-col cols="12" sm="8" md="5" lg="4">
        <!-- Logo mark -->
        <div class="text-center mb-8">
          <div class="logo-ring">
            <span style="font-size: 32px;">🍜</span>
          </div>
          <h1 style="font-size: 26px; font-weight: 700; color: #fff; margin-top: 16px; letter-spacing: -0.5px;">
            ManaBisai
          </h1>
          <p style="font-size: 13px; color: #444; margin-top: 4px; letter-spacing: 1px; text-transform: uppercase;">
            Admin Portal
          </p>
        </div>

        <!-- Login Card -->
        <div class="login-card">
          <h2 style="font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 24px;">
            Sign in to continue
          </h2>

          <v-form @submit.prevent="handleLogin">
            <div class="field-label">Email</div>
            <v-text-field
              v-model="email"
              type="email"
              placeholder="admin@manabisai.com"
              outlined
              dense
              required
              prepend-inner-icon="mdi-email-outline"
              class="mb-1"
            ></v-text-field>

            <div class="field-label">Password</div>
            <v-text-field
              v-model="password"
              type="password"
              placeholder="••••••••"
              outlined
              dense
              required
              prepend-inner-icon="mdi-lock-outline"
              class="mb-2"
            ></v-text-field>

            <v-alert
              v-if="error"
              type="error"
              dense
              text
              class="mb-4"
              style="border-radius: 10px; font-size: 13px;"
            >{{ error }}</v-alert>

            <v-btn
              type="submit"
              block
              :loading="loading"
              class="login-btn"
              elevation="0"
            >
              <span v-if="!loading">Sign In</span>
            </v-btn>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return { email: '', password: '', error: '', loading: false };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password,
        });
        this.$router.push('/spots');
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #0A0A0A;
  position: relative;
  overflow: hidden;
}

.login-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(57, 255, 20, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.logo-ring {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(57, 255, 20, 0.07);
  border: 1px solid rgba(57, 255, 20, 0.2);
  box-shadow: 0 0 40px rgba(57, 255, 20, 0.1);
}

.login-card {
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.login-btn {
  height: 48px !important;
  border-radius: 12px !important;
  background: #39FF14 !important;
  color: #0A0A0A !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  letter-spacing: 0.5px !important;
  box-shadow: 0 0 24px rgba(57, 255, 20, 0.3) !important;
  transition: box-shadow 0.2s !important;
}

.login-btn:hover {
  box-shadow: 0 0 36px rgba(57, 255, 20, 0.45) !important;
}
</style>
