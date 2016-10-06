$(function () {
    // Switch ON / OFF
    $("[data-switch").bootstrapSwitch();

    // Input select
    $("[data-select]").selectpicker();

    // Sliders
    $("[data-slider]").slider({
        tooltip: "always"
    });

    // matchHeight
    $("[data-match-height]").matchHeight();

    // deleteModal
    $("#deleteModal").on("show.bs.modal", function (event) {
      $(this).find("[data-fullname]")
        .text($(event.relatedTarget).data("fullname"));
    });
});
