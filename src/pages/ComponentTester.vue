<template>
  <div class="tester-root pa-8">
    <header class="tester-header mb-6">
      <h1 class="text-display-section tester-title">Component Tester</h1>
      <p class="text-body-base tester-subtitle">
        All components in <code>src/components</code> are auto-listed here.
      </p>
    </header>

    <section
      v-for="entry in componentEntries"
      :key="entry.name"
      class="tester-card pa-6 rounded-lg border-sm mb-6"
    >
      <div class="tester-card-header mb-4">
        <h2 class="text-label-lg tester-card-title">{{ entry.name }}</h2>
      </div>

      <div v-if="entry.name === 'Avatar' && avatar" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="avatar.variant" class="tester-input">
              <option value="default">default</option>
              <option value="img">img</option>
              <option value="multiple">multiple</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="avatar.size" class="tester-input">
              <option value="default">default</option>
              <option value="small">small</option>
              <option value="large">large</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">label</span>
            <input v-model="avatar.label" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">count</span>
            <input v-model.number="avatar.count" class="tester-input" type="number" min="0" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="avatar.rounded" type="checkbox" />
            <span>rounded</span>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">playground code</span>
            <textarea
              v-model="avatarPlaygroundCode"
              class="tester-input tester-code"
              placeholder='<Avatar variant="img" :size="36" label="AB" :count="3" :rounded="true" class="ma-auto" />'
              spellcheck="false"
            />
          </label>

          <div class="tester-actions">
            <button class="tester-button" type="button" @click="applyAvatarPlayground">
              Apply snippet
            </button>
          </div>

          <p v-if="avatarPlaygroundError" class="text-body-xs tester-error">
            {{ avatarPlaygroundError }}
          </p>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            :class="avatarPlaygroundClass"
          />
        </div>
      </div>

      <div v-else class="tester-preview rounded-md pa-6">
        <component :is="entry.name" v-bind="propsFor(entry.name)" />
      </div>
    </section>

    <section v-if="!componentEntries.length" class="tester-card pa-6 rounded-lg border-sm">
      <h2 class="text-label-lg tester-card-title mb-2">No Components Found</h2>
      <p class="text-body-sm tester-subtitle">
        Add a <code>.vue</code> file to <code>src/components</code> and it will appear here.
      </p>
    </section>

    <section class="tester-card pa-6 rounded-lg border-sm">
      <h2 class="text-label-lg tester-card-title mb-2">How It Works</h2>
      <p class="text-body-sm tester-subtitle">
        This page auto-registers components from <code>src/components</code> (except itself).
      </p>
      <p class="text-body-sm tester-subtitle">
        Use default props for new components, or add custom demo props in this file when needed.
      </p>
    </section>
  </div>
</template>

<script>
const componentFiles = require.context('../components', false, /\.vue$/);
const autoComponents = {};
const autoNames = [];

componentFiles.keys().forEach((filePath) => {
  const baseName = filePath.replace('./', '').replace('.vue', '');
  if (baseName === 'ComponentTester') {
    return;
  }

  const module = componentFiles(filePath);
  const definition = module.default || module;
  const componentName = definition.name || baseName;

  autoComponents[componentName] = definition;
  autoNames.push(componentName);
});

autoNames.sort((a, b) => a.localeCompare(b));

const defaultPropsByComponent = {
  Avatar: {
    variant: 'default',
    size: 'default',
    label: 'AA',
    count: 1,
    rounded: true,
  },
};

const AVATAR_VARIANTS = Object.freeze(['default', 'img', 'multiple']);

function parseLiteral(rawValue) {
  const value = String(rawValue).trim();

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === 'null') {
    return null;
  }

  if (value === 'undefined') {
    return undefined;
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  return value;
}

function parseAttributes(input) {
  const attributes = [];
  const pattern = /([:@]?[\w-]+)(?:\s*=\s*(".*?"|'.*?'|[^\s/>]+))?/g;
  let match = pattern.exec(input);

  while (match) {
    const name = match[1];
    if (name && name !== '/') {
      attributes.push({
        name,
        value: match[2],
        hasValue: typeof match[2] !== 'undefined',
      });
    }
    match = pattern.exec(input);
  }

  return attributes;
}

function parseAvatarSnippet(code) {
  const tagMatch = String(code).match(/<Avatar\b([\s\S]*?)\/?>/i);
  if (!tagMatch) {
    throw new Error('Snippet must contain an opening <Avatar ...> tag.');
  }

  return parseAttributes(tagMatch[1]);
}

