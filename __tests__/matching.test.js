const action = require('../index');

test('matching is true if all globs are found in the list', () => {
    const all = action.checkLabels(['Raul', 'Riera'], ['*aul']);
    const some = action.checkLabels(['GitHub', 'Action'], ['Git*', '[0-9]']);
    
    expect(all).toBe(true);
    expect(some).toBe(false);
});

test('matching is alwas case insensitive', () => {
    const uppercase = action.checkLabels(['RAUL'], ['raul']);
    const lowercase = action.checkLabels(['github'], ['Git*']);
    
    expect(uppercase).toBe(true);
    expect(lowercase).toBe(true);
});