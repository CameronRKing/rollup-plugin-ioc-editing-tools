import '\0component-ioc:component-store';
// for some reason, directly importing caused the component to get loaded AFTER the component-store definition,
// leading to runtime errors of "Cannot access before initialization"
const HierarchyInspector = window.__DIS__.get()['/src/inspector/HierarchyInspector.svelte'];
const StoreList = window.__DIS__.get()['/src/StoreList.svelte'];

new StoreList({ target: document.querySelector('#storelist') });
export default new HierarchyInspector({ target: document.querySelector('#app') });