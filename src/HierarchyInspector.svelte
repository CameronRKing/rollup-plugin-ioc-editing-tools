<script>
  import { hoveredNodeId, rootNodes, profilerEnabled } from './inspector/store.js'
  import Toolbar from './inspector/toolbar/Toolbar.svelte'
  import Search from './inspector/toolbar/Search.svelte'
  import ProfileButton from './inspector/toolbar/ProfileButton.svelte'
  import PickerButton from './inspector/toolbar/PickerButton.svelte'
  import VisibilityButton from './inspector/toolbar/VisibilityButton.svelte'
  import ComponentView from './inspector/panel/ComponentView.svelte'
  import Profiler from './inspector/profiler/Profiler.svelte'
  import Breadcrumbs from './inspector/Breadcrumbs.svelte'
  import ConnectMessage from './inspector/ConnectMessage.svelte'
  import Node from './inspector/nodes/Node.svelte'
</script>

<style>
  .node-tree div {
    display: flex;
    overflow: hidden;
    flex: 1 1 0;
    flex-direction: column;
  }

  .node-tree :global(ul) {
    flex-grow: 1;
    list-style: none;
    padding: 0;
  }

  .node-tree :global(li) {
    padding-top: 4px;
  }

  .root div {
    margin-top: 40%;
    text-align: center;
  }
</style>

{#if $profilerEnabled}
  <div>
    <Profiler />
  </div>
{:else if $rootNodes.length}
  <div class="node-tree">
    <Toolbar>
      <ProfileButton />
      <PickerButton />
      <VisibilityButton />
      <Search />
    </Toolbar>
    <ul on:mouseleave={e => ($hoveredNodeId = null)}>
      {#each $rootNodes as node (node.id)}
        <Node {node} />
      {/each}
    </ul>
    <Breadcrumbs />
  </div>
  <ComponentView />
{:else}
  <ConnectMessage />
{/if}
