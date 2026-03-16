var exitPopupStatus = true;
var isCcFormSubmit = false;
var ccGlobalFormData = {};
var bhsConsentData = {};
var ccGlobalFunctionData = {};
var ccSlotFinalData = {};
var otpModal = "#otpValidatePopup";
var globalFileUploadData = new FormData();
otpModal = $(otpModal);
ccGlobalFormData.campaignId = "";
ccGlobalFormData.campaignName = "";
ccGlobalFormData.dummy2 = "";
ccGlobalFormData.landMark = "";
ccGlobalFormData.thirdAddress = "";
ccGlobalFormData.buildingName = "";
ccGlobalFormData.houseNo = "";
ccGlobalFormData.organizationName = "";
ccGlobalFormData.segment = "";
ccGlobalFormData.street = "";
ccGlobalFormData.designation = "";
ccGlobalFormData.secondAddress = "";
ccGlobalFormData.state = "";
ccGlobalFormData.remarks = "";
ccGlobalFormData.projectType = "";
ccGlobalFormData.lName = "";
ccGlobalFormData.city = "";
ccGlobalFormData.phoneNo = "";
ccGlobalFormData.pinCode = "";
ccGlobalFormData.email = "";
ccGlobalFormData.firstAddress = "";
ccGlobalFormData.floorNo = "";
ccGlobalFormData.salutations = "";
ccGlobalFormData.mobileNo = "";
ccGlobalFormData.fName = "";
ccGlobalFormData.skuChosen = "";
ccGlobalFormData.measurementNeeded = "";
ccGlobalFormData.dealerName = "";
ccGlobalFormData.dealerCode = "";
ccGlobalFormData.answer = "";
ccGlobalFormData.sampleFinish = "";
ccGlobalFormData.datePicker = "";
ccGlobalFormData.customField = "";
ccGlobalFormData.visitorId = "";
ccGlobalFormData.bpNumber = "";
ccGlobalFormData.formAllSteps = "";
ccGlobalFormData.formStep2 = "";
ccGlobalFormData.formStep3 = "";
ccGlobalFormData.thankYouStep = "";
ccGlobalFormData.formVariant = "";
ccGlobalFormData.startDate = "";
ccGlobalFormData.isApehs = "";
ccGlobalFormData.authServiceAvailable = "";
ccGlobalFormData.isValidService = "";
ccGlobalFormData.toDate = "";
ccGlobalFormData.serviceGroup = "";
ccGlobalFormData.leadId = "";
ccGlobalFormData.appointment_time = "";
ccGlobalFormData.appointment_end_time = "";
ccGlobalFormData.Id = "";
ccGlobalFormData.description = "";
ccGlobalFormData.serviceCode = "";
ccGlobalFormData.serviceName = "";
ccGlobalFormData.resourcePath = "";
ccGlobalFormData.pageUrl = "";
ccGlobalFormData.whatsAppConsent = "";
ccGlobalFormData.secondVariantCheck = "";
ccGlobalFormData.userBookedAppointment = "";
ccGlobalFormData.hybris_id = "";
ccGlobalFormData.cc_sa_bp = "";
ccGlobalFormData.scheduleEndTime = "";
ccGlobalFormData.scheduleStartTime = "";
ccGlobalFormData.thankYouImage = "";
ccGlobalFormData.thankYouImageExt = "";
ccGlobalFormData.thankYouImageTitle = "";
ccGlobalFormData.thankYouImageAlt = "";
ccGlobalFormData.errorImage = "";
ccGlobalFormData.errorImageExt = "";
ccGlobalFormData.errorImageTitle = "";
ccGlobalFormData.errorImageAlt = "";
ccGlobalFormData.thankYouTitleTxt = "";
ccGlobalFormData.errorTitleTxt = "";
ccGlobalFormData.thankYouDesc = "";
ccGlobalFormData.errorDesc = "";
ccGlobalFormData.thankYouSubmitText = "";
ccGlobalFormData.imageShadeEffect  = "";
ccGlobalFormData.pdfPath = "";
ccGlobalFormData.defaultCampaignIdStatus = "";
ccGlobalFormData.succussPageUrl = "";
ccGlobalFormData.bhsConsent = false;
ccGlobalFormData.bhsSubmitFlag = false;
bhsConsentData.bhsCampaignId = "";
bhsConsentData.bhsCampaignName = "";
bhsConsentData.bhsThankYouMsg = "";
bhsConsentData.serviceName = "";
ccGlobalFormData.currentItem = "";
ccGlobalFormData.source = "";
ccGlobalFormData.medium = "";
ccGlobalFormData.imageB64 = "";
ccGlobalFormData.imageUrl = "";
ccGlobalFormData.isRestricted = false;
ccGlobalFormData.isLeadNonBHS = true;
ccGlobalFormData.enableFileUpload = false;
ccGlobalFormData.parentFormElement = "";
ccGlobalFormData.thankYouPopupHeading = ""
ccGlobalFormData.thankYouPopupErrorDescription = ""
ccGlobalFormData.thankYouPopupSuccessDescription = ""
ccGlobalFormData.thankYouPopupSubHeading = ""
ccGlobalFormData.bookAVisitCTALabel = ""
ccGlobalFormData.downloadPdfLink = ""
ccGlobalFormData.thankYouImageMobile = ""
ccGlobalFormData.thankYouImageDesktop = ""
ccGlobalFormData.newThankYouVariant = false;
ccGlobalFormData.fileInputInvoice = "";
ccGlobalFormData.invoiceSelectedFiles = "";
ccGlobalFormData.invoiceSelectedFilesURL = "";
ccGlobalFormData.fileInputApplication = "";
ccGlobalFormData.applicationSelectedFiles = "";
ccGlobalFormData.applicationSelectedFilesURL = "";
ccGlobalFormData.date = "";
ccGlobalFormData.formData = "";
ccGlobalFormData.name = "";
ccGlobalFormData.projectAddress = "";
ccGlobalFormData.tokoLocation = "";
ccGlobalFormData.tokoName = "";
ccGlobalFormData.contractorName = "";
ccGlobalFormData.contractorMobileNo = "";
ccGlobalFormData.invoiceNo = "";
ccGlobalFormData.area = "";
ccGlobalFormData.roomPainted = "";
ccGlobalFormData.completedDate = "";
ccGlobalFormData.startingDate = "";
ccGlobalFormData.endingDate = "";
ccGlobalFormData.productName = "";
ccGlobalFormData.feedbackOption = "";
ccGlobalFormData.productUsed = "";
ccGlobalFormData.dampnessPresent = "";
ccGlobalFormData.exteriorWallCrack = "";
ccGlobalFormData.interiorWallCrack = "";
ccGlobalFormData.projectTypeInfinito = "";
ccGlobalFormData.noOfWallsNotGood = "";
ccGlobalFormData.wallIssue = "";
var wallIssueArrays = [];

ccGlobalFormData.dateOfPurchase = "";
let furnitureLeadForm = '';
let templateName = "";
ccGlobalFormData.campaignIdFinal = "";
ccGlobalFormData.EnableAutoExitIntentPopUp = false ;
ccGlobalFormData.enableCserviceBhs = false ;
ccGlobalFormData.bhsAutoAppointmentFlow = false ;
ccGlobalFormData.textEntry = "";

let phValidationAnalytics = true;
var cookieExpire = new Date;
cookieExpire.setTime(cookieExpire.getTime() + 24 * 60 * 60 * 1000 * 1);

let allowOTPinBannerForm = $(".js-banner-active-target").attr("data-attr-enableOtpFlow") == 'true' ? true : false; // Based on the checkbox in banner form
// Based on the checkbox in banner form
let thankYouStepMarkUp = "";
let fullImageGifThankYou = false;
let newGifThankYou = false;

