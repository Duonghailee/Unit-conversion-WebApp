var YOUR_ACCESS_KEY = "a24969774b29d7d2639f832300a238f8";
var currencies = [];
var fromCurrency, toCurrency;

$.getJSON("http://apilayer.net/api/list?access_key=" + YOUR_ACCESS_KEY, function (data) {
    for (var key in data.currencies) {
        currencies.push({
            value: data.currencies[key],
            data: key
        })
    }
});

$(document).ready(function () {
    $('#convert').click(function () {
        var value = $("#inputCurrency").val();
        $.getJSON("http://www.apilayer.net/api/live?access_key=" + YOUR_ACCESS_KEY, function (data) {
            var from = fromCurrency || "USD"
            var to = toCurrency || "EUR"
            var ratio = parseFloat(data.quotes[from + to]);
            var result = parseFloat(value) * ratio;
            $("#outputCurrency").val(result);
        });
    });

    function fetchLookup(query, done) {
        var result = {
            suggestions: []
        }
        query = query.toLowerCase();
        result.suggestions = currencies.filter(currency => currency.value.toLowerCase().indexOf(query) >= 0);
        done(result);
    }
    $('#autocomplete_from').keyup(function () {
        if (!this.value) fromCurrency = "";
    });

    $('#autocomplete_from').autocomplete({
        lookup: fetchLookup,
        onSelect: function (suggestion) {
            fromCurrency = suggestion.data;
        }
    });

    $('#autocomplete_to').autocomplete({
        lookup: fetchLookup,
        onSelect: function (suggestion) {
            toCurrency = suggestion.data;
        }
    });


    // LENGTH
    var lengthRatio = {
        "inchcm": 2.54,
        "cminch": 1 / 2.54
    }
    function convertLength() {
        var value = parseFloat($("#inputUnitValue").val() || 0);
        var from = $("#inputUnit").val();
        var to = $("#outputUnit").val();
        var result = from !== to ? value * lengthRatio[from + to] : value;                    
        $("#outputUnitValue").val(result);
    }
    $("#inputUnitValue").keyup(convertLength)
    $("#convertLength").on("click", convertLength);
    $("#lengthConverter select").on("change", convertLength);


});