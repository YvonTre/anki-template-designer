import { mount } from 'svelte'
import { useRegisterSW } from 'virtual:pwa-register/svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

if (typeof window !== 'undefined') {
  useRegisterSW()
}

export default app