$(document).ready(function() {
    ccGlobalFunctionData.enableNoOptionByDefault();
    if ($('.custom-enquire-form-step-1').length > 0) {
        $('.error-message').css('display', 'none');
        $('.errorTitle').css('display', 'none');
        $('.booking-id').css('display', 'none');
        $('.error-image-path').css('display', 'none');
        if ($(".enquire-form__step-2").length > 0) {
            $.ajax({
                type: "POST",
                url: '/apcolourcatalogue/ccforms/APIhandler' + '.initScheduler' + '.json',
                success: function(data) {
                    if (data.status == "failure") {
                        ccGlobalFormData.isValidService = false;
                        ccGlobalFormData.authServiceAvailable = false;
                    } else {
                        ccGlobalFormData.authServiceAvailable = true;
                    }
                }
            });
        }
        ccGlobalFunctionData.cookieForCampaignId();
    }
    //form jump link function.
    $(document).on('click', '.ctaJumpLink', function(event){
     event.preventDefault();
     let dataAt = $(this).attr('data-href');
     if (typeof dataAt !== 'undefined' && dataAt !== false){
        let $ctaTarget = $($(this).attr('data-href'));
        let targetPos = $ctaTarget[0].offsetTop;
        let headerOffset = $('.header__top-utility').innerHeight();
        targetPos = targetPos - headerOffset;
     } else{
        let $ctaTarget = $($(this).attr('href'));
        var targetPos = $ctaTarget[0].offsetTop;
        targetPos = targetPos - 60;
     }

     $('html,body').animate({scrollTop:targetPos});
     });

     $('.form-radio-input__custom-element').on("keydown" ,function(e){
        if(e.key === "Enter")
        {
            e.preventDefault();
            $(this).siblings('input[type="radio"]').prop('checked' , true);
        }
 })

    //BHS Consent variable
    ccGlobalFormData.bhsConsent = $("#enableBhsConsent").val() !== undefined ? Boolean($("#enableBhsConsent").val()) : false;
    bhsConsentData.bhsCampaignId = $("#bhsCampaignId").val() !== undefined ? $("#bhsCampaignId").val() : "";
    bhsConsentData.bhsCampaignName = $("#bhsCampaignName").val() !== undefined ? $("#bhsCampaignName").val() : "";
    bhsConsentData.bhsThankYouMsg = $("#bhsThankYouMsg").val() !== undefined ? $("#bhsThankYouMsg").val() : "";

ccGlobalFunctionData.getCookieValues = function(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

ccGlobalFunctionData.checkCookieValues = function() {
  let cachedFieldVal = ccGlobalFunctionData.getCookieValues("CCFormFields");
  if (cachedFieldVal != "" && cachedFieldVal != undefined) {
        cachedFieldVal = cachedFieldVal.split("|");
        if (cachedFieldVal[0] != "" && cachedFieldVal[0] != undefined) {
            $("input[name='ENQUIRE_NAME']").val(cachedFieldVal[0]);
            $("input[name='ENQUIRE_NAME']").parent().addClass('focussed');
        }
        if (cachedFieldVal[1] != "" && cachedFieldVal[1] != undefined) {
            $("input[name='ENQUIRE_EMAIL']").val(cachedFieldVal[1]);
            $("input[name='ENQUIRE_EMAIL']").parent().addClass('focussed');
        }
        if (cachedFieldVal[2] != "" && cachedFieldVal[2] != undefined) {
            $("input[name='ENQUIRE_MOBILE']").val(cachedFieldVal[2]);
            $("input[name='ENQUIRE_MOBILE']").parent().addClass('focussed');
        }
        if (cachedFieldVal[3] != "" && cachedFieldVal[3] != undefined && cachedFieldVal[3] != "undefined") {
            $("input[name='ENQUIRE_PINCODE']").val(cachedFieldVal[3]);
            $("input[name='ENQUIRE_PINCODE']").parent().addClass('focussed');
        }
  } else {
     ccGlobalFunctionData.setFormFieldsToCookie();
  }
}

ccGlobalFunctionData.setFormFieldsToCookie = function(that){
    let cookie_fullName = $(that).find("#enquire-name").length > 0 ? $(that).find("#enquire-name").val() : "";
    let cookie_email = $(that).find("#enquire-email").length > 0 ? $(that).find("#enquire-email").val() : "";
    let cookie_mobileNo = $(that).find("#enquire-mobile").length > 0 ? $(that).find("#enquire-mobile").val() : "";
    let cookie_pinCode = $(that).find("#enquire-pincode").length > 0 ? $(that).find("#enquire-pincode").val() : "";
    let now = new Date();
    let time = now.getTime();

    // no. of days of cookie validity
    let exdays = 30;
    let expireTime = time + (exdays*24*60*60*1000);
    now.setTime(expireTime);

    if(ccGlobalFunctionData.getCookieValues("CCFormFields") == "") {
        if (cookie_fullName != "" && cookie_email != "" && cookie_mobileNo != "") {
            document.cookie = "CCFormFields=" + cookie_fullName + "|" + cookie_email + "|" + cookie_mobileNo + "|" + cookie_pinCode + ";expires=" + now.toUTCString() + ";path=/";
        }
    } else {
        if (ccGlobalFunctionData.getCookieValues("CCFormFields") != "" && ccGlobalFunctionData.getCookieValues("CCFormFields") != undefined) {
           let existingCookie = ccGlobalFunctionData.getCookieValues("CCFormFields");
               existingCookie = existingCookie.split("|");
               (cookie_fullName != "" ? (existingCookie[0] = cookie_fullName) : existingCookie[0]);
               (cookie_email != "" ? (existingCookie[1] = cookie_email) : existingCookie[1]);
               (cookie_mobileNo != "" ? (existingCookie[2] = cookie_mobileNo) : existingCookie[2]);
               (cookie_pinCode != "" ? (existingCookie[3] = cookie_pinCode) : existingCookie[3]);
               document.cookie = "CCFormFields=" + existingCookie[0] + "|" + existingCookie[1] + "|" + existingCookie[2] + "|" + existingCookie[3] + ";expires=" + now.toUTCString() + ";path=/";
        }
    }
}

ccGlobalFunctionData.getLoginUserDetails = function() {
    $.ajax({
        url: '/apcolourcatalogue/keycloak/profile.userProfile.json?_='+$.now(),
        method: 'GET',
        cache: false,
        success: function(result) {
            let userProfile = result;
            let firstName= userProfile.firstName.trim();
            let lastName = "";
            if(userProfile && userProfile.lastName){
                lastName = userProfile.lastName.trim();
            }
            let userName = "";
            if (firstName) {
                userName = firstName;
            }
            if (lastName) {
                userName = userName + " " + lastName;
            }
            let userEmail= userProfile.email;
            let userMobileNum = (userProfile.attributes && userProfile.attributes.mobileNumber[0])? userProfile.attributes.mobileNumber[0] : "";
            let tenDigitMobileNumber = extractValidMobileNumber(userMobileNum);
            console.log("user name : " + userName.trim());
            ccGlobalFunctionData.setLoginUserDetailsToForm(userName, userEmail, tenDigitMobileNumber);
        },
        error: function(xhr) {
            console.log("Error in get User Info :" + xhr);
        }
    });
}
function extractValidMobileNumber(input) {
     // Remove all non-digit characters
     const digits = input.replace(/\D/g, '');
     // Check if it ends with a valid 10-digit number
     const match = digits.match(/(\d{10})$/);
     return match ? match[1] : null;
}
ccGlobalFunctionData.setLoginUserDetailsToForm = function(userName, userEmail, userMobileNum) {
    if (userName != "" && userName != undefined) {
        $("input[name='ENQUIRE_NAME']").val(userName);
        $("input[name='ENQUIRE_NAME']").parent().addClass('focussed');
    }
    if (userEmail != "" && userEmail != undefined) {
        $("input[name='ENQUIRE_EMAIL']").val(userEmail);
        $("input[name='ENQUIRE_EMAIL']").parent().addClass('focussed');
    }
    if (userMobileNum != "" && userMobileNum != undefined) {
        $("input[name='ENQUIRE_MOBILE']").val(userMobileNum);
        $("input[name='ENQUIRE_MOBILE']").parent().addClass('focussed');
    }
    let cachedValue = ccGlobalFunctionData.getCookieValues("CCFormFields");
    if (cachedValue != "") {
        cachedValue = cachedValue.split("|");
        if (cachedValue[3] != "" && cachedValue[3] != undefined && cachedValue[3] != "undefined") {
            $("input[name='ENQUIRE_PINCODE']").val(cachedValue[3]);
            $("input[name='ENQUIRE_PINCODE']").parent().addClass('focussed');
        }
    }
}
window.addEventListener('keycloakLoginReady', () => {
  if(isKeycloakAuthenticated()) {
        ccGlobalFunctionData.getLoginUserDetails();
    }
});
window.addEventListener("keycloakLoginNotReady", function (e) {
    if(isKeycloakAuthenticated() && typeof(e.detail.userId)!="undefined"){
        console.log("User logged In");
    } else {
        ccGlobalFunctionData.checkCookieValues();
    }
});

    if ($("#inputImage").length > 0) {
        console.log("inputImage document ready");
        let fileInput = document.getElementById("inputImage");
        if (fileInput) {
            console.log("inputImage added event");

            fileInput.addEventListener("change", (e) => {
               // get a reference to the file
               if(e.target.files.length > 0 && e.target.files[0].size < 2000000) {
                    $(".track_form_submit").attr("disabled", true);
                    $('.js-browse-file').parents('.form-browse-wrap').find('.form-global__field-message').text("");
                    $('.js-browse-file').removeClass('novalue');
                    $('.form-browse-wrap .loader-wrap').removeClass('hide');
                    $("#inputImage").val();

                    const file = e.target.files[0];
                   // encode the file using the FileReader API
                   const reader = new FileReader();
                   reader.onloadend = () => {
                     const base64String = reader.result
                             .replace("data:", "")
                             .replace(/^.+,/, "");
                     //console.log(base64String);
                     ccGlobalFormData.imageB64 = base64String;
                     if(ccGlobalFormData.imageB64){
                        ccGlobalFunctionData.getAzureImageURL(ccGlobalFormData.imageB64);
                     }
                   };
                   reader.readAsDataURL(file);
                  // $('.form-browse-wrap .loader-wrap').addClass('hide');
               } else {
                    $("#inputImage").addClass('novalue');
                    if ($("#inputImage").parents('.form-browse-wrap').find('.form-global__field-message').length > 0) {
                        $('.js-browse-file').next().next('.form-global__field-message').text("Please upload file size less than 2MB");
                        $("#inputImage").val("");
                    } else {
                        $('.js-browse-file').parent('.form-global').append('<div class="form-global__field-message form-text-input__field-message" role="status" aria-live="polite">Please upload file size less than 2MB</div>');
                        $("#inputImage").val("");
                    }
               }
             });
        }
    }

    ccGlobalFunctionData.getAzureImageURL = function(base64String) {
           let _self = this;
           let imageB64 = base64String;
           let containerName = "";
           let imageNameFormat = "";
           // This implementation is for new file upload variant for campaign form
           if ($(".form-file-upload").length || $(".form-file-upload-gamification").length) {
            containerName = "campaigns-blob";
            imageNameFormat = "campaignformfileupload";
           } else {
            containerName = "apform";
            imageNameFormat = "building";
           }
             $.ajax({
                 type: "POST",
                 url: "/apcolourcatalogue/azureassetcall.json?container=" + containerName + "&imagename=" + imageNameFormat,
                 dataType: "text",
                 data:encodeURIComponent(JSON.stringify(imageB64)),
                 processData: false,
                 contentType: "application/x-www-form-urlencoded",
                 success: function(response) {
                    $('.form-browse-wrap .loader-wrap').addClass('hide');
                    $(".track_form_submit").attr("disabled", false);
                    if(response != '' && response != undefined) {
                        if (($(".form-file-upload").length || $(".form-file-upload-gamification").length) && ccAnalytics.satelliteCheck()) {
                            _satellite.track("File_upload_successful");
                        }
                        ccGlobalFormData.imageUrl = response;
                        console.log("Response URL : " + ccGlobalFormData.imageUrl);
                     }
                 }
             });
        };

    $('.colorInspiration-getThisLook').click(function(event) {
        event.preventDefault();
        $(this).parents('.a').removeAttr('href');
        var globalFormPopUpId = $('#globalFormPopUp');
        globalFormPopUpId.show();
        modalHandler.showModal(globalFormPopUpId);
    })

    let isPBCVariant = $(".exit-intent-popup").attr("data-attr-pdc-variant");
    /*Implementing New rule for Displaying Exit Intent Pop-up*/
    let typeOfExitPopUpTriggred =  $("#exitPopupmodal").attr("data-attr-formType");
    // Exit Popup JS Start
    function exitPopupShow() {
        if($('.splash-modal-container #splash-popup').attr('data_attr_splashStatus') != 'false'){
            let flagToAutoShowPopUp = false;
            if (typeOfExitPopUpTriggred === 'bhs_form') {
                /*let exitSessionKeyVals = JSON.parse(sessionStorage.getItem("bhsFormSubmission"));*/
                let exitSessionKeyVals = getCookieValues("bhsFormSubmission") != "" ? JSON.parse(getCookieValues("bhsFormSubmission")) : {};
                if(exitSessionKeyVals != null && exitSessionKeyVals != undefined && (exitSessionKeyVals.exitPop_Up_Closed != null || exitSessionKeyVals.formSubmitted != null)) {
                    flagToAutoShowPopUp = exitSessionKeyVals.exitPop_Up_Closed == true || exitSessionKeyVals.formSubmitted == true ? true : false;
                }
            } else {
                /*let exitSessionKeyVals = JSON.parse(sessionStorage.getItem("spsFormSubmission"));*/
                let exitSessionKeyVals = getCookieValues("spsFormSubmission") != "" ? JSON.parse(getCookieValues("spsFormSubmission")) : {};
                if(exitSessionKeyVals != null && exitSessionKeyVals != undefined && (exitSessionKeyVals.exitPop_Up_Closed != null || exitSessionKeyVals.formSubmitted != null)) {
                    flagToAutoShowPopUp = exitSessionKeyVals.exitPop_Up_Closed == true || exitSessionKeyVals.formSubmitted == true ? true : false;
                }
            }
            if (($(".exit-modal").length > 0)) {
                //Adding a Additional Check to Auto Display Pop-up basis the above defined rule
                if (isPBCVariant == "false" && !flagToAutoShowPopUp) {
                    let modalId = $("#exitPopupmodal");
                    modalHandler.showModal(modalId);
                    $(".exit-modal").addClass("active-exit-popup");
                    if ($(".active-exit-popup.in").length > 0) {
                        $(document).mouseup(function (e) {
                            let container = $("#exitPopupmodal .modal-content");
                            // If the target of the click isn't the container nor a descendant of the container
                            if (!container.is(e.target) && container.has(e.target).length === 0) {
                                // Trigger Analytics if Exit Popup is closed on Focus Out Starts
                                if ($(".active-exit-popup.in").length > 0) {
                                    exitIntend();
                                }
                                // Trigger Analytics if Exit Popup is closed on Focus Out Ends
                                $(".exit-modal").removeClass("active-exit-popup");
                                exitPopupStatus = false;
                                if ((".campaignpage-template").length > 0) {
                                    modalHandler.closeModal(modalId);
                                }
                            }
                        });
                    }
                    exitFormPrefilledCheck();
                }
            }
        } else {
            resetTimer();
        }
    }

    // Enable Exit Popup Submit Button if all the input fields are pre-filled on load
    function exitFormPrefilledCheck() {
        let $nameExitPopup = $(".active-exit-popup .form-revamp input[name='ENQUIRE_NAME']");
        let $emailExitPopup = $(".active-exit-popup .form-revamp input[name='ENQUIRE_EMAIL']");
        let $phoneExitPopup = $(".active-exit-popup .form-revamp input[name='ENQUIRE_MOBILE']");
        let $pincodeExitPopup = $(".active-exit-popup .form-revamp input[name='ENQUIRE_PINCODE']");

        if (
            $nameExitPopup.length && $nameExitPopup.val() &&
            $emailExitPopup.length && $emailExitPopup.val() &&
            $phoneExitPopup.length && $phoneExitPopup.val() &&
            $pincodeExitPopup.length && $pincodeExitPopup.val()
        ) {
            $('.active-exit-popup .form-revamp-submit').removeClass('disabled disabled-btn');
        }
        else {
            $('.active-exit-popup .form-revamp-submit').addClass('disabled disabled-btn');
        }
    }

    if(!$('#exitPopupmodal').hasClass('exit-intent-aem')){
    // Show Exit PopUp After 30 seconds
    let configuredTimerForExitPopUp = $('.exit-intent-popup').attr('data-attr-autoShowTimer') ? $('.exit-intent-popup').attr('data-attr-autoShowTimer') : 0;
    configuredTimerForExitPopUp = configuredTimerForExitPopUp > 0 ? configuredTimerForExitPopUp * 1000 : 0;
    let timer = 0;
    function resetTimer() {
        if(configuredTimerForExitPopUp > 0) {
            clearInterval(timer);
            timer = setInterval(triggerPopUpCall, configuredTimerForExitPopUp);
        }
    }

    //Show Pop Up basis user in-activity on the page
    $(window).on('load mousemove mousedown touchstart click keypress',function () {
        resetTimer();
    });

    function triggerPopUpCall() {
          enableAutoExitIntentPopUp();
          if (ccGlobalFormData.EnableAutoExitIntentPopUp) {
            exitPopupShow();
          }

    }

    // Show Exit PopUp On Mouse Leaving Viewport
    document.addEventListener('mouseleave', function (event) {
        enableAutoExitIntentPopUp();
          if (ccGlobalFormData.EnableAutoExitIntentPopUp) {
            exitPopupShow();
          }
    });

    // Show Exit PopUp On Scrolling to Footer
    let configuredHeightForExitPopUp = $('.exit-intent-popup').attr('data-attr-autoShowScroll') ? $('.exit-intent-popup').attr('data-attr-autoShowScroll') : 0;
    configuredHeightForExitPopUp = configuredHeightForExitPopUp > 0 ? configuredHeightForExitPopUp * 1 : 100;

    let heightTriggerPoint = (($(document).height() - $(window).height()) * configuredHeightForExitPopUp) / 100;
    $(window).on('scroll', function (event) {
        if (this.pageYOffset > heightTriggerPoint) {
          enableAutoExitIntentPopUp();
            if (ccGlobalFormData.EnableAutoExitIntentPopUp) {
              exitPopupShow();
            }
        }
    });
}

    $(".closeExitPopup").click(function () {
        $(".js-closemodal[data-dismiss=modal]").trigger({ type: "click" });
        if ((".campaignpage-template").length > 0) {
            let modalTarget = $("#exitPopupmodal");
            modalHandler.closeModal(modalTarget);
        }
        $(".exit-modal").removeClass("active-exit-popup");
        exitPopupStatus = false;
        exitIntend();
    });

    $('.js-whatsAppCheckbox').on('click', function () {
        $(this).toggleClass('whatsAppCheckbox-checked');
        $(this).hasClass("whatsAppCheckbox-checked") ? $(this).attr('aria-checked','true') : $(this).attr('aria-checked','false');

        // desktop
        if ($(this).hasClass("whatsApp-toggle-desktop")) {
            $(this).hasClass("whatsAppCheckbox-checked") ? $(this).find(".on-off").text("ON") : $(this).find(".on-off").text("OFF");
        }

        // mobile
        if ($(this).hasClass("whatsApp-toggle-mobile")) {
            $(this).hasClass("whatsAppCheckbox-checked") ? $(this).find(".on-off").text("ON") : $(this).find(".on-off").text("OFF");
        }
    });

    //Add checkbox functionality on Clicking of Enter through Tab
    $('.js-whatsAppCheckbox').on('keydown', function (e) {
        if(e.key === "Enter")
        {
            $(this).toggleClass('whatsAppCheckbox-checked');
            $(this).hasClass("whatsAppCheckbox-checked") ? $(this).attr('aria-checked','true') : $(this).attr('aria-checked','false')

            // desktop
            if ($(this).hasClass("whatsApp-toggle-desktop")) {
                $(this).hasClass("whatsAppCheckbox-checked") ? $(this).find(".on-off").text("ON") : $(this).find(".on-off").text("OFF");
            }

            // mobile
            if ($(this).hasClass("whatsApp-toggle-mobile")) {
                $(this).hasClass("whatsAppCheckbox-checked") ? $(this).find(".on-off").text("ON") : $(this).find(".on-off").text("OFF");
            }
        }

    });


    $(".form-revamp input").on("blur keydown", function () {
        if ($(".form-revamp .form-text-input__field-message").length > 0) {
            $('.form-revamp-submit').addClass('disabled disabled-btn');
        }
        else {
            $('.form-revamp-submit').removeClass('disabled disabled-btn');
        }
    });
    // Exit Popup JS End


    // Trigger exit popup if policy 'enable-exitIntent' is added to CTA
    // Trigger exit popup if class 'enable-exitIntent' is added to element & CCForms is configured on page
    $(document).on("click", ".enable-exitIntent", function () {
        // Trigger exit popup only if ccforms is not already inside a modal (CIZs, furniture form variant)
        if ($(this).hasClass("track-stickybtn-header")) {
            // Stickyforms analytics implementation
            let ctaText = $(this).text() ? $(this).text().trim() : "";
            if (ccAnalytics.digitalData()) {
                digitalData.data = {
                    "cta_": ctaText
                };
            }
            if (ccAnalytics.satelliteCheck()) {
                _satellite.track("sticky_cta_click", {
                    "cta_": ctaText
                });
            }
        }
        if ((!$(".ccforms .ccFormScheduler").closest('.modal').length) || $(".modal__variant-colorCatalogueFormPopup").length > 0) {
            let modalId = $("#exitPopupmodal");
            // Hide questions oc CCForms header hamburger link 2
            if ($(this).hasClass("hamburger-redirection-link-2")) {
                $("#exitPopupmodal .disclaimer-questions.form-revamp-ques").hide();
            }
            else {
                $("#exitPopupmodal .disclaimer-questions.form-revamp-ques").show();
            }
            modalHandler.showModal(modalId);
            $(".exit-modal").addClass("active-exit-popup");
            if ($(".exit-modal").length > 0) {
                exitFormPrefilledCheck();
                //Display Form Screen again on click of CTA after one submission
                $(".exit-modal.fade-scale.in .enquire-form__step-1").css('display', 'block');
                $(".form-revamp").show();
                $(".exitPopup-success").addClass("d-none");
                $(".exitPopup-error").addClass("d-none");
                $(".exit-popup-right").removeClass("formSubmitScreen");
                let ExitFormModalHeader = $(".exit-intent-popup .exit-popup-header h3").attr("data-attr-form-heading");
                $(".exit-popup-header h3").text(ExitFormModalHeader);
            }
        }
    });

    function exitIntend(){
    //To call Launch Direct Call Rule,
    let typeOfExitPopUpClosed =  $("#exitPopupmodal").attr("data-attr-formType");
        if (typeOfExitPopUpClosed === 'bhs_form') {
            /*let exitSessionKeyVals = JSON.parse(sessionStorage.getItem("bhsFormSubmission")) ?  JSON.parse(sessionStorage.getItem("bhsFormSubmission")) : {};*/
            let exitSessionKeyVals = getCookieValues("bhsFormSubmission") != "" ?  JSON.parse(getCookieValues("bhsFormSubmission")) : {};
            exitSessionKeyVals.exitPop_Up_Closed = true;
            /*sessionStorage.setItem("bhsFormSubmission", JSON.stringify(exitSessionKeyVals));*/
            /*Updating Session Storage level Exit popup values to Cookie*/
            document.cookie = "bhsFormSubmission=" + JSON.stringify(exitSessionKeyVals) + ";path=/;expires=" + cookieExpire.toGMTString();
        } else {
            /*let exitSessionKeyVals = JSON.parse(sessionStorage.getItem("spsFormSubmission")) ?  JSON.parse(sessionStorage.getItem("spsFormSubmission")) : {};*/
            let exitSessionKeyVals = getCookieValues("spsFormSubmission") != "" ?  JSON.parse(getCookieValues("spsFormSubmission")) : {};
            exitSessionKeyVals.exitPop_Up_Closed = true;
            /*sessionStorage.setItem("spsFormSubmission", JSON.stringify(exitSessionKeyVals));*/
            /*Updating Session Storage level Exit popup values to Cookie*/
            document.cookie = "spsFormSubmission=" + JSON.stringify(exitSessionKeyVals) + ";path=/;expires=" + cookieExpire.toGMTString();
        }
        if(typeof(_satellite) != "undefined"){
            _satellite.track("popup_exit");
        }
    }
    //Stick Form JS Start
    function scrollStickyForm() {
        if ($(".js-stickyFormButton").length > 0) {
            setTimeout(function () {
                if ($(window).width() > 991) {
                    let $stickyFormHeaderHeight = $(".header__top-utility").innerHeight();
                    $(".js-stickyFormButton").css("top", $stickyFormHeaderHeight);
                    if ($(".header__sticky").length > 0) {
                        $stickyFormHeaderHeight = $stickyFormHeaderHeight - $(".header__top-utility-links-container").innerHeight();
                        $(".js-stickyFormButton").css("top", $stickyFormHeaderHeight);
                    }
                }
                if ($(window).width() < 991) {
                    if ($(".footer footer").length > 0) {
                        // $(".footer footer").css("padding-bottom", "70px");
                    }
                }
            }, 100);
        }
    }

    $(".js-stickyFormButton").click(function () {
        if ($(".exit-modal").length > 0){
            let modalId = $("#exitPopupmodal");
            modalHandler.showModal(modalId);
            $(".exit-modal").addClass("active-exit-popup");
            exitFormPrefilledCheck();
        }
        $(".exit-modal.fade-scale.in .enquire-form__step-1").css('display', 'block');
        $(".form-revamp").show();
        $(".exitPopup-success").addClass("d-none");
        $(".exitPopup-error").addClass("d-none");
        $(".exit-popup-right").removeClass("formSubmitScreen");
        let ExitFormModalHeader = $(".exit-intent-popup .exit-popup-header h3").attr("data-attr-form-heading");
        $(".exit-popup-header h3").text(ExitFormModalHeader);
    })

        scrollStickyForm();

        $(window).on("scroll", function () {
            scrollStickyForm();
        });
        //Stick Form JS End

    // Vertical Form Variant Input Field & Label Style Starts

    $(".formVerticalVariant input[type='text']").each(function () {
        if ($(this).val() === '') {
            $(this).siblings('.form-text-input__label').addClass("d-none");
        }
        else {
            $(this).siblings('.form-text-input__label').removeClass("d-none");
            $(this).closest('.formVerticalVariantContainer').find('.form-text-input__label').css('background',$(this).closest('.formVerticalVariantContainer').attr('data-form-bg-color'));
            $(this).css("background", "transparent");
            $(this).css("border", "1px solid #bdbdbd");
            $(this).closest('.form-global-revamp').siblings('.MobileNum').css("background", "transparent");
            $(this).closest('.form-global-revamp').siblings('.MobileNum').css("border", "1px solid #bdbdbd");
            $(".formVerticalVariant .telNum").css("border-left", "none");
        }
    })

    // Logic for Country Flag
    if ($(".formVerticalVariant input[type='text'].telNum").val() === '') {
        $(this).closest('.form-global-revamp').siblings('.MobileNum').css("background", inputFieldBg);
        $(this).closest('.form-global-revamp').siblings('.MobileNum').css("border", "none");
    }

    // if questions are not present
    if(!$('.new-banner-form-varient .form-checkbox-input__single-element .disclaimer-group').length > 0){
        $('.formVerticalVariant.new-banner-form-varient .enquire-form-override .enquire-form__step-1').css('height','415px');
    }
    // Vertical Form Variant Input Field & Label Style Ends
    // logic for on click of bhs banner img scroll to the perticular component
    let getbhsautoscrollAttr = $('.new-banner-form-varient .enquire-form__container').data('attr-bhsautoscrollmobid');
    let getbhsautoscrollstatus = $('.new-banner-form-varient .enquire-form__container').data('attr-bhsautoscrollmob');
    if($(window).width() <= 991 && $('.ccforms .new-banner-form-varient') && getbhsautoscrollstatus){
        setTimeout(()=>{
            $('.wrap-forms .bannerImgWithLeftTextComp img').click(function (){
                $('html, body').animate({
                    scrollTop: $(`${getbhsautoscrollAttr}`).offset().top - 60
                }, 1000);
            });
        }, 1000);
    }
});
/*added for campaign form click validation starts*/

    $(".enquire-form__step.enquire-form__step-1 input[name='ENQUIRE_EMAIL']").on("blur keydown", function () {
        $(".resubmit-err").remove();
    });
     $(".enquire-form__step.enquire-form__step-1 input[name='ENQUIRE_MOBILE']").on("blur keydown", function () {
            $(".resubmit-err").remove();
        });

        function checkIfUserHasSubmittedTheFormEarlierWithSameEmailId(val) {
            let returnFlag = false;
            $(".resubmit-err").remove();
            let campCookie = ccGlobal.helpers.getCookie("campaignFormSubmit");
            if (campCookie != null) {
                //alert("you already have filled the form");
                returnFlag = true;
                $("button.ctaText.enquireForm--step-1-submit.otpValidate").after("<div class='resubmit-err'>You have already filled the form</div>");
            }

            return returnFlag;
        }
/*added for campaign form click validation ends*/

function dropdownChange(dropDownValue){
    if($('#enquire-toko-location')!=undefined && $('#enquire-toko-location')!='' && dropDownValue != ''){
    let tokoNameDropdown = $('#enquire-toko-name').val()!=undefined ? $('#enquire-toko-name') : "";
        $.ajax({
              type : "POST",
              url  : '/apcolourcatalogue/tokoDetails' + '.dropDownFilter.json',
              data : {tokoLocation:dropDownValue},
              crossDomain : true,
              async: true,
              success: function(response){
                  if(response!="")
                      if(typeof response === 'string')
                          jsonData=$.parseJSON(response);
                      else
                          jsonData=response;

                  tokoNameDropdown.find('option:not(:first)').remove();
                  jsonData.TokoNames.forEach(function(tokoNameArray) {
                    tokoNameArray.forEach(function(tokoName){
                        var option = document.createElement("option");
                        option.value = tokoName;
                        option.text = tokoName;
                        tokoNameDropdown.append(option);
                    });
                  });
              },
              error:function(xhr){
                    tokoNameDropdown.innerHTML = '<option value="">Failed in retrieving values</option>';
              }
        });
    }
}

ccGlobalFunctionData.formSubmit = function(that) {
    ccGlobalFormData.parentFormElement = that;
    ccGlobalFormData.remarks = "";
    ccGlobalFormData.answer = "";
    ccGlobalFormData.authServiceAvailable = ccGlobalFormData.authServiceAvailable;
    ccGlobalFormData.resourcePath = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-resourcePath');
    var fullName = $(that).find('#enquire-name').val() != undefined ? $(that).find('#enquire-name').val() : '';
    if (fullName != '') {
        ccGlobalFormData.fName = fullName.substring(0, fullName.indexOf(" ")).trim();
        ccGlobalFormData.lName = fullName.substring(fullName.indexOf(" ") + 1).trim();
        if (ccGlobalFormData.fName == "" && ccGlobalFormData.lName != "") {
            ccGlobalFormData.fName = ccGlobalFormData.lName;
            ccGlobalFormData.lName = "";
        }
    }
    ccGlobalFormData.email = $(that).find('#enquire-email').val() != undefined ? $(that).find('#enquire-email').val() : '';
    ccGlobalFormData.mobileNo = $(that).find('#enquire-mobile').val() != undefined ? $(that).find('#enquire-mobile').val() : '';
    ccGlobalFormData.pinCode = $(that).find('#enquire-pincode').val() != undefined ? $(that).find('#enquire-pincode').val() : '';
    ccGlobalFormData.city = $(that).find('#enquire-city').val() != undefined ? $(that).find('#enquire-city').val() : '';
    ccGlobalFormData.bpNumber = $(that).find('#enquire-bpno').val() != undefined ? $(that).find('#enquire-bpno').val() : '';
    ccGlobalFormData.state = $(that).find('#enquire-state').val() != undefined ? $(that).find('#enquire-state').val() : '';

    //Adding warranty parameters
    ccGlobalFormData.name = $(that).find('#enquire-name').val() != undefined ? $(that).find('#enquire-name').val() : '';
    ccGlobalFormData.area = $(that).find('#enquire-area').val() != undefined ? $(that).find('#enquire-area').val() : '';
    ccGlobalFormData.projectAddress = $(that).find('#enquire-project-address').val() != undefined ? $(that).find('#enquire-project-address').val() : '';
    ccGlobalFormData.tokoName = $(that).find('#enquire-toko-name').val() != undefined ? $(that).find('#enquire-toko-name').val() : '';
    ccGlobalFormData.contractorName = $(that).find('#enquire-contractor-name').val() != undefined ? $(that).find('#enquire-contractor-name').val() : '';
    ccGlobalFormData.contractorMobileNo = $(that).find('#enquire-contractor-mobile').val() != undefined ? $(that).find('#enquire-contractor-mobile').val() : '';
    ccGlobalFormData.invoiceNo = $(that).find('#enquire-invoice-number').val() != undefined ? $(that).find('#enquire-invoice-number').val() : '';
    ccGlobalFormData.roomPainted = $(that).find('#enquire-room-painted').val() != undefined ? $(that).find('#enquire-room-painted').val() : '';
    ccGlobalFormData.completedDate = $(that).find('#enquire-completion-date').val() != undefined ? $(that).find('#enquire-completion-date').val() : '';
    ccGlobalFormData.startingDate = $(that).find('#enquire-start-painting-date').val() != undefined ? $(that).find('#enquire-start-painting-date').val() : '';
    ccGlobalFormData.endingDate = $(that).find('#enquire-end-painting-date').val() != undefined ? $(that).find('#enquire-end-painting-date').val() : '';
    ccGlobalFormData.productName = $(that).find('#enquire-product-name').val() != undefined ? $(that).find('#enquire-product-name').val() : '';
    ccGlobalFormData.feedbackOption = $(that).find('#enquire-feedback').val() != undefined ? $(that).find('#enquire-feedback').val() : '';
    ccGlobalFormData.tokoLocation = $(that).find('#enquire-toko-location-input').val() != undefined ? $(that).find('#enquire-toko-location-input').val() : '';
    ccGlobalFormData.noOfWallsNotGood = $(that).find('#walls-not-good').val() != undefined ? $(that).find('#walls-not-good').val() : '';

    if ($(that).find('#product-used').length > 0 ) {
        if ($(that).find('#product-used').hasClass('whatsAppCheckbox-checked')) {
            ccGlobalFormData.productUsed = 'yes';
        } else {
            ccGlobalFormData.productUsed = 'no';
        }
    } else {
        ccGlobalFormData.productUsed = '';
    }

    if ($(that).find('#dampness-present').length > 0 ) {
        if ($(that).find('#dampness-present').hasClass('whatsAppCheckbox-checked')) {
            ccGlobalFormData.dampnessPresent = 'yes';
        } else {
            ccGlobalFormData.dampnessPresent = 'no';
        }
    } else {
        ccGlobalFormData.dampnessPresent = '';
    }

    if ($(that).find('#interior-wall-crack').length > 0 ) {
        if ($(that).find('#interior-wall-crack').hasClass('whatsAppCheckbox-checked')) {
            ccGlobalFormData.interiorWallCrack = 'yes';
        } else {
            ccGlobalFormData.interiorWallCrack = 'no';
        }
    } else {
        ccGlobalFormData.interiorWallCrack = '';
    }

    if ($(that).find('#exterior-wall-crack').length > 0 ) {
        if ($(that).find('#exterior-wall-crack').hasClass('whatsAppCheckbox-checked')) {
            ccGlobalFormData.exteriorWallCrack = 'yes';
        } else {
            ccGlobalFormData.exteriorWallCrack = 'no';
        }
    } else {
        ccGlobalFormData.exteriorWallCrack = '';
    }

    if ($(that).find('#new-home-painting-project').length > 0 && $(that).find('#repainting-project').length > 0) {
        if ($(that).find('#new-home-painting-project').hasClass('whatsAppCheckbox-checked') && $(that).find('#repainting-project').hasClass('whatsAppCheckbox-checked')) {
            ccGlobalFormData.projectTypeInfinito = 'New Home Painting & Repainting';
        } else if ($(that).find('#new-home-painting-project').hasClass('whatsAppCheckbox-checked') || $(that).find('#repainting-project').hasClass('whatsAppCheckbox-checked') ) {
            if ($(that).find('#new-home-painting-project').hasClass('whatsAppCheckbox-checked')) {
            ccGlobalFormData.projectTypeInfinito = 'New Home Painting'; } else if($(that).find('#repainting-project').hasClass('whatsAppCheckbox-checked') ) {
            ccGlobalFormData.projectTypeInfinito = 'Repainting'; } else {
            console.log('Error in retrieving value of infinito project type ');}
        } else {
            ccGlobalFormData.projectTypeInfinito = '';
        }
    } else {
        ccGlobalFormData.projectTypeInfinito = '';
    }

    if($(that).find('#peeling-issue').length>0 || $(that).find('#flaking-issue').length>0 || $(that).find('#crack-issue').length>0 || $(that).find('#color-change-issue').length>0 || $(that).find('#bubble-issue').length>0 || $(that).find('#blister-issue').length>0) {
         if($(that).find('#peeling-issue').hasClass('whatsAppCheckbox-checked')) { wallIssueArrays.push('peeling');}
         if($(that).find('#flaking-issue').hasClass('whatsAppCheckbox-checked')) { wallIssueArrays.push('flaking');}
         if($(that).find('#crack-issue').hasClass('whatsAppCheckbox-checked')) { wallIssueArrays.push('crack');}
         if($(that).find('#color-change-issue').hasClass('whatsAppCheckbox-checked')) { wallIssueArrays.push('color-change');}
         if($(that).find('#bubble-issue').hasClass('whatsAppCheckbox-checked')) { wallIssueArrays.push('bubble');}
         if($(that).find('#blister-issue').hasClass('whatsAppCheckbox-checked')) { wallIssueArrays.push('blister');}
    } else { wallIssueArrays.push('');
    }
    ccGlobalFormData.wallIssue = wallIssueArrays.join(', ');

    //APG warranty form files validation only
    ccGlobalFormData.fileInputInvoice =  $(that).find('#InvoiceImages').length != 0 ? $(that).find('#InvoiceImages') : '';
    ccGlobalFormData.invoiceSelectedFiles = ccGlobalFormData.fileInputInvoice.length != 0 ? ccGlobalFormData.fileInputInvoice[0].files : '';
    ccGlobalFormData.fileInputApplication = $(that).find('#ApplicationImages').length != 0 ? $(that).find('#ApplicationImages') : '';
    ccGlobalFormData.applicationSelectedFiles = ccGlobalFormData.fileInputApplication.length != 0 ? ccGlobalFormData.fileInputApplication[0].files : '';
    ccGlobalFormData.date = $(that).find('#enquire-date').val() != undefined ? $(that).find('#enquire-date').val() : '';

    if($("#dummyName").val() && !$(that).find("#enquire-name").is(":visible")){
        ccGlobalFormData.fName = $("#dummyName").val();
        ccGlobalFormData.lName = "";
    }

    if($("#dummyMobile").val() && !$(that).find("#enquire-mobile").is(":visible")){
        ccGlobalFormData.mobileNo = $("#dummyMobile").val();
    }

    if($("#dummyEmail").val() && !$(that).find("#enquire-email").is(":visible")){
        var currentEmail = $("#dummyEmail").val() ? $("#dummyEmail").val() : ((ccGlobalFormData.mobileNo) + "na@asianpaints.com");
        ccGlobalFormData.email = currentEmail;
    }

    if($("#dummyPincode").val() && !$(that).find("#enquire-pincode").is(":visible")){
        ccGlobalFormData.pinCode = $("#dummyPincode").val() ? $("#dummyPincode").val() : "000000";
    }

    ccGlobalFormData.visitorId = ccGlobalFunctionData.getVisitorId();
    ccGlobalFormData.campaignId = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-campaignId');
    ccGlobalFormData.formAllSteps = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-allsteps');
    ccGlobalFormData.formStep2 = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-steptwo');
    ccGlobalFormData.formStep3 = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-stepthree');
    ccGlobalFormData.thankYouStep = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-thankyoustep');
    ccGlobalFormData.formVariant = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-variant');
    ccGlobalFormData.succussPageUrl = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-successpageurl');
    ccGlobalFormData.thankYouImage = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-thankyouimage");
    ccGlobalFormData.thankYouImageExt = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-thankyouimageext");
    ccGlobalFormData.thankYouImageTitle = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-thankyouimagetitle");
    ccGlobalFormData.thankYouImageAlt = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-thankyouimagealt");
    ccGlobalFormData.errorImage = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-errorimage");
    ccGlobalFormData.errorImageExt = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-errorimageext");
    ccGlobalFormData.errorImageTitle = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-errorimagetitle");
    ccGlobalFormData.errorImageAlt = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-errorimagealt");
    ccGlobalFormData.thankYouTitleTxt = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-thankyoutitle");
    ccGlobalFormData.errorTitleTxt = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-errortitle");
    ccGlobalFormData.thankYouDesc = decodeURIComponent(ccGlobalFunctionData.getFormAttributeData(that, "data-attr-thankyoudesc"));
    ccGlobalFormData.errorDesc = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-errordesc");
    ccGlobalFormData.thankYouSubmitText = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-thankyousubmittext");
    ccGlobalFormData.imageShadeEffect = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-imageshadeeffect");
    ccGlobalFormData.isRestricted = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-linkrestricted");
    ccGlobalFormData.pdfPath = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-pdfpath");
    ccGlobalFormData.defaultCampaignIdStatus = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-defaultcampaignidstatus");
    ccGlobalFormData.newThankYouVariant = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-newThankYouVariant");
    ccGlobalFormData.thankYouPopupHeading = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-thankYouPopupHeading");
    ccGlobalFormData.thankYouPopupErrorDescription = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-thankYouPopupErrorDescription");
    ccGlobalFormData.thankYouPopupSuccessDescription = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-thankYouPopupSuccessDescription");
    ccGlobalFormData.thankYouPopupSubHeading = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-thankYouPopupSubHeading");
    ccGlobalFormData.bookAVisitCTALabel = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-bookAVisitCTALabel");
    ccGlobalFormData.downloadPdfLink = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-thankYouDownloadPdfLink");
    ccGlobalFormData.thankYouImageMobile = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-thankYouImageMobile");
    ccGlobalFormData.thankYouImageDesktop = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-thankYouImageDesktop");
    ccGlobalFormData.enableCserviceBhs = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-enableCserviceBhs");
    ccGlobalFormData.bhsAutoAppointmentFlow = ccGlobalFunctionData.getFormAttributeData(that,"data-attr-bhsAutoAppointmentFlow");

    var slotStartingDate = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-slotsstartdate');
    ccGlobalFormData.startDate = slotStartingDate != '' ?
        ccGlobalFunctionData.getDate(slotStartingDate, 'fromDate') : ccGlobalFunctionData.getDate('5', 'fromDate');
    ccGlobalFormData.fromDate = ccGlobalFormData.startDate + ' 00:00:00';
    var slotEndingDate = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-slotsperiod');
    ccGlobalFormData.endDate = slotEndingDate != '' ?
        ccGlobalFunctionData.getDate(slotEndingDate, 'toDate') : ccGlobalFunctionData.getDate('5', 'toDate');
    ccGlobalFormData.toDate = ccGlobalFormData.endDate + ' 00:00:00';
    //ccGlobalFormData.bpNumber = 'bpno_' + Date.now();
    ccGlobalFormData.pageUrl = window.location.href;
    var slotsServiceGroup = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-servicegroup');
    ccGlobalFormData.serviceGroup = slotsServiceGroup != '' ? slotsServiceGroup : 'APHS';
    var slotServiceCode = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-servicecode');
    let selectedRadioCustomerResponseOne = $(that).find('input[name="CUSTOM_RADIO_customer_response_one"]:checked');
    let selectedRadioCustomerResponseTwo = $(that).find('input[name="CUSTOM_RADIO_customer_response_two"]:checked');
    let selectedCheckboxCustomerResponseOne = $(that).find('input[name="CUSTOM_CHECKBOX_customer_response_one"]').siblings('.whatsAppCheckbox-checked').length;
    let selectedCheckboxCustomerResponseTwo = $(that).find('input[name="CUSTOM_CHECKBOX_customer_response_two"]').siblings('.whatsAppCheckbox-checked').length;
    let mwsQuestionCustomerResponseOne = $('.mws-questions input[name="CUSTOM_RADIO_customer_response_one"]:checked');
    ccGlobalFormData.enableFileUpload = "true" === ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-enableFileUploadFeature');

        if (selectedRadioCustomerResponseOne.length > 0 || mwsQuestionCustomerResponseOne.length > 0) {
            ccGlobalFormData.remarks =  selectedRadioCustomerResponseOne.length > 0 ? selectedRadioCustomerResponseOne.val() : mwsQuestionCustomerResponseOne.val();
        }
        if (selectedRadioCustomerResponseTwo.length > 0) {
            ccGlobalFormData.answer = selectedRadioCustomerResponseTwo.val();
        }
        if (selectedCheckboxCustomerResponseOne > 0) {
            ccGlobalFormData.remarks =  'Yes';
        }
        if (selectedCheckboxCustomerResponseTwo > 0) {
            ccGlobalFormData.answer = 'Yes';
        }
        if($(that).find('.disclaimer-ques-one').length == 0){
            ccGlobalFormData.remarks = "";
        }
        else{
            if(ccGlobalFormData.remarks != "Yes"){
                ccGlobalFormData.remarks = "No";
            }
        }
        if($(that).find('.disclaimer-ques-two').length == 0){
            ccGlobalFormData.answer = "";
        }
        else{
            if(ccGlobalFormData.answer != "Yes"){
                ccGlobalFormData.answer = "No";
            }
        }
    ccGlobalFormData.isLeadNonBHS = true;
   ccGlobalFormData.serviceCode = slotServiceCode != '' ? slotServiceCode : 'RHS';
    if ($(that).find('.whatsAppConsentFormFld').length > 0) {
        if($(that).children('.form-group-global__enquire-form--elements-submit-wrap').find('.whatsAppConsentFormFld .on-off').length > 0) {
            if($(that).children('.form-group-global__enquire-form--elements-submit-wrap').find('.whatsAppConsentFormFld .on-off').text() === "ON"){
                ccGlobalFormData.whatsAppConsent = 'Y';
            } else {
                ccGlobalFormData.whatsAppConsent = 'N';
            }
        } else {
            if ($(that).find('.whatsAppConsentFormFld').hasClass('whatsAppCheckbox-checked')) {
                ccGlobalFormData.whatsAppConsent = 'Y';
            } else {
                ccGlobalFormData.whatsAppConsent = 'N';
            }
        }
    } else {
        ccGlobalFormData.whatsAppConsent = '';
    }
    ccGlobalFormData.whatsAppTempId = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-whatsapptempid');

    ccGlobalFormData.thankYouImageRedirectionURL = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-thankyouimageredirectionpath');

    ccGlobalFormData.thankYouImageRedirectionURL = ccGlobalFormData.thankYouImageRedirectionURL != '' ? ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-thankyouimageredirectionpath') + ' target=' + ccGlobalFunctionData.getFormAttributeData(that,'data-attr-thankyouimageredirectiontarget') : 'javascript:void(0)';

    templateName = ccGlobalFunctionData.getFormAttributeData(that, "data-attr-templateName");
    if (templateName) {
        let formattedTemplateName = templateName.split("/");
        templateName = formattedTemplateName[formattedTemplateName.length - 1];
    }
    //BHS consent fields
    if(that!=='bhsConsent'){
        bhsConsentData.serviceName = ccGlobalFormData.serviceName;
        bhsConsentData.bhsFname = ccGlobalFormData.fName;
        bhsConsentData.bhsLname = ccGlobalFormData.lName;
        bhsConsentData.bhsEmail = ccGlobalFormData.email;
        bhsConsentData.bhsMobileNo = ccGlobalFormData.mobileNo;
        bhsConsentData.bhsPinCode = ccGlobalFormData.pinCode;
    }
    if(that==='bhsConsent'){
        ccGlobalFormData.fName = bhsConsentData.bhsFname;
        ccGlobalFormData.lName = bhsConsentData.bhsLname;
        ccGlobalFormData.email = bhsConsentData.bhsEmail;
        ccGlobalFormData.mobileNo = bhsConsentData.bhsMobileNo;
        ccGlobalFormData.pinCode = bhsConsentData.bhsPinCode;
        ccGlobalFormData.campaignId = bhsConsentData.bhsCampaignId;
        ccGlobalFormData.campaignName = bhsConsentData.bhsCampaignName;
        ccGlobalFormData.serviceName = bhsConsentData.serviceName;
        ccGlobalFormData.whatsAppConsent = 'N';
        ccGlobalFormData.pageUrl = window.location.href + "#BHS";
    }

    if ($(".merawalashadepage").length > 0 && localStorage.getItem('loginStatus')) {
         let userProperties = localStorage.getItem('loginStatus');
         let pincodeProperties = localStorage.getItem('pincode');
         if(userProperties && pincodeProperties){
            let parsedUserPropertes = JSON.parse(userProperties);
            let parsedPincodeProperties = JSON.parse(pincodeProperties)
            if(parsedUserPropertes && parsedPincodeProperties){
              ccGlobalFormData.fName = parsedUserPropertes['firstName'];
              ccGlobalFormData.lname = parsedUserPropertes['lastName'];
              ccGlobalFormData.email = parsedUserPropertes['userId'];
              ccGlobalFormData.mobileNo = parsedUserPropertes['mobileNumber'];
              ccGlobalFormData.pinCode = parsedPincodeProperties;
            }
         }
         if ($('.merawalashadesformvariant').length > 0) {
            ccGlobalFormData.campaignId = $('.merawalashadesformvariant').attr('data-campaignIdMws');
         }
    }
    ccGlobalFunctionData.getCookieId($(that));
    ccGlobalFunctionData.setFormFieldsToCookie($(that));
    if ($(that).find('button').hasClass('otpValidate')) {
    var pathname = window.location.pathname;
    if(pathname == "/campaign/apmailer/referap.html")
    {
    let resubmissionFlag = checkIfUserHasSubmittedTheFormEarlierWithSameEmailId(ccGlobal.helpers.getCookie("campaignFormSubmit"));
        // Call OTP API only if the user has not submitted the form earlier with the same email ID
        if(!resubmissionFlag){
            modalHandler.showModal(otpModal);
            ccGlobalFunctionData.generateOTP($(that));
            ccGlobalFormData.currentItem = $(that);
        }
    }
    else
    {
        modalHandler.showModal(otpModal);
        ccGlobalFunctionData.generateOTP($(that));
        ccGlobalFormData.currentItem = $(that);
    }

    } else if ($(that).find('button').hasClass('apgwarranty') && ccGlobalFormData.invoiceSelectedFiles != 0 && ccGlobalFormData.applicationSelectedFiles != 0) {
        $(".enquireForm--step-1-submit").attr('disabled','disabled');
        ccGlobalFunctionData.handleApgFiles($(that));
    }
    else {
        $(".enquireForm--step-1-submit").attr('disabled','disabled');
        ccGlobalFunctionData.saveLeadsToDB($(that));
    }
    if (ccAnalytics.digitalData()) {
        var currentPageUrl = window.location.href;
        var previousPageUrl = document.referrer;
        digitalData.formEvents = {
            "name" : $(that).parents('.form-attributes').find('#enquire-name').val() != undefined ? $(that).parents('.form-attributes').find('#enquire-name').val() : '',
            "emailId" : $(that).parents('.form-attributes').find('#enquire-email').val() != undefined ? $(that).parents('.form-attributes').find('#enquire-email').val() : '',
            "mobileNumber" : $(that).parents('.form-attributes').find('#enquire-mobile').val() != undefined ? $(that).parents('.form-attributes').find('#enquire-mobile').val() : '',
            "pincode" : $(that).parents('.form-attributes').find('#enquire-pincode').val() != undefined ? $(that).parents('.form-attributes').find('#enquire-pincode').val() : ''
        },
        digitalData.page = {
             "destinationURL"  : currentPageUrl,
             "previousPageUrl" : previousPageUrl
        }
    }
}

ccGlobalFunctionData.handleApgFiles = function(that){

    $(that).find(".rotating.js-rotatingLeadForm").removeClass("d-none");
    ccGlobalFormData.formData = new FormData();
    for (let i = 0; i < ccGlobalFormData.invoiceSelectedFiles.length; i++) {
        ccGlobalFormData.formData.append("invoiceFiles[]", ccGlobalFormData.invoiceSelectedFiles[i]);
    }

    for (let i = 0; i < ccGlobalFormData.applicationSelectedFiles.length; i++) {
        ccGlobalFormData.formData.append("ApplicationFiles[]", ccGlobalFormData.applicationSelectedFiles[i]);
    }

    $.ajax({
      type : "POST",
      url  : '/apcolourcatalogue/ccforms' + '.apgFileUpload.json',
      data: ccGlobalFormData.formData,
      contentType: false,
      processData: false,
      crossDomain : true,
      async: true,
      success: function(response){
          if(response!=""){
              if(typeof response === 'string')
                  jsonData=$.parseJSON(response);
              else
                  jsonData=response;
              if(jsonData['ApplicationFiles[]'] != undefined && jsonData['invoiceFiles[]'] != undefined){
                ccGlobalFormData.applicationSelectedFilesURL = response['ApplicationFiles[]'];
                ccGlobalFormData.invoiceSelectedFilesURL = response['invoiceFiles[]'];
                ccGlobalFunctionData.saveWarrantyRegistrationToDB($(that));
              }
          }
    },
  error:function(xhr){
       if($(that).closest(".formVerticalVariantContainer").length>0){
          $(that).closest(".formVerticalVariantContainer").css("display","none");
          $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").css("display","block");
          $(that).closest(".formVerticalVariant").find(".error-image-path.error-image-left").css("display","block");
          $(that).closest(".formVerticalVariant").find(".error-message").css("display","block");
          $(that).closest(".formVerticalVariant").find(".thank-you-image-path.thank-you-image-left").css("display", "none");
          $(that).closest(".formVerticalVariant").find(".thank-you-message").css("display", "none");
      }
  }
});

}

//Insert warranty form data
ccGlobalFunctionData.saveWarrantyRegistrationToDB = function(that){

    let nodeVal = $('.form-attributes').attr('data-attr-resourcePath');

    let nameVal = ccGlobalFormData.name;
    let mobileNoVal = ccGlobalFormData.mobileNo;
    let emailVal = ccGlobalFormData.email;
    let projectAddressVal = ccGlobalFormData.projectAddress;
    let contractorNameVal = ccGlobalFormData.contractorName;
    let contractorMobileNoVal = ccGlobalFormData.contractorMobileNo;
    let invoiceNoVal = ccGlobalFormData.invoiceNo;
    let areaVal = ccGlobalFormData.area;
    let roomPaintedVal = ccGlobalFormData.roomPainted;
    let completedDateVal = ccGlobalFormData.completedDate;
    let startingDateVal = ccGlobalFormData.startingDate;
    let endingDateVal = ccGlobalFormData.endingDate;
    let productNameVal = ccGlobalFormData.productName;
    let productUsedVal = ccGlobalFormData.productUsed;
    let dampnessPresentVal = ccGlobalFormData.dampnessPresent;
    let exteriorWallCrackVal = ccGlobalFormData.exteriorWallCrack;
    let interiorWallCrackVal = ccGlobalFormData.interiorWallCrack;
    let projectTypeInfinitoVal = ccGlobalFormData.projectTypeInfinito;
    let feedbackOptionVal = ccGlobalFormData.feedbackOption;
    let tokoLocationVal = ccGlobalFormData.tokoLocation;
    let tokoNameVal = ccGlobalFormData.tokoName;
    let applicationSelectedFilesURL = ccGlobalFormData.applicationSelectedFilesURL;
    let invoiceSelectedFilesURL = ccGlobalFormData.invoiceSelectedFilesURL;
    let noOfWallsNotGoodVal =  ccGlobalFormData.noOfWallsNotGood;
    let wallIssueVal = ccGlobalFormData.wallIssue;

    $.ajax({
      type : "POST",
      url  : '/apcolourcatalogue/ccforms' + '.saveWarrantyFormToDb.json',
      data: {
          name: nameVal,
          email: emailVal,
          mobileNo: mobileNoVal,
          projectAddress: projectAddressVal,
          contractorName: contractorNameVal,
          contractorMobileNo: contractorMobileNoVal,
          invoiceNo: invoiceNoVal,
          area: areaVal,
          roomPainted: roomPaintedVal,
          completedDate: completedDateVal,
          startingDate: startingDateVal,
          endingDate: endingDateVal,
          productName: productNameVal,
          productUsed: productUsedVal,
          dampnessPresent: dampnessPresentVal,
          exteriorWallCrack: exteriorWallCrackVal,
          interiorWallCrack: interiorWallCrackVal,
          projectTypeInfinito: projectTypeInfinitoVal,
          tokoLocation: tokoLocationVal,
          tokoName: tokoNameVal,
          feedbackOption: feedbackOptionVal,
          applicationSelectedFilesURL : applicationSelectedFilesURL,
          invoiceSelectedFilesURL : invoiceSelectedFilesURL,
          node : nodeVal,
          noOfWallsNotGood : noOfWallsNotGoodVal,
          wallIssue : wallIssueVal
      },
      success: function(data){
          if(data != null && data.status != "FAILURE") {
              exitPopupStatus = false;
              isCcFormSubmit=true;
              if($(that).closest('.formVerticalVariantContainer').length > 0){
                  $(that).closest(".formVerticalVariantContainer").css("display","none");
                  $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").css("display","block");
                  $(".enquireForm--step-1-submit").removeAttr('disabled');
              }
          } else {
               if($(that).closest(".formVerticalVariantContainer").length>0){
                  $(that).closest(".formVerticalVariantContainer").css("display","none");
                  $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").css("display","block");
                  $(that).closest(".formVerticalVariant").find(".error-image-path.error-image-left").css("display","block");
                  $(that).closest(".formVerticalVariant").find(".error-message").css("display","block");
                  $(that).closest(".formVerticalVariant").find(".thank-you-image-path.thank-you-image-left").css("display", "none");
                  $(that).closest(".formVerticalVariant").find(".thank-you-message").css("display", "none");
                  $(".enquireForm--step-1-submit").removeAttr('disabled');
              }
          }
    },
    error:function(){

          if($(that).closest(".formVerticalVariantContainer").length>0){
            $(that).closest(".formVerticalVariantContainer").css("display","none");
            $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").css("display","block");
            $(that).closest(".formVerticalVariant").find(".error-image-path.error-image-left").css("display","block");
            $(that).closest(".formVerticalVariant").find(".error-message").css("display","block");
            $(that).closest(".formVerticalVariant").find(".thank-you-image-path.thank-you-image-left").css("display", "none");
            $(that).closest(".formVerticalVariant").find(".thank-you-message").css("display", "none");
            $(".enquireForm--step-1-submit").removeAttr('disabled');
          }
    }
});

            $(".rotating.js-rotatingLeadForm").addClass("d-none");

}


ccGlobalFunctionData.getVisitorId = function() {
    if (typeof(_satellite) !== "undefined") {
        ccGlobalFormData.visitorId = _satellite.getVisitorId().getMarketingCloudVisitorID();
    }
    return ccGlobalFormData.visitorId;
}

/*function fullWidthThankYouGifMarkupOld() {
    let redirect = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifRedirect') || "";
    let desktopVideo = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpSingleGifDesktop') || "";
    let mobileVideo = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpSingleGifMobile') || "";
    let newTab = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifRedirectNewTab') || "";

    let htmlStructure =
        `<div class="thank-you-popup-fullImageGif">
            <a href=${redirect} target="${newTab ? '_blank' : '_self'}">
                <video playsinline autoplay muted src="${desktopVideo}" class="thank-vid-desk" aria-label="thank-you"> </video>
                <video playsinline autoplay muted src="${mobileVideo}" class="thank-vid-mob" aria-label="thank-you"></video>
            </a>
        <div>`;
    return htmlStructure;
}*/
/*New Rewamp Thank you popup */
function fullWidthThankYouGifMarkup(newGifTyPopupAllowed) {
    var htmlStructure = '';
    if (newGifTyPopupAllowed) {
        let newDesktopVideo = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifDesktopInterestedCta') || "";
        let newMobileVideo = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifMobileInterestedCta') || "";
        let newRedirect = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifExploreNowRedirect') || "";
        let newTyTab = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifExploreNowRedirectNewTab') || "";
        htmlStructure =
            `<div class="thank-you-popup-fullImageGif thank-you-popup-fullImageGifRewamp trackExploreNow">
                    <video playsinline autoplay muted src="${newDesktopVideo}" class="thank-vid-desk" aria-label="thank-you"> </video>
                    <video playsinline autoplay muted src="${newMobileVideo}" class="thank-vid-mob" aria-label="thank-you"></video>
                    <a class="explore-now-rewamp" href = "${newRedirect}" target="${newTyTab ? '_blank' : '_self'}">Explore Now</a>
                    <a class="interestHandler trackInterestHandler" href= "javascript:void(0)" onclick="interestHandler(event, this)">Yes , I'm Interested</a>
            </div>`;
    } else {
        let redirect = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifRedirect') || "";
        let desktopVideo = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpSingleGifDesktop') || "";
        let mobileVideo = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpSingleGifMobile') || "";
        let newTab = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifRedirectNewTab') || "";

        htmlStructure =
            `<div class="thank-you-popup-fullImageGif track-thank-you-popup-single-gif">
                <a href=${redirect} target="${newTab ? '_blank' : '_self'}">
                    <video playsinline autoplay muted src="${desktopVideo}" class="thank-vid-desk" aria-label="thank-you"> </video>
                    <video playsinline autoplay muted src="${mobileVideo}" class="thank-vid-mob" aria-label="thank-you"></video>
                </a>
            <div>`;

    }
    return htmlStructure;
}

function interestHandler(e, el) {

 // 1) Safety: prevent default & event bubbling
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

 // 2) Get jQuery objects
  const $cta = $(el);

 // Prevent double-click/double-submit on the same instance
//   if ($cta.data('clicked')) return;
//   $cta.data('clicked', true);

  const $widget = $cta.closest('.thank-you-popup-fullImageGifRewamp');


 if ($widget.length === 0) {
    console.warn('interestHandler: Could not find widget container.');
    return;
  }

    console.log("Interest Button Handler");
    let bhsInterestedCampaignId = $('.ccforms .form-attributes').attr('data-attr-bhsInterestedCampaignId') || "";
    //let mobileVideo = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifMobileInterestedCta') || "";
    let bhsInterestedCampaignName = bhsInterestedCampaignId;

    ccGlobalFunctionData.saveYesInterestedBhsLeadsToDB(bhsInterestedCampaignId);

    let formName = $('.ccforms .form-attributes').attr('data-attr-formTitle') || "";
    trackInterestCTA(bhsInterestedCampaignId, formName);

    let desktopImg = $('.ccforms .form-attributes').attr('data-attr-thankyouSuccessDesktopImage') || "";
    let mobileImg = $('.ccforms .form-attributes').attr('data-attr-thankyouSuccessMobileImage') || "";
    let redirect = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifExploreNowRedirect') || "";
    let newTab = $('.ccforms .form-attributes').attr('data-attr-thankYouPopUpGifExploreNowRedirectNewTab') || "";
    let htmlStructure = `<div class ="thank-you-pop-two">
                        <img class = "thank-img-desk" src = "${desktopImg}" loading="eager" fetchpriority="high" style="width: 100%; height: auto;"" alt="Default image" >
                        <img class = "thank-img-mob" src = "${mobileImg}" loading="eager" fetchpriority="high" style="width: 100%; height: auto;"" alt="Default image" >
                    <a class="explore-now-rewamp" href = "${redirect}" target="${newTab ? '_blank' : '_self'}">Explore Now</a>
                    </div>`

              $widget.after(htmlStructure).hide();
    // $('.thank-you-popup-fullImageGifRewamp').after(htmlStructure).hide(); // adds htmlStructure right after the element .hide();


}

ccGlobalFunctionData.saveLeadsToDB = function(that) {
    // $(".rotating.js-rotatingLeadForm").removeClass("d-none");
    $(that).find(".rotating.js-rotatingLeadForm").removeClass("d-none");
    let aesUtil = new AesUtil(128, 1000);
    let nodeVal = ccGlobalFormData.resourcePath;
    let pagePath = ccGlobalFormData.pageUrl;
    let landMarkVal = ccGlobalFormData.landMark;
    let thirdAddressVal = ccGlobalFormData.thirdAddress;
    let buildingNameVal = ccGlobalFormData.buildingName;
    let houseNoVal = ccGlobalFormData.houseNo;
    let organizationNameVal = ccGlobalFormData.organizationName;
    let segmentVal = ccGlobalFormData.segment;
    let streetVal = ccGlobalFormData.street;
    let designationVal = ccGlobalFormData.designation;
    let secondAddressVal = ccGlobalFormData.secondAddress;
    let stateVal = ccGlobalFormData.state;
    let remarksVal = ccGlobalFormData.remarks;
    let projectTypeVal = ccGlobalFormData.projectType;
    let lNameVal = ccGlobalFormData.lName;
    let cityVal = ccGlobalFormData.city;
    let bpNumberVal = ccGlobalFormData.bpNumber;
    let phoneNoVal = ccGlobalFormData.phoneNo;
    let pinCodeVal = ccGlobalFormData.pinCode;
    let emailVal = ccGlobalFormData.email;
    let firstAddressVal = ccGlobalFormData.firstAddress;
    let floorNoVal = ccGlobalFormData.floorNo;
    let salutationsVal = ccGlobalFormData.salutations;
    let mobileNoVal = ccGlobalFormData.mobileNo;
    let fNameVal = ccGlobalFormData.fName;
    let skuChosenVal = ccGlobalFormData.skuChosen;
    let measurementNeededVal = ccGlobalFormData.measurementNeeded;
    let dealerNameVal = ccGlobalFormData.dealerName;
    let dealerCodeVal = ccGlobalFormData.dealerCode;
    let answerVal = ccGlobalFormData.answer;
    let sampleFinishVal = ccGlobalFormData.sampleFinish;
    let datePickerVal = ccGlobalFormData.datePicker;
    let customFieldVal = ccGlobalFormData.customField;
    let visitorIdVal = ccGlobalFormData.visitorId;
    let descriptionVal = ccGlobalFormData.description;
    let whatsAppConsentVal = ccGlobalFormData.whatsAppConsent;
    let dateVal = ccGlobalFormData.date;
    let urlParams = new URLSearchParams(window.location.search);
    let source = urlParams.get("utm_source");
    let medium = urlParams.get("utm_medium");
    let utmContent = urlParams.get("utm_content");
    let utmId = urlParams.get("utm_id");
    let campaignId = urlParams.get("utm_campaign") !== null ? urlParams.get("utm_campaign") : ccGlobalFormData.campaignId;
    if (campaignId) {
        campaignId = campaignId.trim();
    }
    ccGlobalFormData.campaignIdFinal = campaignId ;
    let campaignName = urlParams.get("utm_campaign") !== null ? urlParams.get("utm_campaign") : ccGlobalFormData.campaignId;
    if (campaignName) {
        campaignName = campaignName.trim();
    }
    let utmAdgroupName = urlParams.get("UTM_Adgroup_Name") !== null ? urlParams.get("UTM_Adgroup_Name") : "";
    let utmKeyword = urlParams.get("UTM_Keyword") !== null ? urlParams.get("UTM_Keyword") : "";
    let utmKeywordMatchType = urlParams.get("UTM_Keyword_match_type") !== null ? urlParams.get("UTM_Keyword_match_type") : "";
    let utmCampaignSource = urlParams.get("UTM_Campaign_Source") !== null ? urlParams.get("UTM_Campaign_Source") : "";
    let marketingChannelDetails = getMarketingChannelDetails();
    let cServiceVal = "";
        if (ccGlobalFormData.enableCserviceBhs == "true"){
            cServiceVal = "BHS";
        }

    let imageUrlVal = "";
    if(source) {
        ccGlobalFormData.source = source;
    }
    if(medium) {
        ccGlobalFormData.medium = medium;
    }
    if(utmContent){
        ccGlobalFormData.utmContent = utmContent;
    }
    if(utmId){
        ccGlobalFormData.utmId = utmId;
    }
    let sourceVal = ccGlobalFormData.source;
    let mediumVal = ccGlobalFormData.medium;
    let utmContentVal = ccGlobalFormData.utmContent;
    let utmIdVal = ccGlobalFormData.utmId;
    if (ccGlobalFormData.formVariant == "campaignPageForm") {
        ccGlobalFunctionData.errorPagePopUp(that);
    } else {
        ccGlobalFunctionData.thankYouStepRender(that);
    }
    if (ccGlobalFormData.formVariant == "corporatePageForm" || ccGlobalFormData.formVariant == "corporateVerticalForm") {
         ccGlobalFormData.firstAddress = $(that).find('#enquire-address-1').val() != undefined ? $(that).find('#enquire-address-1').val() : '';
         firstAddressVal = ccGlobalFormData.firstAddress;
         if(ccGlobalFormData.imageUrl){
            imageUrlVal = ccGlobalFormData.imageUrl;
         }
    }
    // This implementation is for new file upload variant for campaign form - starts here
    let isFileUploadFlowVal = "No";
    let textEntryVal = "";
    let fileUploadUrlVal = "";
    if ($(".form-file-upload").length || $(".form-file-upload-gamification").length) {
        if ($(".form-file-upload").length) {
            textEntryVal = $("#comment-textarea").val();
            if ($(".campaign-form-address").length) {
                isFileUploadFlowVal = "CampAddres";
                ccGlobalFormData.textEntry = textEntryVal;
            } else {
                isFileUploadFlowVal = "Yes";
            }
        } else {
            let elements = $(that).find(".mcq-detail .selected");
            elements.each(function(index) {
                textEntryVal += "Q" + (index + 1) + ":" + $(this).find("input").attr("value");
                if (index !== elements.length - 1) {
                 textEntryVal += " | ";
                }
                ccGlobalFormData.textEntry = textEntryVal;
            });
            isFileUploadFlowVal = "LuckyDraw";
        }
        fileUploadUrlVal = ccGlobalFormData.imageUrl;
    }
    // This implementation is for new file upload variant for campaign form - ends here

    // Encrypting mandatory user input fields - name, email, mobile, pincode

    // To handle encryption method for Egypt Arabic
    if (document.documentElement.lang != 'ar'){
        fNameVal = aesUtil.ltyEncrypt(fNameVal);
        lNameVal = aesUtil.ltyEncrypt(lNameVal);
    }
    emailVal = aesUtil.ltyEncrypt(emailVal);
    mobileNoVal = aesUtil.ltyEncrypt(mobileNoVal);
    pinCodeVal = aesUtil.ltyEncrypt(pinCodeVal);

    let skipSalesForceApi = $(".file-form-container").attr("data-attr-removeFileUpload"); // Used in form-with-file-upload variant without file upload
    let skipSalesForceApiForAllVariants = $('.ccforms .form-attributes').attr('data-attr-disableSalesforceCall');

    $.ajax({
        type: "POST",
        url: '/apcolourcatalogue/ccforms' + '.saveleadform.json',
        data: {
            pageUrl: pagePath,
            node: nodeVal,
            landMark: landMarkVal,
            thirdAddress: thirdAddressVal,
            buildingName: buildingNameVal,
            houseNo: houseNoVal,
            organizationName: organizationNameVal,
            segment: segmentVal,
            street: streetVal,
            designation: designationVal,
            secondAddress: secondAddressVal,
            state: stateVal,
            remarks: remarksVal,
            projectType: projectTypeVal,
            lName: lNameVal,
            city: cityVal,
            phoneNo: phoneNoVal,
            pinCode: pinCodeVal,
            email: emailVal,
            firstAddress: firstAddressVal,
            floorNo: floorNoVal,
            salutations: salutationsVal,
            mobileNo: mobileNoVal,
            fName: fNameVal,
            skuChosen: skuChosenVal,
            measurementNeeded: measurementNeededVal,
            dealerName: dealerNameVal,
            dealerCode: dealerCodeVal,
            answer: answerVal,
            sampleFinish: sampleFinishVal,
            datePicker: datePickerVal,
            customField: customFieldVal,
            visitorId: visitorIdVal,
            description: descriptionVal,
            whatsAppConsent: whatsAppConsentVal,
            date:dateVal,
            source:sourceVal,
            medium:mediumVal,
            utmContent: utmContentVal,
            utmId:utmIdVal,
            campaignId: campaignId,
            imageUrl:imageUrlVal,
            referrerId:marketingChannelDetails.referrerId,
            marketingChannel:marketingChannelDetails.marketingChannel,
            isFileUploadFlow:isFileUploadFlowVal,
            textEntry:textEntryVal,
            fileUploadUrl:fileUploadUrlVal,
            bpNumber : bpNumberVal
        },
        success: function(result) {
             //logic to set session storage value on submit of exitIntentPopup
                if (($(that).attr('id') === 'exitPopup-form')&& (result.Status == "SUCCESS")) {
                    if (!sessionStorage.getItem("exitPopupForm")) {
                        sessionStorage.setItem("exitPopupForm", true);

                        // Handle two-column download logic
                        const storedCard = sessionStorage.getItem("twocoldownload");

                        if (storedCard === "card1") {
                            $(".twocolumndownload .card1 .download-pdf-button.enable-exitIntent a").each(function() {
                                $(this).closest(".download-pdf-button").removeClass("enable-exitIntent");
                                this.click();
                            });
                        } else if (storedCard === "card2") {
                            $(".twocolumndownload .card2 .download-pdf-button.enable-exitIntent a").each(function() {
                                $(this).closest(".download-pdf-button").removeClass("enable-exitIntent");
                                this.click();
                            });
                        }

                        const storedVariant = sessionStorage.getItem("multiCarousalDownload");

                        if (storedVariant) {
                            $(`.multiCarousalComponent .${storedVariant} .download-btn.enable-exitIntent a`).each(function() {
                                $(this).closest(".download-btn").removeClass("enable-exitIntent");
                                this.click();
                            });
                            sessionStorage.removeItem("multiCarousalDownload");
                        }
                    }
                }
            if (ccGlobalFormData.bhsAutoAppointmentFlow !== "true") {
                /*Adding Custom Logic to Store Form Submit details on Website for Exit Pop up new Rule Implementation*/
                let formType = $('#exitPopupmodal').attr('data-attr-formType');
                if (formType === 'bhs_form') {
                    var spsFormSubmitDetail = {"formSubmitted": true, "exitPop_Up_Closed": false};
                    /*sessionStorage.setItem("bhsFormSubmission", JSON.stringify(spsFormSubmitDetail));*/
                    document.cookie = "bhsFormSubmission=" + JSON.stringify(spsFormSubmitDetail) + ";path=/;expires=" + cookieExpire.toGMTString();
                } else {
                    var bhsFormSubmitDetail = {"formSubmitted": true, "exitPop_Up_Closed": false}
                    /*sessionStorage.setItem("spsFormSubmission", JSON.stringify(bhsFormSubmitDetail));*/
                    document.cookie = "spsFormSubmission=" + JSON.stringify(bhsFormSubmitDetail) + ";path=/;expires=" + cookieExpire.toGMTString();
                }
                /*End of Custom Logic to Store Form Submit details on Website for Exit Pop up new Rule Implementation*/
                exitPopupStatus = false;
                    if (result.Status == "SUCCESS") {
                        dbFlag = true;
                        isCcFormSubmit=true;

                        // === CVV: show Thank You only on SUCCESS (desktop + mobile) ===
                        try {
                          var $scope     = $(that);
                          var $container = $scope.closest(".form-attributes");

                          if ($container.length && $container.find(".campaignVerticalVariant").length) {
                            // 1) Hide just this form instance (both columns)
                            $container.find(".campaignVerticalVariant").hide();

                            // 2) Make sure error is hidden
                            $container.find(".cvv-error-screen").addClass("is-hidden").hide();

                            // 3) Reveal Thank You (remove the guard AND show)
                            $container.find(".cvv-thankyou-screen")
                              .removeClass("is-hidden")
                              .show();
                          }
                        } catch (e) {
                          console.log("[CVV] success TY switch error:", e);
                        }

                        if($('.visualizerPDFButton').length > 0 ){
                            isFormFilled = true;
                            isButtonClicked = true;
                            getProductDetailsFromConfig();
                        }
                        if ($(that).closest('.formVerticalVariantContainer').length > 0) {
                            $(that).closest(".formVerticalVariantContainer").css("display", "none");
                            if (fullImageGifThankYou) { //formVerticalVariant variant in main page
                                let $revampContainer = $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container");
                                if($revampContainer.find('.thank-you-popup-fullImageGif').length === 0){
                                     thankYouStepMarkUp = fullWidthThankYouGifMarkup(newGifThankYou);
                                    // $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find(".form-revamp-thankyou .no-gutters").remove();
                                    $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find(".form-revamp-thankyou .no-gutters").after(thankYouStepMarkUp);

                            const vid = matchMedia('(max-width: 575px)').matches ? $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find('.thank-vid-mob') : $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find('.thank-vid-desk');
                            console.log(vid , "1")

                                    $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").css("display", "block");
                                    $(that).closest(".formVerticalVariant").find('.no-gutters.old-ty').css('display', 'none');
                                }else{
                                    $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").css("display", "block");
                                }
                               
                            } else {
                                $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").css("display", "block");
                            }
                        }
                        // variant for enquire-form--enquire-sticky-variant
                        if ($(that).closest('.enquire-form--enquire-sticky-variant').length > 0) {
                            if (fullImageGifThankYou) {
                                thankYouStepMarkUp = fullWidthThankYouGifMarkup(newGifThankYou);
                                /* hide old thank-you pop-up for fileupload and new-banner-form-varient variant */
                                $(that).closest(".enquire-form--enquire-sticky-variant").find(".new-ty-parent-container .row.no-gutters").css("display", "none");
                                // setTimeout(function () {
                                    $(that).closest(".enquire-form--enquire-sticky-variant").find(".enquire-form__step-4").find(".custom-enquire-form-mark-up  .enquire-form__dismissible-content").append(thankYouStepMarkUp);
                                     const vid = matchMedia('(max-width: 575px)').matches ? $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find('.thank-vid-mob') : $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find('.thank-vid-desk');
                                    $(that).closest(".enquire-form--enquire-sticky-variant").find(".enquire-form__step-4").css("display", "block");
                                // }, 100)
                            }
                        }



                        furnitureLeadForm = $('#globalFormPopUp:visible').length>0 ? '<div class="col-lg-12 col-12">' : '<div class="col-lg-6 col-12">';
                        $("#globalFormPopUp:visible").length > 0 ? $(".enquire-form__step-4--content").css("padding","0px") : '';
                        if (ccGlobalFormData.formVariant == "corporatePageForm" || ccGlobalFormData.formVariant == "corporateVerticalForm") {
                            //ccGlobalFunctionData.sendmessage(ccGlobalFormData.serviceName, result.templateId);
                            ccGlobalFunctionData.sendWhatsAppMessageCorporateForm();
                        } else {
                            ccGlobalFunctionData.sendmessage(ccGlobalFormData.serviceName, result.templateId);
                        }
                        if (ccGlobalFormData.formVariant == "bimPluginUaeForm") {
                            const link = document.createElement("a");
                            link.href = $(".enquireForm--step-1-submit").attr("data-attr-downloadPdf");
                            $(that).find(".enquireForm--step-1-submit").add(link);
                            link.click();
                            $(that).find(".enquireForm--step-1-submit").remove(link);
                        }
                      if(result.language == "en" || result.language == "null" || result.language == ""){
                            if (skipSalesForceApiForAllVariants !== "true") {
                                ccGlobalFunctionData.pushLeadToSalesforce(pagePath,nodeVal,landMarkVal,thirdAddressVal,buildingNameVal,
                                    houseNoVal,organizationNameVal,segmentVal,streetVal,
                                    designationVal,secondAddressVal,stateVal,remarksVal,
                                    projectTypeVal,lNameVal,cityVal,phoneNoVal,pinCodeVal,
                                    emailVal,firstAddressVal,floorNoVal,salutationsVal,mobileNoVal,
                                    fNameVal,skuChosenVal,measurementNeededVal,dealerNameVal,
                                    dealerCodeVal,answerVal,sampleFinishVal,datePickerVal,
                                    customFieldVal,visitorIdVal,descriptionVal,whatsAppConsentVal,
                                    sourceVal,mediumVal,utmContentVal,utmIdVal,campaignId,campaignName,result.rowID,utmAdgroupName,utmKeyword,utmKeywordMatchType,utmCampaignSource,
                                    marketingChannelDetails.marketingChannel,marketingChannelDetails.referrerId,cServiceVal);
                            } else {
                                ccAnalytics.FormSubmitENSite(globalThisObj, true, false);
                            }
                      }
                        if (!ccGlobalFormData.enableFileUpload) {
                            // $(".rotating.js-rotatingLeadForm").addClass("d-none");
                            $(that).find(".rotating.js-rotatingLeadForm").addClass("d-none");
                        }

                        // Hide form banner on submit.
                        onFormSubmitOfBannerReplaceVarient(that);

                        // Redirection should happen post SF call
                       /*if (ccGlobalFormData.formVariant === "campaignPageForm" && ccGlobalFormData.isLeadNonBHS) {
                            ccGlobalFunctionData.thankYouPageRedirection();
                       }*/

                        if (ccGlobalFormData.formVariant != "campaignPageForm") {
                            if (result.iSAPEHSService) {
                            ccGlobalFormData.isApehs = true;
                            ccGlobalFormData.Id = result.rowID;
                            if (ccGlobalFormData.formAllSteps == "true" || ccGlobalFormData.formStep2 == "true") {
                                ccGlobalFunctionData.getAvailableSlots($(that));
                                $(that).parents('.form-attributes').find('.custom-enquire-form-step-1').css('display', 'none');
                                $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'block');
                                $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'none');
                                $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'none');
                            } else if (ccGlobalFormData.formStep3 == "true") {
                                $(that).parents('.form-attributes').find('.custom-enquire-form-step-1').css('display', 'none');
                                $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'none');
                                $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'block');
                                $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'none');
                            } else if (ccGlobalFormData.thankYouStep == "true") {
                                $(that).parents('.form-attributes').find('.custom-enquire-form-step-1').css('display', 'none');
                                $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'block');
                                $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'none');
                                $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'none');
                                //ccGlobalFunctionData.sendWhatsAppMessage('APHS', ccGlobalFormData.aphSWhatsAppTempId);
                            } else {
                                $(that).parents('.form-attributes').find('.custom-enquire-form-step-1').css('display', 'none');
                                $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'none');
                                $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'none');
                                $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'block');
                                //ccGlobalFunctionData.sendWhatsAppMessage('APHS', ccGlobalFormData.aphSWhatsAppTempId);
                            }
                        } else if (result.Service_Name == 'PTPR_Organic') {
                            $(that).parents('.form-attributes').find('.custom-enquire-form-step-1').css('display', 'none');
                            $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'none');
                            $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'none');
                            $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'block');
                            $(that).parents('.form-attributes').find('.enquire-form__step-4 .appointmentCrmId').html('');
                            $(that).parents('.form-attributes').find('.enquire-form__step-4 .booking-id').css('display', 'none');
                            //ccGlobalFunctionData.sendWhatsAppMessage('PTPR', ccGlobalFormData.ptWhatsAppTempId);

                            if ($(that).closest('.blog-details-right-ccforms-wp').length > 0) {
                                    if (fullImageGifThankYou) {
                                        let $revampContainerBlog = $(that).closest(".blog-details-right-ccforms-wp").find(".form-thankyou-revamp-container");
                                if($revampContainerBlog.find('.thank-you-popup-fullImageGif').length === 0){
                                        thankYouStepMarkUp = fullWidthThankYouGifMarkup(newGifThankYou);
                                        $(that).closest(".blog-details-right-ccforms-wp").find(".new-ty-parent-container .row.no-gutters").css("display", "none");
                                        setTimeout(function () {
                                            $(that).closest(".blog-details-right-ccforms-wp").find(".enquire-form__step-4").find(".form-revamp-thankyou, .custom-enquire-form-mark-up .enquire-form__dismissible-content").append(thankYouStepMarkUp);
                                             const vid = matchMedia('(max-width: 575px)').matches ? $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find('.thank-vid-mob') : $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find('.thank-vid-desk');
                                            $(that).closest(".blog-details-right-ccforms-wp").find(".enquire-form__step-4").css("display", "block");
                                        }, 100)
                                }
                                    } else {
                                        $(that).parents('.form-attributes').find('.thank-you-image-path').css('display', 'block');
                                        $(that).parents('.form-attributes').find('.thank-you-message').css('display', 'block');
                                        $(that).parents('.form-attributes').find('.thankYouTitle').css('display', 'block');
                                    }
                                }
                        } else {
                                if (ccGlobalFormData.isLeadNonBHS) {
                                     /* hide old thank-you pop-up for fileupload and new-banner-form-varient variant */
                                     if ($(that).closest('.form-banner-wrapper, .blog-details-right-ccforms-wp').length > 0) {
                                    if (fullImageGifThankYou) {
                                    
                                        let $revampContainerBlog = $(that).closest(".blog-details-right-ccforms-wp").find(".form-thankyou-revamp-container");
                                if($revampContainerBlog.find('.thank-you-popup-fullImageGif').length === 0){
                                        thankYouStepMarkUp = fullWidthThankYouGifMarkup(newGifThankYou);
                                        $(that).closest(".form-banner-wrapper, .blog-details-right-ccforms-wp").find(".new-ty-parent-container .row.no-gutters").css("display", "none");
                                        setTimeout(function () {
                                            // console.log('.....inside the settimeout')
                                            $(that).closest(".form-banner-wrapper, .blog-details-right-ccforms-wp").find(".enquire-form__step-4").find(".form-revamp-thankyou, .custom-enquire-form-mark-up .enquire-form__dismissible-content").append(thankYouStepMarkUp);
                                             const vid = matchMedia('(max-width: 575px)').matches ? $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find('.thank-vid-mob') : $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").find('.thank-vid-desk');
                                            $(that).closest(".form-banner-wrapper, .blog-details-right-ccforms-wp").find(".enquire-form__step-4").css("display", "block");
                                        }, 100)
                                }else{
                                    console.log('thank you pop up...');
                                }
                                    } else {
                                        $(that).parents('.form-attributes').find('.thank-you-image-path').css('display', 'block');
                                        $(that).parents('.form-attributes').find('.thank-you-message').css('display', 'block');
                                        $(that).parents('.form-attributes').find('.thankYouTitle').css('display', 'block');
                                    }
                                }
                                    if ($(".form-file-upload-gamification").length === 0) {
                                        $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'block');
                                    } else {
                                        $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'none');
                                        $(".game-file-form-container").addClass("d-none");
                                        $(".game-thankyou.susccess").removeClass("d-none");
                                        scrollTopGamification(100);
                                    }
                                }
                            $(that).parents('.form-attributes').find('.error-image-path').css('display', 'none');
                            $(that).parents('.form-attributes').find('.errorTitle').css('display', 'none');
                            $(that).parents('.form-attributes').find('.error-message').css('display', 'none');
                            $(that).parents('.form-attributes').find('.custom-enquire-form-step-1').css('display', 'none');
                            $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'none');
                            $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'none');
                            $(that).parents('.form-attributes').find('.enquire-form__step-4 .appointmentCrmId').html('');
                            $(that).parents('.form-attributes').find('.enquire-form__step-4 .booking-id').css('display', 'none');
                            if (!result.Service_Name || result.Service_Name === "No Service") {
                                ccAnalytics.noService();
                            } else {
                                console.log("submitted successfully");
                            }
                        }
                        }
                        //ccGlobalFunctionData.incompleteFormFillSubmit(1, $(that));
                        //BHS Consent
                        if(ccGlobalFormData.bhsSubmitFlag){
                            ccAnalytics.bhsFormSubmit("BHS Form", bhsConsentData.bhsPinCode);
                            $('.bhsConsentSubmit').hide('slow', function(){ $(".bhsConsentSubmit").hide(); });
                            $(".bhs_reg_success").attr('style', 'display: block; color: green;');
                            ccGlobalFormData.bhsSubmitFlag = false;
                        }
                        if (ccGlobalFormData.formVariant !== "campaignPageForm") {
                            $(that).parents(".enquire-form__step").find("form").trigger("reset");
                            $(that).parents(".enquire-form__step").find("form .floating-label").removeClass("focussed");
                            $(".enquireForm--step-1-submit").removeAttr('disabled');
                        }
                        if ($(".exit-modal").is('.exit-modal.fade-scale.in')) {
                            $(that).closest(".exit-modal").find(".form-revamp").hide();
                            $(".ccQuiz-form .form-revamp").show();

                            if (fullImageGifThankYou) {
                                thankYouStepMarkUp = fullWidthThankYouGifMarkup(newGifThankYou);
                                $('.exitPopup-success').empty();
                                $(".exitPopup-success").append(thankYouStepMarkUp);
                                //  const vid = matchMedia('(max-width: 575px)').matches ? $(that).find('.thank-vid-mob') : $(that).find('.thank-vid-desk');
                                // console.log(vid , "5")
                                 $(".exit-popup-right").addClass("formSubmitScreen");
                                $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").css("display", "block");                                
                            }
                            else {
                                $(".exit-popup-right").addClass("formSubmitScreen");
                                let successModalHeader = $(".exitPopup-success .sub-title").attr("data-attr-success-name");
                                $(".exit-popup-header h3").text(successModalHeader);
                            }
                            $(".exitPopup-success").removeClass("d-none");
                        }
                        if($("#budget-calculator-comp").length>0){
                            if (PbcVue.quickPbcStatus == true){
                               PbcVue.pbcBasicCalculator(PbcVue.quickPbcEvent);
                            }
                            if (PbcVue.advRepaintingStatus == true){
                               PbcVue.advanceQuickPBCLandingPageAfter(PbcVue.advRepaintingEvent);
                            }
                            if (PbcVue.advPbcStatus == true){
                               $(".advanceCalc-tab .form-group-global__advanceCalculator--submit button:first").trigger("click");
                            }
                        }
                        if($("#paintBudgetCalc").length>0){
                            if(pbcCalc.quickPbcStatus=true){
                               pbcCalc.calculatePbcValsAfter();
                            }
                        }

                        // WTHI blog page - on click of load more button
                        if ($(".image-and-description-layout").length > 0) {
                            let numberOfImagesToShow = $(".image-and-description-layout").attr("data-attr-cardsonload");
                            let $imgAndDescriptionSection = $(".image-and-description-layout .content-wrapper");
                            $imgAndDescriptionSection.eq(numberOfImagesToShow - 1).find(".img-wrapper").removeClass("img-wrapper--hidden");
                            $(".image-and-description-layout .content-wrapper").show();
                            $imgAndDescriptionSection.eq(numberOfImagesToShow - 1).find(".detail").show();

                            //Logic to Hide the Load More CTA on Successful form Submission
                            $(".image-and-description-layout .enable-exitIntent").css('display', 'none');
                        }

                        $(".exit-popup-right").removeClass("formSubmitErrorScreen");

                    } else {
                        dbFlag = false;
                        if(nodeVal.indexOf("/en/") != -1){
                        let dbFailId = new Date().getTime()+"-nondblead";
                        if (skipSalesForceApiForAllVariants !== "true") {
                             ccGlobalFunctionData.pushLeadToSalesforce(pagePath,nodeVal,landMarkVal,thirdAddressVal,buildingNameVal,
                                houseNoVal,organizationNameVal,segmentVal,streetVal,
                                designationVal,secondAddressVal,stateVal,remarksVal,
                                projectTypeVal,lNameVal,cityVal,phoneNoVal,pinCodeVal,
                                emailVal,firstAddressVal,floorNoVal,salutationsVal,mobileNoVal,
                                fNameVal,skuChosenVal,measurementNeededVal,dealerNameVal,
                                dealerCodeVal,answerVal,sampleFinishVal,datePickerVal,
                                customFieldVal,visitorIdVal,descriptionVal,whatsAppConsentVal,
                                sourceVal,mediumVal,utmContentVal,utmIdVal,campaignId,campaignName,dbFailId,utmAdgroupName,utmKeyword,utmKeywordMatchType,utmCampaignSource,
                                marketingChannelDetails.marketingChannel,marketingChannelDetails.referrerId,cServiceVal);
                            }
                        }

         // === CVV: re-enable CTA on failure / error ===
                            try {
                              var $scope     = $(that);
                              var $container = $scope.closest(".form-attributes");
                              if ($container.length) {
                                var $finalBtn = $container.find(".cvv-final-submit");
                                $finalBtn.prop("disabled", false)
                                         .removeClass("is-submitting")
                                         .css("opacity", "");
                              }
                            } catch (e) {
                              console.log("[CVV] failure re-enable error:", e);
                            }
                        if($(that).closest(".formVerticalVariantContainer").length>0){ /// First time here
                            $(that).closest(".formVerticalVariantContainer").css("display","none"); //hide
                            $(that).closest(".formVerticalVariant").find(".form-thankyou-revamp-container").css("display","block"); //showing thank you screen
                            $(that).closest(".formVerticalVariant").find(".error-image-path.error-image-left").css("display","block");//showing try again messgae
                            $(that).closest(".formVerticalVariant").find(".error-message").css("display","block");//
                            $(that).closest(".formVerticalVariant").find(".thank-you-image-path.thank-you-image-left").css("display", "none");///hiding thank you screen
                            $(that).closest(".formVerticalVariant").find(".thank-you-message").css("display", "none");//
                        }
                        // Hide form banner on submit.
                        onFormSubmitOfBannerReplaceVarient(that);
                        // $(".rotating.js-rotatingLeadForm").addClass("d-none");
                        $(that).find(".rotating.js-rotatingLeadForm").addClass("d-none");
                        $(".enquireForm--step-1-submit").removeAttr('disabled');
                        furnitureLeadForm = $('#globalFormPopUp:visible').length>0 ? '<div class="col-lg-12 col-12">' : '<div class="col-lg-6 col-12">';
                        $("#globalFormPopUp:visible").length > 0 ? $(".enquire-form__step-4--content").css("padding","0px") : '';
                        ccGlobalFunctionData.displayErrorMessage($(that));
                        if ($(".exit-modal").is('.exit-modal.fade-scale.in')) {
                        $(that).closest(".form-revamp").hide();
                        $(".ccQuiz-form .form-revamp").show();
                        $(".exitPopup-error").removeClass("d-none");
                        $(".exit-popup-right").addClass("formSubmitScreen");
                        let failureModalHeader = $(".exitPopup-error .sub-title").attr("data-attr-failure-name");
                        $(".exit-popup-header h3").text(failureModalHeader);
                        }
                    }
                    $(".form-revamp-thankyou").closest(".enquire-form__step-4").addClass("form-thankyou-revamp-container");
                    if ($(".form-revamp-thankyou").closest(".enquire-form__step-4").length > 0) {
                        var imgClose = $('<img loading="lazy" alt="closeIcon" title="closeIcon" id="formsCloseIcon">');
                        imgClose.attr('src', '/etc.clientlibs/apcolourcatalogue/clientlibs/clientlib-global/resources/images/CloseIconForm.webp');
                        $(".form-thankyou-revamp-container .iconLinks.enquire-form__close .spriteIcon-Aprevamp").replaceWith(imgClose);
                    }
            } else {
                // Auto Appointment flow starts here
                if(result.Status == "SUCCESS" && result.language == "en") {
                    dbFlag = true;
                    isCcFormSubmit=true;
                    if (skipSalesForceApiForAllVariants !== "true") {
                        ccGlobalFunctionData.pushLeadToSalesforce(pagePath,nodeVal,landMarkVal,thirdAddressVal,buildingNameVal,
                        houseNoVal,organizationNameVal,segmentVal,streetVal,
                        designationVal,secondAddressVal,stateVal,remarksVal,
                        projectTypeVal,lNameVal,cityVal,phoneNoVal,pinCodeVal,
                        emailVal,firstAddressVal,floorNoVal,salutationsVal,mobileNoVal,
                        fNameVal,skuChosenVal,measurementNeededVal,dealerNameVal,
                        dealerCodeVal,answerVal,sampleFinishVal,datePickerVal,
                        customFieldVal,visitorIdVal,descriptionVal,whatsAppConsentVal,
                        sourceVal,mediumVal,utmContentVal,utmIdVal,campaignId,campaignName,result.rowID,utmAdgroupName,utmKeyword,utmKeywordMatchType,utmCampaignSource,
                        marketingChannelDetails.marketingChannel,marketingChannelDetails.referrerId,cServiceVal);
                    }
                } else {
                    dbFlag = false;
                    let dbFailId = new Date().getTime()+"-nondblead";
                    if (skipSalesForceApiForAllVariants !== "true") {
                        ccGlobalFunctionData.pushLeadToSalesforce(pagePath,nodeVal,landMarkVal,thirdAddressVal,buildingNameVal,
                        houseNoVal,organizationNameVal,segmentVal,streetVal,
                        designationVal,secondAddressVal,stateVal,remarksVal,
                        projectTypeVal,lNameVal,cityVal,phoneNoVal,pinCodeVal,
                        emailVal,firstAddressVal,floorNoVal,salutationsVal,mobileNoVal,
                        fNameVal,skuChosenVal,measurementNeededVal,dealerNameVal,
                        dealerCodeVal,answerVal,sampleFinishVal,datePickerVal,
                        customFieldVal,visitorIdVal,descriptionVal,whatsAppConsentVal,
                        sourceVal,mediumVal,utmContentVal,utmIdVal,campaignId,campaignName,dbFailId,utmAdgroupName,utmKeyword,utmKeywordMatchType,utmCampaignSource,
                        marketingChannelDetails.marketingChannel,marketingChannelDetails.referrerId,cServiceVal);
                    }
                }
                // Auto Appointment flow ends here
            }
            if (fullImageGifThankYou) {
                $(that).closest(".formVerticalVariant").find('.form-thankyou-revamp-container .form-revamp-thankyou .thank-you-popup-fullImageGif').css('display', 'block');//
                $(that).closest(".formVerticalVariant").find('.form-thankyou-revamp-container .form-revamp-thankyou .no-gutters.old-ty').css('display', 'none');//hiding the thank you error sceen
            }
            $(".thank-you-pop-two").hide();
        },
        error: function() {
            // Hide form banner on submit.
            dbFlag = false;
            exitPopupStatus = false;
            if ($(".exit-modal").is('.exit-modal.fade-scale.in')) {
            $(".form-revamp").hide();
            $(".ccQuiz-form .form-revamp").show();
            $(".exitPopup-error").removeClass("d-none");
            $(".exit-popup-right").addClass("formSubmitErrorScreen");
            $(".exit-popup-right").addClass("formSubmitScreen");
            let failureModalHeader = $(".exitPopup-error .sub-title").attr("data-attr-failure-name");
            $(".exit-popup-header h3").text(failureModalHeader);
            }
            onFormSubmitOfBannerReplaceVarient(that);
            ccGlobalFunctionData.displayErrorMessage($(that));
            // $(".rotating.js-rotatingLeadForm").addClass("d-none");
            $(that).find(".rotating.js-rotatingLeadForm").addClass("d-none");
            $(".enquireForm--step-1-submit").removeAttr("disabled");
            // show error screen for formVerticalVariant 
            $(that).closest(".formVerticalVariant").find('.formVerticalVariantContainer').css("display", "none");
            $(that).closest(".formVerticalVariant").find('.form-thankyou-revamp-container .form-revamp-thankyou .thank-you-popup-fullImageGif').css('display', 'none');
            $(that).closest(".formVerticalVariant").find('.form-thankyou-revamp-container .form-revamp-thankyou .no-gutters.old-ty').css({
                'display': 'flex',
                'margin-top': '20px'
            }
            );
            $(that).closest(".formVerticalVariant").find('.form-thankyou-revamp-container .form-revamp-thankyou .no-gutters.old-ty .error-image-path, .form-thankyou-revamp-container .form-revamp-thankyou .no-gutters.old-ty .error-message').css('display', 'block');
            $(that).closest(".formVerticalVariant").find('.form-thankyou-revamp-container .form-revamp-thankyou .no-gutters.old-ty .thank-you-image-path, .form-thankyou-revamp-container .form-revamp-thankyou .no-gutters.old-ty .thank-you-message').css('display', 'none');
            $(that).closest(".formVerticalVariant").find('.form-thankyou-revamp-container').css('display', 'block');
            /* show old thank-you-error-screen pop-up for fileupload variant */
            $(that).closest(".formVerticalVariant.new-banner-form-varient").find(".new-ty-parent-container .row.no-gutters").css("display", "flex");
        }
    });
}

