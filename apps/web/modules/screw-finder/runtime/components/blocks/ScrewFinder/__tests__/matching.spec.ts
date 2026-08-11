import { describe, expect, it, vi } from 'vitest';
import type { FilterGroup, Product } from '@plentymarkets/shop-api';
import {
  buildScrewFinderProductPath,
  buildMatchCriteria,
  buildNearbyMatches,
  getRequiredFacetFilters,
  getSafetyCriticalFilters,
  rankScrewFinderProducts,
  resolveScrewFinderFacets,
  serializeFacetFilters,
} from '../matching';

vi.mock('@plentymarkets/shop-api', async (importOriginal) => {
  const original = await importOriginal<typeof import('@plentymarkets/shop-api')>();
  return {
    ...original,
    productGetters: {
      getName: (product: Product & { testName?: string }) => product.testName ?? '',
      getShortDescription: (product: Product & { testDescription?: string }) => product.testDescription ?? '',
      getDescription: () => '',
      getTechnicalData: () => '',
      getUrlPath: (product: Product & { testPath?: string }) => product.testPath ?? '',
      getItemId: (product: Product & { testItemId?: string }) => product.testItemId ?? '',
      getVariationId: (product: Product & { testVariationId?: number }) => product.testVariationId ?? 0,
    },
  };
});

const facets: FilterGroup[] = [
  {
    id: 22,
    name: 'Werkstoff',
    type: 'dynamic',
    count: 2,
    values: [
      { id: 96, name: 'A2', count: 4 },
      { id: 97, name: 'A4', count: 2 },
    ],
  },
  {
    id: 21,
    name: 'Kopfform',
    type: 'dynamic',
    count: 1,
    values: [{ id: 82, name: 'Senkkopf', count: 6 }],
  },
  {
    id: 26,
    name: 'Durchmesser',
    type: 'dynamic',
    count: 1,
    values: [{ id: 130, name: '5 mm', count: 5 }],
  },
  {
    id: 'feedback',
    name: 'Bewertung',
    type: 'feedback',
    count: 1,
    values: [],
  },
];

const product = (name: string, description = '', path = '') =>
  ({ testName: name, testDescription: description, testPath: path }) as unknown as Product;

