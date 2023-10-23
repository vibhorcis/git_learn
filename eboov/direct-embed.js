let isResumeAfterLead = false;
let isResumeAfterSales = false;

this.show_eboov_logo = false;
this.use_brand_logo = false;
this.auto_hide_controls = true;
this.auto_play = false;
this.player_color = "";
this.full_screen_controls = false;
this.playback_speed_controls = false;
this.custom_logo_redirect_url = "";
this.custom_logo_url = "";
this.json = {};
var player = '';
var videoThumbnailurl = '';
var videoUrl = '';
var posterThumb = '';
var autoplayOption = '';
var volumeOption = '';
var uiOption = '';
var countVal = 0;
var percentageArr = [];
var playArr = [];
const url = document.location.href;
var eboovembed = url.match(/https:\/\/embed\.eboov\.com\/(.*)/)[1];
if (eboovembed.indexOf('v=') > -1) {
    const newurl = new URL(document.location.href);
    const params = new URLSearchParams(newurl.search);
    eboovembed = params.get("v");
}
async function getAllowedDomains(user_id) {
    return new Promise((resolve, reject) => {
        const url = "https://api.epopsdev.com/v1/domains/get";
        const data = { user_id: user_id };
        var settings = {
            url: url,
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        };

        $.ajax(settings)
            .done(function (json) {
                resolve(json);
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                reject(error);
            });
    });
}
// load embed
var settings = {
    url: "https://api.epopsdev.com/v1/embeds/get",
    method: "POST",
    timeout: 0,
    headers: {
        "Content-Type": "application/json",
    },
    data: JSON.stringify({
        eboov_id: eboovembed,
    }),
};
$.ajax(settings)
.done(async ({data}) => {
    $(window).on(
        "resize orientationchange webkitfullscreenchange mozfullscreenchange fullscreenchange",
        function () {
            setTimeout(function(){
                if(this.show_eboov_logo){
                    changeWaterMark(this.show_eboov_logo);
                }else{
                    changeWaterMark(false);
                }
                if(this.use_brand_logo){
                    changeBrandWaterMark(this.use_brand_logo,this.custom_logo_redirect_url,this.custom_logo_url);
                }
                if (this.auto_hide_controls) {
                    hideControls(true);
                }
                changeColor(this.player_color);
            }, 2000);
        }
    );
    const json = data[0];
    if (json !== undefined) {
        let {
            show_annotation,
            show_annotation_time,
            show_form,
            hide_annotation_time,
            show_form_time,
            show_sales_form,
        } = json;
        if (show_annotation_time)
            show_annotation_time = parseTimeStr(show_annotation_time); // change start time string to seconds.
        if (hide_annotation_time)
            hide_annotation_time = parseTimeStr(hide_annotation_time); // change hide time string to seconds.
        if (show_form_time) show_form_time = parseTimeStr(show_form_time);

        const {
            annotation_text,
            annotation_link,
            cta_color,
            cta_btn_color,
            cta_btn_padding,
            cta_btn_width,
            cta_btn_position,
            auto_hide_controls,
            auto_play,
            show_eboov_logo,
            player_color,
            full_screen_controls,
            use_brand_logo,
            custom_logo_redirect_url,
            custom_logo_url,
            playback_speed_controls
        } = json;
        // Subscription Check
        var Subscsettings = {
            "url": "https://app.eboov.com/wp-json/eb/v1/subscription/check",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "uid": json.uid
            }),
        };
        await loadVideo(json,show_annotation_time,hide_annotation_time,show_form_time);
    }
}).fail(function (jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log(error);
    reject(error);
});
async function loadVideo(json,show_annotation_time,hide_annotation_time,show_form_time){
    const bitmovinContainer = document.getElementById("eboov-display");
    // set observer to watch bitmovin player content change
    const observer = new MutationObserver(function (mutationsList) {
        mutationsList.forEach((mutation) => {
            if (mutation.type === "childList") {
                // node is added or removed
                mutation.addedNodes.forEach((node) => {
                    // loop through added nodes to check bitmovin is loaded
                    if (node.className.includes("bmpui-ui-uicontainer")) {
                        showSpeakerIcon();
                        try {
                            if(json.show_eboov_logo){
                                changeWaterMark(json.show_eboov_logo);
                            }else{
                                changeWaterMark(false);
                            }
                            if(json.use_brand_logo){
                                changeBrandWaterMark(json.use_brand_logo,json.custom_logo_redirect_url,json.custom_logo_url);
                            }
                            if (json.auto_hide_controls) {
                                if(iOS()){  
                                    setInterval(myTimer, 1000);
                                }
                                hideControls(true);
                            }
                            if (!json.auto_play) {
                                hideAutoplay(true);
                            }
                            if(!json.full_screen_controls){
                                hideFullscreenControls(true);
                            }
                            if(!json.playback_speed_controls){
                                hidePlaybackSpeedControls(true);
                            }
                            if (!json.full_screen_controls && !json.playback_speed_controls && !json.auto_hide_controls){
                                hideControls(false);
                            }
                            changeColor(json.player_color);
                        } catch (e) {
                            throw e;
                        }
                    }
                });
            }
        });
    });
    observer.observe(bitmovinContainer, {
        childList: true,
        attributes: true,
    });
    const axinomMsgToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjogMSwKImJlZ2luX2RhdGUiOiAiMjAwMC0wMS0wMVQxNjo1MTo0NiswMzowMCIsCiJleHBpcmF0aW9uX2RhdGUiOiAiMjAyNS0xMi0zMVQyMzo1OTo0MCswMzowMCIsCiJjb21fa2V5X2lkIjogIjM3OTdiMTA5LTYyNWQtNDVmOC04MDg0LWFlMDQwMTE1OTFkYSIsCiJtZXNzYWdlIjogewogICJ0eXBlIjogImVudGl0bGVtZW50X21lc3NhZ2UiLAogICJ2ZXJzaW9uIjogMiwKICAibGljZW5zZSI6IHsKICAgICJkdXJhdGlvbiI6IDM2MDAKICB9LAogICJjb250ZW50X2tleXNfc291cmNlIjogewogICAgImlubGluZSI6IFsKICAgICAgewogICAgICAgICJpZCI6ICIxMTExMTExMS0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiCiAgICAgIH0KICAgIF0KICB9Cn19.ZwTr1HZcKitmQ06zVYsl6PtbjEtA2KpZe7OUIdKGWXQ"; // axinom message token
    const parentDomain = new URL(document.referrer).hostname;
    const analyticsConfig = {
        key: "86def1d6-83ad-4344-9013-79096a41fc4c",
    };
    if(json.use_image_in_loop == false || json.use_image_in_loop == '' && json.use_gif_in_loop == false || json.use_gif_in_loop == '' && json.use_video_in_loop == false || json.use_video_in_loop == '' ){
        posterThumb = json.thumbnail_url;
        autoplayOption = json.auto_play;
        if(autoplayOption){
            volumeOption = true;
        }else{
            volumeOption = false;
        }
    }
    if(json.use_image_in_loop){
        posterThumb = json.thumbnail_url;
        autoplayOption = json.auto_play;
        if(autoplayOption){
            volumeOption = true;
        }else{
            volumeOption = false;
        }
    }
    if(json.use_gif_in_loop){
        posterThumb = json.user_animatedgif_url;
        autoplayOption = json.auto_play;
        if(autoplayOption){
            volumeOption = true;
        }else{
            volumeOption = false;
        }
    }
    if(json.use_video_in_loop){
        videoThumbnailurl = json.user_videothumbnail_url;
        autoplayOption = true;
        volumeOption = true;
        uiOption = false;
    }
    var player_key = `${json.player_license}`;
    var playerConfig = {
        key: `${json.player_license}`, // license key
        // analytics: analyticsConfig,
        version: "player_version",
        playback: {
            autoplay: autoplayOption,
            muted: volumeOption,
        },
        adaptation: {
            desktop: {
                preload: true
            },
            mobile: {
                preload: true
            }
        },
        ui: `${uiOption}`,
        events: {
            ready: function(){
                $(window).on(
                    "resize orientationchange webkitfullscreenchange mozfullscreenchange fullscreenchange",
                    function () {
                        try {
                            if(this.show_eboov_logo){
                                changeWaterMark(this.show_eboov_logo);
                            }else{
                                changeWaterMark(false);
                            }
                            if(this.use_brand_logo){
                                changeBrandWaterMark(this.use_brand_logo,this.custom_logo_redirect_url,this.custom_logo_url);
                            }
                            if (this.auto_hide_controls) {
                                hideControls(true);
                            }
                            changeColor(this.player_color);
                        } catch (error) {
                            throw error;
                        }
                    }
                );
                if (json.show_form == true && show_form_time == 0) {
                    this.pause();
                    this.setViewMode();
                    exitFullScreen();
                    window.parent.postMessage(
                        { command: "triggerOpenPopup",cta_popup:"false" },
                        `https://${parentDomain}`
                    );
                }
                if ($("#bmpui-id-2").length !== 0) {
                        this.mute();
                }else{
                    if(!json.auto_play){
                        this.unmute();
                    }
                }
            },
            play: function () {
                if ($("#bmpui-id-2").length == 0) {
                    if (!playArr.includes('Play')) {
                        playArr.push('Play');
                        window.parent.postMessage(
                            { command: "fbtrackingevent",status:"Play" },
                            `https://${parentDomain}`
                        );
                    }
                }
            },
            paused: function (event) {
                // var pausecurrentTime = event.time;
                // var pauseduration = this.getDuration();
                // var pausepercentage = (pausecurrentTime / pauseduration) * 100;
                // pausepercentage = Math.round(pausepercentage);
                const secondsPlayed = this.getDuration();
                const pausepercentage = Math.floor(secondsPlayed / 60);
                window.parent.postMessage(
                    { command: "fbpauseevent",percentage_val:pausepercentage },
                    `https://${parentDomain}`
                );
            },
            playbackfinished: function () {
                if ($("#bmpui-id-2").length !== 0) {
                    jQuery("#bmpui-id-2").removeClass("bmpui-on");
                    jQuery("#bmpui-id-2").addClass("bmpui-off");
                }
                if ($("#bmpui-id-2").length == 0) {
                    if(json.show_sales_form){
                        exitFullScreen();
                        window.parent.postMessage(
                            { command: "triggerOpenSalesPop",cta_popup:"true" },
                            `https://${parentDomain}`
                        );
                    }
                    switch (json.end_of_video) {
                        case "end_restart_play":
                            this.play();
                            break;
                        case "end_restart_pause":
                            this.play();
                            this.pause();
                            break;
                    }
                }else{
                    this.play();
                }
            },
            orientationchange: function() {
                if(json.show_eboov_logo){
                    changeWaterMark(json.show_eboov_logo);
                }else{
                    changeWaterMark(false);
                }
                if(json.use_brand_logo){
                    changeBrandWaterMark(json.use_brand_logo,json.custom_logo_redirect_url,json.custom_logo_url);
                }
                if (json.auto_hide_controls) {
                    hideControls(true);
                }
                changeColor(json.player_color);
            },
            timechanged: function (event) {
                if ($("#bmpui-id-2").length !== 0) {
                    jQuery("#bmpui-id-2").removeClass("bmpui-on");
                    jQuery("#bmpui-id-2").addClass("bmpui-off");
                }else{
                    var currentTime = event.time;
                    var duration = this.getDuration();
                    var percentage = (currentTime / duration) * 100;
                    percentage = Math.round(percentage);
                    // if(percentage == 25 ||percentage == 50 ||percentage == 75 || percentage == 95){
                    if(percentage > 25){
                        if(percentage >= 25 && percentage < 50){
                            percentage = 25;
                        }
                        if(percentage >= 50 && percentage < 75){
                            percentage = 50;
                        }
                        if(percentage >= 75 && percentage < 95){
                            percentage = 75;
                        }
                        if(percentage >= 95 && percentage <= 110){
                            percentage = 95;
                        }
                        if (!percentageArr.includes(percentage)) {
                            percentageArr.push(percentage);
                            window.parent.postMessage(
                                { command: "fbpercentageevent",percentage_val:percentage },
                                `https://${parentDomain}`
                            );
                        }
                    }
                    // if(!json.volume_controls){
                        if(countVal ==0){
                            if(!json.auto_play){
                                this.unmute();
                            }
                        }
                        countVal++;
                    // }
                }
                if ($("#bmpui-id-2").length == 0) {
                    if(use_brand_logo){
                        changeBrandWaterMark(json.use_brand_logo,json.custom_logo_redirect_url,json.custom_logo_url);
                    }
                    const elapsedTime = Math.floor(event.time);
                    if (json.show_form && elapsedTime >= show_form_time && !isResumeAfterLead) {
                        this.pause();
                        this.setViewMode();
                        exitFullScreen();
                        window.parent.postMessage(
                            { command: "triggerOpenPopup",cta_popup:"false" },
                            `https://${parentDomain}`
                        );
                    }
                    if (elapsedTime === 0) {
                        showAnnotation(false);
                    }
                    // if (elapsedTime === show_annotation_time && show_annotation) {
                    if (elapsedTime >= show_annotation_time && json.show_annotation) {
                        if ($("#bmpui-id-216").length !== 0) {
                            addAnnotation(json.annotation_text, json.annotation_link,json.cta_btn_position, json);
                        }
                        if($("#bmpui-id-125").length !== 0){
                            addAnnotation(json.annotation_text, json.annotation_link,json.cta_btn_position, json);
                        }
                        if($("#bmpui-id-431").length !== 0){
                            addAnnotation(json.annotation_text, json.annotation_link,json.cta_btn_position, json);
                        }
                        if($("#bmpui-id-340").length !== 0){
                            addAnnotation(json.annotation_text, json.annotation_link,json.cta_btn_position, json);
                        }
                        showAnnotation(true);
                    }else{
                        $(".annot-div1").remove();
                        $(".annot-div").remove();
                    }
                    if(hide_annotation_time !== 0){
                        if (elapsedTime >= hide_annotation_time && json.show_annotation) {
                            showAnnotation(false);
                        }
                    }
                }
            },
        },
        network: {
            preprocessHttpRequest: function (requestType, requestConfig) {
                requestConfig.url = requestConfig.url + "?AxDrmMessage=" + axinomMsgToken;
            },
        },
      };
      var mainSource = {
        // dash: `https://mediadev.eboov.com/enc/u/${json.uid}/${json.post_id}/manifest.mpd`,
        hls: `https://media.eboov.com/enc/u/${json.uid}/${json.post_id}/manifest.m3u8`,
        poster: posterThumb,
        // analytics: analyticsConfig,
        analytics: {
            key: "86def1d6-83ad-4344-9013-79096a41fc4c",
            videoId: json.eboov_id,
            title: json.video_title,
            customData1: parentDomain,
            customData2: json.eboov_campaign_id,
            customData3: json?.sales_campaign_id,
            customData4: 'MainVideo',
        },
        drm: {
            playready: {
                LA_URL: "https://3fb22d1e.drm-playready-licensing.axprod.net/AcquireLicense",
            },
            widevine: {
                LA_URL: "https://3fb22d1e.drm-widevine-licensing.axprod.net/AcquireLicense",
            },
        },
      };
      if(json.use_video_in_loop){
            var previewSource = {
                progressive: videoThumbnailurl,
                // analytics: {
                //     customData5: 'Thumbnail',
                // },
            };
            // Building the UI for previews
            let playbackToggleOverlay = new bitmovin.playerui.PlaybackToggleOverlay();
            playbackToggleOverlay.playbackToggleButton.onClick.subscribe(() => { 
                loadSource(player, mainSource)
                myUiManager.release()
                myUiManager = new bitmovin.playerui.UIFactory.buildDefaultUI(player)
                try {
                    if(json.show_eboov_logo){
                        changeWaterMark(json.show_eboov_logo);
                    }
                    if(json.use_brand_logo){
                        changeBrandWaterMark(json.use_brand_logo,json.custom_logo_redirect_url,json.custom_logo_url);
                    }
                    if (json.auto_hide_controls) {
                        hideControls(true);
                    }
                    changeColor(json.player_color);
                } catch (error) {
                    throw error;
                }
                this.show_eboov_logo = json.show_eboov_logo;
                this.use_brand_logo = json.use_brand_logo;
                this.auto_hide_controls = json.auto_hide_controls;
                this.auto_play = json.auto_play;
                this.player_color = json.player_color;
                this.json = json;
            });
            const previewUi = new bitmovin.playerui.UIContainer({
                components: [ 
                    playbackToggleOverlay,
                ],
            });
            // Building the UI for main playback
            var playerContainer = document.getElementById("eboov-display");
            // bitmovin.player.Player.addModule(bitmovin.analytics.PlayerModule);
            player = new bitmovin.player.Player(playerContainer, playerConfig);
            var myUiManager = new bitmovin.playerui.UIManager(player, previewUi);
            loadSource(player, previewSource);
            // functions
            function loadSource(player, source) {
                player.load(source).then(function () {(player) => {
                },(reason) => {
                    console.log("Error while creating Bitmovin Player instance", reason);
                }
            });
        }
      }else{

          const container = document.getElementById("eboov-display");
          // status published, is_active = true?
          if (validate(json)) {
            playerConfig.analytics = analyticsConfig;
            player = new bitmovin.player.Player(container, playerConfig);
            bitmovin.player.Player.addModule(bitmovin.analytics.PlayerModule);
            player.load(mainSource).then(function () {
                // Attach legacy UI skin to player
                try {
                    if(json.show_eboov_logo){
                        changeWaterMark(json.show_eboov_logo);
                    }
                    if(json.use_brand_logo){
                        changeBrandWaterMark(json.use_brand_logo,json.custom_logo_redirect_url,json.custom_logo_url);
                    }
                    if (json.auto_hide_controls) {
                        hideControls(true);
                    }
                    changeColor(json.player_color);
                } catch (error) {
                    throw error;
                }
                this.show_eboov_logo = json.show_eboov_logo;
                this.use_brand_logo = json.use_brand_logo;
                this.auto_hide_controls = json.auto_hide_controls;
                this.auto_play = json.auto_play;
                this.player_color = json.player_color;
                this.json = json;
            });
        }
    }
    const allowedDomains = await getAllowedDomains(json.uid);
    if (!domainCheck(allowedDomains, parentDomain)) {
        player.destroy();
        $('#eboov-display').after('<img src="https://cdn.eboov.com/player/web/8/domain.png" style="width:100%;">');
        $('#eboov-display').remove();
        return;
    }else{
        // Subscription Check
        var Subscsettings = {
          "url": "https://app.eboov.com/wp-json/eb/v1/subscription/check",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "uid": json.uid
          }),
        };
        $.ajax(Subscsettings).done(function (response) {
            if(response.status == 'error' && response.message == 'No active subscription'){
                player.destroy();
                $('#eboov-display').after('<img src="https://cdn.eboov.com/player/web/8/subscription-image.png" style="width:100%;">');
                $('#eboov-display').remove();
                return;
            }else{
            }
        }).fail(function (jqxhr, textStatus, error) {
        });
    }
}
function domainCheck(allowedDomains, currentDomain) {
    const domainsArr = [
        "eboov.com",
        "eboovappstg.wpengine.com",
        "eboovappdev.wpengine.com",
        "app.funnel-preview.com",
        "app.gohighlevel.com",
        ...allowedDomains.data,
    ];
    return domainsArr.some((domain) => {
        return currentDomain.includes(domain);
    });
}
function validate({ status = "published", is_active = true }) {
    return status === "published" && is_active;
}
function changeBackground(color) {
    document.body.style.backgroundColor = color;
}
function addVideoTitle(title) {
    const domain = document.domain;
    if (domain.includes("eboov.com")) {
        const nameDiv = document.getElementById("video_title");
        if (nameDiv) nameDiv.innerText = title;
    }
}
function showSpeakerIcon(){
    jQuery('#bmpui-id-2').append('<div class="volume-speaker-icon"><img src="https://cdn.eboov.com/player/web/8/video-thumbnail-volume.png"></div>');
}
function changeWaterMark(showEboov) {
    const watermark = document.querySelector("button.bmpui-ui-watermark");
    if (watermark) {
        if (!showEboov) {
            document.querySelectorAll('.bmpui-ui-watermark').forEach(function(el) {
               el.style.display = "none";
            });
        } else {
            document.querySelectorAll('.bmpui-ui-watermark').forEach(function(el) {
                el.style.display = "block";
                el.dataset.url = "https://eboov.com";
                el.style.background =
                    "url('https://cdn.eboov.com/eboov_logo_e.svg')";
                el.style.backgroundSize = "contain";
                el.style.backgroundRepeat = "no-repeat";
            });
        }
    }
}
function changeBrandWaterMark(showEboov,custom_logo_redirect_url,custom_logo_url) {
    const watermark = document.querySelector("button.bmpui-ui-watermark");
    if (watermark) {
        if (!showEboov) {
            document.querySelectorAll('.bmpui-ui-watermark').forEach(function(el) {
               el.style.display = "none";
            });
        } else {
            document.querySelectorAll('.bmpui-ui-watermark').forEach(function(el) {
               el.style.display = "block";
               el.dataset.url = custom_logo_redirect_url;
               el.style.background =
                    "url('"+custom_logo_url+"')";
               el.style.backgroundSize = "contain";
               el.style.backgroundRepeat = "no-repeat";
            });
        }
    }
}
function hideTimeBar() {
    const timeBar = document.querySelector(
        ".bmpui-ui-container.bmpui-controlbar-top"
    );
    if (timeBar) {
        timeBar.style.display = "none";
    }
}
function disableAutoHideCtrlBar() {
    const styles = document.getElementsByTagName("style");
    styles[0].sheet.insertRule(
        ".bmpui-controls-hidden { all: unset !important;}",
        0
    );
    styles[0].sheet.insertRule(
        ".bmpui-ui-controlbar.bmpui-hidden { visibility: unset !important; opacity: unset !important; }",
        1
    );
    styles[0].sheet.insertRule(
        ".bmpui-ui-titlebar.bmpui-hidden { visibility: unset !important; opacity: unset !important; }",
        2
    );
    styles[0].sheet.insertRule(
        ".bmpui-ui-uicontainer .bmpui-ui-subtitle-overlay { bottom: 5em !important; }",
        3
    );
}
function changeColor(player_color) {
    const playbackDiv = document.querySelectorAll(
        ".bmpui-seekbar-playbackposition"
    );
    const playbackposition_marker = document.querySelectorAll(
        ".bmpui-seekbar-playbackposition-marker"
    );
    // const seekbar_markers = document.querySelector(".bmpui-seekbar-markers");
    [...playbackDiv, ...playbackposition_marker].forEach((element) => {
        element.style.backgroundColor = player_color;
    });
    const rgba_value = convertHexToRgbA50(player_color);
    if (playbackposition_marker.length) {
        playbackposition_marker[0].style.backgroundColor = rgba_value;
    }
    if (playbackposition_marker.length) {
        playbackposition_marker[0].style.borderColor = player_color;
    }
}

