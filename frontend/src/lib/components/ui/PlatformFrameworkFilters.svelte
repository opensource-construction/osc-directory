<script lang="ts">
  import { PLATFORM_TAGS, FRAMEWORK_TAGS } from '$lib/platform-tags.js';
  import type { PlatformTag, FrameworkTag } from '$lib/platform-tags.js';

  export let selectedPlatforms: PlatformTag[] = [];
  export let selectedFrameworks: FrameworkTag[] = [];

  function togglePlatform(platform: PlatformTag) {
    if (selectedPlatforms.includes(platform)) {
      selectedPlatforms = selectedPlatforms.filter(p => p !== platform);
    } else {
      selectedPlatforms = [...selectedPlatforms, platform];
    }
  }

  function toggleFramework(framework: FrameworkTag) {
    if (selectedFrameworks.includes(framework)) {
      selectedFrameworks = selectedFrameworks.filter(f => f !== framework);
    } else {
      selectedFrameworks = [...selectedFrameworks, framework];
    }
  }

  function clearPlatforms() {
    selectedPlatforms = [];
  }

  function clearFrameworks() {
    selectedFrameworks = [];
  }
</script>

<div class="filter-section">
  <div class="filter-group">
    <div class="filter-header">
      <h3 class="filter-title">
        <span class="filter-icon">💻</span>
        Platforms
      </h3>
      {#if selectedPlatforms.length > 0}
        <button class="clear-btn" on:click={clearPlatforms}>Clear</button>
      {/if}
    </div>
    
    <div class="filter-options">
      {#each Object.values(PLATFORM_TAGS) as platform}
        <label class="filter-option">
          <input 
            type="checkbox" 
            checked={selectedPlatforms.includes(platform)}
            on:change={() => togglePlatform(platform)}
          />
          <span class="checkmark"></span>
          <span class="label-text">{platform}</span>
        </label>
      {/each}
    </div>
  </div>

  <div class="filter-group">
    <div class="filter-header">
      <h3 class="filter-title">
        <span class="filter-icon">🔧</span>
        Frameworks
      </h3>
      {#if selectedFrameworks.length > 0}
        <button class="clear-btn" on:click={clearFrameworks}>Clear</button>
      {/if}
    </div>
    
    <div class="filter-options">
      {#each Object.values(FRAMEWORK_TAGS) as framework}
        <label class="filter-option">
          <input 
            type="checkbox" 
            checked={selectedFrameworks.includes(framework)}
            on:change={() => toggleFramework(framework)}
          />
          <span class="checkmark"></span>
          <span class="label-text">{framework}</span>
        </label>
      {/each}
    </div>
  </div>
</div>

<style>
  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filter-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
  }

  .filter-icon {
    font-size: 1.2rem;
  }

  .clear-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
    background: transparent;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .clear-btn:hover {
    background: #f9fafb;
    color: #374151;
  }

  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
  }

  .filter-option:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  .filter-option input[type="checkbox"] {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #d1d5db;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
  }

  .filter-option input[type="checkbox"]:checked {
    background: #3b82f6;
    border-color: #3b82f6;
  }

  .filter-option input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 1px;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .label-text {
    text-transform: capitalize;
    color: #374151;
  }

  .filter-option:has(input:checked) {
    background: #eff6ff;
    border-color: #3b82f6;
  }

  .filter-option:has(input:checked) .label-text {
    color: #1d4ed8;
    font-weight: 500;
  }
</style>