ccGlobalFunctionData.pushLeadToSalesforce = function (pagePath,nodeVal,landMarkVal,thirdAddressVal,buildingNameVal,
                                                      houseNoVal,organizationNameVal,segmentVal,streetVal,
                                                      designationVal,secondAddressVal,stateVal,remarksVal,
                                                      projectTypeVal,lNameVal,cityVal,phoneNoVal,pinCodeVal,
                                                      emailVal,firstAddressVal,floorNoVal,salutationsVal,mobileNoVal,
                                                      fNameVal,skuChosenVal,measurementNeededVal,dealerNameVal,
                                                      dealerCodeVal,answerVal,sampleFinishVal,datePickerVal,
                                                      customFieldVal,visitorIdVal,descriptionVal,whatsAppConsentVal,
                                                      sourceVal,mediumVal,utmContentVal,utmIdVal,campaignId,campaignName,rowId,utmAdgroupName,utmKeyword,utmKeywordMatchType,utmCampaignSource,
                                                      marketingChannel, referrerId, cServiceVal) {
    $(".enquireForm--step-1-submit").attr('disabled','disabled');
    $.ajax({
        type: "POST",
        url: '/apcolourcatalogue/ccforms/salesforce' + '.leadstosalesforce.json',
        async: false,
        data: {
            pageUrl: pagePath,
            node: nodeVal,
            landMark: landMarkVal,
            thirdAddress: thirdAddressVal,
            buildingName: buildingNameVal,
            houseNo: houseNoVal,
            organizationName: organizationNameVal,
            segment: segmentVal,
            street: streetVal,
            designation: designationVal,
            secondAddress: secondAddressVal,
            state: stateVal,
            remarks: remarksVal,
            projectType: projectTypeVal,
            lName: lNameVal,
            city: cityVal,
            phoneNo: phoneNoVal,
            pinCode: pinCodeVal,
            email: emailVal,
            firstAddressVal: firstAddressVal,
            floorNo: floorNoVal,
            salutations: salutationsVal,
            mobileNo: mobileNoVal,
            fName: fNameVal,
            skuChosen: skuChosenVal,
            measurementNeeded: measurementNeededVal,
            dealerName: dealerNameVal,
            dealerCode: dealerCodeVal,
            answer: answerVal,
            sampleFinish: sampleFinishVal,
            datePicker: datePickerVal,
            customField: customFieldVal,
            visitorId: visitorIdVal,
            description: descriptionVal,
            whatsAppConsent: whatsAppConsentVal,
            source:sourceVal,
            medium:mediumVal,
            utmContent:utmContentVal,
            utmId:utmIdVal,
            campaignId: campaignId,
            campaignName: campaignName,
            rowId: rowId,
            utmAdgroupName:utmAdgroupName,
            utmKeyword:utmKeyword,
            utmKeywordMatchType:utmKeywordMatchType,
            utmCampaignSource:utmCampaignSource,
            referrerId:referrerId || "",
            marketingChannel:marketingChannel || "",
            cService: cServiceVal

        },
        success: function(salesforceResult) {
            console.log(salesforceResult);
            //Unbxd tracking - start
            UnbxdAnalyticsConf = window.UnbxdAnalyticsConf || {};
            UnbxdAnalyticsConf["misc"] = {
               "pageType": templateName,
               "pageTitle": pagePath,
               "formType": nodeVal
            }
            let pidValue = "";
            let qtyValue = "1";
            let priceValue = "0";
            if (templateName.indexOf("-pdp-") != -1 || templateName.indexOf("-detail") != -1) {
                priceValue = $($('.prodInfo p')[1]).text() ? $($('.prodInfo p')[1]).text().replace("MRP ₹","").trim() : $('.priceValue').text().replace("MRP ₹","").trim();
                pidValue = $('.track_share_wishlist').attr('data-attr-sku') ? $('.track_share_wishlist').attr('data-attr-sku') : $(".colour-pdp-product-id").text().replace("PRODUCT CODE :", "").trim();
                qtyValue = $('.selected-quantity').val() ? $('.selected-quantity').val() : "1";
            } else {
                pidValue = rowId;
            }
            var unxPayload = [{
                   pid: pidValue,
                   qty: qtyValue,
                   price: priceValue
               }]
            function fireUnbxdOrder() {
               if (window.Unbxd) {
                   Unbxd.trackMultiple("order", unxPayload)
               } else {
                   console.log("Unbxd is not defined")
               }
            }
            fireUnbxdOrder();
            //Unbxd tracking - end
            $(".rotating.js-rotatingLeadForm").addClass("d-none");
            $(".enquireForm--step-1-submit").attr('disabled','disabled');
            var data = JSON.parse(JSON.stringify(salesforceResult));
            if (data.returnCode == 201) {

                salesforceFlag = true;
                console.log("Salesforce Success");

                // Based on the checkbox in banner form
                allowOTPinBannerForm = $(".js-banner-active-target").attr("data-attr-enableOtpFlow") == 'true' ? true : false; // Based on the checkbox in banner form

                if (allowOTPinBannerForm == true) {
                    let responseOne = $('.ccforms .ccFormScheduler input[name="CUSTOM_RADIO_customer_response_one"]:checked').val();
                    let responseTwo = $('.ccforms .ccFormScheduler input[name="CUSTOM_RADIO_customer_response_two"]:checked').val();

                    let nameFilled = $('.ccforms .ccFormScheduler .form-banner-wrapper input[id="enquire-name"]').val().trim() !== '';
                    let emailFilled = $('.ccforms .ccFormScheduler .form-banner-wrapper input[id="enquire-email"]').val().trim() !== '';
                    let mobileFilled = $('.ccforms .ccFormScheduler .form-banner-wrapper input[id="enquire-mobile"]').val().trim() !== '';
                    let pincodeFilled = $('.ccforms .ccFormScheduler .form-banner-wrapper input[id="enquire-pincode"]').val().trim() !== '';

                    let mobileNum = $('.ccforms .ccFormScheduler .form-banner-wrapper input[id="enquire-mobile"]').val().trim();

                    if (nameFilled && emailFilled && mobileFilled && pincodeFilled) {
                        if (responseOne === 'No' && responseTwo === 'No') {

                            $('.enquire-form__dismissible-container--head').addClass('d-none');
                            $('.enquire-form__dismissible-content.custom-enquire-form-mark-up').addClass('d-none');
                            $('.enquire-form__step.enquire-form__step-4').css('box-shadow', 'none');

                            if ($(window).width() < 991) {
                                $('.enquire-form__step.enquire-form__step-4').css('marginTop', '0');
                                $('.enquire-form-override.enquire-form.enquire-form__container.form-attributes.enquire-form--banner-replace-variant').css('marginTop', '1px');
                                $('.enquire-form__step.enquire-form__step-4').css('border-radius', '8px');
                            }

                            $('.ccforms .ccFormScheduler .form-banner-wrapper .enquire-form__step.enquire-form__step-4 .enquire-form__dismissible-container .form-otp').css("display", "block");
                            $('.ccforms .ccFormScheduler .js-banner-active-target').addClass('d-flex');

                            $('.form-otp .input-field-set input[name="bhs-cal-mob-no"]').val(mobileNum);
                            $(".otp-field-section .digit-group input").val("");
                            $(".otp-field-section .otp-field-error").addClass('d-none');
                            $(".form-otp #verify-otp").attr('style', 'opacity: 0.6;cursor: no-drop;display:none !important');
                            phValidationAnalytics = false;
                            ccGlobalFunctionData.generateOTP(); // Trigger OTP
                        }
                        else if (responseOne === 'Yes' || responseTwo === 'Yes') {
                            $('.enquire-form__dismissible-container--head').removeClass('d-none');
                            $('.enquire-form__dismissible-content.custom-enquire-form-mark-up').removeClass('d-none');
                            $('.enquire-form__step.enquire-form__step-4').css('box-shadow', '0 8px 12px 0 rgba(0,0,0,.05)');
                            $('.ccforms .ccFormScheduler .js-banner-active-target').removeClass('d-flex');

                            if ($(window).width() < 991) {
                                $('.enquire-form__step.enquire-form__step-4').css('marginTop', '85px');
                                $('.enquire-form-override.enquire-form.enquire-form__container.form-attributes.enquire-form--banner-replace-variant').css('marginTop', '-85px');
                                $('.enquire-form__step.enquire-form__step-4').css('border-radius', '8px');
                            }
                        }
                    }
                }

                if (data['Revised_LOB'] === 'BHS' && ccGlobalFormData.enableFileUpload) {
                     modalHandler.closeModal(otpModal);
                     $('.fileUploadFeature').attr("data-attr-ccrefid", data['CRMleadId']);
                     ccGlobalFormData.isLeadNonBHS = false;
                     $('.enquire-form__step-1').hide();
                     $('.fileUploadFeature').removeClass('d-none');
                } else {
                    setTimeout(function () {
                        if (ccGlobalFormData.formVariant == "campaignPageForm") {
                            $(".enquireForm--step-1-submit").removeAttr('disabled');
                            ccGlobalFunctionData.thankYouPageRedirection();
                        } else {
                            $(".enquireForm--step-1-submit").removeAttr('disabled');
                        }
                    }, 1000);
                }
                if (ccGlobalFormData.bhsAutoAppointmentFlow === "true") { // To enable it in author config - "Check to enable auto appointment flow"
                    // this will open the auto appointment calendar popup
                    let dataFromForm = {
                        "name": ccGlobalFormData.fName,
                        "mobileNo": ccGlobalFormData.mobileNo,
                        "emailId": ccGlobalFormData.email,
                        "pinCode": ccGlobalFormData.pinCode,
                        "leadId": "123456",
                        "Whatsapp_Consent": whatsAppConsentVal,
                        "Revised_LOB": data.Revised_LOB,
                        "CRMleadId": data.CRMleadId
                    }
                    sessionStorage.setItem("stepform", JSON.stringify(dataFromForm));
                    let thanksPopupForBhCalculator = $('.thank_you_popup');
                    thanksPopupForBhCalculator.css("display", "block")
                    thanksPopupForBhCalculator.find(".dialog ").css("display", "block")
                    $('body').css("overflow", "hidden");
                    $(".dialog__content").addClass("dsp-none");
                    $('.book-appointment-btn.book-appointment-common-next-evt').parents('.book-appointment-popup-evt').addClass('dsp-none').next().removeClass('dsp-none');
                    $(".book-an-appointment_wrapper").removeClass("dsp-none");
                    // Reset all slides
                    $('#book-appointment_thankyou, #book-appointment_step1, #book-appointment_step2, #book-appointment_step3, #book-appointment_step4-budget, #book-appointment_step4, #book-appointment_step5-otp, #book-appointment_something-wentwrong, #book-appointment_appointment-scheduled').addClass('dsp-none');
                    $("#possession-status-1, #possession-status-2, #possession-status-3").prop("checked", false);
                    $("#design-require-1, #design-require-2, #design-require-3").prop("checked", false);
                    $("#design-budget-1, #design-budget-2").prop("checked", false);
                    $("#home-condition-1, #home-condition-2").prop("checked", false);
                    $("#renovation-living-1, #renovation-living-2").prop("checked", false);
                    $('input[name="room-type"]').prop('checked', false);
                    $('.select-rooms_option-wrapper').css("background-color", 'white');
                    $(".select-rooms_option-wrapper").find(".room-counter-evt").text("00");
                    $(".room-count-minus-evt, .room-count-plus-evt").addClass("disabled");
                    $("input[id='bhs-cal-mob-no']").val(ccGlobalFormData.mobileNo);
                }

                }
                else if(data.returnCode != 201){
                    salesforceFlag = false;
                    ccAnalytics.formFailure(globalThisObj);
            }
        },
        error: function(xhr) {
            $(".rotating.js-rotatingLeadForm").addClass("d-none");
            console.log(xhr);
            ccAnalytics.formFailure(globalThisObj);
        }
    });
    if (ccGlobalFormData.resourcePath && ccGlobalFormData.resourcePath.includes("/content/ap/en/")) {
        if((dbFlag && !salesforceFlag) || (!dbFlag && salesforceFlag) || (dbFlag && salesforceFlag)){
            ccAnalytics.FormSubmitENSite(globalThisObj, dbFlag, salesforceFlag);
        }
    }
};

