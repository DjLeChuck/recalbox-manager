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

    // Launch ROM
    var $launchAlertSuccess = $("[data-launch-alert=success]");
    var $launchAlertError = $("[data-launch-alert=error]");

    $("[data-play]").on("click", function () {
      var $this = $(this);
      var $toggleHidden = $this.find("[data-toggle-hidden]");

      $this.attr("disabled", true);
      $toggleHidden.toggleClass("hidden");

      $.ajax({
        url: "/roms/launch",
        method: "post",
        data: {
          system: $this.data("system"),
          rom: $this.data("rom")
        }
      }).done(function () {
        $launchAlertSuccess.fadeIn(800, function () {
          setTimeout(function () {
            $launchAlertSuccess.fadeOut(800);
          }, 2000);
        });
      }).fail(function () {
        $launchAlertError.fadeIn(800, function () {
          setTimeout(function () {
            $launchAlertError.fadeOut(800);
          }, 2000);
        });
      }).always(function () {
        $this.attr("disabled", false);
        $toggleHidden.toggleClass("hidden");
      });

      return false;
    });

    // Delete ROM
    var $deleteAlertSuccess = $("[data-delete-alert=success]");
    var $deleteAlertError = $("[data-delete-alert=error]");
    var $deleteForm = $("[data-delete=form]");
    var $deleteModal = $("#deleteModal");

    $deleteModal.on("show.bs.modal", function (event) {
      var $button = $(event.relatedTarget);
      var $this = $(this);

      $this.find("[data-fullname]").text($button.data("fullname"));
      $this.find("[name=system]").val($button.data("system"));
      $this.find("[name=rom]").val($button.data("fullname"));
      $this.find("[data-index]").val($button.data("index"));
    });

    $("[data-delete=confirm]").on("click", function (event) {
      var $button = $(this);
      var $toggleHidden = $button.find("[data-toggle-hidden]");

      $button.attr("disabled", true);
      $toggleHidden.toggleClass("hidden");

      $.ajax({
        url: $deleteForm.attr("action"),
        method: $deleteForm.attr("method"),
        data: $deleteForm.serialize()
      }).done(function () {
        $deleteModal.modal("hide");

        $("[data-row=" + $deleteForm.find("[data-index]").val() + "]").fadeOut(600, function () {
          $(this).remove();
        });

        $deleteAlertSuccess.fadeIn(800, function () {
          setTimeout(function () {
            $deleteAlertSuccess.fadeOut(800);
          }, 2000);
        });
      }).fail(function () {
        $deleteAlertError.fadeIn(800, function () {
          setTimeout(function () {
            $deleteAlertError.fadeOut(800);
          }, 2000);
        });
      }).always(function () {
        $button.attr("disabled", false);
        $toggleHidden.toggleClass("hidden");
      });

      return false;
    });

    // Upload ROMs
    var $upload = $("#roms-upload");

    if (0 < $upload.length) {
      console.log('ok');

      var $upload = $("#roms-upload").dropzone({
        paramName: "roms",
        
      });
    }

    // Back to top
    var $backToTop = $('#back-to-top');

    if (0 < $backToTop.length) {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
          $backToTop.fadeIn();
        } else {
          $backToTop.fadeOut();
        }
      });

      // scroll body to 0px on click
      $backToTop.on("click", function () {
        $backToTop.tooltip("hide");
        $("body,html").animate({
          scrollTop: 0
        }, 800);

        return false;
      });

      $backToTop.tooltip("show");
    }

    // Help
    var $submitBtns = $("[data-form-ajax] [type=submit]");

    $submitBtns.on("click", function () {
      $submitBtns.data("clicked", false);

      $(this).data("clicked", true);
    });

    $("[data-form-ajax]").on("submit", function () {
      var $button = $submitBtns.filter(function () { return $(this).data("clicked"); });

      if ($button.is("[data-noajax]")) {
        return true;
      }

      // Ne pas déplacer après var $form = $(this);
      $(this).append(
        $('<input type="hidden" data-submitted>').attr({
          name: $button.attr("name"),
          value: $button.attr("value"),
        })
      );

      var $form = $(this);

      $.ajax({
        url: $form.attr("action"),
        method: $form.attr("method"),
        data: $form.serialize(),
        beforeSend: function () {
          $button.find("[data-toggle-hidden]").toggleClass("hidden");
          $button.attr("disabled", true);

          return true;
        }
      }).done(function (response) {
        var $result = $button.closest("div").find("[data-result]");

        $result.find("[data-value]").each(function () {
          var $resultItem = $(this);

          if ($resultItem.is("a")) {
            $resultItem.attr("href", response.value);
          } else {
            $resultItem.text(response.value);
          }
        });

        $result.removeClass("no-display");
      }).always(function () {
        $button.find("[data-toggle-hidden]").toggleClass("hidden");
        $button.attr("disabled", false);
        $("[data-submitted]").remove();
      });

      return false;
    });
});
