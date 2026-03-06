<template>
  <div class="tester-root pa-8">
    <header class="tester-header mb-6">
      <h1 class="text-display-section tester-title">Component Tester</h1>
      <p class="text-body-base tester-subtitle">
        All components in <code>src/components</code> are auto-listed here.
      </p>
    </header>

    <section class="tester-card tester-filter pa-4 rounded-lg border-sm mb-6">
      <label class="text-label-sm tester-field">
        <span class="tester-field-label">component</span>
        <select v-model="selectedComponent" class="tester-input">
          <option v-for="entry in componentEntries" :key="entry.name" :value="entry.name">
            {{ entry.name }}
          </option>
        </select>
      </label>
    </section>

    <section
      v-for="entry in visibleComponentEntries"
      :key="entry.name"
      class="tester-card pa-6 rounded-lg border-sm mb-6"
    >
      <div class="tester-card-header mb-4">
        <h2 class="text-label-lg tester-card-title">{{ entry.name }}</h2>
      </div>

      <div v-if="entry.name === 'avatar' && avatar" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="avatar.variant" class="tester-input">
              <option v-for="v in AVATAR_VARIANTS" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="avatarSizeMode" class="tester-input">
              <option value="default">default</option>
              <option value="small">small</option>
              <option value="large">large</option>
              <option value="custom">custom</option>
            </select>
          </label>

          <label v-if="avatarSizeMode === 'custom'" class="text-label-sm tester-field">
            <span class="tester-field-label">custom size (20-100)</span>
            <input
              v-model.number="avatarCustomSizeValue"
              class="tester-input"
              type="number"
              min="20"
              max="100"
              step="1"
            />
          </label>

          <label v-if="avatar.variant !== 'img'" class="text-label-sm tester-field">
            <span class="tester-field-label">backend label</span>
            <input v-model="avatar.label" class="tester-input" type="text" />
          </label>

          <label v-if="avatar.variant === 'img'" class="text-label-sm tester-field">
            <span class="tester-field-label">backend image url</span>
            <input
              v-model="avatar.image"
              class="tester-input"
              type="text"
              placeholder="https://..."
              @input="onAvatarImageUrlInput"
            />
          </label>

          <label v-if="avatar.variant === 'img'" class="text-label-sm tester-field">
            <span class="tester-field-label">backend image file</span>
            <input
              class="tester-input-file"
              type="file"
              accept="image/*"
              @change="onAvatarImageFileChange"
            />
          </label>

          <label v-if="avatar.variant === 'multiple'" class="text-label-sm tester-field">
            <span class="tester-field-label">count</span>
            <input v-model.number="avatar.count" class="tester-input" type="number" min="0" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="avatar.rounded" type="checkbox" />
            <span>rounded</span>
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'progress-linear' && progressLinear" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="progressLinear.size" class="tester-input">
              <option v-for="s in PROGRESS_LINEAR_SIZES" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">backend count (% | 1/5)</span>
            <input
              v-model="progressLinear.count"
              class="tester-input"
              type="text"
              placeholder="e.g. 75% or 1/5"
            />
          </label>

          <template v-if="progressLinear.size === 'large'">
            <label class="text-label-sm tester-toggle">
              <input v-model="progressLinear.rounded" type="checkbox" />
              <span>rounded</span>
            </label>

            <label class="text-label-sm tester-field">
              <span class="tester-field-label">current (backend)</span>
              <input v-model="progressLinear.current" class="tester-input" type="text" />
            </label>

            <label class="text-label-sm tester-field">
              <span class="tester-field-label">limit (backend)</span>
              <input v-model="progressLinear.limit" class="tester-input" type="text" />
            </label>
          </template>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'progress-circular' && progressCircular" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="progressCircular.size" class="tester-input">
              <option v-for="s in PROGRESS_CIRCULAR_SIZES" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">backend value</span>
            <input
              v-model="progressCircular.value"
              class="tester-input"
              type="text"
              placeholder="e.g. 25, 80%, 1/4"
            />
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'chip' && chip" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="chip.variant" class="tester-input">
              <option v-for="v in CHIP_VARIANTS" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">color</span>
            <select v-model="chip.color" class="tester-input">
              <option v-for="c in CHIP_COLORS" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="chip.size" class="tester-input">
              <option v-for="s in CHIP_SIZE_KEYS" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">label (backend)</span>
            <input
              v-model="chip.label"
              class="tester-input"
              type="text"
              placeholder="leave empty for icon-only"
            />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="chip.closable" type="checkbox" />
            <span>closable</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="chip.rounded" type="checkbox" />
            <span>rounded</span>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">prepend-icon (mdi-* | flag:in | image url)</span>
            <input v-model="chip.prependIcon" class="tester-input" type="text" placeholder="leave empty to hide" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">append-icon (mdi-* | flag:us | image url)</span>
            <input v-model="chip.appendIcon" class="tester-input" type="text" placeholder="ignored when closable" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="chip.disabled" type="checkbox" />
            <span>disabled</span>
          </label>

        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'combo-box' && comboBox" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="comboBox.variant" class="tester-input">
              <option v-for="v in COMBO_BOX_VARIANTS" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-toggle">
            <input
              v-model="comboBox.multiple"
              type="checkbox"
              @change="onComboBoxMultiSelectChange"
            />
            <span>multi-select</span>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">placeholder (backend)</span>
            <input v-model="comboBox.placeholder" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">icon (mdi-* | flag:in | image url)</span>
            <input
              v-model="comboBox.icon"
              class="tester-input"
              type="text"
              placeholder="leave empty to hide"
            />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">hint</span>
            <input
              v-model="comboBox.hint"
              class="tester-input"
              type="text"
              placeholder="leave empty to hide"
            />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">items (comma separated backend)</span>
            <input
              v-model="comboBox.itemsCsv"
              class="tester-input"
              type="text"
              placeholder="Option A, Option B, Option C"
              @input="onComboBoxItemsCsvInput"
            />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">model-value (backend)</span>
            <input
              v-if="comboBox.multiple"
              :value="Array.isArray(comboBox.value) ? comboBox.value.join(', ') : ''"
              class="tester-input"
              type="text"
              placeholder="comma separated values"
              @input="onComboBoxModelInput"
            />
            <input
              v-else
              v-model="comboBox.value"
              class="tester-input"
              type="text"
              placeholder="single selected value"
            />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="comboBox.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            @update:value="onComboBoxValueUpdate"
          />
        </div>
      </div>

      <div v-else-if="entry.name === 'list' && list" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">max-height</span>
            <input
              v-model.number="list.maxHeight"
              class="tester-input"
              type="number"
              min="48"
              step="1"
            />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">items-count (backend)</span>
            <input
              v-model.number="list.itemsCount"
              class="tester-input"
              type="number"
              min="0"
              step="1"
              @input="onListItemsCountInput"
            />
          </label>
        </div>

        <div class="tester-preview tester-preview-list rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            @update:value="onListValueUpdate"
          />
        </div>
      </div>

      <div v-else-if="entry.name === 'list-item' && listItem" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="listItem.size" class="tester-input">
              <option value="default">default</option>
              <option value="small">small</option>
              <option value="large">large</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">label</span>
            <input v-model="listItem.label" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">subtext</span>
            <input v-model="listItem.subtext" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">append-text</span>
            <input v-model="listItem.appendText" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">prepend-icon (mdi-* | flag:in | image url)</span>
            <input v-model="listItem.prependIcon" class="tester-input" type="text" placeholder="leave empty to hide" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">append-icon (mdi-* | flag:us | image url)</span>
            <input v-model="listItem.appendIcon" class="tester-input" type="text" placeholder="leave empty to hide" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="listItem.selected" type="checkbox" />
            <span>selected</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="listItem.checkbox" type="checkbox" />
            <span>checkbox</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="listItem.avatar" type="checkbox" />
            <span>avatar</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="listItem.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview tester-preview-list-item rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            @update:selected="onListItemSelectedUpdate"
          />
        </div>
      </div>

      <div v-else-if="entry.name === 'radio-button' && radioButton" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-toggle">
            <input v-model="radioButton.value" type="checkbox" />
            <span>backend value (selected)</span>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">backend label</span>
            <input
              v-model="radioButton.label"
              class="tester-input"
              type="text"
              placeholder="leave empty to hide label"
            />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="radioButton.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'date-time-picker' && dateTimePicker" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="dateTimePicker.variant" class="tester-input">
              <option v-for="v in DATE_TIME_PICKER_VARIANTS" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">type</span>
            <select v-model="dateTimePicker.type" class="tester-input" @change="onDateTimePickerTypeChange">
              <option v-for="t in DATE_TIME_PICKER_TYPES" :key="t" :value="t">{{ t }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">state</span>
            <select v-model="dateTimePicker.state" class="tester-input">
              <option v-for="s in DATE_TIME_PICKER_STATES" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">placeholder (backend)</span>
            <input v-model="dateTimePicker.placeholder" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="dateTimePicker.hasIcon" type="checkbox" />
            <span>has-icon</span>
          </label>

          <label v-if="dateTimePicker.hasIcon" class="text-label-sm tester-field">
            <span class="tester-field-label">icon (mdi-* | flag:in | image url)</span>
            <input v-model="dateTimePicker.icon" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="dateTimePicker.hasHint" type="checkbox" />
            <span>has-hint</span>
          </label>

          <label v-if="dateTimePicker.hasHint" class="text-label-sm tester-field">
            <span class="tester-field-label">hint (backend)</span>
            <input v-model="dateTimePicker.hint" class="tester-input" type="text" />
          </label>

          <label v-if="dateTimePicker.type === 'date-range'" class="text-label-sm tester-field">
            <span class="tester-field-label">value range (comma separated)</span>
            <input
              :value="Array.isArray(dateTimePicker.value) ? dateTimePicker.value.join(', ') : ''"
              class="tester-input"
              type="text"
              placeholder="2020-09-18, 2020-09-23"
              @input="onDateTimePickerRangeInput"
            />
          </label>

          <label v-else-if="dateTimePicker.type === 'date-time'" class="text-label-sm tester-field">
            <span class="tester-field-label">value date (YYYY-MM-DD)</span>
            <input
              :value="dateTimePicker.value && dateTimePicker.value.date ? dateTimePicker.value.date : ''"
              class="tester-input"
              type="text"
              placeholder="2020-09-18"
              @input="onDateTimePickerDateInput"
            />
          </label>

          <label v-if="dateTimePicker.type === 'date-time'" class="text-label-sm tester-field">
            <span class="tester-field-label">value time (HH:mm)</span>
            <input
              :value="dateTimePicker.value && dateTimePicker.value.time ? dateTimePicker.value.time : ''"
              class="tester-input"
              type="text"
              placeholder="09:30"
              @input="onDateTimePickerTimeInput"
            />
          </label>

          <label v-if="dateTimePicker.type !== 'date-range' && dateTimePicker.type !== 'date-time'" class="text-label-sm tester-field">
            <span class="tester-field-label">value (backend)</span>
            <input v-model="dateTimePicker.value" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="dateTimePicker.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            @update:value="onDateTimePickerValueUpdate"
          />
        </div>
      </div>

      <div v-else-if="entry.name === 'text-field' && textField" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="textField.variant" class="tester-input">
              <option v-for="v in TEXT_FIELD_VARIANTS" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="textField.size" class="tester-input">
              <option v-for="s in TEXT_FIELD_SIZE_KEYS" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">placeholder (backend)</span>
            <input v-model="textField.placeholder" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">input / value (backend)</span>
            <input v-model="textField.value" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">prepend icon (mdi-* | flag:in | flagcdn.com/in.svg | custom image url)</span>
            <input v-model="textField.prependIcon" class="tester-input" type="text" placeholder="flag:in" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">append icon (mdi-* | flag:us | https://flagcdn.com/us.svg | custom image url)</span>
            <input v-model="textField.appendIcon" class="tester-input" type="text" placeholder="mdi-plus" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">prefix (backend)</span>
            <input v-model="textField.prefix" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">suffix (backend)</span>
            <input v-model="textField.suffix" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">hint (backend)</span>
            <input v-model="textField.hint" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">char-limit (backend)</span>
            <input
              v-model.number="textField.maxlength"
              class="tester-input"
              type="number"
              min="1"
              step="1"
            />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="textField.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'text-area' && textArea" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">placeholder</span>
            <input v-model="textArea.placeholder" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">input</span>
            <textarea v-model="textArea.value" class="tester-input tester-code" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">hint</span>
            <input v-model="textArea.hint" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">char-limit</span>
            <input
              v-model.number="textArea.maxlength"
              class="tester-input"
              type="number"
              min="1"
              step="1"
            />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="textArea.autoGrow" type="checkbox" />
            <span>auto-grow</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="textArea.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview tester-preview-text-area rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            @update:value="onTextAreaValueUpdate"
          />
        </div>
      </div>

      <div v-else-if="entry.name === 'rich-text-editor' && richTextEditor" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">placeholder</span>
            <input v-model="richTextEditor.placeholder" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">value (html)</span>
            <textarea v-model="richTextEditor.value" class="tester-input tester-code" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">hint</span>
            <input v-model="richTextEditor.hint" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">min-height</span>
            <input v-model.number="richTextEditor.minHeight" class="tester-input" type="number" min="120" step="1" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">max-height</span>
            <input v-model.number="richTextEditor.maxHeight" class="tester-input" type="number" min="120" step="1" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">formats (comma separated)</span>
            <input v-model="richTextEditor.formatsCsv" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="richTextEditor.toolbarEnabled" type="checkbox" />
            <span>module.toolbar</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="richTextEditor.historyEnabled" type="checkbox" />
            <span>module.history</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="richTextEditor.readonly" type="checkbox" />
            <span>readonly</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="richTextEditor.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview tester-preview-quill rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            @update:value="onRichTextEditorValueUpdate"
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
  </div>
</template>

<script>
import {
  AVATAR_SIZE_KEYS,
  AVATAR_VARIANTS,
  isValidExplicitSize,
} from '../composables/useAvatar';
import { CHIP_COLORS, CHIP_SIZE_KEYS, CHIP_VARIANTS } from '../composables/useChip';
import { COMBO_BOX_VARIANTS } from '../composables/useComboBox';
import {
  DATE_TIME_PICKER_STATES,
  DATE_TIME_PICKER_TYPES,
  DATE_TIME_PICKER_VARIANTS,
} from '../composables/useDateTimePicker';
import { PROGRESS_CIRCULAR_SIZES } from '../composables/useProgressCircular';
import { PROGRESS_LINEAR_SIZES } from '../composables/useProgressLinear';
import { TEXT_FIELD_SIZE_KEYS, TEXT_FIELD_VARIANTS } from '../composables/useTextField';

const COMBO_BOX_TESTER_ITEMS = Object.freeze([
  { title: 'Option Four', value: 'Option Four' },
  { title: 'Selected Value', value: 'Selected Value' },
  { title: 'Option Five', value: 'Option Five' },
  { title: 'Option Six', value: 'Option Six' },
  { title: 'Option Seven', value: 'Option Seven' },
  { title: 'Option Two', value: 'Option Two' },
  { title: 'Title', value: 'Title' },
]);

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

function buildListTesterItems(count = 6) {
  return Array.from({ length: count }, (_, index) => ({
    value: index + 1,
    label: 'Title',
  }));
}

function buildComboBoxTesterItems() {
  return COMBO_BOX_TESTER_ITEMS.map((item) => ({ ...item }));
}

function buildComboBoxItemsCsv(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }

  return items
    .map((item) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return String(item.title ?? item.label ?? item.value ?? '').trim();
      }
      return String(item ?? '').trim();
    })
    .filter((token) => token.length > 0)
    .join(', ');
}