ccGlobalFunctionData.saveYesInterestedBhsLeadsToDB = function(bhsInterestedCampaignId) {
    // $(".rotating.js-rotatingLeadForm").removeClass("d-none");
    //$(that).find(".rotating.js-rotatingLeadForm").removeClass("d-none");
    let aesUtil = new AesUtil(128, 1000);
    let nodeVal = ccGlobalFormData.resourcePath;
    let pagePath = ccGlobalFormData.pageUrl;
    let landMarkVal = ccGlobalFormData.landMark;
    let thirdAddressVal = ccGlobalFormData.thirdAddress;
    let buildingNameVal = ccGlobalFormData.buildingName;
    let houseNoVal = ccGlobalFormData.houseNo;
    let organizationNameVal = ccGlobalFormData.organizationName;
    let segmentVal = ccGlobalFormData.segment;
    let streetVal = ccGlobalFormData.street;
    let designationVal = ccGlobalFormData.designation;
    let secondAddressVal = ccGlobalFormData.secondAddress;
    let stateVal = ccGlobalFormData.state;
    let remarksVal = ccGlobalFormData.remarks;
    let projectTypeVal = ccGlobalFormData.projectType;
    let lNameVal = ccGlobalFormData.lName;
    let cityVal = ccGlobalFormData.city;
    let phoneNoVal = ccGlobalFormData.phoneNo;
    let pinCodeVal = ccGlobalFormData.pinCode;
    let emailVal = ccGlobalFormData.email;
    let firstAddressVal = ccGlobalFormData.firstAddress;
    let floorNoVal = ccGlobalFormData.floorNo;
    let salutationsVal = ccGlobalFormData.salutations;
    let mobileNoVal = ccGlobalFormData.mobileNo;
    let fNameVal = ccGlobalFormData.fName;
    let skuChosenVal = ccGlobalFormData.skuChosen;
    let measurementNeededVal = ccGlobalFormData.measurementNeeded;
    let dealerNameVal = ccGlobalFormData.dealerName;
    let dealerCodeVal = ccGlobalFormData.dealerCode;
    let answerVal = ccGlobalFormData.answer;
    let sampleFinishVal = ccGlobalFormData.sampleFinish;
    let datePickerVal = ccGlobalFormData.datePicker;
    let customFieldVal = ccGlobalFormData.customField;
    let visitorIdVal = ccGlobalFormData.visitorId;
    let descriptionVal = ccGlobalFormData.description;
    let whatsAppConsentVal = ccGlobalFormData.whatsAppConsent;
    let dateVal = ccGlobalFormData.date;
    let urlParams = new URLSearchParams(window.location.search);
    let source = urlParams.get("utm_source");
    let medium = urlParams.get("utm_medium");
    let utmContent = urlParams.get("utm_content");
    let utmId = urlParams.get("utm_id");
    let campaignId = bhsInterestedCampaignId ? bhsInterestedCampaignId : (urlParams.get("utm_campaign") !== null ? urlParams.get("utm_campaign") : ccGlobalFormData.campaignId);
    if (campaignId) {
        campaignId = campaignId.trim();
    }
    ccGlobalFormData.campaignIdFinal = campaignId ;
    let campaignName = bhsInterestedCampaignId ? bhsInterestedCampaignId : (urlParams.get("utm_campaign") !== null ? urlParams.get("utm_campaign") : ccGlobalFormData.campaignId);
    if (campaignName) {
        campaignName = campaignName.trim();
    }
    let utmAdgroupName = urlParams.get("UTM_Adgroup_Name") !== null ? urlParams.get("UTM_Adgroup_Name") : "";
    let utmKeyword = urlParams.get("UTM_Keyword") !== null ? urlParams.get("UTM_Keyword") : "";
    let utmKeywordMatchType = urlParams.get("UTM_Keyword_match_type") !== null ? urlParams.get("UTM_Keyword_match_type") : "";
    let utmCampaignSource = urlParams.get("UTM_Campaign_Source") !== null ? urlParams.get("UTM_Campaign_Source") : "";
    let marketingChannelDetails = getMarketingChannelDetails();
    let cServiceVal = "";
    if (ccGlobalFormData.enableCserviceBhs == "true"){
        cServiceVal = "BHS";
    }

    let imageUrlVal = "";
    if(source) {
        ccGlobalFormData.source = source;
    }
    if(medium) {
        ccGlobalFormData.medium = medium;
    }
    if(utmContent){
        ccGlobalFormData.utmContent = utmContent;
    }
    if(utmId){
        ccGlobalFormData.utmId = utmId;
    }
    let sourceVal = ccGlobalFormData.source;
    let mediumVal = ccGlobalFormData.medium;
    let utmContentVal = ccGlobalFormData.utmContent;
    let utmIdVal = ccGlobalFormData.utmId;

    firstAddressVal = ccGlobalFormData.firstAddress;
    imageUrlVal = ccGlobalFormData.imageUrl;

    // This implementation is for new file upload variant for campaign form - starts here
    let isFileUploadFlowVal = "No";
    let textEntryVal = "";
    let fileUploadUrlVal = "";
    textEntryVal = ccGlobalFormData.textEntry
    fileUploadUrlVal = ccGlobalFormData.imageUrl;

    // Encrypting mandatory user input fields - name, email, mobile, pincode
    // To handle encryption method for Egypt Arabic
    if (document.documentElement.lang != 'ar'){
        fNameVal = aesUtil.ltyEncrypt(fNameVal);
        lNameVal = aesUtil.ltyEncrypt(lNameVal);
    }
    emailVal = aesUtil.ltyEncrypt(emailVal);
    mobileNoVal = aesUtil.ltyEncrypt(mobileNoVal);
    pinCodeVal = aesUtil.ltyEncrypt(pinCodeVal);
    let skipSalesForceApi = "false";

    $.ajax({
        type: "POST",
        url: '/apcolourcatalogue/ccforms' + '.saveleadform.json',
        data: {
            pageUrl: pagePath,
            node: nodeVal,
            landMark: landMarkVal,
            thirdAddress: thirdAddressVal,
            buildingName: buildingNameVal,
            houseNo: houseNoVal,
            organizationName: organizationNameVal,
            segment: segmentVal,
            street: streetVal,
            designation: designationVal,
            secondAddress: secondAddressVal,
            state: stateVal,
            remarks: remarksVal,
            projectType: projectTypeVal,
            lName: lNameVal,
            city: cityVal,
            phoneNo: phoneNoVal,
            pinCode: pinCodeVal,
            email: emailVal,
            firstAddress: firstAddressVal,
            floorNo: floorNoVal,
            salutations: salutationsVal,
            mobileNo: mobileNoVal,
            fName: fNameVal,
            skuChosen: skuChosenVal,
            measurementNeeded: measurementNeededVal,
            dealerName: dealerNameVal,
            dealerCode: dealerCodeVal,
            answer: answerVal,
            sampleFinish: sampleFinishVal,
            datePicker: datePickerVal,
            customField: customFieldVal,
            visitorId: visitorIdVal,
            description: descriptionVal,
            whatsAppConsent: whatsAppConsentVal,
            date:dateVal,
            source:sourceVal,
            medium:mediumVal,
            utmContent: utmContentVal,
            utmId:utmIdVal,
            campaignId: campaignId,
            imageUrl:imageUrlVal,
            referrerId:marketingChannelDetails.referrerId,
            marketingChannel:marketingChannelDetails.marketingChannel,
            isFileUploadFlow:isFileUploadFlowVal,
            textEntry:textEntryVal,
            fileUploadUrl:fileUploadUrlVal
        },
        success: function(result) {
            if (result.Status == "SUCCESS") {
            // Auto Appointment flow starts here
                if(result.Status == "SUCCESS" && result.language == "en") {
                    dbFlag = true;
                    isCcFormSubmit=true;
                    if (skipSalesForceApi !== "true") {
                        ccGlobalFunctionData.pushLeadToSalesforce(pagePath,nodeVal,landMarkVal,thirdAddressVal,buildingNameVal,
                        houseNoVal,organizationNameVal,segmentVal,streetVal,
                        designationVal,secondAddressVal,stateVal,remarksVal,
                        projectTypeVal,lNameVal,cityVal,phoneNoVal,pinCodeVal,
                        emailVal,firstAddressVal,floorNoVal,salutationsVal,mobileNoVal,
                        fNameVal,skuChosenVal,measurementNeededVal,dealerNameVal,
                        dealerCodeVal,answerVal,sampleFinishVal,datePickerVal,
                        customFieldVal,visitorIdVal,descriptionVal,whatsAppConsentVal,
                        sourceVal,mediumVal,utmContentVal,utmIdVal,campaignId,campaignName,result.rowID,utmAdgroupName,utmKeyword,utmKeywordMatchType,utmCampaignSource,
                        marketingChannelDetails.marketingChannel,marketingChannelDetails.referrerId,cServiceVal);
                    }
                } else {
                    dbFlag = false;
                    let dbFailId = new Date().getTime()+"-nondblead";
                    if (skipSalesForceApi !== "true") {
                        ccGlobalFunctionData.pushLeadToSalesforce(pagePath,nodeVal,landMarkVal,thirdAddressVal,buildingNameVal,
                        houseNoVal,organizationNameVal,segmentVal,streetVal,
                        designationVal,secondAddressVal,stateVal,remarksVal,
                        projectTypeVal,lNameVal,cityVal,phoneNoVal,pinCodeVal,
                        emailVal,firstAddressVal,floorNoVal,salutationsVal,mobileNoVal,
                        fNameVal,skuChosenVal,measurementNeededVal,dealerNameVal,
                        dealerCodeVal,answerVal,sampleFinishVal,datePickerVal,
                        customFieldVal,visitorIdVal,descriptionVal,whatsAppConsentVal,
                        sourceVal,mediumVal,utmContentVal,utmIdVal,campaignId,campaignName,dbFailId,utmAdgroupName,utmKeyword,utmKeywordMatchType,utmCampaignSource,
                        marketingChannelDetails.marketingChannel,marketingChannelDetails.referrerId,cServiceVal);
                    }
                }
            }
            // Auto Appointment flow ends here
        },
        error: function() {
            dbFlag = false;
            exitPopupStatus = false;
        }
    });
}

