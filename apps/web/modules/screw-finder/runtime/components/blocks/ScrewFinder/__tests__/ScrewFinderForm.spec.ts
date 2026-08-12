import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import ScrewFinderForm from '../ScrewFinderForm.vue';

const { findOrDeleteBlockByUuid } = vi.hoisted(() => ({ findOrDeleteBlockByUuid: vi.fn() }));

mockNuxtImport('getEditorTranslation', () => (key: string) => key);
mockNuxtImport('useBlocks', () => () => ({ allBlocks: ref([]) }));
mockNuxtImport('useSiteConfiguration', () => () => ({ blockUuid: ref('finder-form-test') }));
mockNuxtImport('useBlockManager', () => () => ({ findOrDeleteBlockByUuid }));
mockNuxtImport('useFullWidthToggleForContent', () => () => ({ isFullWidth: ref(false) }));

describe('ScrewFinderForm', () => {
  it('should expose the persisted beginner environment stage switch', () => {
    findOrDeleteBlockByUuid.mockReturnValue({ content: {} });

    const wrapper = mount(ScrewFinderForm, {
      global: {
        stubs: {
          EditorFormPanel: { template: '<section><slot /></section>' },
          EditorFullWidthToggle: true,
          EditorColorPicker: { template: '<div><slot name="trigger" color="#fff" :toggle="() => {}" /></div>' },
          FinderFormSwitch: { props: ['label'], template: '<div>{{ label }}</div>' },
          UiFormLabel: { template: '<label><slot /></label>' },
          SfInput: true,
          SfTextarea: true,
          SfSwitch: true,
        },
      },
    });

    expect(wrapper.text()).toContain('beginner-environment');
  });
});
