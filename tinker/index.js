import '\0component-ioc:component-store';
const HierarchyInspector = window.__DIS__.get()['/src/inspector/HierarchyInspector.svelte'];

export default new HierarchyInspector({ target: document.querySelector('#app') });