ccGlobalFunctionData.getAvailableSlots = function(that) {
    if (ccGlobalFormData.serviceGroup == 'APEHS') {
        ccGlobalFormData.serviceGroup = 'APHS';
    }
    ccGlobalFormData.segment = ccGlobalFormData.serviceCode;
    ccGlobalFormData.remarks = 'Booking';
    ccGlobalFormData.campaignId = ccGlobalFunctionData.getCampaignId();
    $.ajax({
        type: "POST",
        url: '/apcolourcatalogue/ccforms/APIhandler' + '.getAvailableSlots.json',
        data: ccGlobalFormData,
        success: function(slotResult) {
            console.log(slotResult.slotData);
            if (slotResult.status == 'success') {
                if (slotResult.slotData != '' && slotResult.slotData != undefined) {
                    slotResult.slotData.forEach(function(value, key) {
                        var slotTiming = {};
                        var slotStart = value.slotStartTime.split(' ');
                        var date = slotStart[2] + '-' + slotStart[1] + '-' + slotStart[5];
                        var slotTime = slotStart[3];
                        var slotsTiming = {
                            'slotDetails': value.slotStartTime.replace(/ /g, '-') + '-to-' + value.slotEndTime.replace(/ /g, '-')
                        }
                        slotTiming[slotTime] = slotsTiming;
                        if (ccSlotFinalData.hasOwnProperty(date)) {
                            if (ccSlotFinalData[date].hasOwnProperty(slotTime)) {
                                ccSlotFinalData[date] = slotTiming;
                            } else {
                                ccSlotFinalData[date][slotTime] = slotsTiming;
                            }
                        } else {
                            ccSlotFinalData[date] = slotTiming;
                        }
                    });
                    if (ccSlotFinalData != '' && ccSlotFinalData != undefined) {
                        ccGlobalFunctionData.showSlotsDropDown($(that));
                    }
                } else {
                    ccGlobalFunctionData.displayErrorMessage($(that));
                }
            } else {
                ccGlobalFunctionData.displayErrorMessage($(that));
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

ccGlobalFunctionData.showSlotsDropDown = function(that) {
    var dateCount = 0;
    var timingCount = 0;
    $.each(ccSlotFinalData, function(key, value) {
        if (dateCount == 0) {
            dateCount++;
            $(that).parents('.form-attributes').find('.custom-visit-me-on-dropdown').html('');
            $(that).parents('.form-attributes').find('.custom-visit-me-on-dropdown')
                .append('<li class="form-dropdown__list-item custom-date-selection"><a href="javascript:void(0)" data-selected="true">' + key + '</a></li>');
        } else {
            $(that).parents('.form-attributes').find('.custom-visit-me-on-dropdown')
                .append('<li class="form-dropdown__list-item"><a href="javascript:void(0)">' + key + '</a></li>');
        }
        if (timingCount == 0) {
            $.each(value, function(key1, value1) {
                if (key1 != '' && key1 != undefined) {
                    key1 = ccGlobalFunctionData.convertToAMPM(key1);
                    if (timingCount == 0) {
                        timingCount++
                        $(that).parents('.form-attributes').find('.custom-visit-me-at-dropdown').html('');
                        $(that).parents('.form-attributes').find('.custom-visit-me-at-dropdown')
                            .append('<li class="form-dropdown__list-item"><a href="javascript:void(0)" data-slot-time=' + value1.slotDetails + ' data-selected="true">' + key1 + '</a></li>');
                        ccGlobalFormData.appointment_time = value1.slotDetails;
                    } else {
                        $(that).parents('.form-attributes').find('.custom-visit-me-at-dropdown')
                            .append('<li class="form-dropdown__list-item"><a href="javascript:void(0)" data-slot-time=' + value1.slotDetails + '>' + key1 + '</a></li>');
                    }
                }
            });
        }
    });
    $(that).parents('.form-attributes').find('.form-dropdown__custom-variant--target').each(function() {
        let preSelVal = $(this).find('.form-dropdown__list-item').first().find('a').text();
        $(this).find('.form-dropdown__list-item').first().find('a').attr('data-selected', true);
        $(this).parents('.form-dropdown.floating-label').addClass('focussed');
        $(this).parents('.form-dropdown').find('input').prop('value', preSelVal);
    });
}
ccGlobalFunctionData.getDate = function(slotsDate, fromToEnd) {
    var today;
    slotsDate = parseInt(slotsDate);
    if (fromToEnd == 'fromDate') {
        today = new Date();
    }
    if (fromToEnd == 'toDate') {
        today = new Date(ccGlobalFormData.startDate);
    }
    if (today != undefined && today != '' && today != null) {
        var dd = today.setDate(today.getDate() + slotsDate);
        dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10)
        {
            dd = '0' + dd;
        }
        if (mm < 10)
        {
            mm = '0' + mm;
        }
        today = yyyy + '-' + mm + '-' + dd;
        console.log(today);
    }
    return today;
}
ccGlobalFunctionData.getURLParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    var toReturn = "";
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            toReturn = sParameterName[1];
        }
    }
    return toReturn;
}
ccGlobalFunctionData.filterSlotTimingOnChange = function(selDate, that) {
    var slotData = ccSlotFinalData[selDate];
    var timingCount = 0;
    $.each(slotData, function(key3, value3) {
        if (key3 != '' && key3 != undefined)
            key3 = ccGlobalFunctionData.convertToAMPM(key3);
        if (timingCount == 0) {
            timingCount++
            $(that).parents('.form-attributes').find('.custom-visit-me-at-dropdown').html('');
            $(that).parents('.form-attributes').find('.custom-visit-me-at-dropdown')
                .append('<li class="form-dropdown__list-item"><a href="javascript:void(0)" data-slot-time=' + value3.slotDetails + ' data-selected="true">' + key3 + '</a></li>');
            $(that).parents('.form-attributes').find('#enqurire-visit-time').prop('value', key3);
            ccGlobalFormData.appointment_time = value3.slotDetails;
        } else {
            $(that).parents('.form-attributes').find('.custom-visit-me-at-dropdown')
                .append('<li class="form-dropdown__list-item"><a href="javascript:void(0)" data-slot-time=' + value3.slotDetails + '>' + key3 + '</a></li>');
        }
    });
}
ccGlobalFunctionData.convertToAMPM = function(slotTime) {
    if (slotTime != '' && slotTime != undefined) {
        var convertTime = slotTime.split(':');
        var hours = convertTime[0];
        var minutes = convertTime[1];
        // Check whether AM or PM
        var timeFormat = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        //minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + timeFormat;
    }
}
ccGlobalFunctionData.saveSchedulerData = function(that) {
    if (ccGlobalFormData.secondVariantCheck == 'ExpertPlus') {
        ccGlobalFormData.firstAddress = $(that).find('#enquire-address-1').val() != undefined ? $(that).find('#enquire-address-1').val() : '';
        ccGlobalFormData.secondAddress = $(that).find('#enquire-address-2').val() != undefined ? $(that).find('#enquire-address-2').val() : '';
        ccGlobalFormData.landMark = $(that).find('#enqurie-landmark').val() != undefined ? $('#enqurie-landmark').val() : '';
        //ccGlobalFormData.bpNumber = 'bpno_' + Date.now();
        ccGlobalFormData.leadId = 'lead_' + Date.now();
        if (ccGlobalFormData.appointment_time != undefined && ccGlobalFormData.appointment_time != '') {
            var appointmentTime = ccGlobalFormData.appointment_time.split('-to-');
            var appointmentStart = appointmentTime[0].replace('IST-', '').replace(/-/g, ' ');
            var appointmentEnd = appointmentTime[1].replace('IST-', '').replace(/-/g, ' ');
            var current_appointment_datetime = new Date(appointmentStart);
            var current_appointment_end_datetime = new Date(appointmentEnd);
            ccGlobalFormData.appointment_time = ccGlobalFunctionData.getSpecificDateFormat(current_appointment_datetime);
            ccGlobalFormData.appointment_end_time = ccGlobalFunctionData.getSpecificDateFormat(current_appointment_end_datetime);
            ccGlobalFormData.scheduleEndTime = ccGlobalFormData.appointment_end_time.replace(' ', 'T');
            ccGlobalFormData.scheduleStartTime = ccGlobalFormData.appointment_time.replace(' ', 'T');
            ccGlobalFunctionData.saveAllStepsData(2, $(that));
        } else {
            ccGlobalFunctionData.displayErrorMessage($(that));
        }
    }
    if (ccGlobalFormData.secondVariantCheck == 'Expert') {
        ccGlobalFormData.serviceName = 'PT'
        ccGlobalFormData.appointment_time = '';
        ccGlobalFormData.campaignId = ccGlobalFunctionData.getCampaignId();
        ccGlobalFunctionData.insertUserDetails(3, $(that));
    }
}
ccGlobalFunctionData.getSpecificDateFormat = function(current_datetime) {
    var specificDateFormat = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
    return specificDateFormat;
}
ccGlobalFunctionData.saveAllStepsData = function(stepNumber, that) {
    if (stepNumber == 3) {
        let $form = '';
        $(that).parents('.form-attributes').find('.enquire-form__step').each(function() {
            if ($(this).data('step') == stepNumber) {
                $form = $(this).find('form');
                return;
            }
        });
        let servicesSelected = [];
        $form.find('.form-checkbox-input__field').each(function() {
            if ($(this).prop('checked') == true) {
                let description = $(this).parents('.form-checkbox-input__card-variant').find('.form-checkbox-input__card-variant--content').text().trim();
                servicesSelected.push(description);
            }
        });
        ccGlobalFormData.answer = servicesSelected.join(' | ');
        ccGlobalFunctionData.insertUserDetails(stepNumber, $(that));
    }
    if (stepNumber == 2) {
        ccGlobalFunctionData.bookAppointment($(that));
    }
}
ccGlobalFunctionData.getCampaignId = function() {
    if (ccGlobalFormData.pageUrl.includes('utm_')) {
        ccGlobalFormData.campaignId = ccGlobalFormData.campIdForPaidUsers != '' ? ccGlobalFormData.campIdForPaidUsers : ccGlobalFormData.campaignId;
    } else if (ccGlobalFormData.serviceName == 'Decor Solutions') {
        ccGlobalFormData.campaignId = ccGlobalFormData.campaignIdDecor != '' ? ccGlobalFormData.campaignIdDecor : ccGlobalFormData.campaignId;
    } else if (ccGlobalFormData.serviceName == 'APEHS') {
        ccGlobalFormData.campaignId = ccGlobalFormData.campaignIdAPHES != '' ? ccGlobalFormData.campaignIdAPHES : ccGlobalFormData.campaignId;
    } else if (ccGlobalFormData.serviceName == 'PT') {
        ccGlobalFormData.campaignId = ccGlobalFormData.campaignIdPT != '' ? ccGlobalFormData.campaignIdPT : ccGlobalFormData.campaignId;
    } else if (ccGlobalFormData.serviceName == '' || ccGlobalFormData.serviceName == 'NoService') {
        ccGlobalFormData.campaignId = ccGlobalFormData.campaignIdCCO != '' ? ccGlobalFormData.campaignIdCCO : ccGlobalFormData.campaignId;
    }
    return ccGlobalFormData.campaignId;
}
ccGlobalFunctionData.incompleteFormFillSubmit = function(status, that) {
    if (status == 0) {
        ccGlobalFormData.fName = $(that).parents('.form-attributes').find('#enquire-name').val() != undefined ? $(that).parents('.form-attributes').find('#enquire-name').val() : '';
        ccGlobalFormData.email = $(that).parents('.form-attributes').find('#enquire-email').val() != undefined ? $(that).parents('.form-attributes').find('#enquire-email').val() : '';
        ccGlobalFormData.mobileNo = $(that).parents('.form-attributes').find('#enquire-mobile').val() != undefined ? $(that).parents('.form-attributes').find('#enquire-mobile').val() : '';
        ccGlobalFormData.pinCode = $(that).parents('.form-attributes').find('#enquire-pincode').val() != undefined ? $(that).parents('.form-attributes').find('#enquire-pincode').val() : '';
        ccGlobalFormData.resourcePath = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-resourcePath');
    }
    ccGlobalFormData.pageUrl = window.location.href;
    ccGlobalFunctionData.visitorId = ccGlobalFunctionData.getVisitorId();
    ccGlobalFunctionData.getCookieId($(that));
    let aesUtil = new AesUtil(128, 1000);
    let nodeVal = aesUtil.ltyEncrypt(ccGlobalFormData.resourcePath);
    let pincode = aesUtil.ltyEncrypt(ccGlobalFormData.pinCode);
    $.ajax({
        type: "GET",
        url: "/apcolourcatalogue/incompleteFormFills" + '.json',
        data:
        {
            visitorId: ccGlobalFunctionData.visitorId,
            node: nodeVal,
            name: ccGlobalFormData.fName,
            mobile: ccGlobalFormData.mobileNo,
            email: ccGlobalFormData.email,
            pinCode: pincode,
            description: ccGlobalFormData.description,
            url: ccGlobalFormData.pageUrl,
            submitStatus: status
        },
        success: function(result) {
            if (result.Status == 'Success') {
                console.log("Success!")
            } else {
                console.log("Fail!")
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

ccGlobalFunctionData.cookieForCampaignId = function() {
    var url_string = window.location.href;
    if (url_string.match("tcid")) {
        var tcid = ccGlobalFunctionData.getURLParameter("tcid");
        var date = new Date();
        date.setTime(date.getTime() + (30 * 60 * 1000));
        $.cookie('campaign_cookie_ID', tcid, {
            expires: date,
            path: '/'
        });
    }
    if (url_string.match("rcid")) {
        var rcid = ccGlobalFunctionData.getURLParameter("rcid");
        var date = new Date();
        date.setTime(date.getTime() + (30 * 60 * 1000));
        $.cookie('product_reference_cookie_ID', rcid, {
            expires: date,
            path: '/'
        });
    }
    if (url_string.match("soa_id")) {
        var soa_id = ccGlobalFunctionData.getURLParameter("soa_id");
        var date = new Date();
        date.setTime(date.getTime() + (30 * 60 * 1000));
        $.cookie('soa_cookie_id', soa_id, {
            expires: date,
            path: '/'
        });
    }
}
ccGlobalFunctionData.getCookieId = function(that) {
    let rcId = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-rcidparameter');
    let tcId = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-tcidparameter');
    let soaId = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-soaidparameter');
    if (tcId == 'true' && $.cookie('campaign_cookie_ID') != null) {
        let campaignCookie = $.cookie('campaign_cookie_ID');
        ccGlobalFormData.campaignId = campaignCookie;
        ccGlobalFormData.campaignIdDecor = campaignCookie;
        ccGlobalFormData.campaignIdAPHES = campaignCookie;
        ccGlobalFormData.campaignIdPT = campaignCookie;
        ccGlobalFormData.campaignIdCCO = campaignCookie;
        ccGlobalFormData.campIdForPaidUsers = campaignCookie;
    }
    if (rcId == 'true' && $.cookie('product_reference_cookie_ID') != null) {
        ccGlobalFormData.description = $.cookie('product_reference_cookie_ID');
    }
    if (soaId == 'true' && $.cookie('soa_cookie_id') != null) {
        ccGlobalFormData.dummy2 = $.cookie('soa_cookie_id');
    }
}
ccGlobalFunctionData.bookAppointment = function(that) {
    $.ajax({
        type: "POST",
        url: '/apcolourcatalogue/ccforms/APIhandler' + '.bookAppointment.json',
        data: ccGlobalFormData,
        success: function(bookAppointmentResult) {
            if (bookAppointmentResult.status == "success") {
                if (bookAppointmentResult.returnMap[4] && bookAppointmentResult.returnMap[4].value.value == "Success") {
                    ccGlobalFormData.userBookedAppointment = true;
                    if (bookAppointmentResult.returnMap[2].value != undefined) {
                        ccGlobalFormData.hybris_id = bookAppointmentResult.returnMap[2].value.value;
                        $(that).parents('.form-attributes').find('.enquire-form__step-4 .appointmentCrmId').html('');
                        $(that).parents('.form-attributes').find('.enquire-form__step-4 .appointmentCrmId').html(ccGlobalFormData.hybris_id);
                        $(that).parents('.form-attributes').find('.enquire-form__step-4 .booking-id').css('display', 'block');
                    }
                    if (bookAppointmentResult.returnMap[0].value != undefined) {
                        ccGlobalFormData.cc_sa_bp = bookAppointmentResult.returnMap[0].value.value;
                    }
                } else {
                    ccGlobalFormData.userBookedAppointment = false;
                    ccGlobalFunctionData.displayErrorMessage($(that));
                }
            } else {
                $(that).parents('.form-attributes').find('.custom-enquire-form-step-1').css('display', 'none');
                $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'none');
                $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'none');
                $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'block');
            }
        },
        error: function(xhr) {
            ccGlobalFunctionData.displayErrorMessage($(that));
        }
    }).done(function() {
        ccGlobalFunctionData.insertUserDetails(2, $(that));
    });
}
ccGlobalFunctionData.insertUserDetails = function(stepNumber, that) {
    $.ajax({
        type: "POST",
        url: '/apcolourcatalogue/ccforms/saveUserDetails' + '.saveUserDetails.json',
        data: ccGlobalFormData,
        success: function(schedulerResult) {
            if (schedulerResult.Record_Status_Update) {
                if (stepNumber == 2 && ccGlobalFormData.userBookedAppointment) {
                    $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'none');
                    ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-allsteps') == "true"
                    || ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-stepthree') == "true"
                    ? $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'block') : $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'block');
                } else if (stepNumber == 3 || !ccGlobalFormData.userBookedAppointment) {
                    $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'none');
                    $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'none');
                    $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'block');
                }
            } else {
                ccGlobalFunctionData.displayErrorMessage($(that));
            }
        },
        error: function(xhr) {
            ccGlobalFunctionData.displayErrorMessage($(that));
        }
    });
}