function sanitizeForDoubleQuotes(value) {
  return String(value).replace(/"/g, "'");
}

export default {
  name: 'ComponentTester',
  components: {
    ...autoComponents,
  },
  data() {
    return {
      componentProps: JSON.parse(JSON.stringify(defaultPropsByComponent)),
      avatarPlaygroundCode: '',
      avatarPlaygroundClass: '',
      avatarPlaygroundError: '',
    };
  },
  created() {
    this.avatarPlaygroundCode = this.buildAvatarSnippet(this.avatar, this.avatarPlaygroundClass);
  },
  computed: {
    componentEntries() {
      return autoNames.map((name) => ({ name }));
    },
    avatar() {
      return this.componentProps.Avatar || null;
    },
  },
  methods: {
    propsFor(name) {
      return this.componentProps[name] || {};
    },
    buildAvatarSnippet(avatar, className) {
      if (!avatar) {
        return '<Avatar />';
      }

      const sizeAttr = typeof avatar.size === 'number' ? `:size="${avatar.size}"` : `size="${sanitizeForDoubleQuotes(avatar.size)}"`;
      const label = avatar.label === null || avatar.label === undefined
        ? ':label="null"'
        : typeof avatar.label === 'number'
          ? `:label="${avatar.label}"`
          : `label="${sanitizeForDoubleQuotes(avatar.label)}"`;

      const classAttr = className ? ` class="${sanitizeForDoubleQuotes(className)}"` : '';

      return `<Avatar variant="${avatar.variant}" ${sizeAttr} ${label} :count="${avatar.count}" :rounded="${avatar.rounded}"${classAttr} />`;
    },
    applyAvatarPlayground() {
      if (!this.avatar) {
        return;
      }

      const nextAvatar = { ...this.avatar };
      let nextClass = this.avatarPlaygroundClass;

      try {
        const attributes = parseAvatarSnippet(this.avatarPlaygroundCode);

        attributes.forEach(({ name, value, hasValue }) => {
          const parsedValue = hasValue ? parseLiteral(value) : true;

          if (name === 'class') {
            if (typeof parsedValue !== 'string') {
              throw new Error('`class` must be a plain string.');
            }
            nextClass = parsedValue.trim();
            return;
          }

          if (name === 'variant' || name === ':variant') {
            if (typeof parsedValue !== 'string' || !AVATAR_VARIANTS.includes(parsedValue)) {
              throw new Error('`variant` must be one of: default, img, multiple.');
            }
            nextAvatar.variant = parsedValue;
            return;
          }

          if (name === 'size' || name === ':size') {
            const validSize = (
              (typeof parsedValue === 'number' && Number.isFinite(parsedValue) && parsedValue > 0) ||
              (typeof parsedValue === 'string' && parsedValue.trim().length > 0)
            );
            if (!validSize) {
              throw new Error('`size` must be a positive number or non-empty string.');
            }
            nextAvatar.size = parsedValue;
            return;
          }

          if (name === 'label' || name === ':label') {
            const validLabel = (
              parsedValue === null ||
              parsedValue === undefined ||
              typeof parsedValue === 'string' ||
              typeof parsedValue === 'number'
            );
            if (!validLabel) {
              throw new Error('`label` must be string, number, null, or undefined.');
            }
            nextAvatar.label = parsedValue;
            return;
          }

          if (name === 'count' || name === ':count') {
            const numericCount = Number(parsedValue);
            if (!Number.isFinite(numericCount) || numericCount < 0) {
              throw new Error('`count` must be a number greater than or equal to 0.');
            }
            nextAvatar.count = Math.floor(numericCount);
            return;
          }

          if (name === 'rounded') {
            if (!hasValue) {
              nextAvatar.rounded = true;
              return;
            }
            if (typeof parsedValue !== 'boolean') {
              throw new Error('`rounded` must be boolean when provided.');
            }
            nextAvatar.rounded = parsedValue;
            return;
          }

          if (name === ':rounded') {
            if (typeof parsedValue !== 'boolean') {
              throw new Error('`:rounded` must be boolean.');
            }
            nextAvatar.rounded = parsedValue;
            return;
          }

          if (name === 'image-src' || name === ':image-src' || name === 'imageSrc' || name === ':imageSrc') {
            if (typeof parsedValue !== 'string') {
              throw new Error('`image-src` must be a string URL/path.');
            }
            nextAvatar.imageSrc = parsedValue;
          }
        });

        this.componentProps.Avatar = nextAvatar;
        this.avatarPlaygroundClass = nextClass;
        this.avatarPlaygroundError = '';
      } catch (error) {
        this.avatarPlaygroundError = error instanceof Error ? error.message : 'Unable to parse snippet.';
      }
    },
  },
};
</script>

<style scoped>
.tester-root {
  background: var(--color-surface-background, #f2f3f8);
  min-height: 100vh;
}

.tester-header {
  max-width: 960px;
}

.tester-title {
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  margin: 0;
}

.tester-subtitle {
  color: var(--color-text-secondary, rgba(0, 0, 0, 0.6));
  margin: 0;
}

.tester-card {
  background: var(--color-surface-primary, #fff);
  border-color: var(--color-border-primary, rgba(0, 0, 0, 0.12));
  border-style: solid;
  max-width: 960px;
}

.tester-card-title {
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  margin: 0;
}

.tester-layout {
  display: grid;
  gap: var(--spacing-6);
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
}

.tester-controls {
  display: grid;
  gap: var(--spacing-4);
}

.tester-field {
  display: grid;
  gap: var(--spacing-1);
}

.tester-field-label {
  color: var(--color-text-secondary, rgba(0, 0, 0, 0.6));
}

.tester-input {
  border: var(--border-sm) solid var(--color-border-primary, rgba(0, 0, 0, 0.12));
  border-radius: var(--rounded-md);
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  font: inherit;
  min-height: var(--base-40);
  padding: 0 var(--spacing-3);
}

.tester-toggle {
  align-items: center;
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  display: inline-flex;
  gap: var(--spacing-2);
}

.tester-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  min-height: 112px;
  padding: var(--spacing-2) var(--spacing-3);
  resize: vertical;
}

.tester-actions {
  display: flex;
  justify-content: flex-start;
}

.tester-button {
  background: var(--primary, #0055d4);
  border: 0;
  border-radius: var(--rounded-md);
  color: var(--white, #fff);
  cursor: pointer;
  font: inherit;
  min-height: var(--base-40);
  padding: 0 var(--spacing-4);
}

.tester-button:hover {
  opacity: 0.92;
}

.tester-button:focus-visible {
  outline: 2px solid var(--primary, #0055d4);
  outline-offset: 2px;
}

.tester-error {
  color: var(--error, #b3261e);
  margin: 0;
}

.tester-preview {
  align-items: center;
  background: var(--color-surface-background, #f2f3f8);
  display: flex;
  justify-content: center;
  min-height: 200px;
}

@media (max-width: 900px) {
  .tester-layout {
    grid-template-columns: 1fr;
  }
}
</style>

