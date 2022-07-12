import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


import TMPlugin from "vite-plugin-tm-userscript";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
     // ...
     AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),

    TMPlugin({
      externalGlobals: {
        "vue": ["Vue", "https://unpkg.com/vue@3.2.36"],
      }
    }),
  ]
})
