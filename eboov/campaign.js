this.eboov_campaign_id = "";
this.sales_campaign_id = "";
this.ip_address = "";
this.eboov_id = "";
this.trackingIds = {};
this.conversion_js = "";
this.popup_js = "";
this.uid = "";
this.is_fb = false;
this.is_snap = false;
this.is_google = false;
this.is_tik = false;
this.is_bing = false;
this.is_pin = false;
this.is_twit = false;
this.is_clar = false;
this.lead_stat_id = 0;
this.sale_stat_id = 0;
this.iframeTop = 0;
this.iframeLeft = 0;
this.eboovembed;
this.enable_retargeting = "";
this.fb_pixel_id = "";
this.global_pixel = true;
this.video_title = "";
this.enable_ga4_retargeting = "";
this.ga4_measurement_id = "";
var url =
  "https://ipgeolocation.abstractapi.com/v1/?api_key=4af5d5fdf3664b4ba9d9062f2ebb7ba3";
var paymentApiEndpoint = "https://app.eboov.com/includes/payments.php";

// (function() {
// 	if(typeof window.jQuery == "undefined"){
    // Load the script
    var referrer = document.referrer;
    if (referrer.indexOf('https://app.eboov.com/') > -1) {
      var script = '';
    }else{
      var script = document.createElement("script");
      script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
      script.type = 'text/javascript';
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    script.onload = function() {
     // var $ = window.jQuery.noConflict();
//   }
    
// })();
// var $ = window.jQuery.noConflict();
        // var $ = jQuery.noConflict();
        // window.onload = function () {

        var load = function () {
          if(jQuery("#eboov-iframe").length != 0){
          	var $ = window.jQuery.noConflict();
        		jQuery( "#eboov-iframe" ).ready(function(){
        		  ebooviFrameLoaded();
        		  eboovdefer(eboovpopup);	
        		});

        	  jQuery(document).click(function(event) {
        	    //if you click on anything except the modal itself or the "open modal" link, close the modal
        	    if (jQuery("#ebv-salesContainer").is(":visible")) {
        	      if (!jQuery(event.target).closest("#ebv-salesContainer").length) {
        	        jQuery("#ebv-salesContainer").hide();
        	        jQuery("#ebv-popup-backdrop").hide();
        	      }
        	    }
        	  });
        		
        		jQuery(window).on("resize", function(event) {
        	      eboovresizePopup(event);
        	  });

            jQuery(window).on("resize orientationchange webkitfullscreenchange mozfullscreenchange fullscreenchange",function () {
              jQuery("#eboov-iframe")[0].contentWindow.postMessage(
                { command: "changeResolution" },
                "https://embed.eboov.com"
              );
            });

        	  jQuery(document).on('click', '.hide-sales-popup' , function() {
        	    if (jQuery("#ebv-salesContainer").is(":visible")) {
        	      jQuery("#ebv-salesContainer").hide();
        	      jQuery("#ebv-popup-backdrop").hide();
        	      jQuery(".hide-sales-popup").remove();
        	      jQuery("#eboov-iframe")[0].contentWindow.postMessage(
        	        { command: "triggerResumeAfterSales" },
        	        "https://embed.eboov.com"
        	      );
        	    }
        	  });
        	}else{
            window.onload = function () {
              load();
            };
          }

        };

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', load); // Document still loading so DomContentLoaded can still fire :)
        } else {
          load();
        }

        function eboovdefer(func) {
          var timesToCheck = 10;

          const interval = setInterval(function callback() {
            timesToCheck--;
            if (typeof window.jQuery !== "undefined") {
              $ = window.jQuery;
              func();
              clearInterval(interval);
              return;
            }

            if (timesToCheck <= 0) {
              clearInterval(interval);
              return;
            }
          }, 1000);
        }

        function ebooviFrameLoaded(){
        	 var iframes = document.querySelectorAll('iframe[src*="embed.eboov.com"]');
        	
        	if(iframes.length > 0){
        	 var url = new URL(iframes[0].src);
        	  const params = new URLSearchParams(url.search);
        	  if(params.has("v") == true){
            	this.eboovembed = params.get("v");
            }else{
            	this.eboovembed = window.location.pathname.substring(1);
            }
          }
        }

        function eboovresizePopup(event){
          var isMobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                  navigator.userAgent
                );
        	 this.iframeTop = jQuery("#eboov-iframe").parent().offset().top;
           // this.iframeLeft = isMobile ? '50%': (((jQuery('#eboov-iframe').width() - jQuery('#ebv-salesContainer').outerWidth()) / 2) + jQuery('#eboov-iframe').scrollLeft()) + Math.max(0, ((jQuery(window).width() - jQuery('#eboov-iframe').outerWidth()) / 2) + jQuery(window).scrollLeft()) + 'px';
        	 // this.iframeLeft = isMobile ? '50%':(parseInt(jQuery("#eboov-iframe").parent().width()) / 2 + jQuery("#eboov-iframe").parent().offset().left);
           this.iframeLeft = isMobile ? '50%': (parseInt(jQuery("#eboov-iframe").parent().width()) / 2 - jQuery("#ebv-salesContainer").width() / 2  + jQuery("#eboov-iframe").parent().offset().left);
        	 jQuery("#ebv-salesContainer").css({"top": "","left": ""});
        	  jQuery("#ebv-salesContainer").css({
                  top: this.iframeTop,
                  left: this.iframeLeft,
                  "z-index": 99999,
               });
               
                jQuery("#ebv-popupContainer").css({
                  top: this.iframeTop,
                  left: this.iframeLeft,
                  "z-index": 99999,
                });

                jQuery("#ebv-popup-backdrop").css({
                  position: "absolute",
                  top:
                    parseInt(jQuery("#eboov-iframe").css("height")) / 2 +
                    jQuery("#eboov-iframe").offset().top,
                  left:
                    jQuery("#eboov-iframe").width() / 2 +
                    jQuery("#eboov-iframe").offset().left,
                  transform: "translate(-50%, -50%)",
                  height: parseInt(jQuery("#eboov-iframe").css("height")),
                  width: jQuery("#eboov-iframe").width(),
                  "z-index": 9999,
                  "background-color": "#00000080",
                });
        	
        }



        //height: calc(100% + 10px);
        function eboovpopup() {
          // Select videos
         var _this = this;
              jQuery("<div id='ebv-popupContainer' class='popupContainer' style='display: none;' />").appendTo("body");
              jQuery("<div id='ebv-salesContainer' class='salesContainer' style='display: none;' />").appendTo("body");
              jQuery("<div id='ebv-popup-backdrop' style='display: none;' ></div>").appendTo(
                jQuery("#ebv-popupContainer").parent()
              );
              jQuery("#ebv-popup-backdrop").css({
                position: "absolute",
                top:
                  parseInt(jQuery("#eboov-iframe").css("height")) / 2 +
                  jQuery("#eboov-iframe").offset().top,
                left:
                  jQuery("#eboov-iframe").width() / 2 +
                  jQuery("#eboov-iframe").offset().left,
                transform: "translate(-50%, -50%)",
                height: parseInt(jQuery("#eboov-iframe").css("height")),
                width: jQuery("#eboov-iframe").width(),
                "z-index": 9999,
                "background-color": "#00000080",
              });
          
             
              var embed_url = "https://api.epopsdev.com/v1/embeds/get";
             
              try {
                jQuery.post( embed_url,JSON.stringify({eboov_id: this.eboovembed}),function(data){
                 
                  const json = data.data[0];
                  if(json !== undefined){
                    const {
                      popup_html,
                      popup_css,
                      popup_js,
                      conversion_js,
                      tracking_ids,
                      eboov_campaign_id,
                      sales_campaign_id,
                      eboov_id,
                      uid,
                      sales_popup_css,
                      sales_popup_html,
                      video_title,
                      enable_retargeting,
                      fb_pixel_id,
                      enable_ga4_retargeting,
                      ga4_measurement_id,
                    } = json;
                   
                    if (popup_html) {
                      const popupContainer = jQuery("#ebv-popupContainer");
                      if (popupContainer) {
                        popupContainer.html(popup_html.replace(/\\"/g, '"'));
                        jQuery("#eboov_submit_button").bind("click",function(e){eboovLeadButtonClick(e)});
                      }
                    }
                    if (sales_popup_html) {
                      const salesContainer = jQuery("#ebv-salesContainer");
                      if (salesContainer) {
                        salesContainer.html(sales_popup_html.replace(/\\"/g, '"'));
                        jQuery("#eboov_step_one").bind("click",function(e){eboovSalesPopOneClick(e);});
                        jQuery("#eboov_step_two").bind("click",function(e){eboovSalesPopTwoClick(e)});
                        jQuery("#eboov-add-bump").bind("change",function(e){eboovBumpCheckBox(e)});
                        
                      }
                    }

                    if (popup_css) {
                      let css_str = popup_css;
                      css_str = css_str.replace(/}/g, "} \n");
                      jQuery("#ebv-popupContainer").prepend(`<style>${css_str}</style>`);
                    }
                    if (sales_popup_css) {
                      let css_str = sales_popup_css;
                      css_str = css_str.replace(/}/g, "} \n");
                      jQuery("#ebv-salesContainer").prepend(`<style>${css_str}</style>`);
                    }
                    
                    jQuery("#ebv-popupContainer").prepend(
                      "<link rel='stylesheet' href='https://user.eboov.com/eb-boot-min.css?v=1.0.1' />"
                    );
                    jQuery("#ebv-salesContainer").prepend(
                      "<link rel='stylesheet' href='https://user.eboov.com/eb-boot-min.css?v=1.0.1' />"
                    );
                  
                   try {
                    _this.trackingIds = JSON.parse(tracking_ids);
                   } catch (e) {
                     console.log(e);
                   }
                   _this.enable_retargeting = enable_retargeting;
                    if(enable_retargeting == true && enable_retargeting != ''){
                      if(_this.trackingIds.facebook_pixel_id == _this.fb_pixel_id){
                        _this.global_pixel = false;
                        _this.fb_pixel_id = _this.trackingIds.facebook_pixel_id;
                      }else{
                        _this.global_pixel = false;
                        _this.fb_pixel_id = fb_pixel_id;
                      }
                    }else if (_this.trackingIds.facebook_pixel_id) {
                        _this.global_pixel = true;
                      _this.fb_pixel_id = _this.trackingIds.facebook_pixel_id;
                    }
                   _this.enable_ga4_retargeting = enable_ga4_retargeting;
                   _this.ga4_measurement_id = ga4_measurement_id;
                   _this.conversion_js = conversion_js;
                   _this.popup_js = popup_js;
                   _this.eboov_campaign_id = eboov_campaign_id;
                   _this.sales_campaign_id = sales_campaign_id;
                   _this.eboov_id = eboov_id;
                   _this.video_title = video_title;
                   _this.uid = uid;
                  }
                });
              } catch (error) {
                console.log(error);
              }
           

          if (window.addEventListener) {
            window.addEventListener("message", onMessage, false);
           
          } else if (window.attachEvent) {
            window.attachEvent("onmessage", onMessage, false);
          }
          
         
        }



        /**
         *
         * @param {integer} screen_size
         */
        function eboovadjustPopupCSS(screen_size) {
          const ptype_size = screen_size > 480 ? "500px" : "375px";
          jQuery("#ebv-popupContainer").css({ "max-width": ptype_size, width: "100%" });
        }
        function eboovadjustSalesCSS(screen_size) {
          const ptype_size = screen_size > 480 ? "500px" : "375px";
          jQuery("#ebv-salesContainer").css({ "max-width": ptype_size, width: "100%" });
        }

        function eboovadjustAlertCSS(screen_size) {
          const ptype_size = screen_size > 480 ? "500px" : "375px";
          jQuery("#ebv-alertContainer").css({ "max-width": ptype_size, width: "100%" });
        }

        function eboovadjustSuccessfullCSS(screen_size) {
          const ptype_size = screen_size > 480 ? "80%" : "375px";
          jQuery("#ebv-succesfullContainer").css({ "max-width": ptype_size, width: "100%" });
        }

        function eboovopenPopup() {
        	 var isMobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                  navigator.userAgent
                );
        	  
        	  var iframe_height = parseInt(jQuery("#eboov-iframe").parent().height());
        	  var iframe_pad_top = parseInt(jQuery("#eboov-iframe").parent().css("padding-top"));
        	  var use_padding = iframe_pad_top;
        	  
        	  if(parseInt(use_padding) <=0 && iframe_height > 0){
        	  	use_padding = iframe_height;
        	  }
        	  
        	 
        	   jQuery("#ebv-popupContainer").css({
                 position: "absolute",
                  top: isMobile ? jQuery("#eboov-iframe").parent().offset().top : ((use_padding / 2) + jQuery("#eboov-iframe").parent().offset().top),
                  left: isMobile ? '50%': (parseInt(jQuery("#eboov-iframe").parent().width()) / 2 + jQuery("#eboov-iframe").parent().offset().left),
                  "transform": isMobile ? "translate(-50%, 0)" : "translate(-50%, -50%)",
                  "z-index": 99999,
                  
                });
                 
        		eboovsaveLeadStats();
          	const popupContainer = jQuery("#ebv-popupContainer");
          	const popupBackdrop = jQuery("#ebv-popup-backdrop");
          	popupContainer.css({ display: "block" });
          	popupBackdrop.css({ display: "block" });
          	eboovadjustPopupCSS(parseInt(jQuery(window).width()));
            eboovleadTracking();
        }


        function eboovopenSalesPop(show_close_btn) {
          if(show_close_btn == 'true'){
            if(jQuery(".hide-sales-popup").length == 0){
              jQuery("#ebv-salesContainer #eboov-pop").find(".eboov-card:first").prepend('<div class="hide-sales-popup" style="width:25px; position: absolute; right: -24px; font-size: 15px; color: #fff; background: #040000a8; border-radius: 50%; padding: 2px 8px; font-weight: 500; cursor: pointer;z-index: 99999;">X</div>');
            }
          }else{
            if(jQuery(".hide-sales-popup").length == 0){
              jQuery('.hide-sales-popup').remove();
            }
          }
        	 var isMobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                  navigator.userAgent
                );
                
                 var iframe_height = parseInt(jQuery("#eboov-iframe").parent().height());
        	  var iframe_pad_top = parseInt(jQuery("#eboov-iframe").parent().css("padding-top"));
        	  var use_padding = iframe_pad_top;
        	  
        	  if(parseInt(use_padding) <=0 && iframe_height > 0){
        	  	use_padding = iframe_height;
        	  }
        	  
        	 // this.iframeTop = isMobile ? jQuery("#eboov-iframe").parent().offset().top : ((use_padding / 2));
           this.iframeTop = jQuery("#eboov-iframe").parent().offset().top;
        	 // this.iframeLeft = isMobile ? (parseInt(jQuery("#eboov-iframe").parent().width()) / 2 + jQuery("#eboov-iframe").parent().offset().left) : (parseInt(jQuery("#eboov-iframe").parent().width()) / 2 + jQuery("#eboov-iframe").parent().offset().left/2);
           this.iframeLeft = isMobile ? '50%':(parseInt(jQuery("#eboov-iframe").parent().width()) / 2 - jQuery("#ebv-salesContainer").width() / 2  + jQuery("#eboov-iframe").parent().offset().left);
        	 // this.iframeLeft = isMobile ? '50%': (((jQuery('#eboov-iframe').width() - jQuery('#ebv-salesContainer').outerWidth()) / 2) + jQuery('#eboov-iframe').scrollLeft()) + Math.max(0, ((jQuery(window).width() - jQuery('#eboov-iframe').outerWidth()) / 2) + jQuery(window).scrollLeft()) + 'px';
        	 jQuery("#ebv-salesContainer").css({
                 position: "absolute",
                  top: this.iframeTop,
                  left:this.iframeLeft,
                  transform: isMobile ? "translate(-50%, 0)" : "translate(0,0)",
                  "z-index": 99999,
                 
                });
                
          const salesContainer = jQuery("#ebv-salesContainer");
          const popupBackdrop = jQuery("#ebv-popup-backdrop");
          jQuery("#ebv-popupContainer").html('');  
          salesContainer.css({ display: "block" });
          popupBackdrop.css({ display: "block" });
          eboovadjustSalesCSS(parseInt(jQuery(window).width()));
          eboovaddSalesStats();
          eboovsalesTracking();
        }

        function eboovaddSalesStats() {
          
          var _this = this;
          try{
          jQuery.get(url, (data) => {
           
            _this.ip_address = data.ip_address;
           
            jQuery.post("https://api.epopsdev.com/v1/stats/save",JSON.stringify({
                eboov_campaign_id: _this.sales_campaign_id,
                ip_address: data,
                user_agent: navigator.userAgent,
                eboov_id: _this.eboov_id,
                user_id: _this.uid,
                stat_type: "2",
              }),function ({data}) {
              	_this.sale_stat_id = data.campaign_stat_id;
            });
          });
        }catch(e){
        	console.log(e);
        }
        }

        function onMessage(event) {
          // Check sender origin to be trusted
          if (event.origin !== "https://embed.eboov.com") return;

          var data = event.data;

          if (typeof window[data.func] == "function") {
            window[data.func].call(null, data.message);
          }
        }

        window.addEventListener(
          "message",
          function (event) {
            if (event.data.command === "triggerOpenPopup") {
              eboovopenPopup();
            }
            if (event.data.command === "triggerOpenSalesPop") {
              const show_close_btn = event.data.cta_popup;
              eboovopenSalesPop(show_close_btn);
            }
            const fbtrackingId = this.fb_pixel_id;
            const fbtrackingIds = this.trackingIds;
            if (event.data.command === "fbtrackingevent") {
              if (fbtrackingId != '' && this.global_pixel != true) {
                if(event.data.status == 'Play'){
                  eboovaddFBPixel(fbtrackingId);
                  // addFBStart(fbtrackingId);
                }
              }else{
                if(event.data.status == 'Play'){
                eboovaddFBStart(fbtrackingId);
              }
              }
            }
            if (event.data.command === "fbpercentageevent") {
              if (fbtrackingId != '' && this.global_pixel != true) {
                eboovaddFBPercentage(event.data.percentage_val,fbtrackingId);
              }
              if(this.enable_ga4_retargeting){
                eboovaddGooglePercentage(event.data.percentage_val,this.ga4_measurement_id);
              }
            }
            if (event.data.command === "fbpauseevent") {
              if (fbtrackingId != '' && this.global_pixel != true) {
                eboovaddFBPausePercentage(event.data.percentage_val,fbtrackingId);
              }
            }
          },
          false
        );
        // window.addEventListener(
        //   "message",
        //   function (event) {
        //     if (event.data.command === "triggerOpenPopup") {
        //       eboovopenPopup();
        //     }
        //     if (event.data.command === "triggerOpenSalesPop") {
        //       const show_close_btn = event.data.cta_popup;
        //       eboovopenSalesPop(show_close_btn);
        //     }
        //   },
        //   false
        // );

        function eboovValidateEmail(email) {
          return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        };

        function eboovsaveLeadStats() {
        	var _this = this;
          try{
          jQuery.get(url, (data) => {
            _this.ip_address = data.ip_address;
            jQuery.ajax({
              url: "https://api.epopsdev.com/v1/stats/save",
              type: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                eboov_campaign_id: _this.eboov_campaign_id,
                ip_address: data,
                user_agent: navigator.userAgent,
                eboov_id: _this.eboov_id,
                user_id: _this.uid,
                stat_type: "1",
              }),
            }).done(({ data }) => {
             _this.lead_stat_id = data.campaign_stat_id;
            });
          });
        }catch(e){
        	console.log(e);
        }
        }

        function eboovsaveLeadType(stat_type_id){
        	if(stat_type_id == 1){
        		eboovsaveLead(this.lead_stat_id,1);
        	}
        	
        	if(stat_type_id == 2){
        		eboovsaveLead(this.sale_stat_id,2);
        	}
        }

        function eboovsaveLead(campaign_stat_id, lead_type = 1) {
          const payload = {
            eboov_campaign_id:
              lead_type === 1 ? this.eboov_campaign_id : this.sales_campaign_id,
            campaign_stat_id: campaign_stat_id.toString(),
            eboov_id: this.eboov_id,
            eboov_email: jQuery("#eboov_email").val(),
            eboov_phone: jQuery("#eboov_phone").val(),
            eboov_full_name: jQuery("#eboov_full_name").val(),
            eboov_first_name: jQuery("#eboov_first_name").val(),
            eboov_last_name: jQuery("#eboov_last_name").val(),
            user_id: this.uid,
            eboov_city: lead_type !== 1 && jQuery("#eboov_city").val(),
            eboov_state: lead_type !== 1 && jQuery("#eboov_state").val(),
            eboov_postal_code: lead_type !== 1 && jQuery("#eboov_postal_code").val(),
            eboov_country: lead_type !== 1 && jQuery("#eboov_country").val(),
            eboov_address: lead_type !== 1 && jQuery("#eboov_address").val(),
          };

          try {
            jQuery.ajax({
              url: "https://api.epopsdev.com/v1/leads/save",
              type: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify(payload),
            }).done(({ data }) => {
              if(lead_type == 1){
              	eboovleadTrackingConversions();
              }
            });
          } catch (error) {
            console.log(error);
          }
        }

        function eboovvalidate() {
          if (!jQuery("#eboov_email").val()) return false;
          const inputs = jQuery("#ebv-popupContainer").find("input");
          for (let index = 0; index < inputs.length; index += 1) {
            if (
              inputs[index].className.includes("required") &&
              !jQuery(inputs[index]).val()
            ) {
              return false;
            }
          }
          return true;
        }

        function eboovisEmptyObject(obj) {
          return Object.keys(obj).length === 0;
        }

        function eboovaddFBPixel(trackingId) {
          const pixelCode = `<script>!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${trackingId}'); fbq('trackCustom', 'Play', {media_id: '${this.eboov_id}',media_name: '${this.video_title}'}); </script><noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${trackingId}&ev=PageView&noscript=1" /></noscript>`;
          jQuery(pixelCode).appendTo("head");
          // const pixelCode = `<script>!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
          // 'https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${trackingId}'); fbq('track', 'ViewContent');</script><noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${trackingId}&ev=PageView&noscript=1" /></noscript>`;
          // jQuery(pixelCode).appendTo("head");
        }

        function eboovaddFBStart(trackingId) {
          const pixelCode = `<script>!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${trackingId}'); </script><noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${trackingId}&ev=PageView&noscript=1" /></noscript>`;
          jQuery(pixelCode).appendTo("head");
        }

        function eboovviewcontenConversion() {
          const viewActionScript = `<script>  fbq('track', 'ViewContent'); </script>`;
          jQuery(viewActionScript).appendTo("body");
        }

        function eboovaddFBConversion() {
          const leadActionScript = `<script> fbq('track', 'Lead'); </script>`;
          jQuery(leadActionScript).appendTo("body");
        }

        function eboovaddFBPercentage(percentage,fbtrackingId){
          const pixelCode1 = `<input type="hidden" class="fb_code" value="${percentage}">`;
          if(jQuery('.fb_code').val() != percentage){
            const percentageActionScript = `<script> fbq('trackCustom', '${percentage} Percent Played', {media_id: '${this.eboov_id}',media_name: '${this.video_title}'}); </script>`;
            jQuery(percentageActionScript).appendTo("body");
          }
        }

        function  eboovaddGooglePercentage(percentage,ga4_measurement_id){
          const pixelCodeGoggle1 = `<input type="hidden" class="gtg_code" value="${percentage}">`;
          if($('.gtg_code').length == 0){
            $(pixelCodeGoggle1).appendTo("body");
            eboovaddGoogleAdsPixelTag(ga4_measurement_id);
          }
          const percentageGoogleActionScript = `<script> gtag('event', '${percentage} percent played', { 'video_id': '${this.eboov_id}', 'video_title': '${this.video_title}'});</script>`;
          $(percentageGoogleActionScript).appendTo("body");
        }

        function eboovaddFBPausePercentage(percentage,fbtrackingId){
          if(percentage < 60){
            var timeDur = 'sec';
          }else{
            var timeDur = 'mins';
          }
          const pausePercentageActionScript = `<script> fbq('trackCustom', 'Seconds Played', {minutes_played: '${percentage} mins'}); </script>`;
          jQuery(pausePercentageActionScript).appendTo("body");
        }

        function eboovaddFBPurchase(amount) {
          jQuery(
            `<script>fbq('track', 'Purchase', {currency: "USD", value: ${amount}});</script>`
          ).appendTo("body");
        }

        function eboovaddGoogleAdsPixel(trackingId) {
          if($('.gtg_code').length == 0){
            const pixelCode = `<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script><script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${trackingId}'); </script>`;
            $(pixelCode).appendTo("head");
          }
        }
        function eboovaddGoogleAdsPixelTag(ga4_measurement_id) {
          const pixelCodeTag = `<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4_measurement_id}"></script><script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${ga4_measurement_id}'); </script>`;
          $(pixelCodeTag).appendTo("head");
        }
        // function eboovaddGoogleAdsPixel(trackingId) {
        //   const pixelCode = `<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script><script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${trackingId}'); </script>`;
        //   jQuery(pixelCode).appendTo("head");
        // }

        function eboovaddGoogleAdsConversion(awId, awLabel) {
          const conversionScript = `<script> gtag('event', 'conversion', {'send_to': '${awId}/${awLabel}'});</script>`;
          jQuery(conversionScript).appendTo("body");
        }

        function eboovaddGoogleAdsPurchase(awId, awLabel, amount, order_id) {
          const script = `<script> gtag('event', 'conversion', {'send_to': '${awId}/${awLabel}','value': ${amount},'currency': 'USD', 'transaction_id': '${order_id}'});</script>`;
          jQuery(script).appendTo("body");
        }

        function eboovaddGoogleAnalytics(id) {
          const gaScript = `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); ga('create', '${id}', 'auto'); ga('send', 'pageview');</script>`;
          jQuery(gaScript).appendTo("head");
        }

        function eboovaddGAConversion(id) {
          const conversion_js = `<script>ga('send', 'event', 'Lead', 'submit', 'eboov', '${id}');</script>`;
          jQuery(conversion_js).appendTo("body");
        }

        function eboovaddGAPurchase(id) {
          const script = `<script>ga('send', 'event', 'Sales', 'submit', 'eboov', '${id}');</script>`;
          jQuery(script).appendTo("body");
        }

        function eboovaddPinterestPixel(trackingId) {
          const pixelScript = `<script type="text/javascript">!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push( Array.prototype.slice.call(arguments))}; var n=window.pintrk;n.queue=[],n.version="3.0"; var t=document.createElement("script");t.async=!0,t.src=e; var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js"); pintrk('load', '${trackingId}'); pintrk('page'); pintrk('track', 'pagevisit');</script><noscript><img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?tid=${trackingId}&noscript=1" /></noscript><noscript><img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?tid=${trackingId}&event=pagevisit&noscript=1" /></noscript>`;
          jQuery(pixelScript).appendTo("head");
        }

        function eboovaddPinterestConversion(trackingId) {
          const conversionScript = `<script>pintrk('track', 'lead', { lead_type: 'Eboov' });</script><noscript><img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?tid=${trackingId}&event=lead&ed[lead_type]=Eboov&noscript=1" /></noscript>`;
          jQuery(conversionScript).appendTo("body");
        }

        function eboovaddPinterestPurchase(trackingId) {
          const script = `<script>pintrk('track', 'checkout');</script><noscript><img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?tid=${trackingId}&event=checkout&noscript=1" /></noscript>`;
          jQuery(script).appendTo("body");
        }

        function eboovaddSnapChatPixel(trackingId) {
          const pixelScript = `<script type='text/javascript'>(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function() {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
          a.queue=[];var s='script';r=t.createElement(s);r.async=!0; r.src=n;var u=t.getElementsByTagName(s)[0]; u.parentNode.insertBefore(r,u);})(window,document, 'https://sc-static.net/scevent.min.js'); snaptr('init', '${trackingId}'); snaptr('track', 'PAGE_VIEW'); </script>`;
          jQuery(pixelScript).appendTo("body");
        }

        function eboovaddSnapConversion() {
          const conversion_js = `<script>snaptr('track', 'SIGN_UP');</script>`;
          jQuery(conversion_js).appendTo("body");
        }

        function eboovaddSnapPurchase() {
          const script = `<script>snaptr('track', 'PURCHASE');</script>`;
          jQuery(script).appendTo("body");
        }

        function eboovaddTikTokPixel(trackingId) {
          const pixel_js = `<script> !function (w, d, t) { w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)}; ttq.load('${trackingId}'); ttq.page();}(window, document, 'ttq');</script>`;
          jQuery(pixel_js).appendTo("head");
        }

        function eboovaddTikTokConversion() {
          const conversion_js = `<script>ttq.track('SubmitForm'); ttq.track('ViewContent');</script>`;
          jQuery(conversion_js).appendTo("body");
        }

        function eboovaddTikTokPurchase(id, amount) {
          const script = `<script>ttq.track('CompletePayment', {'currency': 'USD', 'content_name': 'sales', 'content_category': 'eboov', 'content_id': ${id}, 'content_type': 'product', value: ${amount}});</script>`;
          jQuery(script).appendTo("body");
        }

        function eboovaddTwitterPixel(trackingId) {
          const pixel_js = `<script>!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js', a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script'); twq('init','${trackingId}'); twq('track', 'PageView');</script> <script src="//platform.twitter.com/oct.js" type="text/javascript"></script>`;
          jQuery(pixel_js).appendTo("head");
        }

        function eboovaddTwitterConversion(trackingId) {
          const conversion_js = `<script type="text/javascript">twttr.conversion.trackPid('${trackingId}', { tw_sale_amount: 0, tw_order_quantity: 0 });</script>`;
          jQuery(conversion_js).appendTo("body");
        }

        function eboovaddTwitterPurchase(amount, num_items = 1) {
          const script = `<script>twq('track','Purchase', { value: '${amount}', currency: 'USD', num_items: '${num_items}',});</script> <script src="//platform.twitter.com/oct.js" type="text/javascript"></script>`;
          jQuery(script).appendTo("body");
        }

        function eboovaddBingPixel(trackingId) {
          const pixel_js = `<script>(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"${trackingId}"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");</script>`;
          jQuery(pixel_js).appendTo("head");
        }

        function eboovaddBingConversion() {
          const conversion_js = `<script> function uet_report_conversion() { window.uetq = window.uetq || []; window.uetq.push('event', 'submit_lead_form', {}); } uet_report_conversion();</script>`;
          jQuery(conversion_js).appendTo("body");
        }

        function eboovaddBingPurchase(amount) {
          const script = `<script>window.uetq = window.uetq || []; window.uetq.push('event', 'purchase', { 'event_category': 'eboov', 'event_label': 'sales', 'event_value': ${amount}});</script>`;
          jQuery(script).appendTo("body");
        }


        function eboovaddClarityPixel(trackingId) {
          const pixel_js = `<script type="text/javascript">(function(c,l,a,r,i,t,y){ c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i; y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "${trackingId}"); </script>`;
          jQuery(pixel_js).appendTo("head");
        }

        function eboovcheckoutValidate(id) {
          const inputs = jQuery(id).find("input");
          for (let index = 0; index < inputs.length; index += 1) {
            if (
              inputs[index].className.includes("required") &&
              !jQuery(inputs[index]).val()
            ) {
              return false;
            }
          }
          return true;
        }

        function eboovsendPaymentDataType(){
        	eboovsendPaymentData(this.sale_stat_id);
        }

        function eboovsendPaymentData(campaign_stat_id) {
          
          var payload = eboovmakeCCData(campaign_stat_id);
          if (payload === null) return;
          
          try {
            jQuery.ajax({
             url: "https://app.eboov.com/includes/payments.php",
              type: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify(payload),
            }).done((response) => {
              jQuery(".eboov-spinner-border").addClass("eboov-invisible");
            	jQuery(".eboov-spinner-border").removeClass("eboov-visible");
            	const data = JSON.parse(response);
            	// success
            	if (data.code === 100) {
              	//jQuery("#alertSuccess").css({ display: "block" });
              	jQuery("#ebv-salesContainer").css({ display: "none" });
                jQuery("#ebv-popup-backdrop").css({ display: "none" });
              	// alert(
               //  	"Thank You! Your Order Is Successful  Please Reference Sales Order:  " +
               //    data.eboov_sales_id
              	// );
              	eboovsalesTrackingConversions(data);
                if(data.redirect_to != '' || data.redirect_to != null || data.redirect_to != undefined){
                  jQuery('#ebv-salesContainer').remove();
                  jQuery('#ebv-alertContainer').remove();
                  jQuery('#ebv-popup-backdrop').remove();
                  jQuery('#ebv-popupContainer').remove();
                  jQuery('#ebv-succesfullContainer').remove();
                  jQuery("<div id='ebv-succesfullContainer' class='ebv-succesfullContainer' style='box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;'><div class='hide-success-popup' style='width:25px; position: absolute; right: 5px; font-size: 15px; color: #fff; background: #040000a8; border-radius: 50%; padding: 2px 8px; font-weight: 500; cursor: pointer;z-index: 99999;'>X</div><iframe id='successIframe' src='' width='100%' height='100%'></iframe></div>").appendTo("body");
                  jQuery("#ebv-succesfullContainer").css({
                    "z-index": 9999,
                    padding: "10px",
                    background: "white",
                    "border-radius": "5px",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    height: "600px",
                    "max-width": "900px"

                  });
                  eboovadjustSuccessfullCSS(parseInt(jQuery(window).width()));
                  if(data.ty_page == 'default'){
                    eboovpopup();
                    jQuery('#successIframe').attr('src','https://app.eboov.com/'+data.redirect_to);
                  }else if(data.redirect_to == undefined){
                    jQuery('#successIframe').attr('src','https://app.eboov.com/thank-you/?id='+data.eboov_sales_id);
                  }else{
                    eboovpopup();
                    jQuery('#successIframe').attr('src',data.redirect_to);
                  }
                }else{
                  eboovpopup();
                  jQuery('#succesfullContainer').remove();
                  jQuery("<div id='succesfullContainer' class='succesfullContainer' style='box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;'><div class='hide-success-popup' style='width:25px; position: absolute; right: 5px; font-size: 15px; color: #fff; background: #040000a8; border-radius: 50%; padding: 2px 8px; font-weight: 500; cursor: pointer;z-index: 99999;'>X</div><iframe id='successIframe' src='' width='100%' height='100%'></iframe></div>").appendTo("body");
                  jQuery("#succesfullContainer").css({
                    "z-index": 9999,
                    padding: "10px",
                    background: "white",
                    "border-radius": "5px",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    height: "600px",
                    "max-width": "900px"
                  });
                  adjustSuccessfullCSS(parseInt(jQuery(window).width()));
                  jQuery('#successIframe').attr('src','https://app.eboov.com/thank-you/?id='+data.eboov_sales_id);
                }
            	} else {
              	alert(data.message);
              	jQuery("#eboov_step_two").removeAttr("disabled");
            	}
            });
          } catch (error) {
            console.log(error);
          }
          
         
        }

        function eboovmakeCCData(campaign_stat_id) {
          var response = {
            eboov_campaign_id: this.sales_campaign_id,
            uid: this.uid,
            eboov_id: this.eboov_id,
            eboov_add_bump: jQuery("#eboov-add-bump").val(),
            eboov_bump_id: jQuery("#eboov_bump_id").val(),
            eboov_product_id: jQuery("#eboov_product_id").val(),
            eboov_shipping_id: jQuery("#eboov_shipping_id").val(),
            eboov_exp_month: jQuery("#eboov_exp_month").val(),
            eboov_exp_year: jQuery("#eboov_exp_year").val(),
            eboov_cvv: jQuery("#eboov_cvv").val(),
            eboov_cardnumber: jQuery("#eboov_cardnumber").val(),
            eboov_full_name: jQuery("#eboov_full_name").val(),
            eboov_email: jQuery("#eboov_email").val(),
            eboov_phone: jQuery("#eboov_phone").val(),
            eboov_address: jQuery("#eboov_address").val(),
            eboov_city: jQuery("#eboov_city").val(),
            eboov_state: jQuery("#eboov_state").val(),
            eboov_postal_code: jQuery("#eboov_postal_code").val(),
            eboov_country: jQuery("#eboov_country").val(),
            campaign_stat_id: campaign_stat_id,
            ip_address: this.ip_address,
          };
          if (!eboovcreditCardType(response.eboov_cardnumber, response.eboov_cvv)) {
            alert("Invalid credit card info!");
            jQuery(".eboov-spinner-border").addClass("eboov-invisible");
            jQuery(".eboov-spinner-border").removeClass("eboov-visible");
            jQuery("#eboov_step_two").removeAttr("disabled");
            return null;
          }
          return response;
        }

        function eboovcreditCardType(cc, cvv) {
            const regex = new RegExp("^[0-9]{13,19}$");
            if (!regex.test(cc)) {
                return false;
            }
            return eboovluhnck(cc);
        }

        function eboovluhnck(cc){
            let validsum = 0;
            let k = 1;
            for (let l = cc.length - 1; l >= 0; l--) {
                let calck = 0;
                calck = Number(cc.charAt(l)) * k;
                if (calck > 9) {
                    validsum = validsum + 1;
                    calck = calck - 10;
                }
                validsum = validsum + calck;
                if (k == 1) {
                    k = 2;
                } else {
                    k = 1;
                }
            }
            return (validsum % 10) == 0;
        }

        function eboovleadTracking(){
        	if (!eboovisEmptyObject(this.trackingIds)) {
            	const trackingIds = this.trackingIds;
            	if (trackingIds.google_analytics_ua) {
            			this.is_google = true;
              	eboovaddGoogleAnalytics(trackingIds.google_analytics_ua);
            	}
            	if (trackingIds.google_analytics_g4) {
            		this.is_google = true;
              	eboovaddGoogleAnalytics(trackingIds.google_analytics_g4);
            	}
            	if (trackingIds.google_adwords_id) {
        				this.is_google = true;
              	eboovaddGoogleAdsPixel(trackingIds.google_adwords_id);
            	}
            	if (trackingIds.facebook_pixel_id) {
            		this.is_fb = true;
                eboovviewcontenConversion();
              	// eboovaddFBPixel(trackingIds.facebook_pixel_id);
            	}
            	if (trackingIds.twitter_pixel_id) {
            		this.is_twit = true;
              	eboovaddTwitterPixel(trackingIds.twitter_pixel_id);
            	}
            	if (trackingIds.snapchat_pixel_id) {
            		this.is_snap = true;
              	eboovaddSnapChatPixel(trackingIds.snapchat_pixel_id);
            	}
            	if (trackingIds.tiktok_pixel_id) {
        				this.is_tik = true;
              	eboovaddTikTokPixel(trackingIds.tiktok_pixel_id);
            	}
            	if (trackingIds.clarity_pixel_id) {
            		this.is_clar = false;
              	eboovaddClarityPixel(trackingIds.clarity_pixel_id);
            	}
            	if (trackingIds.bing_pixel_id) {
        					this.is_bing = true;
              	eboovaddBingPixel(trackingIds.bing_pixel_id);
            	}
            	if (trackingIds.pinterest_pixel_id) {
        				this.is_pin = true;
              	eboovaddPinterestPixel(trackingIds.pinterest_pixel_id);
            	}
          }
          if (this.popup_js) jQuery(this.popup_js).appendTo("body");
        }

        function eboovleadTrackingConversions(){
        	
        	 if (!eboovisEmptyObject(this.trackingIds)) {
                  const trackingIds = this.trackingIds;
                    if (trackingIds.facebook_pixel_id) {
                      // if(this.global_pixel == true){
                        eboovaddFBConversion();
                      // }
                    }
                    if (trackingIds.google_analytics_ua) {
                      eboovaddGAConversion(trackingIds.google_analytics_ua);
                    }
                    if (trackingIds.google_analytics_g4) {
                      eboovaddGAConversion(trackingIds.google_analytics_g4);
                    }
                    if (
                      trackingIds.google_adwords_id &&
                      trackingIds.google_adwords_label
                    ) {
                      eboovaddGoogleAdsConversion(
                        trackingIds.google_adwords_id,
                        trackingIds.google_adwords_label
                      );
                    }
                    if (trackingIds.twitter_pixel_id && trackingIds.twitter_ad_label) {
                      eboovaddTwitterConversion(trackingIds.twitter_ad_label);
                    }
                    if (trackingIds.pinterest_pixel_id) {
                      eboovaddPinterestConversion(trackingIds.pinterest_pixel_id);
                    }
                    if (trackingIds.bing_pixel_id) {
                      eboovaddBingConversion(trackingIds.bing_pixel_id);
                    }
                    if (trackingIds.tiktok_pixel_id) {
                      eboovaddTikTokConversion();
                    }
                    if (trackingIds.snapchat_pixel_id) {
                      eboovaddSnapConversion();
                    }
                  }
                  if (this.conversion_js) jQuery(this.conversion_js).appendTo("body");
        }

        function eboovsalesTracking(){
        	
        	 if (!eboovisEmptyObject(this.trackingIds)) {
            const trackingIds = this.trackingIds;
            if (trackingIds.google_analytics_ua) {
            	if(this.is_google == false){
               eboovaddGoogleAnalytics(trackingIds.google_analytics_ua);
              }  
              eboovaddGAConversion(trackingIds.google_analytics_ua);
            }
            if (trackingIds.google_analytics_g4) {
            	if(this.is_google == false){
              	eboovaddGoogleAnalytics(trackingIds.google_analytics_g4);
            	}
            	eboovaddGAConversion(trackingIds.google_analytics_g4);
            }
            if (trackingIds.google_adwords_id && trackingIds.sales_google_ads_label) {
            	if(this.is_google == false){
               eboovaddGoogleAdsPixel(trackingIds.google_adwords_id);
              }
               eboovaddGoogleAdsConversion(
                 trackingIds.google_adwords_id,
                 trackingIds.sales_google_ads_label
               );
              
            }
            if (trackingIds.facebook_pixel_id) {
            	if(this.is_fb == false){
               // eboovaddFBPixel(trackingIds.facebook_pixel_id);
              }
               eboovaddFBConversion();
            }
            if (trackingIds.twitter_pixel_id) {
            	if(this.is_twit == false){
              	eboovaddTwitterPixel(trackingIds.twitter_pixel_id);
            	}
              eboovaddTwitterConversion(trackingIds.twitter_pixel_id);
            }
            if (trackingIds.snapchat_pixel_id) {
            	if(this.is_snap == false){
               eboovaddSnapChatPixel(trackingIds.snapchat_pixel_id);
              }
              eboovaddSnapConversion();
            }
            if (trackingIds.tiktok_pixel_id) {
              eboovaddTikTokPixel(trackingIds.tiktok_pixel_id);
              eboovaddTikTokConversion();
            }
            if (trackingIds.clarity_pixel_id) {
            	if(this.is_clar == false){
               eboovaddClarityPixel(trackingIds.clarity_pixel_id);
              }
            }
            if (trackingIds.bing_pixel_id) {
            	if(this.is_bing == false){
              	eboovaddBingPixel(trackingIds.bing_pixel_id);
            	}
              eboovaddBingConversion();
            }
            if (trackingIds.pinterest_pixel_id) {
            	if(this.is_ping == false){
              	eboovaddPinterestPixel(trackingIds.pinterest_pixel_id);
            	}
              eboovaddPinterestConversion(trackingIds.pinterest_pixel_id);
            }
          }
        }

        function eboovsalesTrackingConversions(data){
        	var trackingIds = this.trackingIds;
        	 if (!eboovisEmptyObject(trackingIds)) {
                if (trackingIds.facebook_pixel_id) {
                  eboovaddFBPurchase(data["order_total"]);
                }
                if (trackingIds.google_analytics_ua) {
                  eboovaddGAPurchase(data["eboov_sales_id"]);
                }
                if (trackingIds.google_analytics_g4) {
                  eboovaddGAPurchase(data["eboov_sales_id"]);
                }
                if (
                  trackingIds.google_adwords_id &&
                  trackingIds.sales_google_ads_label
                ) {
                  //awId, awLabel, amount, order_id
                  eboovaddGoogleAdsPurchase(
                    trackingIds.google_adwords_id,
                    trackingIds.sales_google_ads_label,
                    data["order_total"],
                    data["eboov_sales_id"]
                  );
                }
                if (trackingIds.twitter_pixel_id) {
                  eboovaddTwitterPurchase(data["order_total"]);
                }
                if (trackingIds.pinterest_pixel_id) {
                  eboovaddPinterestPurchase(trackingIds.pinterest_pixel_id);
                }
                if (trackingIds.bing_pixel_id) {
                  eboovaddBingPurchase(data["order_total"]);
                }
                if (trackingIds.tiktok_pixel_id) {
                  eboovaddTikTokPurchase(data["eboov_sales_id"], data["order_total"]);
                }
                if (trackingIds.snapchat_pixel_id) {
                  eboovaddSnapPurchase();
                }
              }
        }

        function eboovLeadButtonClick(event){
                  
                  event.preventDefault();
                  if (!eboovvalidate()) {
                    alert("Please fill in the required fields!");
                    return;
                  }
                  if (!eboovValidateEmail(jQuery("#eboov_email").val())) {
                    alert("Email you entered is invalid!");
                    return;
                  }

                  eboovsaveLeadType(1);
                  jQuery("#eboov-iframe")[0].contentWindow.postMessage(
                    { command: "triggerResumeAfterLead" },
                    "https://embed.eboov.com"
                  );
                  jQuery("#ebv-popupContainer").css({ display: "none" });
                  jQuery("#ebv-popup-backdrop").css({ display: "none" });
        }

        function eboovSalesPopOneClick(event){
              event.preventDefault();
              if (!eboovcheckoutValidate("#checkoutStep1")) {
                alert("Please fill in the required fields!");
                return;
              }
              if (!eboovValidateEmail(jQuery("#eboov_email").val())) {
                alert("Email you entered is invalid!");
                return null;
              }
              eboovsaveLeadType(2);
              jQuery("#checkoutStep1").removeClass("eboov-visible");
              jQuery("#checkoutStep1").addClass("eboov-invisible");
              jQuery("#checkoutStep2").addClass("eboov-visible");
              jQuery("#checkoutStep2").removeClass("eboov-invisible");
        }

        function eboovSalesPopTwoClick(event){
              event.preventDefault();
              jQuery("#eboov_step_two").attr("disabled", "disabled");
              jQuery(".eboov-spinner-border").removeClass("eboov-invisible");
              jQuery(".eboov-spinner-border").addClass("eboov-visible");
              if (!eboovcheckoutValidate("#checkoutStep2")) {
                jQuery(".eboov-spinner-border").addClass("eboov-invisible");
                jQuery(".eboov-spinner-border").removeClass("eboov-visible");
                alert("Please fill in the required fields!");
                jQuery("#eboov_step_two").removeAttr("disabled");
                return;
              }
              eboovsendPaymentDataType();
        }

        function eboovBumpCheckBox(e){
        	e.preventDefault();
        	if(jQuery('#eboov-add-bump').is(":checked")){
        		jQuery('#eboov-add-bump').val(1);
        	}else{
        		jQuery('#eboov-add-bump').val(0);
        		jQuery("#eboov-add-bump").prop('checked', false); 
        		jQuery("#eboov-add-bump").removeAttr('checked');
        	}
        }
        function eboovresumeVideoAfterSales() {
          jQuery("#eboov-iframe")[0].contentWindow.postMessage(
            { command: "triggerResumeAfterSales" },
            "https://embed.eboov.com"
          );
          jQuery("#ebv-salesContainer").css({ display: "none" });
          jQuery("#ebv-popup-backdrop").css({ display: "none" });
          //jQuery("#ebv-alertContainer").css({ display: "none" });
          //jQuery("#ebv-popup-backdrop").css({ display: "none" });
        }

};