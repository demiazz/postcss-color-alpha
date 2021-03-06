var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts) {
    expect(postcss([plugin(opts)]).process(input).css).to.eql(output);
};

describe('postcss-color-alpha', function () {
    it('converts black() to rgba', function () {
        test('a{ color: black(0) }', 'a{ color: rgba(0, 0, 0, 0) }');
    });

    it('converts white() to rgba', function () {
        test('a{ color: black(.3) }', 'a{ color: rgba(0, 0, 0, 0.3) }');
        test('a{ color: white(.2) }', 'a{ color: rgba(255, 255, 255, 0.2) }');
        test('a{ color: black(0) }', 'a{ color: rgba(0, 0, 0, 0) }');
        test('a{ color: white(0) }', 'a{ color: rgba(255, 255, 255, 0) }');
        test('a{ color: black(1) }', 'a{ color: #000 }');
        test('a{ color: white(1) }', 'a{ color: #FFF }');
    });

    it('converts white() without arguments to rgba', function () {
        test('a{ color: white() }', 'a{ color: rgba(255, 255, 255, 0) }');
    });

    it('converts `#rgb.a` to rgba', function () {
        test('a{ color: #0fc.3 }', 'a{ color: rgba(0, 255, 204, 0.3) }');
    });

    it('converts `#rrggbb.a` to rgba', function () {
        test('a{ color: #00ffcc.45 }', 'a{ color: rgba(0, 255, 204, 0.45) }');
    });

    it('converts `#rgb.a` to rgba in long prop values', function () {
        test('div{ border: solid 1px #0fc.45 }', 'div{ border: solid 1px rgba(0, 255, 204, 0.45) }');
    });

    it('converts black() or white() to rgba in long prop values', function () {
        test('div{ border: solid 1px black(0.9) }', 'div{ border: solid 1px rgba(0, 0, 0, 0.9) }');
    });

    it('converts `#rgb.a` to rgba in series', function () {
        test('div{ border-color: #0fc.1 #000.2 #fff.3 #ccc.4 }', 'div{ border-color: rgba(0, 255, 204, 0.1) rgba(0, 0, 0, 0.2) rgba(255, 255, 255, 0.3) rgba(204, 204, 204, 0.4) }');
    });

    it('converts mixed colors to rgba', function () {
        test('div{ border-color: #0fc #000.2 white(.3) black }', 'div{ border-color: #0fc rgba(0, 0, 0, 0.2) rgba(255, 255, 255, 0.3) black }');
    });

    it('converts #rgb.a in gradients', function() {
        test('div{ background: #004400 radial-gradient(#fff.05, #fff.0) }', 'div{ background: #004400 radial-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0)) }');
    });

    it('converts white() in gradients', function() {
        test('div{ background: #004400 radial-gradient(white(0.05), white(0)) }', 'div{ background: #004400 radial-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0)) }');
    });

    it('converts comma-separated values', function() {
        test('.bg { text-shadow: 1px 1px 1px #0fc.1, 3px 3px 5px #fff.05;}', '.bg { text-shadow: 1px 1px 1px rgba(0, 255, 204, 0.1), 3px 3px 5px rgba(255, 255, 255, 0.05);}');
    });

    it('convertas rgba(#rgb, a) to rgba(r, g, b, a)', function() {
        test('a{ color: rgba(#000, .6) }', 'a{ color: rgba(0, 0, 0, 0.6) }');
        test('b{ border-color: rgba(#000, .6) rgba(#fff, 0.1) #333 #666 }', 'b{ border-color: rgba(0, 0, 0, 0.6) rgba(255, 255, 255, 0.1) #333 #666 }');
        test('.bg { text-shadow: 1px 1px 1px rgba(#0fc, .1), 3px 3px 5px rgba(#fff, .05);}', '.bg { text-shadow: 1px 1px 1px rgba(0, 255, 204, 0.1), 3px 3px 5px rgba(255, 255, 255, 0.05);}');
    });

    it('converts rgba(#rgb, 0) in gradients', function() {
        test(
            'background-image: linear-gradient(to bottom, rgba(#fff, .6) 0%, rgba(#fff, 0), 100%);',
            'background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0), 100%);'
        );
    });

    it('converts rgba(rgb(), a)', function() {
        test(
            'a { color: rgba(rgb(204, 0, 255), 0.4); }',
            'a { color: rgba(204, 0, 255, 0.4); }'
        );
    });
});