function openSalesModal(e){
    e.preventDefault();
    player.pause();
    exitFullScreen();
    const parentModalDomain = new URL(document.referrer).hostname;
    window.parent.postMessage(
        { command: "triggerOpenSalesPop",cta_popup:"true" },
        `https://${parentModalDomain}`
    );
    return false;
}
function addAnnotation(annotation_text, annotation_link,cta_btn_position, json) {
    const bottom = json.auto_hide_controls ? "15px" : "100px";
    const cta_new_color = json.cta_color ? json.cta_color : "white";
    const cta_new_btn_color = json.cta_btn_color ? json.cta_btn_color : "rgba(0,0,0,0.10)";
    const cta_new_btn_padding = json.cta_btn_padding ? json.cta_btn_padding : "10";
    const cta_new_btn_width = json.cta_btn_width ? json.cta_btn_width : "50";
    let cta_new_btn_position =""
    let annotation_func = '';
    let annotation_href = '';
    const annotation_text_val = annotation_text ? annotation_text : "Click Here";
    if(!annotation_link && json.cta_radio_option == 'sale_campaign'){
        annotation_func = 'onclick="openSalesModal(event);"';
        annotation_href = 'href="#"';
    }
    if(json.cta_radio_option == 'cta_callable'){
        annotation_href = `href="tel:${json.annotation_number}"`;
    }
    if(annotation_link){
        annotation_href = `href="${annotation_link}"`;
    }
    if(cta_btn_position == 'top-left'){
      cta_new_btn_position = json.auto_hide_controls ? "top:15px; left:15px;" : "top:100px; left:100px;";
      cta_new_btn_position = jQuery(window).width() > 480 ? cta_new_btn_position : "top:15px; left:15px;";
    }else if(cta_btn_position == 'top-center'){
      cta_new_btn_position = json.auto_hide_controls ? "top:15px;" : "top:100px;";
      cta_new_btn_position = jQuery(window).width() > 480 ? cta_new_btn_position : "top:15px;";
    }else if(cta_btn_position == 'top-right'){
      cta_new_btn_position = json.auto_hide_controls ? "top:15px; right:15px;" : "top:100px; right:100px;";
      cta_new_btn_position = jQuery(window).width() > 480 ? cta_new_btn_position : "top:15px; right:15px;";
    }else if(cta_btn_position == 'middle-left'){
      cta_new_btn_position = json.auto_hide_controls ? "top:35px; left:15px;" : "top:250px; left:100px;";
      cta_new_btn_position = jQuery(window).width() > 480 ? cta_new_btn_position : "top:35px; left:15px;";
    }else if(cta_btn_position == 'middle-center'){
      cta_new_btn_position = "top: 50%; left: 50%; transform: translate(-50%, -50%);";
    }else if(cta_btn_position == 'middle-right'){
      cta_new_btn_position = json.auto_hide_controls ? "top:35px; right:15px;" : "top:250px; right:100px;";
      cta_new_btn_position = jQuery(window).width() > 480 ? cta_new_btn_position : "top:35px; right:15px;";
    }else if(cta_btn_position == 'bottom-left'){
      cta_new_btn_position = json.auto_hide_controls ? "bottom:15px;left:15px;" : "bottom:15px; left:100px;";
      cta_new_btn_position = jQuery(window).width() > 480 ? cta_new_btn_position : "bottom:15px;left:15px;";
    }else if(cta_btn_position == 'bottom-right'){
      cta_new_btn_position = json.auto_hide_controls ? "bottom:15px;right:15px;" : "bottom:15px; right:100px;";
       cta_new_btn_position = jQuery(window).width() > 480 ? cta_new_btn_position : "bottom:15px;right:15px;";
    }else{
       cta_new_btn_position = json.auto_hide_controls ? "bottom:15px;" : "bottom:15px;";
       cta_new_btn_position = jQuery(window).width() > 480 ? cta_new_btn_position : "bottom:20px;";
    }
    if ($("#bmpui-id-216").length !== 0) {
        if ($(".annotation-text").length == 0) {
            $(".annotation-text1").remove();
            $("#bmpui-id-216").after(
                 // `<div style="display: flex; justify-content: center;"><a role="button" class="annotation-text" ${annotation_href} target="_blank" style="cursor: pointer; position: absolute; z-index: 99999; width: ${cta_new_btn_width}%; padding: ${cta_new_btn_padding}px; border: 3px ${cta_new_btn_color} solid; border-radius: 10px; text-align: center; color: ${cta_new_color}; -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); background-color:${cta_new_btn_color}; text-decoration: none; ${cta_new_btn_position}">${annotation_text_val}</a></div>`
                 `<div style="display: flex; justify-content: center;"><a role="button" class="annotation-text" ${annotation_href} ${annotation_func} target="_blank" style="cursor: pointer; position: absolute; z-index: 99999; width: ${cta_new_btn_width}%; padding: ${cta_new_btn_padding}px; border: 3px ${cta_new_btn_color} solid; border-radius: 10px; text-align: center; color: ${cta_new_color}; -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); background-color:${cta_new_btn_color}; text-decoration: none; ${cta_new_btn_position}">${annotation_text_val}</a></div>`
            );
        }
    }
    if ($("#bmpui-id-431").length !== 0) {
        if ($(".annotation-text").length == 0) {
            $(".annotation-text1").remove();
            $("#bmpui-id-431").after(
                 // `<div style="display: flex; justify-content: center;"><a role="button" class="annotation-text" ${annotation_href} target="_blank" style="cursor: pointer; position: absolute; z-index: 99999; width: ${cta_new_btn_width}%; padding: ${cta_new_btn_padding}px; border: 3px ${cta_new_btn_color} solid; border-radius: 10px; text-align: center; color: ${cta_new_color}; -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); background-color:${cta_new_btn_color}; text-decoration: none; ${cta_new_btn_position}">${annotation_text_val}</a></div>`
                 `<div style="display: flex; justify-content: center;"><a role="button" class="annotation-text" ${annotation_href} ${annotation_func} target="_blank" style="cursor: pointer; position: absolute; z-index: 99999; width: ${cta_new_btn_width}%; padding: ${cta_new_btn_padding}px; border: 3px ${cta_new_btn_color} solid; border-radius: 10px; text-align: center; color: ${cta_new_color}; -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); background-color:${cta_new_btn_color}; text-decoration: none; ${cta_new_btn_position}">${annotation_text_val}</a></div>`
            );
        }
    }
    if ($("#bmpui-id-340").length !== 0) {
        if ($(".annotation-text").length == 0) {
            $(".annotation-text1").remove();
            $("#bmpui-id-340").after(
                // `<div style="display: flex; justify-content: center;"><a role="button" class="annotation-text" ${annotation_href} target="_blank" style="cursor: pointer; position: absolute; z-index: 99999; width: ${cta_new_btn_width}%; padding: ${cta_new_btn_padding}px; border: 3px ${cta_new_btn_color} solid; border-radius: 10px; text-align: center; color: ${cta_new_color}; -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); background-color:${cta_new_btn_color}; text-decoration: none; ${cta_new_btn_position}">${annotation_text_val}</a></div>`
                `<div style="display: flex; justify-content: center;"><a role="button" class="annotation-text" ${annotation_href} ${annotation_func} target="_blank" style="cursor: pointer; position: absolute; z-index: 99999; width: ${cta_new_btn_width}%; padding: ${cta_new_btn_padding}px; border: 3px ${cta_new_btn_color} solid; border-radius: 10px; text-align: center; color: ${cta_new_color}; -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); background-color:${cta_new_btn_color}; text-decoration: none; ${cta_new_btn_position}">${annotation_text_val}</a></div>`
            );
        }
    }
    if ($("#bmpui-id-125").length !== 0) {
        if ($(".annotation-text1").length == 0) {
            $(".annotation-text").remove();
            $("#bmpui-id-125").after(
                 // `<div style="display: flex; justify-content: center;"><a role="button" class="annotation-text1" ${annotation_href} target="_blank" style="cursor: pointer; position: absolute; z-index: 99999; width: ${cta_new_btn_width}%; padding: ${cta_new_btn_padding}px; border: 3px ${cta_new_btn_color} solid; border-radius: 10px; text-align: center; color: ${cta_new_color}; -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); background-color:${cta_new_btn_color}; text-decoration: none; ${cta_new_btn_position}">${annotation_text_val}</a></div>`
                 `<div style="display: flex; justify-content: center;"><a role="button" class="annotation-text1" ${annotation_href} ${annotation_func} target="_blank" style="cursor: pointer; position: absolute; z-index: 99999; width: ${cta_new_btn_width}%; padding: ${cta_new_btn_padding}px; border: 3px ${cta_new_btn_color} solid; border-radius: 10px; text-align: center; color: ${cta_new_color}; -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75); background-color:${cta_new_btn_color}; text-decoration: none; ${cta_new_btn_position}">${annotation_text_val}</a></div>`
            );
        }
    }
}