const defaultPropsByComponent = {
  avatar: {
    variant: 'default',
    size: 'default',
    label: 'AA',
    image: '',
    count: 1,
    rounded: true,
  },
  'progress-linear': {
    size: 'default',
    count: '1/5',
    rounded: false,
    current: null,
    limit: null,
  },
  'progress-circular': {
    size: 'default',
    value: '1/4',
  },
  chip: {
    variant: 'default',
    color: 'default',
    closable: false,
    rounded: false,
    size: 'default',
    label: 'label',
    prependIcon: '',
    appendIcon: '',
    disabled: false,
  },
  'combo-box': {
    variant: 'default',
    multiple: false,
    placeholder: 'Placeholder Select Something',
    icon: '',
    hint: '',
    disabled: false,
    value: null,
    items: buildComboBoxTesterItems(),
    itemsCsv: buildComboBoxItemsCsv(buildComboBoxTesterItems()),
  },
  list: {
    maxHeight: 304,
    value: 2,
    itemsCount: 6,
    items: buildListTesterItems(6),
  },
  'list-item': {
    size: 'default',
    selected: false,
    label: 'Title',
    checkbox: false,
    avatar: false,
    prependIcon: '',
    appendIcon: '',
    subtext: '',
    appendText: '',
    disabled: false,
  },
  'radio-button': {
    value: false,
    label: '',
    disabled: false,
  },
  'text-field': {
    variant: 'default',
    size: 'default',
    placeholder: 'Placeholder Enter Smthng',
    value: 'Input Text',
    prependIcon: '',
    appendIcon: '',
    prefix: '',
    suffix: '',
    hint: '',
    maxlength: null,
    disabled: false,
  },
  'text-area': {
    placeholder: 'Placeholder Enter Smthng',
    value: 'Lorem ipsum dolor sit amet consectetur.',
    hint: '',
    maxlength: null,
    autoGrow: false,
    disabled: false,
  },
  'date-time-picker': {
    variant: 'default',
    type: 'date',
    state: 'default',
    placeholder: '',
    hasIcon: false,
    icon: 'mdi-plus',
    hasHint: false,
    hint: '',
    disabled: false,
    value: null,
  },
  'rich-text-editor': {
    placeholder: 'Compose an epic...',
    value: '<p>Start writing with <strong>brand-styled</strong> controls.</p>',
    hint: '',
    minHeight: 200,
    maxHeight: null,
    formatsCsv: 'header,font,size,bold,italic,underline,strike,script,blockquote,code-block,list,indent,align,direction,color,background,link,image,video,formula,clean,history',
    toolbarEnabled: true,
    historyEnabled: true,
    readonly: false,
    disabled: false,
  },
};

