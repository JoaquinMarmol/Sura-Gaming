// vite.config.ts
import { defineConfig } from "file:///C:/Users/usuario/Desktop/demo-waas-auth-master/node_modules/.pnpm/vite@4.5.3_@types+node@20.14.2/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/usuario/Desktop/demo-waas-auth-master/node_modules/.pnpm/@vitejs+plugin-react@4.3.0_vite@4.5.3_@types+node@20.14.2_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { vanillaExtractPlugin } from "file:///C:/Users/usuario/Desktop/demo-waas-auth-master/node_modules/.pnpm/@vanilla-extract+vite-plugin@3.9.5_@types+node@20.14.2_vite@4.5.3_@types+node@20.14.2_/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    //mkcert({ hosts: ['localhost.direct'] }),
    react(),
    vanillaExtractPlugin()
  ],
  // For github pages https://0xsequence.github.io/demo-waas-auth/
  base: mode === "production" ? "/demo-waas-auth/" : "/"
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c3VhcmlvXFxcXERlc2t0b3BcXFxcZGVtby13YWFzLWF1dGgtbWFzdGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c3VhcmlvXFxcXERlc2t0b3BcXFxcZGVtby13YWFzLWF1dGgtbWFzdGVyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy91c3VhcmlvL0Rlc2t0b3AvZGVtby13YWFzLWF1dGgtbWFzdGVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IHZhbmlsbGFFeHRyYWN0UGx1Z2luIH0gZnJvbSAnQHZhbmlsbGEtZXh0cmFjdC92aXRlLXBsdWdpbidcbi8vaW1wb3J0IG1rY2VydCBmcm9tICd2aXRlLXBsdWdpbi1ta2NlcnQnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBwbHVnaW5zOiBbXG4gICAgLy9ta2NlcnQoeyBob3N0czogWydsb2NhbGhvc3QuZGlyZWN0J10gfSksXG4gICAgcmVhY3QoKSxcbiAgICB2YW5pbGxhRXh0cmFjdFBsdWdpbigpLFxuICBdLFxuICAvLyBGb3IgZ2l0aHViIHBhZ2VzIGh0dHBzOi8vMHhzZXF1ZW5jZS5naXRodWIuaW8vZGVtby13YWFzLWF1dGgvXG4gIGJhc2U6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICcvZGVtby13YWFzLWF1dGgvJyA6ICcvJyxcbn0pKVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVSxTQUFTLG9CQUFvQjtBQUNuVyxPQUFPLFdBQVc7QUFDbEIsU0FBUyw0QkFBNEI7QUFJckMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxTQUFTO0FBQUE7QUFBQSxJQUVQLE1BQU07QUFBQSxJQUNOLHFCQUFxQjtBQUFBLEVBQ3ZCO0FBQUE7QUFBQSxFQUVBLE1BQU0sU0FBUyxlQUFlLHFCQUFxQjtBQUNyRCxFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