function showAnnotation(isShow) {
    if (isShow) {
        $(".annotation-text").css({ visibility: "visible" });
        $(".annotation-text1").css({ visibility: "visible" });
    } else {
        $(".annotation-text").css({ visibility: "hidden" });
        $(".annotation-text1").css({ visibility: "hidden" });
    }
}

function exitFullScreen() { 
    const fullscreenbutton = document.getElementsByClassName("bmpui-ui-fullscreentogglebutton bmpui-on")[0];    
    if (fullscreenbutton) { 
        document.querySelectorAll('.bmpui-ui-fullscreentogglebutton.bmpui-on').forEach(function(el) {   
           el.click();  
        }); 
    }   
}
function hideControls(hide) {
    const controls = document.getElementsByClassName("bmpui-ui-controlbar")[0];
    const settingstogglebutton = document.getElementsByClassName("bmpui-ui-settingstogglebutton bmpui-off")[0];
    const fullscreentogglebutton = document.getElementsByClassName("bmpui-ui-fullscreentogglebutton")[0];
    const controlbar = document.getElementsByClassName("bmpui-ui-container bmpui-controlbar-top")[0];
    const playback = document.getElementsByClassName("bmpui-ui-playbacktogglebutton")[0];
    if (settingstogglebutton) {
        document.querySelectorAll('.bmpui-ui-settingstogglebutton').forEach(function(el) {
           el.style.display = hide ? "none" : "block";
        });
    }
    if (fullscreentogglebutton) {
        document.querySelectorAll('.bmpui-ui-fullscreentogglebutton').forEach(function(el) {
           el.style.display = hide ? "none" : "block";
        });
    }
    if(playback){
        document.querySelectorAll('.bmpui-ui-playbacktogglebutton').forEach(function(el) {
           el.style.display = hide ? "none" : "block";
        });
    }
    if (controlbar) {
        document.querySelectorAll('.bmpui-ui-container.bmpui-controlbar-top').forEach(function(el) {
           el.style.display = hide ? "none" : "block";
        });
    }
}
function hideAutoplay(hide){
    if (hide) {
        if(document.getElementsByClassName("bmpui-ui-playbacktogglebutton")[0]){
            document.getElementsByClassName("bmpui-ui-playbacktogglebutton")[0].style.display = "none";
        }
    }else{
        if(document.getElementsByClassName("bmpui-ui-playbacktogglebutton")[0]){
            document.getElementsByClassName("bmpui-ui-playbacktogglebutton")[0].style.display = "block";
        }
    }
}
function hideFullscreenControls(hide){
    if (hide) {
        if(document.getElementsByClassName("bmpui-ui-fullscreentogglebutton")[0]){
            document.getElementsByClassName("bmpui-ui-fullscreentogglebutton")[0].style.display = "none";
        }
    }else{
        if(document.getElementsByClassName("bmpui-ui-fullscreentogglebutton")[0]){
            document.getElementsByClassName("bmpui-ui-fullscreentogglebutton")[0].style.display = "block";
        }
    }
}
function hidePlaybackSpeedControls(hide){
    if(document.getElementsByClassName("bmpui-ui-container bmpui-controlbar-top")[0]){
        document.getElementsByClassName("bmpui-ui-container bmpui-controlbar-top")[0].style.display = "none";
    }
    if(document.getElementsByClassName("bmpui-ui-settingstogglebutton bmpui-off")[0]){
        document.getElementsByClassName("bmpui-ui-settingstogglebutton bmpui-off")[0].style.display = "none";
    }
}
/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas =
        getTextWidth.canvas ||
        (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}
