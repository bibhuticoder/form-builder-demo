import '@testing-library/jest-dom';
// Polyfill for structuredClone for Node < 17
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}