describe('Screw Finder matching', () => {
  it('should resolve live dynamic facets by normalized names', () => {
    const resolved = resolveScrewFinderFacets(facets);

    expect(resolved.material?.id).toBe(22);
    expect(resolved.head?.id).toBe(21);
    expect(resolved.diameter?.id).toBe(26);
    expect(Object.values(resolved)).not.toContain(facets[3]);
  });

  it('should enforce A4 for a highly corrosive beginner environment', () => {
    const resolved = resolveScrewFinderFacets(facets);
    const filters = getRequiredFacetFilters({ path: 'beginner', environment: 'corrosive' }, resolved);

    expect(filters.map((filter) => filter.id)).toEqual([97]);
  });

  it('should preserve every selected professional specification', () => {
    const resolved = resolveScrewFinderFacets(facets);
    const filters = getRequiredFacetFilters(
      {
        path: 'professional',
        material: facets[0]?.values?.[0],
        head: facets[1]?.values?.[0],
        diameter: facets[2]?.values?.[0],
      },
      resolved,
    );

    expect(serializeFacetFilters(filters)).toBe('96,82,130');
  });

  it('should always target the exact matched variation in finder product links', () => {
    const matchedProduct = {
      testPath: 'schrauben/terrassenschraube',
      testItemId: '613',
      testVariationId: 4172,
    } as unknown as Product;

    expect(buildScrewFinderProductPath(matchedProduct)).toBe('/schrauben/terrassenschraube_613_4172');
  });

  it('should keep only material as a professional alternative safety constraint', () => {
    const resolved = resolveScrewFinderFacets(facets);
    const filters = getSafetyCriticalFilters(
      {
        path: 'professional',
        material: facets[0]?.values?.[0],
        head: facets[1]?.values?.[0],
        diameter: facets[2]?.values?.[0],
      },
      resolved,
    );

    expect(serializeFacetFilters(filters)).toBe('96');
  });

  it('should rank application-specific products before generic products', () => {
    const ranked = rankScrewFinderProducts(
      [
        product('Universalschraube'),
        product('Terrassenschraube A2', 'Für Terrassendielen und Außenanwendung'),
        product('Schnellbauschraube', 'Für Gipskarton'),
      ],
      { path: 'beginner', application: 'terrace', environment: 'outdoor' },
    );

    expect((ranked[0]?.product as Product & { testName?: string }).testName).toBe('Terrassenschraube A2');
    expect(ranked[0]?.reasons).toContain('geeignet für Terrasse und Außenbereich');
  });

  it('should label nearby professional matches and list unconfirmed specifications', () => {
    const matches = buildNearbyMatches(
      [product('Spanplattenschraube Senkkopf 5 mm')],
      {
        path: 'professional',
        material: { id: 97, name: 'A4' },
        head: { id: 83, name: 'Tellerkopf' },
        diameter: { id: 130, name: '5 mm' },
      },
      1,
      { facets: resolveScrewFinderFacets(facets) },
    );

    expect(matches[0]?.exact).toBe(false);
    expect(matches[0]?.criteria).toEqual([
      { label: 'Werkstoff', selectedValue: 'A4', status: 'unknown' },
      {
        label: 'Kopfform',
        selectedValue: 'Tellerkopf',
        actualValue: 'Senkkopf',
        status: 'mismatch',
      },
      { label: 'Durchmesser', selectedValue: '5 mm', status: 'match' },
    ]);
    expect(matches[0]?.differences).toEqual(['Kopfform: Senkkopf statt Tellerkopf.']);
  });

  it('should mark exact professional criteria as confirmed by the filtered response', () => {
    const criteria = buildMatchCriteria(
      product('Produkt ohne auslesbare Spezifikationen'),
      {
        path: 'professional',
        material: { id: 97, name: 'A4' },
        diameter: { id: 130, name: '5 mm' },
      },
      true,
      { facets: resolveScrewFinderFacets(facets) },
    );

    expect(criteria.map((criterion) => criterion.status)).toEqual(['match', 'match']);
  });

  it('should rank a dimension-only alternative ahead of a head-and-dimension mismatch', () => {
    const resolved = resolveScrewFinderFacets(facets);
    const matches = buildNearbyMatches(
      [product('Spanplattenschraube Tellerkopf 4 mm'), product('Spanplattenschraube Senkkopf 4 mm')],
      {
        path: 'professional',
        material: { id: 96, name: 'A2' },
        head: { id: 82, name: 'Senkkopf' },
        diameter: { id: 130, name: '5 mm' },
      },
      2,
      { facets: resolved, confirmedFilters: [{ id: 96, name: 'A2' }] },
    );

    expect((matches[0]?.product as Product & { testName?: string }).testName).toContain('Senkkopf');
    expect(matches[0]?.criteria.find((criterion) => criterion.label === 'Werkstoff')?.status).toBe('match');
  });

  it('should expose selectable product dimensions as available near misses', () => {
    const alternative = product('Pfostenverbinderschraube') as Product;
    alternative.variationAttributeMap = {
      variations: [],
      attributes: [
        {
          attributeId: 1,
          position: 1,
          name: 'Abmessung',
          type: 'select',
          values: [
            { attributeValueId: 1, position: 1, imageUrl: '', name: '8,0 x 40 mm' },
            { attributeValueId: 2, position: 2, imageUrl: '', name: '8,0 x 50 mm' },
            { attributeValueId: 3, position: 3, imageUrl: '', name: '8,0 x 100 mm' },
          ],
        },
      ],
    };

    const criteria = buildMatchCriteria(
      alternative,
      {
        path: 'professional',
        diameter: { id: 150, name: '10 mm' },
        length: { id: 173, name: '50 mm' },
      },
      false,
      { facets: resolveScrewFinderFacets(facets) },
    );

    expect(criteria).toEqual([
      {
        label: 'Durchmesser',
        selectedValue: '10 mm',
        availableValues: ['8 mm'],
        status: 'available',
      },
      { label: 'Gesamtlänge', selectedValue: '50 mm', status: 'match' },
    ]);
  });

  it('should parse localized package quantities without producing a 000 Stück suffix', () => {
    const alternative = product('Magazinierte Schraube, 1.000 Stück') as Product;
    alternative.groupedAttributes = [{ attributePosition: 1, name: 'Packungsmenge', value: '5.000 Stück' }];

    const criteria = buildMatchCriteria(
      alternative,
      {
        path: 'professional',
        package: { id: 128, name: '2500 Stück' },
      },
      false,
    );

    expect(criteria).toEqual([
      {
        label: 'Packungsmenge',
        selectedValue: '2500 Stück',
        availableValues: ['1000 Stück', '5000 Stück'],
        status: 'available',
      },
    ]);
  });
});
