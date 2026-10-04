import { describe, expect, it } from 'vitest';
import { getLiturgicalDay } from '../src/lib/liturgical/season';

const d = (y: number, m: number, day: number) => new Date(Date.UTC(y, m - 1, day));

describe('getLiturgicalDay - 2026 (Easter April 5)', () => {
  it('Christmas Day is white', () => {
    expect(getLiturgicalDay(d(2026, 12, 25))).toEqual({ label: 'Christmas', color: 'white' });
  });
  it('Baptism of the Lord (Jan 11) is the last day of Christmas season', () => {
    expect(getLiturgicalDay(d(2026, 1, 11)).color).toBe('white');
  });
  it('the day after Baptism is Ordinary Time', () => {
    expect(getLiturgicalDay(d(2026, 1, 12))).toEqual({ label: 'Ordinary Time', color: 'green' });
  });
  it('Ash Wednesday (Feb 18) starts Lent, violet', () => {
    expect(getLiturgicalDay(d(2026, 2, 18))).toEqual({ label: 'Lent', color: 'violet' });
  });
  it('a mid-Lent weekday is violet', () => {
    expect(getLiturgicalDay(d(2026, 3, 3)).color).toBe('violet');
  });
  it('Laetare Sunday (Mar 15) is rose', () => {
    expect(getLiturgicalDay(d(2026, 3, 15))).toEqual({ label: 'Laetare Sunday', color: 'rose' });
  });
  it('Palm Sunday (Mar 29) is red', () => {
    expect(getLiturgicalDay(d(2026, 3, 29))).toEqual({ label: 'Palm Sunday', color: 'red' });
  });
  it('Holy Thursday (Apr 2) is still violet (Lent, simplified)', () => {
    expect(getLiturgicalDay(d(2026, 4, 2)).color).toBe('violet');
  });
  it('Good Friday (Apr 3) is red', () => {
    expect(getLiturgicalDay(d(2026, 4, 3))).toEqual({ label: 'Good Friday', color: 'red' });
  });
  it('Holy Saturday (Apr 4) is violet (simplified, not green)', () => {
    expect(getLiturgicalDay(d(2026, 4, 4)).color).toBe('violet');
  });
  it('Easter Sunday (Apr 5) is white', () => {
    expect(getLiturgicalDay(d(2026, 4, 5))).toEqual({ label: 'Easter', color: 'white' });
  });
  it('mid-Easter-season weekday is white', () => {
    expect(getLiturgicalDay(d(2026, 5, 1)).color).toBe('white');
  });
  it('Pentecost (May 24) is red', () => {
    expect(getLiturgicalDay(d(2026, 5, 24))).toEqual({ label: 'Pentecost', color: 'red' });
  });
  it('the day after Pentecost is Ordinary Time, green', () => {
    expect(getLiturgicalDay(d(2026, 5, 25))).toEqual({ label: 'Ordinary Time', color: 'green' });
  });
  it('a July weekday is Ordinary Time, green', () => {
    expect(getLiturgicalDay(d(2026, 7, 4))).toEqual({ label: 'Ordinary Time', color: 'green' });
  });
  it('Gaudete Sunday (Dec 13) is rose', () => {
    expect(getLiturgicalDay(d(2026, 12, 13))).toEqual({ label: 'Gaudete Sunday', color: 'rose' });
  });
  it('an early Advent weekday (Dec 1) is violet', () => {
    expect(getLiturgicalDay(d(2026, 12, 1))).toEqual({ label: 'Advent', color: 'violet' });
  });
  it('late November, before Advent starts, is still Ordinary Time', () => {
    expect(getLiturgicalDay(d(2026, 11, 20))).toEqual({ label: 'Ordinary Time', color: 'green' });
  });
});

describe('getLiturgicalDay - 2024 (Easter March 31)', () => {
  it('Ash Wednesday (Feb 14) is violet', () => {
    expect(getLiturgicalDay(d(2024, 2, 14))).toEqual({ label: 'Lent', color: 'violet' });
  });
  it('the day before Ash Wednesday is still Ordinary Time', () => {
    expect(getLiturgicalDay(d(2024, 2, 13))).toEqual({ label: 'Ordinary Time', color: 'green' });
  });
  it('Pentecost (May 19) is red', () => {
    expect(getLiturgicalDay(d(2024, 5, 19))).toEqual({ label: 'Pentecost', color: 'red' });
  });
  it('Advent 1 (Dec 1) is violet', () => {
    expect(getLiturgicalDay(d(2024, 12, 1))).toEqual({ label: 'Advent', color: 'violet' });
  });
  it('Gaudete Sunday (Dec 15) is rose', () => {
    expect(getLiturgicalDay(d(2024, 12, 15))).toEqual({ label: 'Gaudete Sunday', color: 'rose' });
  });
});
