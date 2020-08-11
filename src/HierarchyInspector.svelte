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
$: window.rn = $rootNodes;

$: console.log($rootNodes.length);
</script>

<style>
  div {
    display: flex;
    overflow: hidden;
    flex: 1 1 0;
    flex-direction: column;
  }

  ul {
    overflow: auto;
    flex-grow: 1;
    padding-top: 8px;
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
  <div class="node-tree dark chrome">
    {console.log('I should be showing SOMETHING!')}
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