ccGlobalFunctionData.displayErrorMessage = function(that) {
    $(that).parents('.form-attributes').find('.thank-you-message').css('display', 'none');
    $(that).parents('.form-attributes').find('.thankYouTitle').css('display', 'none');
    $(that).parents('.form-attributes').find('.thank-you-image-path').css('display', 'none');
    $(that).parents('.form-attributes').find('.error-image-path').css('display', 'block');
    $(that).parents('.form-attributes').find('.errorTitle').css('display', 'block');
    $(that).parents('.form-attributes').find('.error-message').css('display', 'block');
    $(that).parents('.form-attributes').find('.custom-enquire-form-step-1').css('display', 'none');
    $(that).parents('.form-attributes').find('.enquire-form__step-2').css('display', 'none');
    $(that).parents('.form-attributes').find('.enquire-form__step-3').css('display', 'none');
    if ($(".form-file-upload-gamification").length === 0) {
        $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'block');
    } else {
        $(that).parents('.form-attributes').find('.enquire-form__step-4').css('display', 'none');
        $(".game-file-form-container").addClass("d-none");
        $(".game-thankyou.failure").removeClass("d-none");
        scrollTopGamification(100);
    }
    $(that).parents('.form-attributes').find('.enquire-form__step-4 .appointmentCrmId').html('');
    $(that).parents('.form-attributes').find('.enquire-form__step-4 .booking-id').css('display', 'none');
    ccAnalytics.noService();
    $(".form-revamp-thankyou").closest(".enquire-form__step-4").addClass("form-thankyou-revamp-container");
    if ($(".form-revamp-thankyou").closest(".enquire-form__step-4").length > 0) {
        var imgClose = $('<img loading="lazy" alt="closeIcon" title="closeIcon" id="formsCloseIcon">');
        imgClose.attr('src', '/etc.clientlibs/apcolourcatalogue/clientlibs/clientlib-global/resources/images/CloseIconForm.webp');
        $(".form-thankyou-revamp-container .iconLinks.enquire-form__close .spriteIcon-Aprevamp").replaceWith(imgClose);
    }
}

$(document).on('focusout', '#enquire-mobile', function() {
    var mobileNumber = $(this).val();
    if (mobileNumber != '' && mobileNumber != undefined) {
        if (phoneNumberIsValid(mobileNumber)) {
            //ccGlobalFunctionData.incompleteFormFillSubmit(0, $(this));
        }
    }
});
$(document).on('focusout', '#enquire-email', function() {
    var emailId = $(this).val();
    if (emailId != '' && emailId != undefined) {
        if (emailIsValid(emailId)) {
            //ccGlobalFunctionData.incompleteFormFillSubmit(0, $(this));
        }
    }
});
ccGlobalFunctionData.sendWhatsAppMessage = function(service, templateId) {
    if (ccGlobalFormData.whatsAppConsent != undefined && ccGlobalFormData.whatsAppConsent == 'Y') {
        var name = ccGlobalFormData.fName;
        var mobileNumber = ccGlobalFormData.mobileNo;
        var pinCodeValue = ccGlobalFormData.pinCode;
        var apiData = JSON.stringify("{\"event\":{\"code\":\"WELCOME_MESSAGE\",\"data\":{\"countryCode\":\"91\",\"mobile\":\"91" + mobileNumber + "\",\"name\":\"" + name + "\",\"pincode\":\"" + pinCodeValue + "\",\"serviceType\":\"" + service + "\",\"bpNumber\":\"\",\"leadId\":\"\",\"messageTemplateId\":\"" + templateId + "\",\"visitDate\":\"\",\"visitTime\":\"\"}}}");
        $.ajax({
            type: "POST",
            url: "/asianpaints/whatsAppMessage" + '.json',
            data: {
                apiData: apiData
            },
            success: function(result) {
                if (result == 'Success') {
                    console.log("Success!")
                    console.log(service + " message sent successfully")
                } else {
                    console.log("Fail!")
                    console.log("Error in " + service + " service")
                }
            },
            error: function(xhr) {
                console.log("Error!")
            }
        });
    }
}

ccGlobalFunctionData.sendWhatsAppMessageCorporateForm = function() {
    if (ccGlobalFormData.whatsAppConsent != undefined && ccGlobalFormData.whatsAppConsent == 'Y') {
        var name = ccGlobalFormData.fName;
        var lname = ccGlobalFormData.lName;
        var mobileNumber = ccGlobalFormData.mobileNo;
        var pinCodeValue = ccGlobalFormData.pinCode;
        var firstAddressVal = ccGlobalFormData.firstAddress;
        var apiData = JSON.stringify("{\"triggerJourney\":\"website-lead\",\"variables\":{\"first_name\":\"" + name + "\",\"last_name\":\"" + lname + "\",\"phone_number\":\"91" + mobileNumber + "\",\"address\":\"" + firstAddressVal + "\",\"pincode\":\"" + pinCodeValue + "\"}}");
        $.ajax({
            type: "POST",
            url: "/asianpaints/whatsAppMessage.corporateFormApi" + '.json',
            data: {
                apiData: apiData
            },
            success: function(result) {
                if (result == 'Success') {
                    console.log("Success!")
                    //console.log(service + " message sent successfully")
                } else {
                    console.log("Fail!")
                    //console.log("Error in " + service + " service")
                }
            },
            error: function(xhr) {
                console.log("Error!")
            }
        });
    }
}

ccGlobalFunctionData.getFormAttributeData = function(that, dataAttribute) {
    var attributeValue = $(that).parents('.form-attributes').attr(dataAttribute);
    return attributeValue != undefined ? attributeValue : '';
}

ccGlobalFunctionData.thankYouStepRender = function(that) {
    furnitureLeadForm = $('#globalFormPopUp:visible').length > 0 ? '<div class="col-lg-12 col-12">' : '<div class="col-lg-6 col-12">';
    let pdfDownloadMarkup = "";
    let bhsConsentMarkup = "";
    let bhsConsentCheck = $("#enableBhsConsent").val() !== undefined ? Boolean($("#enableBhsConsent").val()):false;

    /*Adding Custom Changes for Color Inspiration Zone Form Varient*/

    let cizReturnToHomeButton = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-cizReturnHomeTitle');
    let cizReturnToHomeButtonLink = "";
    cizReturnToHomeButtonLink = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-cizReturnHomeLink');
    cizReturnToHomeButtonLink = cizReturnToHomeButtonLink != '' ? cizReturnToHomeButtonLink : 'javascript:void(0)';

    let cizReturnToGalleryButton = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-cizReturnGalleryTitle');
    let cizReturnToGalleryButtonLink = "";
    cizReturnToGalleryButtonLink = ccGlobalFunctionData.getFormAttributeData(that, 'data-attr-cizReturnGalleryLink');
    cizReturnToGalleryButtonLink = cizReturnToGalleryButtonLink != '' ? cizReturnToGalleryButtonLink : 'javascript:void(0)';

    if(bhsConsentCheck){
        bhsConsentMarkup = '<div class="ctaComp baseBtn" style="margin-bottom:10px"><button class="ctaText enquireForm--step-1-submit track_form_submit bhsConsentSubmit" data-current-step="1">SUBMIT</button><p class="bhs_reg_success" style="display:none; clor:green;">Submitted Sucessfully</p></div>';
        if(bhsConsentData.bhsThankYouMsg!=""){
            ccGlobalFormData.thankYouDesc = bhsConsentData.bhsThankYouMsg;
        }
    }
    if (!ccGlobalFormData.defaultCampaignIdStatus) {
        if (ccGlobalFormData.pdfPath) {
            var pdfLink = (ccGlobalFormData.isRestricted == 'true' ? 'javascript:void(0)' : ccGlobalFormData.pdfPath);
            pdfDownloadMarkup = '<div class="ctaComp whiteBtn"><a href=' + pdfLink + ' onclick="ccAnalytics.trackPdfDownload(this)" data-attr-isrestricted="'+ccGlobalFormData.isRestricted+'" data-attr-restrictedpath="'+ccGlobalFormData.pdfPath+'" download> <button tabindex = "0" class="ctaText download-catalogue track_form_pdf"> <span class="enquire-form--submitBtn">' +
                ccGlobalFormData.thankYouSubmitText + '</span> <span class="iconsWithText iconsWithText__right' + 'spriteIcon-AprevampPhase3 downloadPDFIcon"></span> </button> </a> </div> </div>';
        }
    }
/*Adding Custom Changes 'Declareing thankYouStepMarkUp on globalscope' & Adding the Necessary if() else condition for CIZ variant*/
        if($('.ciz-form-varient').length < 1){
            if(ccGlobalFormData.newThankYouVariant=="true"){
             ccGlobalFormData.thankYouImageRedirectionURL = (ccGlobalFormData.thankYouImageRedirectionURL && ccGlobalFormData.thankYouImageRedirectionURL!='javascript:void(0)') ? ccGlobalFormData.thankYouImageRedirectionURL : '/content/ap/en/home/services/beautiful-homes-service.html';
             thankYouStepMarkUp =
             '<div class="enquire-form__dismissible-content form-revamp-thankyou">'+
             '<div class="row no-gutters">'+
                 '<div class="col-lg-4 col-12 form-revamp-thankyou-left">'+
                     '<div class="textOverImageWrap__parent text-overlay custom-visible-overlay">'+
                         '<div class="thank-you-image-path thank-you-image-left" style="display: block;">'+
                             '<div class="thank-you-left-content">'+
                                 '<h2>'+ccGlobalFormData.thankYouTitleTxt+'</h2>'+
                                 '<p>'+ccGlobalFormData.thankYouPopupSuccessDescription+'</p>'+
                             '</div>'+
                         '</div>'+
                         '<div class="error-image-path error-image-left" style="display: none;">'+
                             '<div class="error-left-content">'+
                                 '<h2>'+ccGlobalFormData.errorTitleTxt+'</h2>'+
                                 '<p>'+ccGlobalFormData.thankYouPopupErrorDescription+'</p>'+
                             '</div>'+
                         '</div>'+
                     '</div>'+
                 '</div>'+
                 '<div class="col-lg-8 col-12 form-revamp-thankyou-right">'+
                     '<div class="enquire-form__step-4--content form-revamp-thankyou-right-content" style="--bg-image-desktop: url('+ccGlobalFormData.thankYouImageDesktop+'); --bg-image-mob: url('+ccGlobalFormData.thankYouImageMobile+');"">'+
                         '<div class="thank-you-message" style="display: block">'+
                             '<p class="thank-you-message-title">'+ccGlobalFormData.thankYouPopupHeading+'</p>'+
                             '<p class="thank-you-message-subtitle">'+ccGlobalFormData.thankYouPopupSubHeading+'</p>'+
                             '<div class="cta ctaComp baseBtn">'+
                                 '<a href='+ccGlobalFormData.thankYouImageRedirectionURL+' target="_self" class="ctaText trackCTA animated-arrow-btn yellow-gradient" data-attr-isrestricted="false">'+ccGlobalFormData.bookAVisitCTALabel+'<span class="arrow"></span></a>'+
                             '</div>';
                             if(ccGlobalFormData.downloadPdfLink){
                                 thankYouStepMarkUp = thankYouStepMarkUp +'<a href='+ccGlobalFormData.downloadPdfLink+' class="error-message-download" onclick="ccAnalytics.trackPdfDownload(this)" data-attr-isrestricted="true" data-attr-restrictedpath='+ccGlobalFormData.downloadPdfLink+' download="">'+ccGlobalFormData.thankYouSubmitText+'</a>';
                             }
                         thankYouStepMarkUp = thankYouStepMarkUp +'</div>'+
                         '<div class="error-message" style="display: none">'+
                             '<p class="error-message-title">'+ccGlobalFormData.thankYouPopupHeading+'</p>'+
                             '<p class="error-message-subtitle">'+ccGlobalFormData.thankYouPopupSubHeading+'</p>'+
                             '<div class="cta ctaComp baseBtn">'+
                                 '<a href='+ccGlobalFormData.thankYouImageRedirectionURL+' target="_self" class="ctaText trackCTA animated-arrow-btn yellow-gradient" data-attr-isrestricted="false">'+ccGlobalFormData.bookAVisitCTALabel+'<span class="arrow"></span></a>'+
                             '</div>';
                             if(ccGlobalFormData.downloadPdfLink){
                                 thankYouStepMarkUp = thankYouStepMarkUp +'<a href='+ccGlobalFormData.downloadPdfLink+' class="error-message-download" onclick="ccAnalytics.trackPdfDownload(this)" data-attr-isrestricted="true" data-attr-restrictedpath='+ccGlobalFormData.downloadPdfLink+' download="">'+ccGlobalFormData.thankYouSubmitText+'</a>';
                             }
                        thankYouStepMarkUp = thankYouStepMarkUp + '</div>'+
                     '</div>'+
                 '</div>'+
             '</div>'+
         '</div>';
         } else {




        // if(fullImageGifThankYou){
        //      thankYouStepMarkUp = fullWidthThankYouGifMarkup();
        //     } else {
                thankYouStepMarkUp =
                '<div class="enquire-form__dismissible-content"> <div class="row no-gutters">'+
                furnitureLeadForm +
                '<div class="textOverImageWrap__parent text-overlay ' + ccGlobalFormData.imageShadeEffect +' custom-visible-overlay"><div class="thank-you-image-path">' +
                '<picture><source class="lazy" media="(max-width:575px)" srcset="" data-srcset=' + ccGlobalFormData.thankYouImage +
                '> <source class="lazy"' + 'media="(min-width:576px) and (max-width:767px)" srcset=' +
                ccGlobalFormData.thankYouImage + '><source media="(min-width:768px) and (max-width:991px)" srcset=' +
                ccGlobalFormData.thankYouImage + '><source media="(min-width:992px)" srcset=' +
                ccGlobalFormData.thankYouImage + '><img src=' +
                ccGlobalFormData.thankYouImage + ' alt=' + ccGlobalFormData.thankYouImageAlt + ' title=' +
                ccGlobalFormData.thankYouImageTitle + '></picture></div><div class="error-image-path"><picture>' +
                '<source class="lazy" media="(max-width:575px)" srcset=' + ccGlobalFormData.errorImage +
                ".transform/cc-width-375-height-200/image." +
                ccGlobalFormData.errorImageExt + '><source media="(min-width:576px) and (max-width:767px)" srcset=' +
                ccGlobalFormData.errorImage + ".transform/cc-width-360-height-200/image." +
                ccGlobalFormData.errorImageExt + '> <source media="(min-width:768px) and (max-width:991px)" srcset=' +
                ccGlobalFormData.errorImage + ".transform/cc-width-768-height-1024/image." +
                ccGlobalFormData.errorImageExt + '><source media="(min-width:992px)" srcset=' +
                ccGlobalFormData.errorImage + ".transform/cc-width-457-height-465/image." +
                ccGlobalFormData.errorImageExt + '><img src=' + ccGlobalFormData.errorImage +
                ".transform/cc-width-457-height-465/image." +
                ccGlobalFormData.errorImageExt + ' alt=' + ccGlobalFormData.errorImageAlt + ' title=' +
                ccGlobalFormData.errorImageTitle + '> </picture> </div> <a class="ccFormsImgRedirection" href=' + ccGlobalFormData.thankYouImageRedirectionURL  +'><div class="textOverImageWrap textOverImageWrap--align-center textOverImageWrap--align-center-center"> <h2 class="thankYouTitle">' +
                ccGlobalFormData.thankYouTitleTxt + '</h2> <h2 class="errorTitle">' +
                ccGlobalFormData.errorTitleTxt + '</h2> </div></a> </div> </div>'+
                furnitureLeadForm +
                '<div class="enquire-form__step-4--content"> <div class="thank-you-message"> <p class="booking-id">' +
                'Your Booking ID is: <strong><span class="appointmentCrmId"></span></strong></p>' +
                ccGlobalFormData.thankYouDesc + '</div> ' + bhsConsentMarkup +
                '<div class="error-message">' +
                ccGlobalFormData.errorDesc + '</div>' + pdfDownloadMarkup + '</div></div></div>';
            // }




            }
        }
        // Color Inspiration PDP Form Success & Error rendering Start
        else{
                thankYouStepMarkUp = '<div class="enquire-form__dismissible-content">'+
                    furnitureLeadForm +
                    '<div class="enquire-form__step-4--content"> <div class="thank-you-message"> <div class="successInspiration"> <div class="sharetool pdpBannerIcon pdp-temp"> <span id="wishlist-opt" class="spriteIcon-Aprevamp successIcon track_share_wishlist"> </span> </div> <div class="thankuHeading centerAlign">' + ccGlobalFormData.thankYouTitleTxt + '</div>' +
                    '<div class="ctawishlist cta ctaComp linkBtn linkBtn1 purpleColorText"> <div class="centerAlign"> <a href="' + cizReturnToHomeButtonLink + ' "target="'  + ccGlobalFunctionData.getFormAttributeData(that,'data-attr-cizReturnHomeTarget') +
                    '" class="ctaText trackCTA">' + cizReturnToHomeButton + '</a> </div> </div>' +
                    '<div class="ctawishlist cta ctaComp linkBtn linkBtn2 purpleColorText"> <div class="centerAlign"> <a href="' + cizReturnToGalleryButtonLink + ' "target="' + ccGlobalFunctionData.getFormAttributeData(that,'data-attr-cizReturnGalleryTarget') +
                    '" class="ctaText trackCTA">' + cizReturnToGalleryButton + '</a> </div> </div> </div>' +
                    '</div> ' + bhsConsentMarkup + '<div class="error-message"> <div class="sharetool pdpBannerIcon pdp-temp"> <span id="wishlist-opt" class="spriteIcon-Aprevamp errorIcon track_share_wishlist"> </span> </div>' + ccGlobalFormData.errorDesc + '</div>' + '</div></div></div>';
        }
        // Color Inspiration PDP Form Success & Error rendering Ends

        $(that).parents(".form-attributes").find(".custom-enquire-form-mark-up").html("");
        $(that).parents(".form-attributes").find(".custom-enquire-form-mark-up").append(thankYouStepMarkUp);
        $(".error-message").css("display", "none");
        $(".errorTitle").css("display", "none");
        $(".booking-id").css("display", "none");
        $(".error-image-path").css("display", "none");



// In ccGlobalFunctionData.thankYouStepRender
if (window.innerWidth <= 600 && $(that).length > 0) {
  // Prefer legacy step-1 container if present; otherwise fall back to CVV root or body
  var $target = $(that).closest(".enquire-form__step-1");
  if (!$target.length) {
    // CVV fallback: scroll to the component root or its active step
    var $cvvRoot = $(that).closest(".campaignVerticalVariant");
    if ($cvvRoot.length) {
      $target = $cvvRoot.find(".cvv-step.active").first();
      if (!$target.length) $target = $cvvRoot; // ultimate fallback
    } else {
      $target = $(that); // last resort
    }
  }

  var off = $target.offset && $target.offset();
  if (off && typeof off.top === "number") {
    $("html,body").animate({ scrollTop: off.top - 50 }, 0);
  }
}

    if ($(".profile-js-handle").length !== 0) {
        attachEventLogin();
    }
    setTimeout(function(){
        var ccAnalyticsFormFileds = [];
        var formSubmissionFields = $.cookie('CCFormFields');
        ccAnalyticsFormFileds = formSubmissionFields ? formSubmissionFields.split('|') : {};
        if (typeof window.dataLayer !== 'undefined' && typeof window.dataLayer.enhanceConversion !== 'undefined') {
        window.dataLayer.enhanceConversion = window.dataLayer.enhanceConversion || [];
        window.dataLayer.enhanceConversion.push({
            'name': ccAnalyticsFormFileds[0] ? ccAnalyticsFormFileds[0] : '',
            'email': ccAnalyticsFormFileds[1] ? ccAnalyticsFormFileds[1] : '',
            'mobileNumber': ccAnalyticsFormFileds[2] ? ccAnalyticsFormFileds[2] : '',
            'pincode': ccAnalyticsFormFileds[3] ? ccAnalyticsFormFileds[3] : ''
        });
        }
        console.log("enhanceConversion added in dataLayer..");
    }, 1500);
    return true;
}

ccGlobalFunctionData.sendmessage = function(serviceDetails, templateId) {
if (templateId != null && templateId != undefined) {
        ccGlobalFunctionData.sendWhatsAppMessage(serviceDetails, templateId);
    }
}

ccGlobalFunctionData.errorPagePopUp = function(that) {
    let errorMarkUp = '<div class="enquire-form__dismissible-content"> <div class="row no-gutters"><div class="col-lg-6 col-12">' +
        '<div class="textOverImageWrap__parent text-overlay ' + ccGlobalFormData.imageShadeEffect + ' custom-visible-overlay"><div class="error-image-path"><picture>' +
            '<source class="lazy" media="(max-width:575px)" srcset=' + ccGlobalFormData.errorImage +
            ".transform/cc-width-375-height-200/image." +
            ccGlobalFormData.errorImageExt + '><source media="(min-width:576px) and (max-width:767px)" srcset=' +
            ccGlobalFormData.errorImage + ".transform/cc-width-360-height-200/image." +
            ccGlobalFormData.errorImageExt + '> <source media="(min-width:768px) and (max-width:991px)" srcset=' +
            ccGlobalFormData.errorImage + ".transform/cc-width-768-height-1024/image." +
            ccGlobalFormData.errorImageExt + '><source media="(min-width:992px)" srcset=' +
            ccGlobalFormData.errorImage + ".transform/cc-width-457-height-465/image." +
            ccGlobalFormData.errorImageExt + '><img src=' + ccGlobalFormData.errorImage +
            ".transform/cc-width-457-height-465/image." +
            ccGlobalFormData.errorImageExt + ' alt=' + ccGlobalFormData.errorImageAlt + ' title=' +
            ccGlobalFormData.errorImageTitle + '> </picture> </div> <div class="textOverImageWrap textOverImageWrap--align-center textOverImageWrap--align-center-center"> <h2 class="errorTitle">' +
            ccGlobalFormData.errorTitleTxt + '</h2> </div> </div> </div> <div class="col-lg-6 col-12">' +
            '<div class="enquire-form__step-4--content"> <div class="error-message">' +
            ccGlobalFormData.errorDesc + '</div></div></div></div>';
            $(that).parents(".form-attributes").find(".custom-enquire-form-mark-up").html("");
            $(that).parents(".form-attributes").find(".custom-enquire-form-mark-up").append(errorMarkUp);
            $(".error-message").css("display", "none");
            $(".errorTitle").css("display", "none");
            $(".booking-id").css("display", "none");
            $(".error-image-path").css("display", "none");
}

ccGlobalFunctionData.thankYouPageRedirection = function() {
    let now = new Date();
    let submittedFormName = $('.enquire-form__step-1 h2').text().trim();
    submittedFormName = submittedFormName ? submittedFormName : '';
    document.cookie = "submittedFormName=" + submittedFormName + ";path=/";
    if(ccGlobalFormData.succussPageUrl != "" && ccGlobalFormData.succussPageUrl != undefined) {
        window.location.href =  ccGlobalFormData.succussPageUrl;
    }
}

//BHS Consent

$(".enquire-form__dismissible-content").on('click',"button.bhsConsentSubmit", function(){
    ccGlobalFunctionData.formSubmit("bhsConsent");
    ccGlobalFormData.bhsSubmitFlag = true;
});

