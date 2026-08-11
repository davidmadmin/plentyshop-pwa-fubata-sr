<template>
  <div class="sticky h-[80vh] overflow-y-auto">
    <EditorFormPanel
      v-model="contentOpen"
      :title="getEditorTranslation('content')"
      data-testid="screw-finder-form-content"
    >
      <div class="space-y-4 py-3">
        <label class="block">
          <UiFormLabel>{{ getEditorTranslation('eyebrow') }}</UiFormLabel>
          <SfInput v-model="finder.text.eyebrow" data-testid="screw-finder-eyebrow" />
        </label>
        <label class="block">
          <UiFormLabel>{{ getEditorTranslation('title') }}</UiFormLabel>
          <SfInput v-model="finder.text.title" data-testid="screw-finder-title" />
        </label>
        <label class="block">
          <UiFormLabel>{{ getEditorTranslation('introduction') }}</UiFormLabel>
          <SfTextarea v-model="finder.text.introduction" rows="4" data-testid="screw-finder-introduction" />
        </label>
        <label class="block">
          <UiFormLabel>{{ getEditorTranslation('beginner-cta') }}</UiFormLabel>
          <SfInput v-model="finder.text.beginnerCta" />
        </label>
        <label class="block">
          <UiFormLabel>{{ getEditorTranslation('professional-cta') }}</UiFormLabel>
          <SfInput v-model="finder.text.professionalCta" />
        </label>
        <label class="block">
          <UiFormLabel>{{ getEditorTranslation('results-title') }}</UiFormLabel>
          <SfInput v-model="finder.text.resultsTitle" />
        </label>
        <label class="block">
          <UiFormLabel>{{ getEditorTranslation('empty-title') }}</UiFormLabel>
          <SfInput v-model="finder.text.emptyTitle" />
        </label>
        <label class="block">
          <UiFormLabel>{{ getEditorTranslation('empty-text') }}</UiFormLabel>
          <SfTextarea v-model="finder.text.emptyText" rows="3" />
        </label>
      </div>
    </EditorFormPanel>

    <EditorFormPanel
      v-model="sourceOpen"
      :title="getEditorTranslation('source')"
      data-testid="screw-finder-form-source"
    >
      <div class="py-3">
        <UiFormLabel>{{ getEditorTranslation('source-path') }}</UiFormLabel>
        <SfInput v-model="finder.sourceCategoryPath" data-testid="screw-finder-source-path" />
        <p class="mt-2 text-xs text-neutral-600">{{ getEditorTranslation('source-help') }}</p>
      </div>
    </EditorFormPanel>

    <EditorFormPanel v-model="flowOpen" :title="getEditorTranslation('flow')" data-testid="screw-finder-form-flow">
      <div class="space-y-4 py-3">
        <FinderFormSwitch v-model="finder.paths.beginner" :label="getEditorTranslation('enable-beginner')" />
        <FinderFormSwitch v-model="finder.paths.professional" :label="getEditorTranslation('enable-professional')" />
        <hr class="border-neutral-200" />
        <FinderFormSwitch v-model="finder.stages.beginnerHead" :label="getEditorTranslation('beginner-head')" />
        <FinderFormSwitch v-model="finder.stages.beginnerDemand" :label="getEditorTranslation('beginner-demand')" />
        <FinderFormSwitch v-model="finder.stages.beginnerExactSize" :label="getEditorTranslation('beginner-size')" />
        <FinderFormSwitch
          v-model="finder.stages.professionalDrive"
          :label="getEditorTranslation('professional-drive')"
        />
        <FinderFormSwitch
          v-model="finder.stages.professionalPackage"
          :label="getEditorTranslation('professional-package')"
        />
        <label class="block">
          <UiFormLabel>{{ getEditorTranslation('result-count') }}</UiFormLabel>
          <SfInput v-model.number="finder.resultCount" type="number" min="1" max="3" data-testid="screw-finder-count" />
        </label>
        <p class="text-xs text-neutral-600">{{ getEditorTranslation('flow-help') }}</p>
      </div>
    </EditorFormPanel>

    <EditorFormPanel
      v-model="appearanceOpen"
      :title="getEditorTranslation('appearance')"
      data-testid="screw-finder-form-appearance"
    >
      <div class="space-y-4 py-3">
        <div>
          <UiFormLabel>{{ getEditorTranslation('background-color') }}</UiFormLabel>
          <EditorColorPicker v-model="finder.appearance.backgroundColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <SfInput v-model="finder.appearance.backgroundColor" type="text">
                <template #suffix>
                  <button
                    type="button"
                    class="h-8 w-10 cursor-pointer rounded border border-neutral-400"
                    :style="{ backgroundColor: color }"
                    @mousedown.stop
                    @click.stop="toggle"
                  />
                </template>
              </SfInput>
            </template>
          </EditorColorPicker>
        </div>
        <div>
          <UiFormLabel>{{ getEditorTranslation('accent-color') }}</UiFormLabel>
          <EditorColorPicker v-model="finder.appearance.accentColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <SfInput v-model="finder.appearance.accentColor" type="text">
                <template #suffix>
                  <button
                    type="button"
                    class="h-8 w-10 cursor-pointer rounded border border-neutral-400"
                    :style="{ backgroundColor: color }"
                    @mousedown.stop
                    @click.stop="toggle"
                  />
                </template>
              </SfInput>
            </template>
          </EditorColorPicker>
        </div>
      </div>
    </EditorFormPanel>

    <EditorFormPanel v-model="layoutOpen" :title="getEditorTranslation('layout')">
      <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />
    </EditorFormPanel>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea } from '@storefront-ui/vue';
