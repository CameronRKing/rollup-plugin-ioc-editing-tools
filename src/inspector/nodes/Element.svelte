<script>
  import Collapse from './Collapse.svelte'
  import SearchTerm from './SearchTerm.svelte'
  import ElementAttributes from './ElementAttributes.svelte'
  import { visibility } from '../store.js';

  export let style
  export let hasChildren
  export let hover
  export let selected
  export let tagName
  export let attributes = []
  export let listeners = []
  export let collapsed

  function stringify(value) {
    switch (typeof value) {
      case 'string':
        return `"${value}"`
      case 'undefined':
        return 'undefined'
      case 'number':
        return value != value ? 'NaN' : value.toString()
      case 'object':
        if (value == null) return 'null'
        if (Array.isArray(value)) return `[${value.map(stringify).join(', ')}]`
        if (value.__isFunction) return value.name + '()'
        if (value.__isSymbol) return value.name
        return `{${Object.entries(value)
          .map(([key, value]) => `${key}: ${stringify(value)}`)
          .join(', ')}}`
    }
  }

  let _attributes
  let cache = {}
  $: {
    let localCache = {}
    _attributes = attributes.map(o => {
      const value = stringify(o.value)
      localCache[o.key] = value

      return {
        ...o,
        value,
        flash: !!_attributes && value != cache[o.key]
      }
    })
    cache = localCache
  }
</script>

<style>
  div {
    line-height: 16px;
  }

  .tag-name {
    color: rgb(0, 116, 232);
    font-size: 18px;
  }

  :global(.dark) .tag-name {
    color: rgb(117, 191, 255);
  }
</style>

{#if hasChildren}
  <div
    class:hover
    class:selected
    {style}
    on:dblclick={e => (collapsed = !collapsed)}>
    <Collapse {selected} bind:collapsed />
    &lt;
    <span class="tag-name">
      <SearchTerm text={tagName} />
    </span>
    {#if $visibility['attributes']}
    <ElementAttributes attributes={_attributes} {listeners} />
    {/if}
    &gt;
    {#if collapsed}
      &hellip;
    {/if}
  </div>
  {#if !collapsed}
    <slot />
  {/if}
{:else}
  <div class:hover class:selected {style}>
    &lt;
    <span class="tag-name">
      <SearchTerm text={tagName} />
    </span>
    {#if $visibility['attributes']}
    <ElementAttributes attributes={_attributes} {listeners} />
    {/if}
    &nbsp;/&gt;
  </div>
{/if}
