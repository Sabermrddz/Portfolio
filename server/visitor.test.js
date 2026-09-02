import test from 'node:test';
import assert from 'node:assert/strict';
import { detectVisitorDevice, buildVisitorEmailHtml } from './visitor.js';

test('detectVisitorDevice identifies mobile Android Chrome from user agent', () => {
  const result = detectVisitorDevice(
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36'
  );

  assert.equal(result.device, 'Mobile');
  assert.equal(result.browser, 'Chrome');
  assert.equal(result.os, 'Android');
});

test('buildVisitorEmailHtml includes visitor metadata and user agent', () => {
  const html = buildVisitorEmailHtml({
    ipAddress: '41.123.45.67',
    device: 'Mobile',
    browser: 'Chrome',
    os: 'Android',
    screen: '1080 × 2400',
    language: 'ar-DZ',
    timezone: 'Africa/Algiers',
    page: 'https://example.com/',
    userAgent: 'Mozilla/5.0 test',
    country: 'Algeria',
    city: 'Batna',
  });

  assert.match(html, /New Website Visitor/i);
  assert.match(html, /41\.123\.45\.67/);
  assert.match(html, /Chrome/);
  assert.match(html, /Mozilla\/5\.0 test/);
});
