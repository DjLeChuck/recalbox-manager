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

    function showThenHideAlertBox($el) {
      $el.fadeIn(800, function () {
        setTimeout(function () {
          $el.fadeOut(800);
        }, 2000);
      });
    }

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
        showThenHideAlertBox($launchAlertSuccess);
      }).fail(function () {
        showThenHideAlertBox($launchAlertError);
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
    var $romNumber = $("[data-rom-number]");

    $deleteModal.on("show.bs.modal", function (event) {
      var $button = $(event.relatedTarget);
      var $this = $(this);

      $this.find("[data-fullname]").text($button.data("fullname"));
      $this.find("[name=rom]").val($button.data("filename"));
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

        $romNumber.text(parseInt($romNumber.text()) - 1);

        showThenHideAlertBox($deleteAlertSuccess);
      }).fail(function () {
        showThenHideAlertBox($deleteAlertError);
      }).always(function () {
        $button.attr("disabled", false);
        $toggleHidden.toggleClass("hidden");
      });

      return false;
    });

    // Update ROM
    var $updateAlertSuccess = $("[data-update-alert=success]");
    var $updateAlertError = $("[data-update-alert=error]");
    var $updateForm = $("[data-update=form]");
    var $updateModal = $("#updateModal");

    $updateModal.on("show.bs.modal", function (event) {
      var $button = $(event.relatedTarget);
      var $this = $(this);

      $this.find("[data-fullname]").text($button.data("fullname"));
      $this.find("[data-fullname-val]").val($button.data("fullname"));
      $this.find("[name=rom]").val($button.data("filename"));
      $this.find("[data-index]").data("index", $button.data("index"));
      $this.find("[data-publisher]").val($button.data("publisher"));
      $this.find("[data-developer]").val($button.data("developer"));
      $this.find("[data-genre]").val($button.data("genre"));
      $this.find("[data-players]").val($button.data("players"));
      $this.find("[data-desc]").val($button.data("desc"));
      $this.find("[data-releasedate-day]").selectpicker('val', $button.data("releasedate-day") || '00');
      $this.find("[data-releasedate-month]").selectpicker('val', $button.data("releasedate-month") || '00');
      $this.find("[data-releasedate-year]").val($button.data("releasedate-year"));
    });

    $("[data-update=confirm]").on("click", function (event) {
      var $button = $(this);
      var $toggleHidden = $button.find("[data-toggle-hidden]");

      $button.attr("disabled", true);
      $toggleHidden.toggleClass("hidden");

      $.ajax({
        url: $updateForm.attr("action"),
        method: $updateForm.attr("method"),
        data: $updateForm.serialize()
      }).done(function () {
        // Update data on page
        var $updateButton = $("[data-update=trigger][data-index=" + $updateForm.data("index") + "]");
        var fullname = $updateForm.find("[data-fullname-val]").val();

        $updateButton.data({
          fullname: fullname,
          desc: $updateForm.find("[data-desc]").val(),
          genre: $updateForm.find("[data-genre]").val(),
          players: $updateForm.find("[data-players]").val(),
          publisher: $updateForm.find("[data-publisher]").val(),
          developer: $updateForm.find("[data-developer]").val(),
          releasedateDay: $updateForm.find("[data-releasedate-day]").val(),
          releasedateMonth: $updateForm.find("[data-releasedate-month]").val(),
          releasedateYear: $updateForm.find("[data-releasedate-year]").val(),
        });

        $("[data-rom-fullname][data-index=" + $updateForm.data("index") + "]").text(fullname);

        $updateModal.modal("hide");
        showThenHideAlertBox($updateAlertSuccess);
      }).fail(function () {
        showThenHideAlertBox($updateAlertError);
      }).always(function () {
        $button.attr("disabled", false);
        $toggleHidden.toggleClass("hidden");
      });

      return false;
    });

    // Upload ROMs
    var $upload = $("#roms-upload");

    if (0 < $upload.length) {
      $upload.dropzone({
        paramName: "roms",
        dictDefaultMessage: $upload.data("drop-here"),
        dictResponseError: $upload.data("server-error")
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