ccGlobalFunctionData.resetFormsOnLogout = function(){
    $("input[name='ENQUIRE_NAME']").length > 0 ? $("input[name='ENQUIRE_NAME']").val("") : "";
    $("input[name='ENQUIRE_EMAIL']").length > 0 ? $("input[name='ENQUIRE_EMAIL']").val("") : "";
    $("input[name='ENQUIRE_MOBILE']").length > 0 ? $("input[name='ENQUIRE_MOBILE']").val("") : "";
    $("input[name='ENQUIRE_PINCODE']").length > 0 ? $("input[name='ENQUIRE_PINCODE']").val("") : "";
    ccGlobalFunctionData.checkCookieValues();
}

ccGlobalFunctionData.generateOTP = function(e) {
    allowOTPinBannerForm == true ? "" : $(".rotating.js-rotatingLeadForm").removeClass("d-none");
	let aesUtil = new AesUtil(128, 1000);
    let mobile = allowOTPinBannerForm == true ? aesUtil.ltyEncrypt($("input[id='bhs-cal-mob-no']").val()) : aesUtil.ltyEncrypt(ccGlobalFormData.mobileNo);
    if (mobile) {
        $.ajax({
            type: "GET",
            url: "/apcolourcatalogue/ccforms" + '.getOtp.json',
            data: {
                  mobileNo : mobile
              },
            async: false,
            success: function(msg) {
                if (allowOTPinBannerForm == true) {
                    sessionStorage.setItem("CCKey", msg.key);
                    $("#verify-otp .rotating.js-rotatingLeadForm").addClass("d-none");
                    try {                        
                        $(".form-otp #verify-otp").addClass('otp-delivered');
                        $(".form-otp #verify-otp").attr('style', 'opacity: 0.6;cursor: no-drop;display:inline-flex');
                        $(".digit-group input[type='text']").removeAttr("disabled");
                        $('.form-otp .input-title').attr('style', 'opacity: 1;');
                        $('.timer .time').attr('style', 'color: #27AE60;');
                        $('.otp-mob-number').css("opacity", "0.6");
                        $('.form-otp .edit-value').attr('style', 'opacity: 1;cursor: pointer;');
                        resetOTPTimer();
                        if(phValidationAnalytics){
                            if (typeof (_satellite) != "undefined") {
                                _satellite.track("BHS_AA_Phoneno", {
                                    "flowType": "BHPS OTP Verification"
                                });
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    $(".rotating.js-rotatingLeadForm").addClass("d-none");
                    try {
                        sessionStorage.setItem("CCKey", msg.key);
                        $("#formOTPSubmitCTA").show();
                        $("#formOTPValidateCTA").hide();
                        $('.otp-timer').show();
                        setTimeout(function () {
                            ccGlobalFunctionData.myTimer() //to clear session storage.
                        }, 60000);//1 min
                        ccGlobalFunctionData.OtpTimer();
                    } catch (e) {
                        console.log(e);
                    }
                }
            },
            error: function () {
                if (allowOTPinBannerForm == true) {
                    $("#verify-otp .rotating.js-rotatingLeadForm").addClass("d-none");
                } else {
                    $(".rotating.js-rotatingLeadForm").addClass("d-none");
                }
            }
        });
    } else {
        if (allowOTPinBannerForm == true) {
            $("#verify-otp .rotating.js-rotatingLeadForm").addClass("d-none");
            console.log('Error in getting mobile no.');
        } else {
            $(".rotating.js-rotatingLeadForm").addClass("d-none");
            console.log('Error in getting mobile no.');
        }
    }
}

ccGlobalFunctionData.OtpTimer = function() {
    setTimeout(function() {
        startTimerCount(60, $('.otp-timer'));
    }, 1000);
}
function startTimerCount(duration, display) {
    var timer = duration, minutes, seconds;
    var timeOut = setInterval(function() {
        var modalOpenCounter = 0;
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.html(minutes + ":" + seconds);
        $('.modal').each(function(){
            if($(this).css('display')!='none'){
                modalOpenCounter++;
            }
        });
        if(modalOpenCounter == 0){
            timer = 0;
            display.html('00' + ":" + '00');
            clearInterval(timeOut);
            $('.otp-timer').show();
            $("#formOTPSubmitCTA").show();
            $("#formOTPValidateCTA").hide();
            return;
        }
        if (--timer < 0) {
            clearInterval(timeOut);
            $('.otp-timer').hide();
            $("#formOTPSubmitCTA").hide();
            $("#formOTPValidateCTA").show();
        }
    }, 1000);
}

ccGlobalFunctionData.myTimer = function() {
    sessionStorage.clear();
}

ccGlobalFunctionData.verifyOtp = function(otpVal) {
    if (otpVal && otpVal.length == 6) {
        allowOTPinBannerForm == true ? $("#thankyoupopId .rotating.js-rotatingLeadForm").removeClass("d-none") : $(".rotating.js-rotatingLeadForm").removeClass("d-none");
        $.ajax({
            type: "POST",
            url: "/apcolourcatalogue/ccforms" + ".otpVerification.json",
            data: {
                otpData : otpVal
            },
            success: function(response) {
                if (response) {
                    if (allowOTPinBannerForm == true) {
                        $('.otp-timer').hide();
                        var output = response.keyData;
                        if (output == sessionStorage.getItem('CCKey')) {
                            if (typeof (_satellite) != "undefined") {
                                _satellite.track("BHS_AA_OTP", {
                                    "flowType": "BHPS OTP Success"
                                });
                            }
                            $(".digit-group input").val("");
                            $(".form-otp .timer .time").text(`00:59`);
                            $(".form-otp .timer .time").css("visibility", "initial");
                            $(".form-otp .timer .resend-otp").removeClass('red');
                            $(".otp-field-section .otp-field-error").addClass('d-none');
                            $('.form-otp').hide();
                            $('.enquire-form__dismissible-container--head').removeClass('d-none');
                            $('.enquire-form__dismissible-content.custom-enquire-form-mark-up').removeClass('d-none');
                            $('.ccforms .ccFormScheduler .js-banner-active-target').removeClass('d-flex');                           
                            clearInterval(timer);
                            console.log('otp validation success...!');
                        } else {
                            $('.otp-field-error').removeClass('d-none');
                        }

                    } else {
                        $('.otp-timer').hide();
                        var output = response.keyData;
                        if (output == sessionStorage.getItem('CCKey')) {
                            if (ccGlobalFormData.resourcePath && ccGlobalFormData.resourcePath.includes("/content/ap/en/")) {
                                ccAnalytics.formSubmit(ccGlobalFormData.parentFormElement, "otpverified");
                            }
                            setCookie("campaignFormSubmit", "campaignformSubmitCookie");
                            function setCookie(name, value) {
                                document.cookie = name + "=" + value;
                            }
                            ccGlobalFunctionData.saveLeadsToDB($(ccGlobalFormData.currentItem));
                            if (!ccGlobalFormData.enableFileUpload) {
                                modalHandler.closeModal(otpModal);
                                $(".rotating.js-rotatingLeadForm").addClass("d-none");
                            }
                            console.log('otp validation success...!');
                        } else if (sessionStorage.getItem('CCKey') == null) {
                            $("#formOTPSubmitCTA").hide();
                            $("#formOTPValidateCTA").show();
                            $('#otpFail').html("Session Expired, Please Try Again...!").show();
                        } else {
                            $("#formOTPSubmitCTA").show();
                            $("#formOTPValidateCTA").hide();
                            $('.otp-timer').show();
                            $('#otpFail').html("Invalid OTP. Please Try Again...!").show();
                        }
                    }
                } else {
                    $("#thankyoupopId .rotating.js-rotatingLeadForm").addClass("d-none");
                }
            },
            error: function () {
                allowOTPinBannerForm == true ? $("#thankyoupopId .rotating.js-rotatingLeadForm").addClass("d-none") : $(".rotating.js-rotatingLeadForm").addClass("d-none");
            }
        });
    }
};

// Hide background banner on success/error after form submit for form varient: enquire-form--banner-replace-variant
function onFormSubmitOfBannerReplaceVarient(that) {
    if ($(that).parents(".enquire-form--banner-replace-variant").length !== 0 && ccGlobalFormData.isLeadNonBHS) {
        if ($(that).parents(".enquire-form--banner-replace-variant").hasClass("pad40")) {
            $(that).parents(".enquire-form--banner-replace-variant").removeClass("pad40");
            $(that).parents(".enquire-form--banner-replace-variant").removeClass("letMeHelpForm-wp");
            $(that).parents(".enquire-form--banner-replace-variant").css("background", "#fff");
            $(that).parents(".form-banner-wrapper").find(".js-banner-active-target").hide();
            // Form becomes responsive at 1200px
            if (!(screen.width <= 1200 || window.innerWidth <= 1200)) {
                $(that).parents(".form-banner-wrapper").find(".enquire-form.enquire-form-override").css("position", "relative");
            }
        }
    }
}

// Add flex class to radio buttons of horizontal closed forms
let parentEle = $('.disclaimer-group').closest('.form-group-global');
if (parentEle.length > 0) {
    parentEle.each(function (i, currentElement) {
        if ($(currentElement).siblings('.enquire-form__steps-overview').length > 0) {
            let radioButtonGroup = $(currentElement).find('.disclaimer-group');
            radioButtonGroup.each(function (i, ele) {
                $(ele).addClass("disclaimer-group__flex");
            });
        }
    });
}

// Add class(enquire-form__step-1--minimal__with-disclaimer-radio) to vertical form inside the banner only if radio buttons are present
let bannerFormParentEle = $(".disclaimer-group").closest(".enquire-form.enquire-form-override");
if (bannerFormParentEle.length > 0) {
    $(".enquire-form.enquire-form-override").children('.enquire-form__step-1--minimal').addClass("enquire-form__step-1--minimal__with-disclaimer-radio");
}

// Stickyforms analytics implementation
$("#stickyFormBtn").click(function () {
    let ctaText = $(this).find(".ctaText").text().trim();
    if (ccAnalytics.digitalData()) {
        digitalData.data = {
            "cta_": ctaText
        };
    }
    if (ccAnalytics.satelliteCheck()) {
        _satellite.track("sticky_cta_click", {
            "cta_": ctaText
        });
    }
});

// Form Vertical Variant JS Starts

// Update Input Field colors based on Config & default values
let inputFieldBg = $(".formVerticalVariant input").attr("data-input-field-color");
// let formBg = $(".formVerticalVariant .formVerticalVariantContainer").attr("data-form-bg-color");

$(".formVerticalVariant:not('.vertical-whitevariant') input[type='text']").focus(function () {
    $(this).css("background", "transparent");
    $(this).siblings('.form-text-input__label').removeClass("d-none");
    $(this).closest('.formVerticalVariantContainer').find('.form-text-input__label').css('background',$(this).closest('.formVerticalVariantContainer').attr('data-form-bg-color'));
    $(this).css("border", "1px solid #fff");
});
// form-vertical-white-variant
$(".vertical-whitevariant input[type='text']").focus(function () {
    $(this).css("background", "transparent");
    $(this).siblings('.form-text-input__label').removeClass("d-none");
    $(this).closest('.formVerticalVariantContainer').find('.form-text-input__label').css('background','#fff');
    $(this).css("border", "1px solid #75787B");
});
$(".formVerticalVariant:not('.vertical-whitevariant') .telNum").focus(function () {
    $(this).closest('.form-global-revamp').siblings('.MobileNum').css("background", "transparent");
    $(this).closest('.form-global-revamp').siblings('.MobileNum').css("border", "1px solid #fff");
    $(this).closest('.form-global-revamp').find('.telNum').css("border-left", "none");
});

$(".vertical-whitevariant .telNum").focus(function () {
    $(this).closest('.form-global-revamp').siblings('.MobileNum').css("background", "transparent");
    $(this).closest('.form-global-revamp').siblings('.MobileNum').css("border", "1px solid #75787B");
    $(this).closest('.form-global-revamp').find('.telNum').css("border-left", "1px solid #75787B");
});

// Close icon on thank you screen
$(".formVerticalVariant .enquire-form__close").on("click", function () {
    $(this).closest(".enquire-form__step").find("form").trigger("reset");
    $(this).closest(".enquire-form__step").find("form .floating-label").removeClass("focussed");
    $(".form-attributes").find(".enquire-form__step").fadeOut();
    $(".enquire-form__step-1").find("form").trigger("reset");
    $(".formVerticalVariantContainer").fadeIn();
    $(".formVerticalVariantContainer").show();
    $(".form-thankyou-revamp-container").hide();
    $(".ccforms .js-carouselWithText").length ?  $(".ccforms .js-carouselWithText").slick("refresh") : "";
    ccGlobalFormData = {};
    ccGlobalFunctionData.checkCookieValues();
    // Add the border back
    $(".blog-details-right-ccforms-wp").css("border", "2px solid #e5e3e7");
});

// Form Vertical Variant JS Ends

const dropContainer = document.getElementById("dropcontainer") ? document.getElementById("dropcontainer") : ""
const fileInput = document.getElementById("images") ? document.getElementById("dropcontainer") : ""

if (dropContainer != '' && fileInput != '') {

  dropContainer.addEventListener("dragover", (e) => {
    // prevent default to allow drop
    e.preventDefault()
  }, false)

  dropContainer.addEventListener("dragenter", () => {
    dropContainer.classList.add("drag-active")
  })

  dropContainer.addEventListener("dragleave", () => {
    dropContainer.classList.remove("drag-active")
  })

  dropContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    dropContainer.classList.remove("drag-active")
    fileInput.files = e.dataTransfer.files
  })

}

//Hide Auto Show Exit intent pop-up based on campaign URL


 function enableAutoExitIntentPopUp() {
  let currentURLQueryParam = new URLSearchParams(window.location.search);
  let hasUtmParams = false;

  // Check if the current URL contains any of the UTM parameters
    if (currentURLQueryParam.has('utm_source') || currentURLQueryParam.has('utm_medium') || currentURLQueryParam.has('utm_id')
       || currentURLQueryParam.has('utm_content') || currentURLQueryParam.has('utm_campaign') ) {
      hasUtmParams = true;
    }

  if (!hasUtmParams) {
    ccGlobalFormData.EnableAutoExitIntentPopUp = true;
  }
}

ccGlobalFunctionData.enableNoOptionByDefault = function(){
    if(!$(".woodfinishtool").length && !$(".colourconsultancy").length ){
        $(".ccforms .disclaimer-questions").find('input[type="checkbox"]').prop('value', "No");
        $(".ccforms").find('input[value="No"]').prop('checked', true);
    }
}

// Campaign page banner form file uploaded must be saved to azure successfully before form submit
function campaignFileUploadToAzure(fileObject, flowTypeValue) {
    $.ajax({
        type: "POST",
        url: "/apcolourcatalogue/ccforms" + ".campaignFileUpload.json",
        data: fileObject,
        contentType: false,
        processData: false,
        crossDomain: true,
        async: true,
        success: function (response) {
            if (response && response.campaignFileForm && response.campaignFileForm[0]) {
                if (flowTypeValue === "Lucky draw gamification - House") {
                    flowTypeValue = "Lucky draw gamification";
                }
                if (($(".form-file-upload").length ||  $(".form-file-upload-gamification").length) && ccAnalytics.satelliteCheck()) {
                   _satellite.track("File_upload_successful", {
                        "flowType": flowTypeValue
                   });
                }
                if (response.campaignFileForm && response.campaignFileForm.length > 1) {
                    ccGlobalFormData.imageUrl = response.campaignFileForm[0] + " | " + response.campaignFileForm[response.campaignFileForm.length - 1];
                } else {
                    ccGlobalFormData.imageUrl = response.campaignFileForm[0];
                }
                 $('.gamification_proceed').removeAttr('disabled')
            }
        },
        error: function () {
            $(".file-upload-err").html("Server error");
        }
    });
}

// Used in varient - Form with file upload
$(".file-upload-field").on("change", function ({ target }) {
    $(".file-upload-err").html(""); //Clear error msg
    if (target.files && target.files.length) {
        let flowType = "";
        if ($(target).hasClass("gamification-form-file-upload-invoice")) {
            flowType = "Lucky draw gamification - Invoice";
        }
        if ($(target).hasClass("gamification-form-file-upload-house")) {
            flowType = "Lucky draw gamification - House";
        }
        if ($(target).hasClass("campaign-form-file-upload")) {
            flowType = "Campaign Form with file upload";
        }
        if (ccAnalytics.satelliteCheck()) {
            _satellite.track("File_upload_start", {
                "flowType": flowType
            });
        }
        let allowedFileSize = parseInt($(this).attr("data-attr-allowedFileSize"));
        let allowedFileExtension = $(this).attr("data-attr-allowedFileExtension");
        let fileSizeErrorMessage = $(this).attr("data-attr-fileSizeErrorMessage");
        let fileExtensionErrorMessage = $(this).attr("data-attr-fileExtensionErrorMessage");
        uploadedImage = target.files[0];
        let extension = target.files[0].type.split("/").pop();
        let fileSize = (target.files[0].size / (1024 * 1024)).toFixed(2); //File size in MB
        // Allow extenstions specified by the author or allow all types of files
        if (uploadedImage && (!allowedFileExtension || allowedFileExtension.includes(extension))) {
            // Allow file size specified by the author
            if (fileSize <= allowedFileSize) {
                globalFileUploadData.append("campaignFileForm", target.files[0]);
                const fileName = target.files[0].name
                $(this).next("#file-name-display").text(fileName);
                $('.file-upload-house-err').text('');

                const text = $('.game-file-form-container #enquire-name').val().trim();
                const email = $('.game-file-form-container #enquire-email').val().trim();
                const phone = $('.game-file-form-container #enquire-mobile').val().trim();
                const pincode = $('.game-file-form-container #enquire-pincode').val().trim();

                const phoneValid = /^\d{10}$/.test(phone);
                const pincodeValid = /^\d{6}$/.test(pincode);

                if (text && email && phoneValid && pincodeValid) {
                    $('.screen-two-error').addClass('d-none');
                }
                if ($(target).hasClass("campaign-form-file-upload") || $(target).hasClass("gamification-form-file-upload-house")) {
                    campaignFileUploadToAzure(globalFileUploadData, flowType);
                } else {
                    console.log("Lucky draw gamification Invoice flow")
                }
            } else {
                $(this).val(null);
                $(".file-upload-err").html(fileSizeErrorMessage); //File size error msg
            }
        } else {
            $(this).val(null);
            $(".file-upload-err").html(fileExtensionErrorMessage); //File exetension error msg
        }
    }
});

// Used in varient - Form with file upload
$(".form-file-upload #comment-textarea").keyup(function () {
    let characterCount = $(this).val().length;
    let current = $("#current");
    current.text(characterCount);
});

    function setYesForTwoQuestions() {
        // Uncheck all radio buttons and checkboxes within the specified classes, excluding the form-whatsapp-consent class and the specific WhatsApp consent checkbox
        $('.form-group-global__enquire-form--elements-submit-wrap input[type="radio"], .form-layout-revamp input[type="radio"], ' +
          '.form-group-global__enquire-form--elements-submit-wrap input[type="checkbox"], .form-layout-revamp input[type="checkbox"]')
          .not('#pdp-request-call-back-form-whatsapp-consent input[type="checkbox"], .form-whatsapp-consent input[type="checkbox"]').each(function () {
            $(this).prop('checked', false).removeAttr('checked');
            var spanElement = $(this).siblings('.form-checkbox-input__custom--check');
            if (spanElement.length) {
                spanElement.removeClass('whatsAppCheckbox-checked');
            }
        });

        // Uncheck all radio buttons within the disclaimer-ques-one disclaimer-group d-flex class
        $('.form-group-global__enquire-form--elements-wrap.track_field_focus .disclaimer-ques-one.disclaimer-group.d-flex input[type="radio"]').each(function () {
            $(this).prop('checked', false).removeAttr('checked');
        });
    }

    setYesForTwoQuestions();

    setTimeout(function () {
        setYesForTwoQuestions();
    }, 1000);



/** START: GAMIFICATION FORM WITH FILE UPLOAD */

// Hide the landing page and show the form
$(document).on('click', '.game-landing a', function (event) {
    $(this).parents('.game-landing').addClass('d-none')
    $(this).parents('.game-landing').siblings('.file-form-container').removeClass('d-none')
    scrollTopGamification();
    if (ccAnalytics.satelliteCheck()) {
        _satellite.track("carousel_banner_click", {
            "bannerTitle": "Apcolite All Protek - Lucky Draw"
        });
    }
});

$(document).on('click', '.gamification_proceed', function (event) {
    event.preventDefault();
    const text = $('.game-file-form-container #enquire-name').val().trim();
    const email = $('.game-file-form-container #enquire-email').val().trim();
    const phone = $('.game-file-form-container #enquire-mobile').val().trim();
    const pincode = $('.game-file-form-container #enquire-pincode').val().trim();
    const file = $('.game-file-form-container #file-upload')[0].files.length;

    const phoneValid = /^\d{10}$/.test(phone);
    const pincodeValid = /^\d{6}$/.test(pincode);

    if (text && email && phoneValid && pincodeValid && file > 0) {
        let btnTitle = $(this).clone().children().remove().end().text() ? $(this).clone().children().remove().end().text().trim() : "";
        let parentTitle = $(this).closest(".potex-container").find(".bottom-text").text() ? $(this).closest(".potex-container").find(".bottom-text").text().trim() : "";
        if (ccAnalytics.satelliteCheck()) {
            _satellite.track("custom_cta_click", {
                "cta_": btnTitle,
                "parentTitle": parentTitle
            });
        }
        $(this).parents('.potex-container').addClass('d-none');
        $(this).parents('.potex-container').siblings('.mcq-container').removeClass('d-none');
        $('.screen-two-error').addClass('d-none');
        scrollTopGamification();
    } else {
        $('.screen-two-error').removeClass('d-none');
    }
});

// $(document).on('change', '.game-file-form-container input[type="radio"]', function () {
//     const $fieldset = $(this).closest('fieldset');
//     // Remove 'selected' class from all labels in this fieldset
//     $fieldset.find('label').removeClass('selected');
//     if ($(this).is(':checked')) {
//         $(this).parent('label').addClass('selected');
//     }
// })


// Hide error message dynamically when all questions are answered
// $('.mcq-detail input[type="radio"]').on('change', function () {
//     let allAnswered = true;

//     $('.mcq-detail fieldset').each(function () {
//         if ($(this).find('input[type="radio"]:checked').length === 0) {
//             allAnswered = false;
//         }
//     });

//     if (allAnswered) {
//         $('.screen-three-error').addClass('d-none');
//     }
// });

/** END: GAMIFICATION FORM WITH FILE UPLOAD */

//To scroll to top on click of gamification proceed/submit button
function scrollTopGamification(value = 0) {
    $("html, body").animate({
        scrollTop: $(".game-file-form-container").offset().top + value
    }, 500);
}


/* Form with file upload variant - without file upload */
$('#comment-textarea').on('keyup', function () {
    $(".comment-err").html("");
});


/* Banner form with OTP */

if (allowOTPinBannerForm == true) {
    // Change Button Text
    let submitButtonLabel = $('.ccforms .ccFormScheduler .form-banner-wrapper .ctaText.enquireForm--step-1-submit.track_form_submit').contents().filter(function () {
        return this.nodeType === 3;
    }).first().text().trim()

    function checkAnswers() {
        const answerOne = $('.ccforms .ccFormScheduler input[name="CUSTOM_RADIO_customer_response_one"]:checked').val();
        const answerTwo = $('.ccforms .ccFormScheduler input[name="CUSTOM_RADIO_customer_response_two"]:checked').val();

        if (answerOne && answerTwo) {
            if (answerOne === 'No' && answerTwo === 'No') {
                $('.ccforms .ccFormScheduler .form-banner-wrapper .ctaText.enquireForm--step-1-submit.track_form_submit').contents().filter(function () {
                    return this.nodeType === 3;
                }).first().replaceWith('Proceed');
            } else if (answerOne === 'Yes' || answerTwo === 'Yes') {
                $('.ccforms .ccFormScheduler .form-banner-wrapper .ctaText.enquireForm--step-1-submit.track_form_submit').contents().filter(function () {
                    return this.nodeType === 3;
                }).first().replaceWith(submitButtonLabel);
            }
        }
    }

    $(document).on('change', '.ccforms .ccFormScheduler input[name="CUSTOM_RADIO_customer_response_one"], .ccforms .ccFormScheduler input[name="CUSTOM_RADIO_customer_response_two"]', checkAnswers);

    $(document).on('click', '#cancel-otp', function () {
        if ($('.form-otp').length > 0) {
            $('.form-otp').hide();
            clearInterval(timer);
            $('#formsCloseIcon').trigger('click');
        }
    });

    $(document).on('click', '.edit-value', function () {
        if (parseFloat($(this).css('opacity')) >= 1) {
            $('input[id="bhs-cal-mob-no"]').removeAttr('disabled').focus();
            $('.otp-mob-number').css("opacity", "1");
            $('#verify-otp').hide();
            $('#get-otp-for-new-number').show();
            $('.digit-group input').attr('disabled', true);
            $(".digit-group input").val("");
            $(".form-otp .timer .resend-otp").removeClass('red');
            if (typeof (_satellite) != "undefined") {
                _satellite.track("custom_cta_click", {
                    "cta_": "Edit mobile number for OTP"
                });
            }
        }
    });

    $(document).on('blur keyup', '.form-otp .input-field-set input[name="bhs-cal-mob-no"]', function () {
        if ($('.form-otp .input-field-set input[name="bhs-cal-mob-no"]').val().length > 9) {
            if (!$('#verify-otp').hasClass('otp-delivered')) {
                $('#verify-otp').attr('style', '');
            }
            else if ($('#verify-otp').hasClass('otp-delivered') && ($('.timer .time').css('visibility') === 'hidden')) {
                $('.resend-otp').addClass('red');
            }
        }
        else {
            if (!$('#verify-otp').hasClass('otp-delivered')) {
                $('#verify-otp').attr('style', 'opacity: 0.6;cursor: no-drop;pointer-events: none');
            }
            else if ($('#verify-otp').hasClass('otp-delivered') && ($('.timer .time').css('visibility') === 'hidden')) {
                $('.resend-otp').removeClass('red');
            }
        }
    });

    $(document).on('focus', '.digit-group input', function () {
        $(this).attr('maxlength', 1);
    });

    $(document).on('blur keyup touchend', '.digit-group input', function (e) {
            $(".otp-field-section .otp-field-error").addClass('d-none');
            let parent = $($(this).parent());
            if (e.keyCode === 8 || e.keyCode === 37) {
                let prev = parent.find('input#' + $(this).data('previous'));
                if (prev.length) {
                    $(prev).select();
                }
            } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
                let next = parent.find('input#' + $(this).data('next'));
                if (next.length) {
                    $(next).select();
                } else {
                    if (parent.data('autosubmit')) {
                        parent.submit();
                    }
                }
            }
            // Enable submit button if OTP is entered
            let completeOTP = $("#digit-1").val() + $("#digit-2").val() + $("#digit-3").val() + $("#digit-4").val() + $("#digit-5").val()  + $("#digit-6").val();
            if (completeOTP && completeOTP.length === 6) {
                $(".form-otp #verify-otp").attr('style', '').removeAttr('disabled');
            }
            else {
                $(".form-otp #verify-otp").attr('style', 'opacity: 0.6;cursor: no-drop;');
            }
        });

    let timer;
    let countdown = 59;
    resetOTPTimer = function () {
        if (timer) {
            clearInterval(timer);
        }
        countdown = 59;
        $(".form-otp .timer .time").css("visibility", "initial");
        $(".form-otp .timer .resend-otp").removeClass('red');

        updateTimer();
        timer = setInterval(updateTimer, 1000);

        function updateTimer() {
            if (countdown > 0) {
                let displayTime = countdown < 10 ? "0" + countdown : countdown;
                $("#timer .time").text("00:" + displayTime);
                countdown--;
            } else {
                $(".form-otp .timer .time").css("visibility", "hidden");
                $(".form-otp .timer .resend-otp").addClass('red');
                $('.form-otp .edit-value').attr('style', 'opacity: 1;cursor: pointer;');
                countdown = 59;
                clearInterval(timer);
            }
        }
    }

    // Reset Timer on resend otp button
    $(document).on('click', '.form-otp .resend-otp.red', function (e) {
        if ($(this).hasClass('red')) {
            phValidationAnalytics = false
            $(".digit-group input").val(""); // Clear otp existing input
            ccGlobalFunctionData.generateOTP();
            $(".form-otp .timer .time").text(`00:59`);
            $(".form-otp .timer .time").css("visibility", "initial");
            $(".form-otp .timer .resend-otp").removeClass('red');
            $(".otp-field-section .otp-field-error").addClass('d-none'); // Reset OTP error message
        }
    });


    $(document).on('click', '#verify-otp', function () {
        let otpVal = $("input[id='digit-1']").val() + $("input[id='digit-2']").val() + $("input[id='digit-3']").val() + $("input[id='digit-4']").val() + $("input[id='digit-5']").val() + $("input[id='digit-6']").val();
        ccGlobalFunctionData.verifyOtp(otpVal);
    });

    $(document).on('click', '#get-otp-for-new-number', function () {
        phValidationAnalytics = true;
        ccGlobalFunctionData.generateOTP(); // Trigger OTP
        $('#verify-otp').show();
        $('#get-otp-for-new-number').hide();
        $('.digit-group input').attr('disabled', false);      
    });
}