function convertHexToRgbA50(hexVal) {
    var ret;

    // If the hex value is valid.
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexVal)) {
        // Getting the content after '#',
        // eg. 'ffffff' in case of '#ffffff'
        ret = hexVal.slice(1);

        // Splitting each character
        ret = ret.split("");

        // Checking if the length is 3
        // then make that 6
        if (ret.length == 3) {
            var ar = [];
            ar.push(ret[0]);
            ar.push(ret[0]);
            ar.push(ret[1]);
            ar.push(ret[1]);
            ar.push(ret[2]);
            ar.push(ret[2]);
            ret = ar;
        }

        // Starts with '0x'(in hexadecimal)
        ret = "0x" + ret.join("");

        // Converting the first 2 characters
        // from hexadecimal to r value
        var r = (ret >> 16) & 255;

        // Converting the second 2 characters
        // to hexadecimal to g value
        var g = (ret >> 8) & 255;

        // Converting the last 2 characters
        // to hexadecimal to b value
        var b = ret & 255;

        // Appending all of them to make
        // the RGBA value
        return "rgba(" + [r, g, b].join(",") + ",0.5)";
    }
}
function parseTimeStr(str) {
    const timeArr = str.split(":");
    return (
        Number.parseInt(timeArr[0]) * 3600 +
        Number.parseInt(timeArr[1]) * 60 +
        Number.parseInt(timeArr[2])
    );
}
function onMessage(event) {
    var data = event.data;
    if (typeof window[data.func] == "function") {
        window[data.func].call(null, data.message);
    }
}
function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
$(window).on(
    "resize orientationchange webkitfullscreenchange mozfullscreenchange fullscreenchange",
    function () {
        try {
            if(this.show_eboov_logo){
                changeWaterMark(this.show_eboov_logo);
            }else{
                changeWaterMark(false);
            }
            if(this.use_brand_logo){
                changeBrandWaterMark(this.use_brand_logo,this.custom_logo_redirect_url,this.custom_logo_url);
            }
            if (this.auto_hide_controls) {
                hideControls(true);
            }
            changeColor(this.player_color);
        } catch (error) {
            throw error;
        }
    }
);
window.addEventListener("message", (event) => {
    if (event.data.command === "triggerResumeAfterLead") {
        isResumeAfterLead = true;
        player.play();
    }
    if (event.data.command === "triggerResumeAfterSales") {
        isResumeAfterSales = true;
        player.play();
    }
    if(event.data.command === "changeResolution") {
        const controls = document.getElementsByClassName("bmpui-ui-controlbar")[0];
        const settingstogglebutton = document.getElementsByClassName("bmpui-ui-settingstogglebutton bmpui-off")[0];
        const fullscreentogglebutton = document.getElementsByClassName("bmpui-ui-fullscreentogglebutton")[0];
        const controlbar = document.getElementsByClassName("bmpui-ui-container bmpui-controlbar-top")[0];
        const playback = document.getElementsByClassName("bmpui-ui-playbacktogglebutton")[0];
        const hide = true;
        if (settingstogglebutton) {
            document.querySelectorAll('.bmpui-ui-settingstogglebutton').forEach(function(el) {
                el.style.display = hide ? "none" : "block";
            });
        }
        if (fullscreentogglebutton) {
            document.querySelectorAll('.bmpui-ui-fullscreentogglebutton').forEach(function(el) {
                el.style.display = hide ? "none" : "block";
            });
        }
        if(playback){
            document.querySelectorAll('.bmpui-ui-playbacktogglebutton').forEach(function(el) {
                el.style.display = hide ? "none" : "block";
            });
        }
        if (controlbar) {
            document.querySelectorAll('.bmpui-ui-container.bmpui-controlbar-top').forEach(function(el) {
                el.style.display = hide ? "none" : "block";
            });
        }
    }
});