import { describe, expect, it } from 'vitest';
import { getEaster, resolveMovableFeast } from '../src/lib/liturgical/easter';

const iso = (d: Date) => d.toISOString().slice(0, 10);

describe('getEaster', () => {
  it.each([
    [2024, '2024-03-31'],
    [2025, '2025-04-20'],
    [2026, '2026-04-05'],
    [2027, '2027-03-28'],
    [2038, '2038-04-25'], // latest possible date
    [2285, '2285-03-22'], // earliest possible date
  ])('Easter %i is %s', (year, expected) => {
    expect(iso(getEaster(year))).toBe(expected);
  });
});

describe('resolveMovableFeast', () => {
  it('offset 0 is Easter itself', () => {
    expect(iso(resolveMovableFeast(0, 2026))).toBe('2026-04-05');
  });
  it('Palm Sunday (-7) and Good Friday (-2)', () => {
    expect(iso(resolveMovableFeast(-7, 2026))).toBe('2026-03-29');
    expect(iso(resolveMovableFeast(-2, 2026))).toBe('2026-04-03');
  });
  it('Pentecost (+49) can land in June', () => {
    expect(iso(resolveMovableFeast(49, 2026))).toBe('2026-05-24');
    expect(iso(resolveMovableFeast(49, 2038))).toBe('2038-06-13');
  });
  it('crosses a month boundary backwards (Ash Wednesday, -46)', () => {
    expect(iso(resolveMovableFeast(-46, 2026))).toBe('2026-02-18');
  });
});
