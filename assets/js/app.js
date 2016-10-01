$(function () {
    // Switch ON / OFF
    $("[data-switch").bootstrapSwitch();

    // Input select
    $("[data-select]").selectpicker();

    // Sliders
    $("[data-slider]").slider({
        tooltip: "always"
    });
});
