$(function () {

    $("#skey").autocomplete({
        source: function (val, parse) {
            $.ajax({
                url: "/getXialaKey.aspx",
                data: {
                    q: escape(val)
                },
                dataType: "json",
                success: function (r) {
                    parse(r);
                }
            });
        },
        format: function (value, item) {
            var itemText = item[0].replace(value, "<b class='orange'>" + value + "</b>"),
        li = $("<li/>").html(itemText).data("value", item[0]);
            return li;
        },
        isResult: function (data) {
            return data.result.length;
        },
        dealData: function (data) {
            return data.result;
        },
        onselect: function (val) {
            Simple.log(val);
        }
    });
})