if (document.documentElement.lang == "en") {
    $(document).ready(function () {
    let rawUrls = $('.form-attributes').attr('data-attr-thankYouPopUpPageUrls') || "";
    let bhInterestNewGifRestrictPageUrls = $('.form-attributes').attr('data-attr-bhInterestNewGifRestrictPageUrls') || "";
    //let bhInterestRestrictPageUrlsChild = $('.form-attributes').attr('data-attr-bhInterestRestrictPageUrlsChild') || "";
    let authoredPaths = rawUrls.split(',').map(path => path.trim());
    let authoredBhIntRestrictPaths = bhInterestNewGifRestrictPageUrls.split(',').map(path => path.trim());
    //let authoredBhIntRestrictChildPaths = bhInterestRestrictPageUrlsChild.split(',').map(path => path.trim());
    let currentPath = window.location.pathname
        .replace(/\.html$/, '')
        .replace(/\/$/, '');

    let semanticSegments = authoredPaths.map(path => {
        let match = path.match(/\/home(\/.+)/);
        return match ? match[1].replace(/\/$/, '') : null;
    }).filter(Boolean);

    let semanticSegmentsNewGif = authoredBhIntRestrictPaths.map(path => {
            let match = path.match(/\/home(\/.+)/);
            return match ? match[1].replace(/\/$/, '') : null;
    }).filter(Boolean);

    let matchFound = semanticSegments.some(segment => currentPath.includes(segment));
        let matchFoundNewTyRestrictUrls = semanticSegmentsNewGif.some(segment => currentPath.includes(segment));

    if (matchFound) {
        fullImageGifThankYou = false;
    } else if (matchFoundNewTyRestrictUrls) {
        fullImageGifThankYou = true;//allowed for old thank you gif
        newGifThankYou = false;//restricted for bh interested new revamp thank you gif
        $(".enquire-form__dismissible-container--head").addClass("icon-close-full-image");
        $(".enquire-form__dismissible-container--head a span").remove();
        let closeIcon = $('<span class="header-popup-close-icon" role="img" aria-label="close icon" title="close icon"></span>');
        $(".enquire-form__dismissible-container--head a").append(closeIcon);
        // Hide in old thank you html file
        // $(".enquire-form__dismissible-content.form-revamp-thankyou .old-ty").remove();
        $(".form-thankyou-revamp-container #formsCloseIcon").remove();
        $(".enquire-form__step.enquire-form__step-4").addClass("new-ty-parent-container");
    } else {
        fullImageGifThankYou = true;
        newGifThankYou = true;
        $(".enquire-form__dismissible-container--head").addClass("icon-close-full-image");
        $(".enquire-form__dismissible-container--head a span").remove();
        let closeIcon = $('<span class="header-popup-close-icon" role="img" aria-label="close icon" title="close icon"></span>');
        $(".enquire-form__dismissible-container--head a").append(closeIcon);
        // Hide in old thank you html file
        // $(".enquire-form__dismissible-content.form-revamp-thankyou .old-ty").remove();
        $(".form-thankyou-revamp-container #formsCloseIcon").remove();
        $(".enquire-form__step.enquire-form__step-4").addClass("new-ty-parent-container");
        // $(".new-ty-parent-container .enquire-form__dismissible-container").css("height", "0");
        // Blogs
       // $(".blog-details-right-ccforms-wp").css("border", "none");
    }
    $(document).on('click', '.track-thank-you-popup-single-gif a', function () {
        if(_satellite!=undefined){
            _satellite.track("custom_cta_click", {
                "cta_" : "Get Free Design Consultation",
                "parentTitle" : "Form Thank you pop-up"
            });
        }
    });












(function ($) {
  "use strict";

  $(document).on("focusin", ".track_field_focus", function () {
    try {
      if (window.formFlag === true) {
        window.formFlag = false;

        var $root = $(this).closest(".form-attributes");
        var campaignId = $root.attr("data-attr-campaignId") || "";
        var formName = "Campaign Vertical Variant Form";

        if (ccAnalytics.satelliteCheck()) {
          _satellite.track("form_start", { formName: formName, campaignId: campaignId });
        }
      }
    } catch (e) {
      console.log("[Analytics] form_start error:", e);
    }
  });

  console.log("[CVV] JS Loaded");
  console.log("[CVV] Ready");

  $(".campaignVerticalVariant").each(function (i) {
    console.log("[CVV] Init instance", i);

    var $root = $(this);
    var ns = ".cvv" + i;

    var $container = $root.closest(".form-attributes");
    $container.find(".cvv-thankyou-screen").addClass("is-hidden").hide();
    $container.find(".cvv-error-screen").addClass("is-hidden").hide();

    var $step1 = $root.find(".cvv-step-1");
    var $step2 = $root.find(".cvv-step-2");

    var $name   = $root.find("#enquire-name");
    var $mob    = $root.find("#enquire-mobile");
    var $verify = $root.find(".cvv-verify-btn");

    var $otpWrap       = $root.find(".cvv-otp-wrapper");
    var $otpBoxes      = $root.find(".cvv-otp-box");
    var $otpInputsWrap = $root.find(".cvv-otp-inputs");
    var $otpSubmit     = $root.find(".cvv-submit-otp-btn");
    var $otpStatus     = $root.find(".cvv-otp-status");
    var $countdown     = $root.find(".cvv-countdown");
    var $resend        = $root.find(".cvv-resend-otp");
    var $otpFoot       = $root.find(".cvv-otp-foot");
    var $inline        = $root.find(".cvv-affix-status");

    var $email = $root.find("#enquire-email");
    var $addr  = $root.find("#enquire-address");
    var $pin   = $root.find("#enquire-pincode");

    var $final = $root.find(".cvv-final-submit");
    var $back  = $root.find(".cvv-back-btn");

    var OTP_LEN_ATTR = parseInt($root.attr("data-otp-len"), 10);
    var OTP_LEN = (isFinite(OTP_LEN_ATTR) && OTP_LEN_ATTR > 0) ? OTP_LEN_ATTR : 6;
    var OTP_VERIFY_URL = "/apcolourcatalogue/ccforms" + ".otpVerification.json";

    var timer = null;
    var secs  = 0;

    var verifyLocked = false;
    var otpEnteringTracked  = false;
    var otpValidatedTracked = false;

    function digitsOnly(v) { v = v || ""; return v.replace(/\D/g, ""); }
    function trim(v) { v = v || ""; return v.trim(); }

    var MSG = {
      nameRequired:    "Please enter your name",
      mobileInvalid:   "Enter a valid mobile number",
      emailRequired:   "Please enter your email",
      addressRequired: "Please enter your address",
      pincodeInvalid:  "Enter a valid pincode"
    };

    function nameValid(v) {
      v = trim(v); if (!v) return false;
      return /^([A-Za-z]+(?:\s+[A-Za-z]+)*)$/.test(v);
    }
    function mobileValid(v) { v = digitsOnly(v); return /^[1-9]\d{9}$/.test(v); }
    function emailValid(v)  { v = trim(v); return /^[A-Za-z0-9._]+@[A-Za-z0-9._]+\.[A-Za-z]{2,}$/.test(v); }
    function pincodeValid(v){ v = digitsOnly(v); return /^\d{6}$/.test(v); }
    function addressValid(v){ v = trim(v); return /^[A-Za-z0-9,\s]+$/.test(v); }

    function showErr(fieldWrapSel, errSel, msg) {
      var $wrap = $root.find(fieldWrapSel);
      $wrap.addClass("is-error");
      var $err = $root.find(errSel);
      if (msg) $err.text(msg);
      $err.attr({ role: "status", "aria-live": "polite" }).removeClass("is-hidden");
    }
    function clearErr(fieldWrapSel, errSel) {
      $root.find(fieldWrapSel).removeClass("is-error");
      $root.find(errSel).addClass("is-hidden");
    }
    function showOtpError(msg) {
      $otpStatus.text(msg || "Enter a valid OTP").removeClass("cvv-success").addClass("cvv-error");
      $otpInputsWrap.addClass("is-error");
    }
    function clearOtpUI() {
      $otpStatus.text("").removeClass("cvv-error cvv-success");
      $otpInputsWrap.removeClass("is-error");
    }

    function resetOtpSection() {
      if (timer) { clearInterval(timer); timer = null; }
      $otpBoxes.val("");
      clearOtpUI();
      $otpWrap.stop(true, true).slideUp(120);
      $otpFoot.removeClass("is-expired");
      $resend.addClass("is-hidden");
      $countdown.text("00:59");
      $inline.addClass("is-hidden");
      $otpSubmit.prop("disabled", true).removeClass("is-ready");

      otpEnteringTracked  = false;
      otpValidatedTracked = false;
    }

    function unlockVerifyIfNeeded() {
      if (verifyLocked) {
        verifyLocked = false;
        resetOtpSection();
        setVerifyState();
      }
    }

    $root.addClass("is-step-1").removeClass("is-step-2");

    function setVerifyState() {
      var ok = nameValid($name.val()) && mobileValid($mob.val());
      $verify.prop("disabled", verifyLocked || !ok);
      return ok && !verifyLocked;
    }
    function updateFinalCtaState() {
      var ok = emailValid($email.val()) && addressValid($addr.val()) && pincodeValid($pin.val());
      $final.prop("disabled", !ok).toggleClass("is-ready", ok);
      return ok;
    }


    function handleNameKey(e) {
      if (e && e.type === "keydown") {
        var ctrl = ["Backspace","Tab","ArrowLeft","ArrowRight","Delete","Home","End","Enter"];
        var isCombo = e.ctrlKey || e.metaKey;
        if (ctrl.indexOf(e.key) === -1 && !isCombo && !/^[A-Za-z\s]$/.test(e.key)) e.preventDefault();
      }
      var v = $name.val() || "";
      var cleaned = v.replace(/[^A-Za-z\s]/g, "").replace(/\s{2,}/g, " ");
      if (v !== cleaned) $name.val(cleaned);

      unlockVerifyIfNeeded();

      if ($root.find("#cvv-field-name").hasClass("is-error") && nameValid($name.val())) {
        clearErr("#cvv-field-name", "#cvv-err-name");
      }
      setVerifyState();
    }
    function handleNameBlur() {
      var v = trim($name.val());
      if (!v || !nameValid(v)) showErr("#cvv-field-name", "#cvv-err-name", MSG.nameRequired);
      setVerifyState();
    }
    $name.off(ns)
      .on("keydown" + ns, handleNameKey)
      .on("input"   + ns, handleNameKey)
      .on("keyup"   + ns, handleNameKey)
      .on("blur"    + ns, handleNameBlur)
      .on("focus"   + ns, function(){ clearErr("#cvv-field-name", "#cvv-err-name"); });

    function handleMobileKey(e) {
      if (e && e.type === "keydown") {
        var allow = ["Backspace","Tab","ArrowLeft","ArrowRight","Delete","Home","End","Enter"];
        var combo = e.ctrlKey || e.metaKey;
        var k = (e.key || "").toLowerCase();
        if (combo && (k === "a" || k === "c" || k === "v" || k === "x")) {
        } else if (!/^\d$/.test(e.key) && allow.indexOf(e.key) === -1) {
          e.preventDefault();
        }
      }
      var v = digitsOnly($mob.val()).slice(0,10);
      if ($mob.val() !== v) $mob.val(v);

      unlockVerifyIfNeeded();

      if ($root.find("#cvv-field-mobile").hasClass("is-error") && mobileValid($mob.val())) {
        clearErr("#cvv-field-mobile", "#cvv-err-mobile");
      }
      setVerifyState();
    }
    function handleMobileBlur() {
      var v = $mob.val();
      if (!mobileValid(v)) showErr("#cvv-field-mobile", "#cvv-err-mobile", MSG.mobileInvalid);
      setVerifyState();
    }
    $mob.off(ns)
      .on("keydown" + ns, handleMobileKey)
      .on("input"   + ns, handleMobileKey)
      .on("keyup"   + ns, handleMobileKey)
      .on("blur"    + ns, handleMobileBlur)
      .on("focus"   + ns, function(){ clearErr("#cvv-field-mobile", "#cvv-err-mobile"); });

    $name.add($mob).on("keypress" + ns, function(e){
      if (e.key === "Enter") { e.preventDefault(); if (setVerifyState()) $verify.trigger("click"); }
    });

    function handleEmailKey(e) {
      if (e && e.type === "keydown") {
        var nav = ["Backspace","Tab","ArrowLeft","ArrowRight","Delete","Home","End","Enter"];
        var combo = e.ctrlKey || e.metaKey;
        var allowed = /^[A-Za-z0-9_.@]$/;
        var key = e.key || "";
        var lower = key.toLowerCase();
        if (combo && (lower === "a" || lower === "c" || lower === "v" || lower === "x")) {
        } else if (nav.indexOf(key) === -1 && !allowed.test(key)) {
          e.preventDefault();
        }
      }
      var v = $email.val() || "";
      var cleaned = v.replace(/[^A-Za-z0-9_.@]/g, "");
      if (v !== cleaned) $email.val(cleaned);
      if ($root.find("#cvv-field-email").hasClass("is-error") && emailValid($email.val())) {
        clearErr("#cvv-field-email", "#cvv-err-email");
      }
      updateFinalCtaState();
    }
    function handleEmailBlur() {
      var v = trim($email.val());
      if (!v || !emailValid(v)) showErr("#cvv-field-email", "#cvv-err-email", MSG.emailRequired);
      updateFinalCtaState();
    }
    $email.off(ns)
      .on("keydown" + ns, handleEmailKey)
      .on("input"   + ns, handleEmailKey)
      .on("keyup"   + ns, handleEmailKey)
      .on("blur"    + ns, handleEmailBlur)
      .on("focus"   + ns, function(){ clearErr("#cvv-field-email", "#cvv-err-email"); });

    function handleAddrKey(e) {
      if (e && e.type === "keydown") {
        var nav = ["Backspace","Tab","ArrowLeft","ArrowRight","Delete","Home","End","Enter"];
        var combo = e.ctrlKey || e.metaKey;
        var allowed = /^[A-Za-z0-9,\s]$/;
        var key = e.key || ""; var lower = key.toLowerCase();
        if (combo && (lower === "a" || lower === "c" || lower === "v" || lower === "x")) {
        } else if (nav.indexOf(key) === -1 && !allowed.test(key)) {
          e.preventDefault();
        }
      }
      var v = $addr.val() || "";
      var cleaned = v.replace(/[^A-Za-z0-9,\s]/g, "");
      if (v !== cleaned) $addr.val(cleaned);
      if ($root.find("#cvv-field-address").hasClass("is-error") && addressValid($addr.val())) {
        clearErr("#cvv-field-address", "#cvv-err-address");
      }
      updateFinalCtaState();
    }
    function handleAddrBlur() {
      var v = $addr.val();
      if (!addressValid(v)) showErr("#cvv-field-address", "#cvv-err-address", MSG.addressRequired);
      updateFinalCtaState();
    }
    $addr.off(ns)
      .on("keydown" + ns, handleAddrKey)
      .on("input"   + ns, handleAddrKey)
      .on("keyup"   + ns, handleAddrKey)
      .on("blur"    + ns, handleAddrBlur)
      .on("focus"   + ns, function(){ clearErr("#cvv-field-address", "#cvv-err-address"); });

    function handlePinKey(e) {
      if (e && e.type === "keydown") {
        var nav = ["Backspace","Tab","ArrowLeft","ArrowRight","Delete","Home","End","Enter"];
        var combo = e.ctrlKey || e.metaKey;
        var key = (e.key || "").toLowerCase();
        if (combo && (key === "a" || key === "c" || key === "v" || key === "x")) {
        } else if (!/^\d$/.test(e.key) && nav.indexOf(e.key) === -1) {
          e.preventDefault();
        }
      }
      var v = digitsOnly($pin.val()).slice(0,6);
      if ($pin.val() !== v) $pin.val(v);
      if ($root.find("#cvv-field-pincode").hasClass("is-error") && pincodeValid($pin.val())) {
        clearErr("#cvv-field-pincode", "#cvv-err-pincode");
      }
      updateFinalCtaState();
    }
    function handlePinBlur() {
      var v = $pin.val();
      if (!pincodeValid(v)) showErr("#cvv-field-pincode", "#cvv-err-pincode", MSG.pincodeInvalid);
      updateFinalCtaState();
    }
    $pin.off(ns)
      .on("keydown" + ns, handlePinKey)
      .on("input"   + ns, handlePinKey)
      .on("keyup"   + ns, handlePinKey)
      .on("blur"    + ns, handlePinBlur)
      .on("focus"   + ns, function(){ clearErr("#cvv-field-pincode", "#cvv-err-pincode"); });

    setVerifyState();
    updateFinalCtaState();
    setTimeout(function(){ setVerifyState(); updateFinalCtaState(); }, 0);

    function readOtp() {
      var v = "";
      $otpBoxes.each(function () { v += ($(this).val() || ""); });
      return digitsOnly(v);
    }
    function updateOtpState() {
      var otp = readOtp();
      var ready = (otp.length === OTP_LEN);
      $otpSubmit.prop("disabled", !ready);
      $otpSubmit.toggleClass("is-ready", ready);
    }

    $otpBoxes.off(ns).on("input" + ns, function () {
      this.value = digitsOnly(this.value).slice(0, 1);
      if (this.value && this.nextElementSibling) this.nextElementSibling.focus();
      clearOtpUI();
      updateOtpState();

      if (!otpEnteringTracked) {
        var anyDigitEntered = $otpBoxes.toArray().some(function (el) { return (el.value || "").length > 0; });
        if (anyDigitEntered) {
          otpEnteringTracked = true;
          try {
            if (ccAnalytics.satelliteCheck()) {
              _satellite.track("custom_cta_click", { "cta_": "Entering otp" });
            }
          } catch (e) {}
        }
      }
    });

    try{
        (function () {
          $otpBoxes.each(function () {
            $(this)
              .attr("inputmode", "numeric")
              .attr("autocomplete", "one-time-code")
              .attr("pattern", "\\d*");
          });

          function focusAt(idx) {
            var el = $otpBoxes.get(idx);
            if (!el) return;
            el.focus();
            try { el.setSelectionRange(0, 1); } catch (e) {}
          }

          function fillDigits(digits) {
            var i;
            for (i = 0; i < $otpBoxes.length; i++) {
              $otpBoxes[i].value = digits[i] || "";
            }
            var firstEmpty = -1;
            for (i = 0; i < $otpBoxes.length; i++) {
              if (!$otpBoxes[i].value) { firstEmpty = i; break; }
            }
            if (firstEmpty === -1) {
              $otpBoxes[$otpBoxes.length - 1].focus();
            } else {
              focusAt(firstEmpty);
            }
            clearOtpUI();
            updateOtpState();
          }

          $otpBoxes.off("keydown" + ns).on("keydown" + ns, function (e) {
            var key = e.key || e.which;
            var index = $otpBoxes.index(this);
            var k = (typeof key === "string") ? key : String.fromCharCode(key);

            if (k === "Tab") return;

            if (k === "ArrowLeft") {
              e.preventDefault();
              focusAt(index - 1);
              return;
            }
            if (k === "ArrowRight") {
              e.preventDefault();
              focusAt(index + 1);
              return;
            }

            if (k === "Delete") {
              e.preventDefault();
              this.value = "";
              clearOtpUI();
              updateOtpState();
              return;
            }

            if (k === "Backspace") {
              e.preventDefault();
              if (this.value) {
                this.value = "";
                clearOtpUI();
                updateOtpState();
              } else {
                var prevIdx = index - 1;
                if (prevIdx >= 0) {
                  $otpBoxes[prevIdx].value = "";
                  focusAt(prevIdx);
                  clearOtpUI();
                  updateOtpState();
                }
              }
              return;
            }

            if (k && k.length === 1 && !/^\d$/.test(k)) {
              var combo = e.ctrlKey || e.metaKey;
              var lower = k.toLowerCase();
              if (!(combo && (lower === "a" || lower === "c" || lower === "v" || lower === "x"))) {
                e.preventDefault();
              }
            }
          });

          $otpInputsWrap.off("paste" + ns).on("paste" + ns, function (e) {
            try { e.preventDefault(); } catch (err) {}
            var clip = (e.originalEvent && (e.originalEvent.clipboardData || window.clipboardData)) ||
                       (e.clipboardData || window.clipboardData);
            var text = clip && (clip.getData("text") || clip.getData("Text")) || "";
            var digits = (text || "").replace(/\D/g, "").slice(0, OTP_LEN).split("");
            if (!digits.length) return;
            fillDigits(digits);
          });

          $otpBoxes.off("focus" + ns).on("focus" + ns, function () {
            var el = this;
            setTimeout(function () {
              try { el.select(); } catch (e) {}
            }, 0);
          });

          $otpBoxes.off("mouseup" + ns).on("mouseup" + ns, function (e) { e.preventDefault(); });
        })();
    }catch(e){
        console.log("Error when setting otp rules"+e)
    }
    function startCountdown(s) {
      secs = s;
      $otpFoot.removeClass("is-expired");
      $resend.addClass("is-hidden");
      updateTimer();
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        secs--;
        updateTimer();
        if (secs <= 0) {
          clearInterval(timer); timer = null;
          $otpFoot.addClass("is-expired");
          $resend.removeClass("is-hidden");
        }
      }, 1000);
    }
    function updateTimer() {
      if (secs <= 0) { $countdown.text(""); return; }
      var ss = secs < 10 ? "0" + secs : secs;
      $countdown.text("00:" + ss);
    }

    $verify.off("click" + ns).on("click" + ns, function () {
      try {
        if (ccAnalytics.satelliteCheck()) {
          var btnTitle = $(this).clone().children().remove().end().text().trim() || "Verify";
          _satellite.track("custom_cta_click", { "cta_": btnTitle });
        }
      } catch (e) {}

      if ($verify.is(":disabled")) {
        if (!nameValid($name.val()))  showErr("#cvv-field-name", "#cvv-err-name", MSG.nameRequired);
        if (!mobileValid($mob.val())) showErr("#cvv-field-mobile", "#cvv-err-mobile", MSG.mobileInvalid);
        return;
      }

      clearErr("#cvv-field-name", "#cvv-err-name");
      clearErr("#cvv-field-mobile", "#cvv-err-mobile");

      var ok = true;
      if (!nameValid($name.val()))  { showErr("#cvv-field-name", "#cvv-err-name", MSG.nameRequired); ok = false; }
      if (!mobileValid($mob.val())) { showErr("#cvv-field-mobile", "#cvv-err-mobile", MSG.mobileInvalid); ok = false; }
      if (!ok) return;

      verifyLocked = true;
      $verify.prop("disabled", true);

      $inline.removeClass("is-hidden");
      $otpBoxes.val("");
      clearOtpUI();

      otpEnteringTracked  = false;
      otpValidatedTracked = false;

      $otpSubmit.prop("disabled", true).removeClass("is-ready");
      $otpWrap.stop(true, true).slideDown(150);

      setTimeout(function(){ $otpBoxes.eq(0).focus(); }, 160);

      window.ccGlobalFormData = window.ccGlobalFormData || {};
      window.ccGlobalFormData.mobileNo = digitsOnly($mob.val());

      try {
        if (window.ccGlobalFunctionData && window.ccGlobalFunctionData.generateOTP) {
          window.ccGlobalFunctionData.generateOTP();
        }
      } catch (err) { console.log(err); }

      startCountdown(59);
    });

    $resend.off("click" + ns).on("click" + ns, function () {
      if ($resend.hasClass("is-hidden")) return;

      otpEnteringTracked  = false;
      otpValidatedTracked = false;

      $otpBoxes.val("");
      updateOtpState();
      clearOtpUI();

      try {
        if (window.ccGlobalFunctionData && window.ccGlobalFunctionData.generateOTP) {
          window.ccGlobalFunctionData.generateOTP();
        }
      } catch (err) { console.log(err); }

      startCountdown(59);
      setTimeout(function(){ $otpBoxes.eq(0).focus(); }, 160);
    });

    function verifyOtpViaApi(otp) {
      return $.ajax({
        type: "POST",
        url: OTP_VERIFY_URL,
        data: { otpData: otp }
      });
    }

    $otpSubmit.off("click" + ns).on("click" + ns, function () {
      try {
        if (ccAnalytics.satelliteCheck()) {
          var btnTitle = $(this).clone().children().remove().end().text().trim() || "Submit OTP";
          _satellite.track("custom_cta_click", { "cta_": btnTitle });
        }
      } catch (e) {}

      var otp = readOtp();
      if (otp.length !== OTP_LEN) {
        showOtpError("Enter a valid OTP");
        return;
      }

      var sessionKey = null;
      try { sessionKey = sessionStorage.getItem("CCKey"); } catch(e) { sessionKey = null; }
      if (!sessionKey) {
        showOtpError("Enter a valid OTP");
        if (timer) { clearInterval(timer); timer = null; }
        $otpFoot.addClass("is-expired");
        $resend.removeClass("is-hidden");
        $countdown.text("");
        return;
      }

      var prevText = $otpSubmit.text();
      $otpSubmit.prop("disabled", true).removeClass("is-ready");

      verifyOtpViaApi(otp)
        .done(function (resp) {
          var serverKey = null;
          if (resp) {
            if (typeof resp.keyData !== "undefined") serverKey = resp.keyData;
            else if (typeof resp.key !== "undefined") serverKey = resp.key;
            else if (resp.data && typeof resp.data.keyData !== "undefined") serverKey = resp.data.keyData;
          }

          if (serverKey && String(serverKey) === String(sessionKey)) {
            if (!otpValidatedTracked) {
              otpValidatedTracked = true;
              try {
                if (ccAnalytics.satelliteCheck()) {
                  _satellite.track("custom_cta_click", { "cta_": "Validated Otp" });
                }
              } catch (e) {}
            }

            clearOtpUI();
            switchToStep2();
          } else {
            showOtpError("Enter a valid OTP");
          }
        })
        .fail(function () {
          showOtpError("Enter a valid OTP");
        })
        .always(function () {
          updateOtpState();
          $otpSubmit.text(prevText);
        });
    });

    function switchToStep2() {
      $root.removeClass("is-step-1").addClass("is-step-2");
      $step1.hide().removeClass("active");
      $step2.show().addClass("active");

      if (timer) { clearInterval(timer); timer = null; }
      $otpFoot.removeClass("is-expired");
      $countdown.text("00:59");

      updateFinalCtaState();
    }

    $back.off("click" + ns).on("click" + ns, function () {
      $root.removeClass("is-step-2").addClass("is-step-1");
      $step2.hide().removeClass("active");
      $step1.show().addClass("active");

      verifyLocked = false;

      otpEnteringTracked  = false;
      otpValidatedTracked = false;

      resetOtpSection();
      setVerifyState();
    });

    $final.off("click" + ns).on("click" + ns, function () {
      clearErr("#cvv-field-email",   "#cvv-err-email");
      clearErr("#cvv-field-address", "#cvv-err-address");
      clearErr("#cvv-field-pincode", "#cvv-err-pincode");

      var ok = true;
      if (!emailValid($email.val()))   { showErr("#cvv-field-email",   "#cvv-err-email",   MSG.emailRequired);   ok = false; }
      if (!addressValid($addr.val()))  { showErr("#cvv-field-address", "#cvv-err-address", MSG.addressRequired); ok = false; }
      if (!pincodeValid($pin.val()))   { showErr("#cvv-field-pincode", "#cvv-err-pincode", MSG.pincodeInvalid);  ok = false; }

      if (!ok) { updateFinalCtaState(); return; }

      $final.prop("disabled", true).addClass("is-submitting").css("opacity", "0.6");

      window.ccGlobalFormData = window.ccGlobalFormData || {};
      window.ccGlobalFormData.firstAddress = trim($addr.val());

      try {
        if (ccGlobalFunctionData && ccGlobalFunctionData.formSubmit) {
          ccGlobalFunctionData.formSubmit($root);
        }
      } catch (err) {
        console.log(err);
        $final.prop("disabled", false).removeClass("is-submitting").css("opacity", "");
      }
    });

  });

})(jQuery);



});

//BCCI-Campaign
$(window).on('load', function() {
  if($('.fomrvertical-color-campaign').length){
    $('.fomrvertical-color-campaign .form-group-global__enquire-form--elements-wrap .form-text-input__field').each(function() {
        if ($(this).val().trim() !== "") {
        $(this).css('background-color', 'transparent');
        }
    });
  }
});

}