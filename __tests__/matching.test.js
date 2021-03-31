const validate = require('../src/labels');

test('matching is true if all globs are found in the list', () => {
    const all = validate(['Raul', 'Riera'], ['*aul']);
    const some = validate(['GitHub', 'Action'], ['Git*', '[0-9]']);
    
    expect(all).toBe(true);
    expect(some).toBe(false);
});

test('matching is alwas case insensitive', () => {
    const uppercase = validate(['RAUL'], ['raul']);
    const lowercase = validate(['github'], ['Git*']);
    
    expect(uppercase).toBe(true);
    expect(lowercase).toBe(true);
});