import type { ScrewFinderContent, ScrewFinderFormProps } from './types';
import { resolveScrewFinderContent } from './defaults';

const props = defineProps<ScrewFinderFormProps>();
const { allBlocks } = useBlocks();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();
const resolvedUuid = computed(() => props.uuid || blockUuid.value);

const rawFinder = computed(
  () => (findOrDeleteBlockByUuid(allBlocks.value, resolvedUuid.value)?.content ?? {}) as ScrewFinderContent,
);
Object.assign(rawFinder.value, resolveScrewFinderContent(rawFinder.value));
const finder = computed(() => rawFinder.value as Required<ScrewFinderContent>);
const finderRef = ref(finder.value);
const { isFullWidth } = useFullWidthToggleForContent(finderRef);

const contentOpen = ref(true);
const sourceOpen = ref(false);
const flowOpen = ref(false);
const appearanceOpen = ref(false);
const layoutOpen = ref(false);

watch(
  () => finder.value.resultCount,
  (value) => {
    finder.value.resultCount = Math.min(3, Math.max(1, Number(value) || 3));
  },
);

watch(
  () => [finder.value.paths.beginner, finder.value.paths.professional],
  ([beginner, professional]) => {
    if (!beginner && !professional) finder.value.paths.beginner = true;
  },
);
</script>

<i18n lang="json">
{
  "en": {
    "content": "Content",
    "eyebrow": "Small heading",
    "title": "Heading",
    "introduction": "Introduction",
    "beginner-cta": "Beginner button",
    "professional-cta": "Professional button",
    "results-title": "Results heading",
    "empty-title": "No-match heading",
    "empty-text": "No-match text",
    "source": "Product source",
    "source-path": "Category URL path",
    "source-help": "The finder reads products and live dynamic facets from this category.",
    "flow": "Finder flow",
    "enable-beginner": "Enable guided beginner path",
    "enable-professional": "Enable direct professional path",
    "beginner-environment": "Ask about environment",
    "beginner-head": "Ask about head finish",
    "beginner-demand": "Ask about fastening demand",
    "beginner-size": "Offer exact dimensions",
    "professional-drive": "Ask professional users about drive",
    "professional-package": "Ask professional users about package quantity",
    "result-count": "Number of result cards",
    "flow-help": "Stages remain in a validated order. Technical matching rules are maintained in code.",
    "appearance": "Appearance",
    "background-color": "Background color",
    "accent-color": "Accent color",
    "layout": "Layout"
  },
  "de": {
    "content": "Inhalt",
    "eyebrow": "Kleine Überschrift",
    "title": "Überschrift",
    "introduction": "Einleitung",
    "beginner-cta": "Button für Einsteiger",
    "professional-cta": "Button für Profis",
    "results-title": "Ergebnisüberschrift",
    "empty-title": "Überschrift ohne Treffer",
    "empty-text": "Text ohne Treffer",
    "source": "Produktquelle",
    "source-path": "Kategorie-URL-Pfad",
    "source-help": "Der Finder liest Produkte und dynamische Filter live aus dieser Kategorie.",
    "flow": "Finder-Ablauf",
    "enable-beginner": "Geführten Einsteigerweg aktivieren",
    "enable-professional": "Direkten Profiweg aktivieren",
    "beginner-environment": "Umgebung abfragen",
    "beginner-head": "Kopfabschluss abfragen",
    "beginner-demand": "Belastung abfragen",
    "beginner-size": "Exakte Abmessungen anbieten",
    "professional-drive": "Antrieb bei Profis abfragen",
    "professional-package": "Packungsmenge bei Profis abfragen",
    "result-count": "Anzahl Ergebniskarten",
    "flow-help": "Die Schritte bleiben in einer validierten Reihenfolge. Technische Regeln werden im Code gepflegt.",
    "appearance": "Darstellung",
    "background-color": "Hintergrundfarbe",
    "accent-color": "Akzentfarbe",
    "layout": "Layout"
  }
}
</i18n>
