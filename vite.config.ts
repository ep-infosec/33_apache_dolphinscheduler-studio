/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteCompression from 'vite-plugin-compression'
import dts from 'vite-plugin-dts'
import path from 'path-browserify'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    lib: {
      entry: 'studio/index.ts',
      formats: ['es']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'studio'),
      path: 'path-browserify'
    }
  },
  server: {
    proxy: {
      '/studio/api': {
        target: loadEnv('development', './').VITE_APP_DEV_WEB_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/studio\/api/, '')
      },
      '/studio/ws': {
        target: loadEnv('development', './').VITE_APP_DEV_WEB_URL,
        ws: true,
        rewrite: (path) => path.replace(/^\/studio\/ws/, '/socket.io/')
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false
    }),
    dts({
      exclude: 'src/*',
      insertTypesEntry: true
    })
  ]
})