export default {
  name: 'ComponentTester',
  components: {
    ...autoComponents,
  },
  setup() {
    return {
      AVATAR_VARIANTS,
      CHIP_COLORS,
      CHIP_SIZE_KEYS,
      CHIP_VARIANTS,
      COMBO_BOX_VARIANTS,
      DATE_TIME_PICKER_STATES,
      DATE_TIME_PICKER_TYPES,
      DATE_TIME_PICKER_VARIANTS,
      PROGRESS_CIRCULAR_SIZES,
      PROGRESS_LINEAR_SIZES,
      TEXT_FIELD_SIZE_KEYS,
      TEXT_FIELD_VARIANTS,
    };
  },
  data() {
    return {
      componentProps: JSON.parse(JSON.stringify(defaultPropsByComponent)),
      selectedComponent: autoNames[0] || '',
    };
  },
  computed: {
    componentEntries() {
      return autoNames.map((name) => ({ name }));
    },
    visibleComponentEntries() {
      return this.componentEntries.filter((entry) => entry.name === this.selectedComponent);
    },
    avatar() {
      return this.componentProps.avatar || null;
    },
    progressLinear() {
      return this.componentProps['progress-linear'] || null;
    },
    progressCircular() {
      return this.componentProps['progress-circular'] || null;
    },
    chip() {
      return this.componentProps.chip || null;
    },
    comboBox() {
      return this.componentProps['combo-box'] || null;
    },
    list() {
      return this.componentProps.list || null;
    },
    listItem() {
      return this.componentProps['list-item'] || null;
    },
    radioButton() {
      return this.componentProps['radio-button'] || null;
    },
    textField() {
      return this.componentProps['text-field'] || null;
    },
    textArea() {
      return this.componentProps['text-area'] || null;
    },
    dateTimePicker() {
      return this.componentProps['date-time-picker'] || null;
    },
    richTextEditor() {
      return this.componentProps['rich-text-editor'] || null;
    },
    avatarSizeMode: {
      get() {
        if (!this.avatar) {
          return 'default';
        }

        return (typeof this.avatar.size === 'string' && AVATAR_SIZE_KEYS.includes(this.avatar.size))
          ? this.avatar.size
          : 'custom';
      },
      set(value) {
        if (!this.avatar) {
          return;
        }

        if (value === 'custom') {
          if (!isValidExplicitSize(this.avatar.size)) {
            this.avatar.size = 36;
          }
          return;
        }

        this.avatar.size = value;
      },
    },
    avatarCustomSizeValue: {
      get() {
        if (!this.avatar || !isValidExplicitSize(this.avatar.size)) {
          return '';
        }
        return this.avatar.size;
      },
      set(value) {
        if (!this.avatar) {
          return;
        }

        const numericValue = Number(value);
        if (isValidExplicitSize(numericValue)) {
          this.avatar.size = numericValue;
        }
      },
    },
  },
  methods: {
    propsFor(name) {
      const props = this.componentProps[name] || {};
      if (name === 'list') {
        return {
          maxHeight: props.maxHeight,
          value: props.value,
          items: Array.isArray(props.items) ? props.items : [],
        };
      }
      if (name === 'combo-box') {
        return {
          variant: props.variant,
          multiple: props.multiple,
          placeholder: props.placeholder,
          icon: props.icon,
          hint: props.hint,
          disabled: props.disabled,
          value: props.value,
          items: Array.isArray(props.items) ? props.items : [],
        };
      }
      if (name === 'text-area') {
        return {
          placeholder: props.placeholder,
          value: props.value,
          hint: props.hint,
          maxlength: props.maxlength,
          autoGrow: props.autoGrow,
          disabled: props.disabled,
        };
      }
      if (name === 'date-time-picker') {
        return {
          variant: props.variant,
          type: props.type,
          state: props.state,
          placeholder: props.placeholder,
          hasIcon: props.hasIcon,
          icon: props.icon,
          hasHint: props.hasHint,
          hint: props.hint,
          disabled: props.disabled,
          value: props.value,
        };
      }
      if (name === 'rich-text-editor') {
        const parsedFormats = String(props.formatsCsv || '')
          .split(',')
          .map((token) => token.trim())
          .filter((token) => token.length > 0);

        return {
          placeholder: props.placeholder,
          value: props.value,
          hint: props.hint,
          minHeight: props.minHeight,
          maxHeight: props.maxHeight,
          formats: parsedFormats,
          modules: {
            toolbar: props.toolbarEnabled !== false,
            history: props.historyEnabled !== false,
          },
          readonly: props.readonly,
          disabled: props.disabled,
        };
      }
      return props;
    },
    onAvatarImageFileChange(event) {
      if (!this.avatar) {
        return;
      }

      const files = event.target && event.target.files ? event.target.files : [];
      const file = files[0];
      if (!file || !file.type.startsWith('image/')) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (!this.avatar) {
          return;
        }

        this.avatar.image = typeof reader.result === 'string' ? reader.result : '';
        this.avatar.variant = 'img';
      };
      reader.readAsDataURL(file);
    },
    onAvatarImageUrlInput() {
      if (!this.avatar) {
        return;
      }

      if (String(this.avatar.image || '').trim().length > 0) {
        this.avatar.variant = 'img';
      }
    },
    onComboBoxValueUpdate(nextValue) {
      if (!this.comboBox) {
        return;
      }

      this.comboBox.value = nextValue;
    },
    onComboBoxItemsCsvInput() {
      if (!this.comboBox) {
        return;
      }

      const values = String(this.comboBox.itemsCsv || '')
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0);

      this.comboBox.items = values.map((value) => ({
        title: value,
        value,
      }));

      if (this.comboBox.multiple === true) {
        const current = Array.isArray(this.comboBox.value)
          ? this.comboBox.value
          : [];

        this.comboBox.value = current.filter((entry) =>
          values.includes(String(entry))
        );
        return;
      }

      if (Array.isArray(this.comboBox.value)) {
        this.comboBox.value = this.comboBox.value[0] ?? null;
      }

      if (this.comboBox.value == null || this.comboBox.value === '') {
        return;
      }

      if (!values.includes(String(this.comboBox.value))) {
        this.comboBox.value = null;
      }
    },
    onComboBoxMultiSelectChange() {
      if (!this.comboBox) {
        return;
      }

      if (this.comboBox.multiple === true) {
        if (!Array.isArray(this.comboBox.value)) {
          const singleValue = this.comboBox.value;
          this.comboBox.value = singleValue == null || singleValue === ''
            ? []
            : [singleValue];
        }
        return;
      }

      if (Array.isArray(this.comboBox.value)) {
        this.comboBox.value = this.comboBox.value[0] ?? null;
      }
    },
    onComboBoxModelInput(event) {
      if (!this.comboBox || this.comboBox.multiple !== true) {
        return;
      }

      const nextText = event && event.target ? event.target.value : '';
      this.comboBox.value = String(nextText || '')
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0);
    },
    onDateTimePickerTypeChange() {
      if (!this.dateTimePicker) {
        return;
      }

      if (this.dateTimePicker.type === 'date-range') {
        this.dateTimePicker.value = [];
        return;
      }

      if (this.dateTimePicker.type === 'date-time') {
        this.dateTimePicker.value = { date: '', time: '' };
        return;
      }

      this.dateTimePicker.value = '';
    },
    onDateTimePickerValueUpdate(nextValue) {
      if (!this.dateTimePicker) {
        return;
      }

      this.dateTimePicker.value = nextValue;
    },
    onDateTimePickerRangeInput(event) {
      if (!this.dateTimePicker || this.dateTimePicker.type !== 'date-range') {
        return;
      }

      const nextText = event && event.target ? event.target.value : '';
      this.dateTimePicker.value = String(nextText || '')
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
        .slice(0, 2);
    },
    onDateTimePickerDateInput(event) {
      if (!this.dateTimePicker || this.dateTimePicker.type !== 'date-time') {
        return;
      }

      const nextText = String(event && event.target ? event.target.value : '').trim();
      const currentValue = this.dateTimePicker.value && typeof this.dateTimePicker.value === 'object'
        ? this.dateTimePicker.value
        : { date: '', time: '' };

      this.dateTimePicker.value = {
        ...currentValue,
        date: nextText,
      };
    },
    onDateTimePickerTimeInput(event) {
      if (!this.dateTimePicker || this.dateTimePicker.type !== 'date-time') {
        return;
      }

      const nextText = String(event && event.target ? event.target.value : '').trim();
      const currentValue = this.dateTimePicker.value && typeof this.dateTimePicker.value === 'object'
        ? this.dateTimePicker.value
        : { date: '', time: '' };

      this.dateTimePicker.value = {
        ...currentValue,
        time: nextText,
      };
    },
    onListItemsCountInput() {
      if (!this.list) {
        return;
      }

      const parsed = Number(this.list.itemsCount);
      const normalizedCount = Number.isFinite(parsed)
        ? Math.max(0, Math.floor(parsed))
        : 0;

      this.list.itemsCount = normalizedCount;
      this.list.items = buildListTesterItems(normalizedCount);

      if (normalizedCount === 0) {
        this.list.value = null;
        return;
      }

      const numericModel = Number(this.list.value);
      if (!Number.isFinite(numericModel) || numericModel < 1 || numericModel > normalizedCount) {
        this.list.value = Math.min(2, normalizedCount);
      }
    },
    onListValueUpdate(nextValue) {
      if (!this.list) {
        return;
      }

      this.list.value = nextValue;
    },
    onListItemSelectedUpdate(nextValue) {
      if (!this.listItem) {
        return;
      }

      this.listItem.selected = nextValue === true;
    },
    onTextAreaValueUpdate(nextValue) {
      if (!this.textArea) {
        return;
      }

      this.textArea.value = String(nextValue ?? '');
    },
    onRichTextEditorValueUpdate(nextValue) {
      if (!this.richTextEditor) {
        return;
      }

      this.richTextEditor.value = String(nextValue ?? '');
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

.tester-filter {
  max-width: 320px;
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

.tester-input-file {
  border: var(--border-sm) dashed var(--color-border-primary, rgba(0, 0, 0, 0.12));
  border-radius: var(--rounded-md);
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  font: inherit;
  min-height: var(--base-40);
  padding: var(--spacing-2) var(--spacing-3);
}

.tester-code {
  min-height: 112px;
  padding: var(--spacing-2) var(--spacing-3);
  resize: vertical;
}

.tester-preview {
  align-items: center;
  background: var(--white, #ffffff);
  border: var(--border-sm) solid var(--black, #000000);
  display: flex;
  justify-content: center;
  min-height: 200px;
}

.tester-preview-list,
.tester-preview-list-item {
  justify-content: flex-start;
}

.tester-preview-list {
  align-items: flex-start;
}

.tester-preview-text-area {
  align-items: flex-start;
  align-self: flex-start;
  justify-content: flex-start;
  height: auto;
  min-height: 0;
}

.tester-preview-quill {
  align-items: flex-start;
  justify-content: flex-start;
}

@media (max-width: 900px) {
  .tester-layout {
    grid-template-columns: 1fr;
  }
}
</style>
