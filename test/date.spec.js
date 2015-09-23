
describe("ISO Date spec", function() {
    var checkDateIso = dateValidate('iso');

    it("Should correctly check ISO format", function() {
        expectTrue(checkDateIso('2000-01-01'));
        expectTrue(checkDateIso('2000-1-1'));
        expectTrue(checkDateIso('2000-01-1'));



        expectFalse(checkDateIso('20-01-01'));
        expectFalse(checkDateIso(''));
        expectFalse(checkDateIso('2000.10.10'));
    });
});

describe("ANSI INCITS 30-1997 date spec", function() {
    var checkDateAnsi = dateValidate('ansi');

    it("Should correctly check United States format", function() {
        expectTrue(checkDateAnsi('01/01/2000'));
        expectTrue(checkDateAnsi('01/20/2000'));

        expectFalse(checkDateAnsi(''));
        expectFalse(checkDateAnsi('01/01/20'));
        expectFalse(checkDateAnsi('2000.10.10'));
    });
});

describe("dd.mm.yyyy date spec", function() {
    var checkDate = dateValidate('dd.mm.yyyy');

    it("Should correctly check dd.mm.yyyy format", function() {
        expectTrue(checkDate('01.01.2000'));
        expectTrue(checkDate('01.20.2000'));

        expectFalse(checkDate('01.01.20'));
        expectFalse(checkDate(''));
        expectFalse(checkDate('2000-10-10'));
    });
});


describe("Universal date spec", function() {

    var checkDate = dateValidateUniversal();

    it("Should correctly check date in all formats", function() {
        expectTrue(checkDate('01.12.2000'));
        expectTrue(checkDate('20/10/2000'));
        expectTrue(checkDate('2000-10-10'));
        expectFalse(checkDate('efef'));
        expectFalse(checkDate('20000-10-10'));
        expectFalse(checkDate('2000-100-10'));
        expectFalse(checkDate('2000-10-100'));

        // @TODO: check logic correctness of dates
        // expectFalse(checkDate('2000-01-32'));
        // expectFalse(checkDate('2000-13-15'));
        // expectFalse(checkDate('2000-02-30')); // 30 Feb
    });
});

// Functions

function dateValidate(format) {
    var V = initValidators(getBaseValidatorFunctions(), getValidators());
    return function(value) {
        return V.date(format)(value);
    };
}


function dateValidateUniversal() {
    var V = initValidators(getBaseValidatorFunctions(), getValidators());
    return function(value) {
        return V.date()(value);
    };
}


function expectTrue(value) {
    return expect(value).toEqual(true);
}

function expectFalse(value) {
    return expect(value).not.toEqual(true);
}
